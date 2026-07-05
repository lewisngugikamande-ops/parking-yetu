const { AccessEngine } = require('../../src');
const { EventBus } = require('@access-engine/kernel');
const {
  MemoryIdentityRepository,
  MemoryCredentialRepository,
  MemoryMembershipRepository,
  MemoryPolicyRepository,
  MemorySessionRepository,
} = require('@access-engine/infrastructure');

const { Identity, Credential, Membership, Policy, Session } = require('@access-engine/engine');

describe('AccessEngine Integration', () => {
  let engine;
  
  beforeEach(() => {
    engine = AccessEngine.builder()
      .withIdentityRepository(new MemoryIdentityRepository())
      .withCredentialRepository(new MemoryCredentialRepository())
      .withMembershipRepository(new MemoryMembershipRepository())
      .withPolicyRepository(new MemoryPolicyRepository())
      .withSessionRepository(new MemorySessionRepository())
      .withEventBus(new EventBus())
      .build();
  });
  
  test('allows a member to enter via QR scan', async () => {
    // Create identity
    const identity = Identity.create({
      name: 'Test User',
      email: 'test@example.com'
    });
    await engine.identityRepository.save(identity);
    
    // Create credential
    const credential = Credential.create({
      identityId: identity.id,
      type: 'qr',
      value: 'TEST-QR-123'
    });
    await engine.credentialRepository.save(credential);
    
    // Create membership with roles
    const membership = Membership.create({
      identityId: identity.id,
      organizationId: 'test-org',
      roles: ['member']
    });
    await engine.membershipRepository.save(membership);
    
    // Create policy - FIX: Check membership.roles instead of identity.roles
    const policy = Policy.create({
      name: 'Member Access',
      organizationId: 'test-org',
      rules: [
        {
          condition: { field: 'membership.roles', operator: 'contains', value: 'member' },
          effect: 'allow'
        }
      ]
    });
    await engine.policyRepository.save(policy);
    
    // Process the request
    const result = await engine.process({
      credential: { value: 'TEST-QR-123' },
      accessPointId: 'gate-a',
      action: 'enter',
      organizationId: 'test-org'
    });
    
    expect(result.success).toBe(true);
    expect(result.decision).toBe('allow');
    expect(result.sessionId).toBeDefined();
  });
  
  test('denies access to non-member', async () => {
    const identity = Identity.create({
      name: 'Guest User',
      email: 'guest@example.com'
    });
    await engine.identityRepository.save(identity);
    
    const credential = Credential.create({
      identityId: identity.id,
      type: 'qr',
      value: 'GUEST-QR-456'
    });
    await engine.credentialRepository.save(credential);
    
    const result = await engine.process({
      credential: { value: 'GUEST-QR-456' },
      accessPointId: 'gate-a',
      action: 'enter',
      organizationId: 'test-org'
    });
    
    expect(result.success).toBe(false);
    expect(result.decision).toBe('deny');
  });
});
