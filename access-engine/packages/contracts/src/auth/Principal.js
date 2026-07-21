class Principal {
  constructor(data) {
    this.subject = data.subject;
    this.scheme = data.scheme;
    this.claims = data.claims || {};
    this.authenticatedAt = data.authenticatedAt || new Date().toISOString();
    this.expiresAt = data.expiresAt || null;
    Object.freeze(this);
  }

  // ✅ ADD THIS METHOD
  isValid() {
    if (this.expiresAt && new Date(this.expiresAt) < new Date()) {
      return false;
    }
    return true;
  }

  toJSON() {
    return {
      subject: this.subject,
      scheme: this.scheme,
      claims: this.claims,
      authenticatedAt: this.authenticatedAt,
      expiresAt: this.expiresAt
    };
  }
}

module.exports = Principal;
