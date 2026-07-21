// Memory Adapters
const {
  MemoryIdentityRepository,
  MemoryCredentialRepository,
  MemoryMembershipRepository,
  MemoryPolicyRepository,
  MemorySessionRepository,
} = require('./adapters/memory');

// Firestore Adapters
const FirestoreIdentityRepository = require('./adapters/firestore/FirestoreIdentityRepository');
const FirestoreCredentialRepository = require('./adapters/firestore/FirestoreCredentialRepository');
const FirestoreMembershipRepository = require('./adapters/firestore/FirestoreMembershipRepository');
const FirestorePolicyRepository = require('./adapters/firestore/FirestorePolicyRepository');
const FirestoreSessionRepository = require('./adapters/firestore/FirestoreSessionRepository');
const FirestoreClient = require('./adapters/firestore/FirestoreClient');
const FirestoreMapper = require('./adapters/firestore/FirestoreMapper');

// Auth Adapters
const {
  MockIssuer,
  MockResolver,
  JWTIssuer,
  JWTResolver,
  DatabasePermissionResolver,
  MockPermissionResolver,
} = require('./adapters/auth');

const RepositoryProvider = require('./RepositoryProvider');
const AuthRegistry = require('./AuthRegistry');

module.exports = {
  MemoryIdentityRepository,
  MemoryCredentialRepository,
  MemoryMembershipRepository,
  MemoryPolicyRepository,
  MemorySessionRepository,
  FirestoreIdentityRepository,
  FirestoreCredentialRepository,
  FirestoreMembershipRepository,
  FirestorePolicyRepository,
  FirestoreSessionRepository,
  FirestoreClient,
  FirestoreMapper,
  MockIssuer,
  MockResolver,
  JWTIssuer,
  JWTResolver,
  DatabasePermissionResolver,
  MockPermissionResolver,
  RepositoryProvider,
  AuthRegistry,
};
