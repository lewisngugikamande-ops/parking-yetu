console.log("🔥 LOADED AccessEngine.js from:", __filename);

const { EventBus } = require('@access-engine/kernel');
const { Result } = require('@access-engine/foundation');

class AccessEngine {
  constructor({
    identityRepository,
    credentialRepository,
    membershipRepository,
    policyRepository,
    sessionRepository,
    eventBus
  }) {
    this.identityRepository = identityRepository;
    this.credentialRepository = credentialRepository;
    this.membershipRepository = membershipRepository;
    this.policyRepository = policyRepository;
    this.sessionRepository = sessionRepository;
    this.eventBus = eventBus || new EventBus();
  }
  
  static builder() {
    return new AccessEngineBuilder();
  }
  
  async process(request) {
    console.log('📥 REAL ENGINE processing:', request);
    
    const ctx = {
      request: request,
      metadata: {},
      result: null
    };
    
    try {
      await this.validateRequest(ctx);
      await this.resolveCredential(ctx);
      await this.resolveIdentity(ctx);
      await this.resolveMembership(ctx);
      await this.evaluatePolicy(ctx);
      await this.createSession(ctx);
      await this.emitEvents(ctx);
      
      return ctx.result || { success: true };
    } catch (error) {
      console.error("🔴 ENGINE ERROR:", error.message);
      return { success: false, error: error.message, decision: 'deny' };
    }
  }
  
  async validateRequest(ctx) {
    const requestData = ctx.request;
    const { credential, accessPointId, action, organizationId } = requestData;
    
    let credentialValue = null;
    if (typeof credential === 'string') {
      credentialValue = credential;
    } else if (credential && typeof credential === 'object') {
      credentialValue = credential.value;
    }
    
    if (!credentialValue) throw new Error('Credential is required');
    if (!accessPointId) throw new Error('Access point is required');
    if (!action) throw new Error('Action is required');
    if (!['enter', 'exit'].includes(action)) {
      throw new Error(`Invalid action: ${action}`);
    }
    
    ctx.credentialValue = credentialValue;
    ctx.organizationId = organizationId || 'default-org';
    ctx.requestData = requestData;
  }
  
  async resolveCredential(ctx) {
    const credential = await this.credentialRepository.findByValue(ctx.credentialValue);
    if (!credential) throw new Error('Credential not found');
    if (!credential.isValid()) throw new Error('Credential is expired or revoked');
    ctx.credential = credential;
    ctx.identityId = credential.identityId;
  }

  async resolveIdentity(ctx) {
   const identity = await this.identityRepository.findById(ctx.identityId);

   if (!identity) throw new Error('Identity not found');

   if (!identity.isActive) throw new Error('Identity is not active');
  
   ctx.identity = identity;
}

// 🆕 Debug logging
async resolveIdentity(ctx) {
  const identity = await this.identityRepository.findById(ctx.identityId);


  if (!identity) throw new Error('Identity not found');

  ctx.identity = identity;
}
  
  async resolveMembership(ctx) {
    const membership = await this.membershipRepository.findByIdentityAndOrganization(
      ctx.identity.id,
      ctx.organizationId
    );
    if (!membership) throw new Error('No membership found for this organization');
    if (!membership.isActive) throw new Error('Membership is not active');
    ctx.membership = membership;
  }
  
  async evaluatePolicy(ctx) {
    const policies = await this.policyRepository.findByOrganization(ctx.organizationId);
    for (const policy of policies) {
      const context = {
        identity: ctx.identity,
        membership: ctx.membership,
        action: ctx.requestData?.action || ctx.request.action
      };
      const result = policy.evaluate(context);
      if (result.matched) {
        if (result.effect === 'deny') {
          throw new Error(result.reason || 'Policy denied access');
        }
        ctx.policy = policy;
        ctx.policyResult = result;
        return;
      }
    }
    throw new Error('No matching policy found');
  }
  
  async createSession(ctx) {
    const Session = require('./session/Session');
    const session = Session.create({
      identityId: ctx.identity.id,
      resourceId: ctx.requestData?.accessPointId || ctx.request.accessPointId,
      status: 'active',
      context: {
        policyId: ctx.policy?.id,
        action: ctx.requestData?.action || ctx.request.action,
        organizationId: ctx.organizationId
      }
    });
    await this.sessionRepository.save(session);
    ctx.session = session;
  }
  
  async emitEvents(ctx) {
    console.log('✅ Engine processing complete (events skipped)');
    ctx.result = {
      success: true,
      decision: 'allow',
      sessionId: ctx.session?.id,
      identityId: ctx.identity?.id,
      events: []
    };
  }
}

class AccessEngineBuilder {
  constructor() { this.config = {}; }
  withIdentityRepository(repo) { this.config.identityRepository = repo; return this; }
  withCredentialRepository(repo) { this.config.credentialRepository = repo; return this; }
  withMembershipRepository(repo) { this.config.membershipRepository = repo; return this; }
  withPolicyRepository(repo) { this.config.policyRepository = repo; return this; }
  withSessionRepository(repo) { this.config.sessionRepository = repo; return this; }
  withEventBus(eventBus) { this.config.eventBus = eventBus; return this; }
  build() { return new AccessEngine(this.config); }
}

module.exports = AccessEngine;
