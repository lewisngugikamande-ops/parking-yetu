/**
 * Repository Provider - Configuration-based dependency injection
 * 
 * Selects which repository implementation to use based on environment variable.
 */
class RepositoryProvider {
  static getProvider(type = process.env.REPOSITORY_PROVIDER || 'memory') {
    switch (type.toLowerCase()) {
      case 'firestore':
        return this.getFirestoreProvider();
      case 'memory':
      default:
        return this.getMemoryProvider();
    }
  }

  static getMemoryProvider() {
    // Lazy load to avoid circular dependencies
    const { 
      MemoryIdentityRepository,
      MemoryCredentialRepository,
      MemoryMembershipRepository,
      MemoryPolicyRepository,
      MemorySessionRepository,
    } = require('./adapters/memory');
    
    return {
      identity: new MemoryIdentityRepository(),
      credential: new MemoryCredentialRepository(),
      membership: new MemoryMembershipRepository(),
      policy: new MemoryPolicyRepository(),
      session: new MemorySessionRepository(),
    };
  }

  static getFirestoreProvider() {
    // Lazy load to avoid circular dependencies
    const {
      FirestoreIdentityRepository,
      FirestoreCredentialRepository,
      FirestoreMembershipRepository,
      FirestorePolicyRepository,
      FirestoreSessionRepository,
      FirestoreClient,
    } = require('./adapters/firestore/index');
    
    // Initialize Firestore client
    const db = FirestoreClient.getInstance();
    
    return {
      identity: new FirestoreIdentityRepository(),
      credential: new FirestoreCredentialRepository(),
      membership: new FirestoreMembershipRepository(),
      policy: new FirestorePolicyRepository(),
      session: new FirestoreSessionRepository(),
    };
  }
}

module.exports = RepositoryProvider;
