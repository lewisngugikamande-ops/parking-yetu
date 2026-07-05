const { AuthRegistry } = require('@access-engine/infrastructure');

const registry = new AuthRegistry();

const { MockIssuer, MockResolver, MockPermissionResolver } = require('@access-engine/infrastructure');
registry
  .registerIssuer('mock', new MockIssuer())
  .registerResolver('mock', new MockResolver());

const { JWTIssuer, JWTResolver } = require('@access-engine/infrastructure');
registry
  .registerIssuer('jwt', new JWTIssuer())
  .registerResolver('jwt', new JWTResolver());

function getAuthProvider(type = process.env.AUTH_PROVIDER || 'mock') {
  return registry.getProvider(type);
}

function createAuthMiddleware(resolver) {
  return async function authenticate(req, res, next) {
    try {
      const principal = await resolver.resolve(req);
      req.principal = principal;
      req.logger?.info('Authentication check', {
        authenticated: !!principal,
        scheme: principal?.scheme,
        subject: principal?.subject
      });
      next();
    } catch (error) {
      req.logger?.warn('Authentication error', { error: error.message });
      next();
    }
  };
}

function createAuthorizationMiddleware(permissionResolver) {
  return async function authorize(req, res, next) {
    try {
      if (!req.principal) {
        req.authContext = null;
        return next();
      }
      const authContext = await permissionResolver.resolve(req.principal);
      req.authContext = authContext;
      req.logger?.info('Authorization check', {
        principal: authContext.principal.subject,
        roles: authContext.roles,
        permissions: authContext.permissions
      });
      next();
    } catch (error) {
      req.logger?.warn('Authorization error', { error: error.message });
      next();
    }
  };
}

function requireAuth(req, res, next) {
  
  if (!req.principal) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      decision: 'deny'
    });
  }
  next();
}

function requirePermission(permission) {
  return function(req, res, next) {
    if (!req.authContext || !req.authContext.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        error: `Permission '${permission}' required`,
        decision: 'deny'
      });
    }
    next();
  };
}

module.exports = {
  getAuthProvider,
  createAuthMiddleware,
  createAuthorizationMiddleware,
  requireAuth,
  requirePermission,
};
