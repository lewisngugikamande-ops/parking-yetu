const { MembershipRepository } = require('@access-engine/contracts');
const FirestoreClient = require('./FirestoreClient');
const FirestoreMapper = require('./FirestoreMapper');
const { Membership } = require('@access-engine/engine');

class FirestoreMembershipRepository extends MembershipRepository {
  constructor() {
    super();
    this.db = FirestoreClient.getInstance();
    this.collectionName = 'memberships';
  }

  async save(membership) {
    const document = FirestoreMapper.toFirestore(membership);
    const docRef = this.db.collection(this.collectionName).doc(membership.id.toString());
    await docRef.set(document);
    return membership;
  }

  async findById(id) {
    const doc = await this.db.collection(this.collectionName).doc(id.toString()).get();
    if (!doc.exists) return null;
    return FirestoreMapper.fromFirestore(doc, Membership);
  }

  async findByIdentityAndOrganization(identityId, organizationId) {
    const identityIdStr = identityId.toString();
    const snapshot = await this.db
      .collection(this.collectionName)
      .where('identityId', '==', identityIdStr)
      .where('organizationId', '==', organizationId)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return FirestoreMapper.fromFirestore(snapshot.docs[0], Membership);
  }

  async findAll() {
    const snapshot = await this.db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => FirestoreMapper.fromFirestore(doc, Membership));
  }

  async delete(id) {
    await this.db.collection(this.collectionName).doc(id.toString()).delete();
  }
}

module.exports = FirestoreMembershipRepository;
