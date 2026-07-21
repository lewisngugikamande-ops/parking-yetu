const { DomainEvent } = require('@access-engine/foundation');

class IdentityCreatedEvent extends DomainEvent {
  constructor(identityId, profile) {
    super('identity.created', { identityId: identityId.toString(), profile: profile.toJSON() }, identityId);
  }
}

class IdentityActivatedEvent extends DomainEvent {
  constructor(identityId) {
    super('identity.activated', { identityId: identityId.toString() }, identityId);
  }
}

class IdentitySuspendedEvent extends DomainEvent {
  constructor(identityId, reason) {
    super('identity.suspended', { identityId: identityId.toString(), reason }, identityId);
  }
}

class IdentityDeactivatedEvent extends DomainEvent {
  constructor(identityId, reason) {
    super('identity.deactivated', { identityId: identityId.toString(), reason }, identityId);
  }
}

class CredentialAddedEvent extends DomainEvent {
  constructor(identityId, credentialId, credentialType) {
    super('identity.credential.added', { 
      identityId: identityId.toString(), 
      credentialId: credentialId.toString(),
      credentialType 
    }, identityId);
  }
}

class CredentialRemovedEvent extends DomainEvent {
  constructor(identityId, credentialId) {
    super('identity.credential.removed', { 
      identityId: identityId.toString(), 
      credentialId: credentialId.toString() 
    }, identityId);
  }
}

module.exports = {
  IdentityCreatedEvent,
  IdentityActivatedEvent,
  IdentitySuspendedEvent,
  IdentityDeactivatedEvent,
  CredentialAddedEvent,
  CredentialRemovedEvent,
};
