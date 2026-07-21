const { RepositoryProvider } = require('../src');
const { Identity, Credential, Membership, Policy, Session } = require('@access-engine/engine');

describe('Repository Tests', () => {
  let repositories;
  
  // Determine which provider to test
  const provider = process.env.REPOSITORY_PROVIDER || 'memory';
  const isFirestore = provider === 'firestore';
  
  beforeAll(() => {
    console.log(`🧪 Testing ${provider} repositories...`);
    repositories = RepositoryProvider.getProvider(provider);
  });

  afterAll(async () => {
    // Clean up Firestore connection if needed
    if (isFirestore) {
      // Give Firestore time to close connections
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    // Force Jest to exit
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe('Identity Repository', () => {
    test('should create and retrieve an identity', async () => {
      const identity = Identity.create({
        name: 'Test User',
        email: 'test@example.com'
      });
      
      await repositories.identity.save(identity);
      const found = await repositories.identity.findById(identity.id);
      
      expect(found).toBeDefined();
      expect(found.profile.name).toBe('Test User');
      expect(found.id.toString()).toBe(identity.id.toString());
    });

    test('should return null for non-existent identity', async () => {
      const found = await repositories.identity.findById('non-existent-id');
      expect(found).toBeNull();
    });

    test('should delete an identity', async () => {
      const identity = Identity.create({
        name: 'Delete Me',
        email: 'delete@example.com'
      });
      
      await repositories.identity.save(identity);
      await repositories.identity.delete(identity.id);
      const found = await repositories.identity.findById(identity.id);
      
      expect(found).toBeNull();
    });

    test('should find all identities', async () => {
      const all = await repositories.identity.findAll();
      expect(Array.isArray(all)).toBe(true);
    });
  });

  describe('Credential Repository', () => {
    let testIdentity;
    
    beforeAll(async () => {
      testIdentity = Identity.create({
        name: 'Credential Test User',
        email: 'credential@example.com'
      });
      await repositories.identity.save(testIdentity);
    });

    test('should create and retrieve a credential', async () => {
      const credential = Credential.create({
        identityId: testIdentity.id,
        type: 'qr',
        value: 'TEST-CRED-123'
      });
      
      await repositories.credential.save(credential);
      const found = await repositories.credential.findById(credential.id);
      
      expect(found).toBeDefined();
      expect(found.value).toBe('TEST-CRED-123');
      expect(found.identityId.toString()).toBe(testIdentity.id.toString());
    });

    test('should find credential by value', async () => {
      const credential = Credential.create({
        identityId: testIdentity.id,
        type: 'qr',
        value: 'UNIQUE-VALUE-456'
      });
      
      await repositories.credential.save(credential);
      const found = await repositories.credential.findByValue('UNIQUE-VALUE-456');
      
      expect(found).toBeDefined();
      expect(found.value).toBe('UNIQUE-VALUE-456');
    });

    test('should return null for non-existent credential', async () => {
      const found = await repositories.credential.findByValue('NON-EXISTENT');
      expect(found).toBeNull();
    });
  });

  describe('Membership Repository', () => {
    let testIdentity;
    
    beforeAll(async () => {
      testIdentity = Identity.create({
        name: 'Membership Test User',
        email: 'membership@example.com'
      });
      await repositories.identity.save(testIdentity);
    });

    test('should create and retrieve a membership', async () => {
      const membership = Membership.create({
        identityId: testIdentity.id,
        organizationId: 'test-org',
        roles: ['member']
      });
      
      await repositories.membership.save(membership);
      const found = await repositories.membership.findById(membership.id);
      
      expect(found).toBeDefined();
      expect(found.organizationId).toBe('test-org');
      expect(found.roles).toContain('member');
    });

    test('should find membership by identity and organization', async () => {
      const membership = Membership.create({
        identityId: testIdentity.id,
        organizationId: 'another-org',
        roles: ['admin']
      });
      
      await repositories.membership.save(membership);
      const found = await repositories.membership.findByIdentityAndOrganization(
        testIdentity.id,
        'another-org'
      );
      
      expect(found).toBeDefined();
      expect(found.roles).toContain('admin');
    });
  });

  describe('Policy Repository', () => {
    test('should create and retrieve a policy', async () => {
      const policy = Policy.create({
        name: 'Test Policy',
        organizationId: 'test-org',
        rules: [
          {
            condition: { field: 'membership.roles', operator: 'contains', value: 'member' },
            effect: 'allow'
          }
        ]
      });
      
      await repositories.policy.save(policy);
      const found = await repositories.policy.findById(policy.id);
      
      expect(found).toBeDefined();
      expect(found.name).toBe('Test Policy');
      expect(found.rules).toHaveLength(1);
    });

    test('should find policies by organization', async () => {
      const policy1 = Policy.create({
        name: 'Policy 1',
        organizationId: 'org-a',
        rules: []
      });
      const policy2 = Policy.create({
        name: 'Policy 2',
        organizationId: 'org-a',
        rules: []
      });
      
      await repositories.policy.save(policy1);
      await repositories.policy.save(policy2);
      
      const found = await repositories.policy.findByOrganization('org-a');
      expect(found.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Session Repository', () => {
    let testIdentity;
    
    beforeAll(async () => {
      testIdentity = Identity.create({
        name: 'Session Test User',
        email: 'session@example.com'
      });
      await repositories.identity.save(testIdentity);
    });

    test('should create and retrieve a session', async () => {
      const session = Session.create({
        identityId: testIdentity.id,
        resourceId: 'gate-a',
        status: 'active',
        context: { test: true }
      });
      
      await repositories.session.save(session);
      const found = await repositories.session.findById(session.id);
      
      expect(found).toBeDefined();
      expect(found.resourceId).toBe('gate-a');
      expect(found.status).toBe('active');
    });

    test('should find active session by resource', async () => {
      const session = Session.create({
        identityId: testIdentity.id,
        resourceId: 'gate-b',
        status: 'active'
      });
      
      await repositories.session.save(session);
      const found = await repositories.session.findActiveByResource('gate-b');
      
      expect(found).toBeDefined();
      expect(found.resourceId).toBe('gate-b');
      expect(found.status).toBe('active');
    });
  });
});
