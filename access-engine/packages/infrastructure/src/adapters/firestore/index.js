// Firestore Adapters
const FirestoreIdentityRepository = require('./FirestoreIdentityRepository');
const FirestoreCredentialRepository = require('./FirestoreCredentialRepository');
const FirestoreMembershipRepository = require('./FirestoreMembershipRepository');
const FirestorePolicyRepository = require('./FirestorePolicyRepository');
const FirestoreSessionRepository = require('./FirestoreSessionRepository');
const FirestoreClient = require('./FirestoreClient');
const FirestoreMapper = require('./FirestoreMapper');
const FirestoreTransactionManager = require('./FirestoreTransactionManager');

module.exports = {
  FirestoreIdentityRepository,
  FirestoreCredentialRepository,
  FirestoreMembershipRepository,
  FirestorePolicyRepository,
  FirestoreSessionRepository,
  FirestoreClient,
  FirestoreMapper,
  FirestoreTransactionManager,
};
