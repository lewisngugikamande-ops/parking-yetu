const { Principal, TokenIssuer, PrincipalResolver } = require('@access-engine/contracts');
const jwt = require('jsonwebtoken');

class JWTIssuer extends TokenIssuer {
  constructor(options = {}) {
    super();
    const secret = options.secret || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is required when AUTH_PROVIDER=jwt');
    }
    this.secret = secret;
    this.expiresIn = options.expiresIn || '24h';
  }

  async issue(credentials) {
    const { username, tenantId = 'test-org' } = credentials;
    
    const payload = {
      sub: username || 'test-user-1',
      username: username || 'test-user',
      tenant: tenantId,
      roles: ['member']
    };
    
    const token = jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    
    const principal = new Principal({
      subject: payload.sub,
      scheme: 'jwt',
      claims: { username: payload.username, token }
    });
    
    return { token, principal };
  }
}

class JWTResolver extends PrincipalResolver {
  constructor(options = {}) {
    super();
    const secret = options.secret || process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is required');
    }
    this.secret = secret;
  }

  async resolve(request) {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, this.secret);
      
      return new Principal({
        subject: decoded.sub,
        scheme: 'jwt',
        claims: { username: decoded.username, token }
      });
    } catch (error) {
      return null;
    }
  }
}

module.exports = { JWTIssuer, JWTResolver };
