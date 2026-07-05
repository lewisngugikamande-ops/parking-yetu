const { Identity, IdentityId, IdentityProfile } = require('./');
const { Result } = require('@access-engine/foundation');

describe('Identity', () => {
  describe('Creation', () => {
    test('creates an active identity with valid profile', () => {
      const identity = Identity.create({
        name: 'Lewis',
        email: 'lewis@example.com',
        phone: '+254712345678'
      });
      
      expect(identity.isActive).toBe(true);
      expect(identity.profile.name).toBe('Lewis');
      expect(identity.profile.email).toBe('lewis@example.com');
      expect(identity.profile.phone).toBe('+254712345678');
    });
    
    test('emits IdentityCreatedEvent on creation', () => {
      const identity = Identity.create({
        name: 'Lewis',
        email: 'lewis@example.com'
      });
      
      const events = identity.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('identity.created');
      expect(events[0].data.profile.name).toBe('Lewis');
    });
    
    test('rejects invalid email', () => {
      expect(() => {
        Identity.create({
          name: 'Lewis',
          email: 'not-an-email'
        });
      }).toThrow('Invalid email address');
    });
    
    test('rejects invalid phone', () => {
      expect(() => {
        Identity.create({
          name: 'Lewis',
          phone: '123'
        });
      }).toThrow('Invalid phone number');
    });
  });
  
  describe('Activation', () => {
    test('activates a suspended identity', () => {
      const identity = Identity.create({ name: 'Lewis' });
      identity.suspend('Testing suspension');
      expect(identity.isSuspended).toBe(true);
      
      const result = identity.activate();
      expect(result.isOk()).toBe(true);
      expect(identity.isActive).toBe(true);
    });
    
    test('fails to activate an already active identity', () => {
      const identity = Identity.create({ name: 'Lewis' });
      expect(identity.isActive).toBe(true);
      
      const result = identity.activate();
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().message).toBe('Identity is already active');
    });
    
    test('fails to activate a deactivated identity', () => {
      const identity = Identity.create({ name: 'Lewis' });
      identity.deactivate('Deactivated');
      expect(identity.isDeactivated).toBe(true);
      
      const result = identity.activate();
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().message).toBe('Cannot activate a deactivated identity');
    });
    
    test('emits IdentityActivatedEvent on activation', () => {
      const identity = Identity.create({ name: 'Lewis' });
      identity.suspend('Testing');
      identity.clearEvents();
      
      identity.activate();
      const events = identity.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('identity.activated');
    });
  });
  
  describe('Suspension', () => {
    test('suspends an active identity', () => {
      const identity = Identity.create({ name: 'Lewis' });
      expect(identity.isActive).toBe(true);
      
      const result = identity.suspend('Suspension reason');
      expect(result.isOk()).toBe(true);
      expect(identity.isSuspended).toBe(true);
    });
    
    test('fails to suspend an already suspended identity', () => {
      const identity = Identity.create({ name: 'Lewis' });
      identity.suspend('First suspension');
      
      const result = identity.suspend('Second suspension');
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().message).toBe('Identity is already suspended');
    });
    
    test('fails to suspend a deactivated identity', () => {
      const identity = Identity.create({ name: 'Lewis' });
      identity.deactivate('Deactivated');
      
      const result = identity.suspend('Suspension reason');
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().message).toBe('Cannot suspend a deactivated identity');
    });
    
    test('emits IdentitySuspendedEvent on suspension', () => {
      const identity = Identity.create({ name: 'Lewis' });
      identity.clearEvents();
      
      identity.suspend('Suspension reason');
      const events = identity.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('identity.suspended');
      expect(events[0].data.reason).toBe('Suspension reason');
    });
  });
  
  describe('Deactivation', () => {
    test('deactivates an active identity', () => {
      const identity = Identity.create({ name: 'Lewis' });
      expect(identity.isActive).toBe(true);
      
      const result = identity.deactivate('Deactivation reason');
      expect(result.isOk()).toBe(true);
      expect(identity.isDeactivated).toBe(true);
    });
    
    test('deactivates a suspended identity', () => {
      const identity = Identity.create({ name: 'Lewis' });
      identity.suspend('Suspension');
      
      const result = identity.deactivate('Deactivation reason');
      expect(result.isOk()).toBe(true);
      expect(identity.isDeactivated).toBe(true);
    });
    
    test('fails to deactivate an already deactivated identity', () => {
      const identity = Identity.create({ name: 'Lewis' });
      identity.deactivate('First deactivation');
      
      const result = identity.deactivate('Second deactivation');
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr().message).toBe('Identity is already deactivated');
    });
    
    test('emits IdentityDeactivatedEvent on deactivation', () => {
      const identity = Identity.create({ name: 'Lewis' });
      identity.clearEvents();
      
      identity.deactivate('Deactivation reason');
      const events = identity.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe('identity.deactivated');
      expect(events[0].data.reason).toBe('Deactivation reason');
    });
  });
  
  describe('Versioning', () => {
    test('increments version on each state change', () => {
      const identity = Identity.create({ name: 'Lewis' });
      expect(identity.version).toBe(0);
      
      identity.suspend('Suspension');
      expect(identity.version).toBe(1);
      
      identity.activate();
      expect(identity.version).toBe(2);
      
      identity.deactivate('Deactivation');
      expect(identity.version).toBe(3);
    });
  });
  
  describe('Restoration', () => {
    test('restores from repository data without emitting events', () => {
      const restored = Identity.restore({
        id: 'restored-123',
        profile: { name: 'Restored User' },
        status: 'active',
        version: 5
      });
      
      expect(restored.id.toString()).toBe('restored-123');
      expect(restored.profile.name).toBe('Restored User');
      expect(restored.version).toBe(5);
      expect(restored.isActive).toBe(true);
      
      // No events on restoration
      expect(restored.getEvents()).toHaveLength(0);
    });
  });
  
  describe('Serialization', () => {
    test('serializes to JSON', () => {
      const identity = Identity.create({
        name: 'Lewis',
        email: 'lewis@example.com',
        phone: '+254712345678'
      });
      
      const json = identity.toJSON();
      expect(json).toEqual({
        id: expect.any(String),
        profile: {
          name: 'Lewis',
          email: 'lewis@example.com',
          phone: '+254712345678',
          metadata: {}
        },
        status: 'active',
        version: 0
      });
    });
  });
});
