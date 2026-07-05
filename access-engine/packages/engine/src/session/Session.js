class Session {
  constructor(data) {
    this.id = data.id || require('crypto').randomUUID();
    this.identityId = data.identityId;
    this.resourceId = data.resourceId;
    this.status = data.status || 'active';
    this.context = data.context || {};
    this.events = [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.version = data.version || 0;
  }

  static create(data) {
    return new Session(data);
  }

  isActive() {
    return this.status === 'active';
  }

  getEvents() {
    return this.events;
  }

  clearEvents() {
    this.events = [];
  }

  _addEvent(event) {
    this.events.push(event);
  }

  _incrementVersion() {
    this.version += 1;
  }

  toJSON() {
    let identityIdValue = this.identityId;
    if (identityIdValue && typeof identityIdValue === 'object') {
      identityIdValue = identityIdValue.toJSON ? identityIdValue.toJSON() : identityIdValue.toString();
    }

    return {
      id: this.id,
      identityId: identityIdValue,
      resourceId: this.resourceId,
      status: this.status,
      context: this.context,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version
    };
  }
}

module.exports = Session;
