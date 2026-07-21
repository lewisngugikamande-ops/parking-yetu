const { IdentityRepository } = require('@access-engine/contracts');
const FirestoreClient = require('./FirestoreClient');
const FirestoreMapper = require('./FirestoreMapper');
const { Identity } = require('@access-engine/engine');

class FirestoreIdentityRepository extends IdentityRepository {
  constructor() {
    super();
    this.db = FirestoreClient.getInstance();
    this.collectionName = 'identities';
  }

  async save(identity) {
    const data = FirestoreMapper.toFirestore(identity);
    const docRef = this.db.collection(this.collectionName).doc(identity.id.toString());
    await docRef.set(data);
    return identity;
  }



  async findById(id) {
    const doc = await this.db.collection(this.collectionName).doc(id.toString()).get();
    if (!doc.exists) return null;
    // ✅ Should return a domain entity
    return FirestoreMapper.fromFirestore(doc, Identity);
  }

  async findAll() {
    const snapshot = await this.db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => FirestoreMapper.fromFirestore(doc, Identity));
  }

  async delete(id) {
    await this.db.collection(this.collectionName).doc(id.toString()).delete();
  }
}

module.exports = FirestoreIdentityRepository;
