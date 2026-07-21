const { CredentialRepository } = require('@access-engine/contracts');
const FirestoreClient = require('./FirestoreClient');
const FirestoreMapper = require('./FirestoreMapper');
const { Credential } = require('@access-engine/engine');

class FirestoreCredentialRepository extends CredentialRepository {
  constructor() {
    super();
    this.db = FirestoreClient.getInstance();
    this.collectionName = 'credentials';
  }

  async save(credential) {
    const document = FirestoreMapper.toFirestore(credential);
    const docRef = this.db.collection(this.collectionName).doc(credential.id.toString());
    await docRef.set(document);
    return credential;
  }

  async findById(id) {
    const doc = await this.db.collection(this.collectionName).doc(id.toString()).get();
    if (!doc.exists) return null;
    return FirestoreMapper.fromFirestore(doc, Credential);
  }

  async findByValue(value) {
    const snapshot = await this.db
      .collection(this.collectionName)
      .where('value', '==', value)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return FirestoreMapper.fromFirestore(snapshot.docs[0], Credential);
  }

  async findAll() {
    const snapshot = await this.db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => FirestoreMapper.fromFirestore(doc, Credential));
  }

  async delete(id) {
    await this.db.collection(this.collectionName).doc(id.toString()).delete();
  }
}

module.exports = FirestoreCredentialRepository;
