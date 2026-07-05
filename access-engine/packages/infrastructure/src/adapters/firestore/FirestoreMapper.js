/**
 * Firestore Mapper
 * Maps between domain entities and Firestore documents
 * 
 * This mapper is intentionally simple. It relies on domain entities
 * to serialize themselves correctly via toJSON().
 */
class FirestoreMapper {
  /**
   * Convert domain entity to Firestore document
   * 
   * Domain entities are responsible for their own serialization.
   * The mapper only handles:
   * - Document ID extraction
   * - Firestore-specific types (timestamps)
   */
  static toFirestore(entity) {
    // Let the entity serialize itself
    const data = entity.toJSON ? entity.toJSON() : { ...entity };
    
    // Remove id from data (it's stored as document id)
    const { id, ...document } = data;
    
    // Convert dates to Firestore timestamps
    if (document.createdAt) document.createdAt = new Date(document.createdAt);
    if (document.updatedAt) document.updatedAt = new Date(document.updatedAt);
    
    return document;
  }

  /**
   * Convert Firestore document to domain entity
   */
  static fromFirestore(doc, EntityClass) {
    const data = doc.data();
    const id = doc.id;
    
    // Convert Firestore timestamps to ISO strings
    const converted = { ...data, id };
    if (converted.createdAt && converted.createdAt.toISOString) {
      converted.createdAt = converted.createdAt.toISOString();
    }
    if (converted.updatedAt && converted.updatedAt.toISOString) {
      converted.updatedAt = converted.updatedAt.toISOString();
    }

  // ✅ This should return a domain entity, not a plain object
  if (EntityClass.restore) {
    return EntityClass.restore(converted);
  }
  if (EntityClass.create) {
    return EntityClass.create(converted);
  }
  return new EntityClass(converted)
;
  }
}

module.exports = FirestoreMapper;
