class AuthorizationContext {
  constructor(data) {
    this.principal = data.principal;
    this.tenantId = data.tenantId || null;
    this.roles = data.roles || [];
    this.permissions = data.permissions || [];
    this.retrievedAt = data.retrievedAt || new Date().toISOString();
    Object.freeze(this);
  }
  hasRole(role) { return this.roles.includes(role); }
  hasPermission(permission) { return this.permissions.includes(permission); }
  toJSON() {
    return {
      principal: this.principal.toJSON(),
      tenantId: this.tenantId,
      roles: this.roles,
      permissions: this.permissions,
      retrievedAt: this.retrievedAt
    };
  }
}
module.exports = AuthorizationContext;
