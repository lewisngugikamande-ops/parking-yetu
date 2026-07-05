const { Principal, TokenIssuer, PrincipalResolver } = require('@access-engine/contracts');

class MockIssuer extends TokenIssuer {
  constructor(options = {}) {
    super();
    this.users = options.users || {
      'test-user': {
        id: 'test-user-1',
        tenantId: 'test-org',
        roles: ['member']
      },
      'admin': {
        id: 'admin-1',
        tenantId: 'test-org',
        roles: ['admin', 'member']
      }
    };
  }

  async issue(credentials) {
    const { username } = credentials;
    const user = this.users[username];
    if (!user) return null;
    const token = `mock-token-${user.id}`;
    const principal = new Principal({
      subject: user.id,
      scheme: 'mock',
      claims: { username }
    });
    return { token, principal };
  }
}

class MockResolver extends PrincipalResolver {
  constructor(options = {}) {
    super();
    this.users = options.users || {
      'test-user-1': {
        id: 'test-user-1',
        tenantId: 'test-org',
        roles: ['member']
      },
      'admin-1': {
        id: 'admin-1',
        tenantId: 'test-org',
        roles: ['admin', 'member']
      }
    };
    this.validTokens = options.validTokens || [
      'mock-token-test-user-1',
      'mock-token-admin-1'
    ];
  }

  async resolve(request) {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      console.log('🔐 MockResolver: No Authorization header');
      return null;
    }
    if (!authHeader.startsWith('Bearer ')) {
      console.log('🔐 MockResolver: Invalid auth scheme');
      return null;
    }
    const token = authHeader.substring(7);
    if (!this.validTokens.includes(token)) {
      console.log('🔐 MockResolver: Invalid token');
      return null;
    }
    const userId = token.replace('mock-token-', '');
    const user = this.users[userId];
    if (!user) {
      console.log('🔐 MockResolver: User not found');
      return null;
    }
    console.log('🔐 MockResolver: Authentication successful for', userId);
    return new Principal({
      subject: user.id,
      scheme: 'mock',
      claims: { userId, token }
    });
  }
}

module.exports = { MockIssuer, MockResolver };
