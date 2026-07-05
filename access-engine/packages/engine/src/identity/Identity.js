const { Entity, Result } = require('@access-engine/foundation');
const IdentityId = require('./IdentityId');
const IdentityProfile = require('./IdentityProfile');
const {
  IdentityCreatedEvent,
  IdentityActivatedEvent,
  IdentitySuspendedEvent,
  IdentityDeactivatedEvent,
} = require('./events');

class Identity extends Entity {
  constructor(data) {
    const id = data.id instanceof IdentityId ? data.id : new IdentityId(data.id);
    super(id);
    
    // Handle both IdentityProfile objects and plain objects
    if (data.profile instanceof IdentityProfile) {
      this._profile = data.profile;
    } else if (data.profile) {
      this._profile = new IdentityProfile(data.profile);
    } else {
      this._profile = new IdentityProfile({});
    }
    
    this._status = data.status || 'active';
    this._version = data.version || 0;
    
    if (!data.fromRepository) {
      this._addEvent(new IdentityCreatedEvent(this._id, this._profile));
    }
  }
  
  get profile() { return this._profile; }
  get status() { return this._status; }
  get version() { return this._version; }
  get isActive() { return this._status === 'active'; }
  get isSuspended() { return this._status === 'suspended'; }
  get isDeactivated() { return this._status === 'deactivated'; }
  
  static create(data) {
    return new Identity({
      profile: data,
      status: 'active',
      fromRepository: false
    });
  }
  
  static restore(data) {
    return new Identity({
      ...data,
      fromRepository: true
    });
  }
  
  activate() {
    if (this._status === 'active') {
      return Result.err('Identity is already active');
    }
    if (this._status === 'deactivated') {
      return Result.err('Cannot activate a deactivated identity');
    }
    
    this._status = 'active';
    this._addEvent(new IdentityActivatedEvent(this._id));
    this._incrementVersion();
    return Result.ok(this);
  }
  
  suspend(reason) {
    if (this._status === 'suspended') {
      return Result.err('Identity is already suspended');
    }
    if (this._status === 'deactivated') {
      return Result.err('Cannot suspend a deactivated identity');
    }
    
    this._status = 'suspended';
    this._addEvent(new IdentitySuspendedEvent(this._id, reason));
    this._incrementVersion();
    return Result.ok(this);
  }
  
  deactivate(reason) {
    if (this._status === 'deactivated') {
      return Result.err('Identity is already deactivated');
    }
    
    this._status = 'deactivated';
    this._addEvent(new IdentityDeactivatedEvent(this._id, reason));
    this._incrementVersion();
    return Result.ok(this);
  }
  
  toJSON() {
    return {
      id: this._id.toString(),
      profile: this._profile.toJSON ? this._profile.toJSON() : this._profile,
      status: this._status,
      version: this._version
    };
  }
}

module.exports = Identity;
