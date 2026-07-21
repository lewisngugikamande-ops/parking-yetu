const { AuthorizationContext, PermissionResolver } = require('@access-engine/contracts');

class DatabasePermissionResolver extends PermissionResolver {
  constructor({ membershipRepository, policyRepository }) {
    super();
    this.membershipRepository = membershipRepository;
    this.policyRepository = policyRepository;
  }

  async resolve(principal) {
    let roles = ['member'];
    if (principal.scheme === 'mock') {
      roles = ['member'];
    }
    
    return new AuthorizationContext({
      principal,
      tenantId: 'test-org',
      roles,
      permissions: ['parking.enter', 'parking.exit']
    });
  }
}

class MockPermissionResolver extends PermissionResolver {
  constructor(options = {}) {
    super();
    this.roles = options.roles || {
      'test-user-1': ['member'],
      'admin-1': ['admin', 'member']
    };
  }

  async resolve(principal) {
    const roles = this.roles[principal.subject] || ['member'];
    
    return new AuthorizationContext({
      principal,
      tenantId: 'test-org',
      roles,
      permissions: ['parking.enter', 'parking.exit']
    });
  }
}

module.exports = {
  DatabasePermissionResolver,
  MockPermissionResolver,
};
