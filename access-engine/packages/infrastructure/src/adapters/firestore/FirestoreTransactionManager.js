const FirestoreClient = require('./FirestoreClient');

/**
 * Firestore Transaction Manager
 * Wraps Firestore transactions in a clean abstraction
 */
class FirestoreTransactionManager {
  constructor() {
    this.db = FirestoreClient.getInstance();
  }

  /**
   * Execute a transaction
   * @param {Function} callback - async function that receives transaction object
   * @returns {Promise} - result of the transaction
   */
  async execute(callback) {
    return await this.db.runTransaction(async (transaction) => {
      return await callback(transaction);
    });
  }

  /**
   * Get a collection reference
   */
  collection(name) {
    return this.db.collection(name);
  }

  /**
   * Get a document reference
   */
  doc(path) {
    return this.db.doc(path);
  }
}

module.exports = FirestoreTransactionManager;
