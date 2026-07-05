class Credential {
  constructor(data) {
    this.id = data.id || require('crypto').randomUUID();
    this.identityId = data.identityId;
    this.type = data.type || 'qr';
    this.value = data.value;
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static create(data) {
    return new Credential(data);
  }

  isValid() {
    return this.status === 'active';
  }

  toJSON() {
    // Explicitly serialize identityId to a string
    let identityIdValue = this.identityId;
    if (identityIdValue && typeof identityIdValue === 'object') {
      // Try toJSON first, then toString
      identityIdValue = identityIdValue.toJSON ? identityIdValue.toJSON() : identityIdValue.toString();
    }

    return {
      id: this.id,
      identityId: identityIdValue,
      type: this.type,
      value: this.value,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Credential;
