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
  // Private constructor - use factory methods
  constructor(data) {
    const id = data.id instanceof IdentityId ? data.id : new IdentityId(data.id);
    super(id);
    
    this._profile = data.profile instanceof IdentityProfile 
      ? data.profile 
      : new IdentityProfile(data.profile);
    this._status = data.status || 'active';
    this._version = data.version || 0;
    
    // If new, emit creation event
    if (!data.fromRepository) {
      this._addEvent(new IdentityCreatedEvent(this._id, this._profile));
    }
  }
  
  // Getters
  get profile() { return this._profile; }
  get status() { return this._status; }
  get version() { return this._version; }
  get isActive() { return this._status === 'active'; }
  get isSuspended() { return this._status === 'suspended'; }
  get isDeactivated() { return this._status === 'deactivated'; }
  
  // Factory: Create new identity
  static create(profile) {
    return new Identity({
      profile,
      status: 'active',
      fromRepository: false
    });
  }
  
  // Factory: Restore from repository
  static restore(data) {
    return new Identity({
      ...data,
      fromRepository: true
    });
  }
  
  // Commands
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
  
  // Serialization
  toJSON() {
    return {
      id: this._id.toString(),
      profile: this._profile.toJSON(),
      status: this._status,
      version: this._version
    };
  }
}

module.exports = Identity;
