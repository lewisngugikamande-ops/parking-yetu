const { SessionRepository } = require('@access-engine/contracts');
const FirestoreClient = require('./FirestoreClient');
const FirestoreMapper = require('./FirestoreMapper');
const { Session } = require('@access-engine/engine');

class FirestoreSessionRepository extends SessionRepository {
  constructor() {
    super();
    this.db = FirestoreClient.getInstance();
    this.collectionName = 'sessions';
  }

  async save(session) {
    const data = FirestoreMapper.toFirestore(session);
    const docRef = this.db.collection(this.collectionName).doc(session.id.toString());
    await docRef.set(data);
    return session;
  }

  async findById(id) {
    const doc = await this.db.collection(this.collectionName).doc(id.toString()).get();
    if (!doc.exists) return null;
    return FirestoreMapper.fromFirestore(doc, Session);
  }

  async findActiveByResource(resourceId) {
    const snapshot = await this.db
      .collection(this.collectionName)
      .where('resourceId', '==', resourceId)
      .where('status', '==', 'active')
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return FirestoreMapper.fromFirestore(snapshot.docs[0], Session);
  }

  async findAll() {
    const snapshot = await this.db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => FirestoreMapper.fromFirestore(doc, Session));
  }

  async delete(id) {
    await this.db.collection(this.collectionName).doc(id.toString()).delete();
  }

  async findByOrganization(organizationId) {
    const snapshot = await this.db
      .collection(this.collectionName)
      .where('organizationId', '==', organizationId)
      .get();
    return snapshot.docs.map(doc => FirestoreMapper.fromFirestore(doc, Session));
  }
}

module.exports = FirestoreSessionRepository;
