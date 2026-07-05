const {
  IdentityRepository,
  CredentialRepository,
  MembershipRepository,
  PolicyRepository,
  SessionRepository,
} = require('@access-engine/contracts');

class MemoryIdentityRepository extends IdentityRepository {
  constructor() {
    super();
    this.data = new Map();
  }

  async save(identity) {
    const id = identity.id.toString();
    this.data.set(id, identity);
    return identity;
  }

  async findById(id) {
    return this.data.get(id.toString()) || null;
  }

  async findAll() {
    return Array.from(this.data.values());
  }

  async delete(id) {
    this.data.delete(id.toString());
  }
}

class MemoryCredentialRepository extends CredentialRepository {
  constructor() {
    super();
    this.data = new Map();
  }

  async save(credential) {
    const id = credential.id.toString();
    this.data.set(id, credential);
    return credential;
  }

  async findById(id) {
    return this.data.get(id.toString()) || null;
  }

  async findByValue(value) {
    for (const credential of this.data.values()) {
      if (credential.value === value) {
        return credential;
      }
    }
    return null;
  }

  async findAll() {
    return Array.from(this.data.values());
  }

  async delete(id) {
    this.data.delete(id.toString());
  }
}

class MemoryMembershipRepository extends MembershipRepository {
  constructor() {
    super();
    this.data = new Map();
  }

  async save(membership) {
    const id = membership.id.toString();
    this.data.set(id, membership);
    return membership;
  }

  async findById(id) {
    return this.data.get(id.toString()) || null;
  }

  async findByIdentityAndOrganization(identityId, organizationId) {
    for (const membership of this.data.values()) {
      if (membership.identityId.toString() === identityId.toString() &&
          membership.organizationId === organizationId) {
        return membership;
      }
    }
    return null;
  }

  async findAll() {
    return Array.from(this.data.values());
  }

  async delete(id) {
    this.data.delete(id.toString());
  }
}

class MemoryPolicyRepository extends PolicyRepository {
  constructor() {
    super();
    this.data = new Map();
  }

  async save(policy) {
    const id = policy.id.toString();
    this.data.set(id, policy);
    return policy;
  }

  async findById(id) {
  const result = this.data.get(id.toString()) || null;
  console.log('🔍 MemoryIdentityRepository.findById returning:', result);
  console.log('🔍 Is it an Identity instance?', result instanceof Identity);
  console.log('🔍 Does it have isActive?', result && typeof result.isActive === 'function' ? 'yes' : 'no');
  return result;
}

  async findByOrganization(organizationId) {
    const results = [];
    for (const policy of this.data.values()) {
      if (policy.organizationId === organizationId) {
        results.push(policy);
      }
    }
    return results;
  }

  async findAll() {
    return Array.from(this.data.values());
  }

  async delete(id) {
    this.data.delete(id.toString());
  }
}

class MemorySessionRepository extends SessionRepository {
  constructor() {
    super();
    this.data = new Map();
  }

  async save(session) {
    const id = session.id.toString();
    this.data.set(id, session);
    return session;
  }

  async findById(id) {
    return this.data.get(id.toString()) || null;
  }

  async findActiveByResource(resourceId) {
    for (const session of this.data.values()) {
      if (session.resourceId === resourceId && session.status === 'active') {
        return session;
      }
    }
    return null;
  }

  async findAll() {
    return Array.from(this.data.values());
  }

  async delete(id) {
    this.data.delete(id.toString());
  }
}

module.exports = {
  MemoryIdentityRepository,
  MemoryCredentialRepository,
  MemoryMembershipRepository,
  MemoryPolicyRepository,
  MemorySessionRepository,
};
