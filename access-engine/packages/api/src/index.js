console.log('🔥 LOADED AccessEngine.js from:', __filename);

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { Logger, CorrelationId, MetricsCollector, HealthChecks } = require('@access-engine/observability');
const { RepositoryProvider } = require('@access-engine/infrastructure');
const { AccessEngine } = require('@access-engine/engine');
const { EventBus } = require('@access-engine/kernel');
const { Identity, Credential, Membership, Policy, Session } = require('@access-engine/engine');
const { printBanner } = require('./banner');

// Auth middleware
const {
  getAuthProvider,
  createAuthMiddleware,
  createAuthorizationMiddleware,
  requireAuth,
} = require('./middleware/auth');

const logger = new Logger({ service: 'access-api' });
const metrics = new MetricsCollector();

const repositories = RepositoryProvider.getProvider();

// Get auth provider from registry
const { resolver: authResolver } = getAuthProvider();
const { MockPermissionResolver } = require('@access-engine/infrastructure');
const permissionResolver = new MockPermissionResolver();

logger.info('Repository provider initialized', { provider: process.env.REPOSITORY_PROVIDER || 'memory' });
logger.info('Auth provider initialized', { provider: process.env.AUTH_PROVIDER || 'mock' });

const eventBus = new EventBus();

// Build the Access Engine
const engine = new AccessEngine({
  identityRepository: repositories.identity,
  credentialRepository: repositories.credential,
  membershipRepository: repositories.membership,
  policyRepository: repositories.policy,
  sessionRepository: repositories.session,
  eventBus: eventBus
});

// ============================================
// SEED DATA
// ============================================

async function seedData() {
  logger.info('Seeding test data...');
  const existing = await repositories.credential.findByValue('TEST-QR-123');
  if (existing) { logger.info('Seed data already exists'); return; }
  
  const identity = Identity.create({ name: 'Test User', email: 'test@example.com' });
  await repositories.identity.save(identity);
  logger.info('Identity created', { identityId: identity.id });
  
  const credential = Credential.create({ identityId: identity.id, type: 'qr', value: 'TEST-QR-123' });
  await repositories.credential.save(credential);
  logger.info('Credential created', { credentialId: credential.id });
  
  const membership = Membership.create({ identityId: identity.id, organizationId: 'test-org', roles: ['member'] });
  await repositories.membership.save(membership);
  logger.info('Membership created', { membershipId: membership.id });
  
  const policy = Policy.create({ 
    name: 'Member Access', 
    organizationId: 'test-org', 
    rules: [{ effect: 'allow', actions: ['*'], resources: ['*'] }]
  });
  await repositories.policy.save(policy);
  logger.info('Policy created', { policyId: policy.id });
  
  logger.info('Seed complete! Test with: TEST-QR-123');
}

// ============================================
// EXPRESS APP
// ============================================

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Allow all origins with credentials
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Correlation ID middleware
app.use((req, res, next) => {
  const correlationId = CorrelationId.generate();
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  const childLogger = logger.child({ correlationId });
  req.logger = childLogger;
  next();
});

// Auth middleware
app.use(createAuthMiddleware(authResolver));
app.use(createAuthorizationMiddleware(permissionResolver));

// ============================================
// HEALTH ENDPOINTS
// ============================================

app.get('/health', async (req, res) => {
  const health = new HealthChecks();
  health.addCheck('engine', async () => ({ status: 'healthy' }));
  health.addCheck('auth', async () => ({ status: 'healthy' }));
  const status = await health.check();
  res.json({ service: 'access-api', status: 'healthy', timestamp: new Date().toISOString(), checks: status });
});

app.get('/health/ready', (req, res) => res.json({ status: 'ready' }));
app.get('/health/live', (req, res) => res.json({ status: 'alive' }));
app.get('/metrics', (req, res) => res.json({}));

// ============================================
// AUTH ENDPOINTS
// ============================================

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { issuer } = getAuthProvider();
    const result = await issuer.issue({ username, password });
    
    if (!result) {
      return res.status(401).json({ success: false, error: 'Invalid credentials', decision: 'deny' });
    }
    
    res.json({
      success: true,
      token: result.token,
      principal: result.principal.toJSON(),
      message: 'Login successful'
    });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message, decision: 'deny' });
  }
});

app.get('/auth/me', requireAuth, async (req, res) => {
  try {
    const principal = req.principal;
    if (!principal) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    res.json({ success: true, principal: principal.toJSON ? principal.toJSON() : principal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/auth/logout', requireAuth, async (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

// ============================================
// PARKING ENDPOINTS
// ============================================

app.post('/api/entry', requireAuth, async (req, res) => {
  const start = Date.now();
  const { logger } = req;
  
  try {
    logger.info('Entry request received', { body: req.body });
    metrics.increment('api.entry.requests');
    
    const { credential, accessPointId, organizationId, metadata } = req.body;
    const tenantId = req.authContext?.tenantId || organizationId || 'test-org';
    
    const result = await engine.process({
      credential: { value: credential },
      accessPointId: accessPointId || 'gate-a',
      action: 'enter',
      organizationId: tenantId,
      metadata: {
        ...metadata,
        actor: req.principal?.subject,
        authenticatedAt: req.principal?.authenticatedAt
      }
    });
    
    const duration = Date.now() - start;
    metrics.histogram('api.entry.duration', duration);
    
    if (result.success) {
      metrics.increment('api.entry.success');
      logger.info('Entry successful', { sessionId: result.sessionId, duration });
    } else {
      metrics.increment('api.entry.failure');
      logger.warn('Entry denied', { error: result.error, duration });
    }
    
    res.json(result);
  } catch (error) {
    const duration = Date.now() - start;
    metrics.increment('api.entry.error');
    logger.error('Entry error', { error: error.message, duration });
    res.status(400).json({ success: false, error: error.message, decision: 'deny' });
  }
});

app.post('/api/exit', requireAuth, async (req, res) => {
  const start = Date.now();
  const { logger } = req;
  
  try {
    logger.info('Exit request received', { body: req.body });
    metrics.increment('api.exit.requests');
    
    const { credential, accessPointId, organizationId, metadata } = req.body;
    const tenantId = req.authContext?.tenantId || organizationId || 'test-org';
    
    const result = await engine.process({
      credential: { value: credential },
      accessPointId: accessPointId || 'gate-a',
      action: 'exit',
      organizationId: tenantId,
      metadata: {
        ...metadata,
        actor: req.principal?.subject,
        authenticatedAt: req.principal?.authenticatedAt
      }
    });
    
    const duration = Date.now() - start;
    metrics.histogram('api.exit.duration', duration);
    
    if (result.success) {
      metrics.increment('api.exit.success');
      logger.info('Exit successful', { sessionId: result.sessionId, duration });
    } else {
      metrics.increment('api.exit.failure');
      logger.warn('Exit denied', { error: result.error, duration });
    }
    
    res.json(result);
  } catch (error) {
    const duration = Date.now() - start;
    metrics.increment('api.exit.error');
    logger.error('Exit error', { error: error.message, duration });
    res.status(400).json({ success: false, error: error.message, decision: 'deny' });
  }
});

// ============================================
// START SERVER
// ============================================

seedData().then(() => {
  app.listen(PORT, () => {
    const config = {
      port: PORT,
      repositoryProvider: process.env.REPOSITORY_PROVIDER || 'memory',
      authProvider: process.env.AUTH_PROVIDER || 'mock',
      firestoreEmulator: process.env.FIRESTORE_EMULATOR_HOST || 'not configured',
      metricsPort: process.env.METRICS_PORT || null,
    };
    printBanner(config);
  });
}).catch(err => {
  logger.error('Seed error:', { error: err.message });
  process.exit(1);
});

module.exports = app;
