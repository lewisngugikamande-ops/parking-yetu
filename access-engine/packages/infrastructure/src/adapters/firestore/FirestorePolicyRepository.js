const { PolicyRepository } = require('@access-engine/contracts');
const FirestoreClient = require('./FirestoreClient');
const FirestoreMapper = require('./FirestoreMapper');
const { Policy } = require('@access-engine/engine');

class FirestorePolicyRepository extends PolicyRepository {
  constructor() {
    super();
    this.db = FirestoreClient.getInstance();
    this.collectionName = 'policies';
  }

  async save(policy) {
    const data = FirestoreMapper.toFirestore(policy);
    const docRef = this.db.collection(this.collectionName).doc(policy.id.toString());
    await docRef.set(data);
    return policy;
  }

  async findById(id) {
    const doc = await this.db.collection(this.collectionName).doc(id.toString()).get();
    if (!doc.exists) return null;
    return FirestoreMapper.fromFirestore(doc, Policy);
  }

  async findByOrganization(organizationId) {
    const snapshot = await this.db
      .collection(this.collectionName)
      .where('organizationId', '==', organizationId)
      .get();
    return snapshot.docs.map(doc => FirestoreMapper.fromFirestore(doc, Policy));
  }

  async findAll() {
    const snapshot = await this.db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => FirestoreMapper.fromFirestore(doc, Policy));
  }

  async delete(id) {
    await this.db.collection(this.collectionName).doc(id.toString()).delete();
  }
}

module.exports = FirestorePolicyRepository;
