class Membership {
  constructor(data) {
    this.id = data.id || require('crypto').randomUUID();
    this.identityId = data.identityId;
    this.organizationId = data.organizationId || 'default-org';
    this.roles = data.roles || [];
    this._status = data.status || 'active';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static create(data) {
    return new Membership(data);
  }

  get isActive() {
    return this._status === 'active';
  }

  // Optional: keep a method version for compatibility
  isActive() {
    return this._status === 'active';
  }

  toJSON() {
    return {
      id: this.id,
      identityId: this.identityId,
      organizationId: this.organizationId,
      roles: this.roles,
      status: this._status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Membership;
