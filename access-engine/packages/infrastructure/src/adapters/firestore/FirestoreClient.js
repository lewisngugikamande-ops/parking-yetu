let firestoreInstance = null;

function getFirestoreClient() {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    const admin = require('firebase-admin');
    
    // Check if already initialized (handle different module structures)
    let isInitialized = false;
    try {
      // Try to check if apps exists and has length
      isInitialized = admin.apps && Array.isArray(admin.apps) && admin.apps.length > 0;
    } catch (e) {
      // If checking apps fails, assume not initialized
      isInitialized = false;
    }
    
    if (!isInitialized) {
      // Initialize with project ID
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'parking-yetu',
      });
    }
    
    // Get Firestore instance
    firestoreInstance = admin.firestore();
    
    // Configure emulator if set
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      firestoreInstance.settings({
        host: process.env.FIRESTORE_EMULATOR_HOST,
        ssl: false,
      });
    }
    
    return firestoreInstance;
  } catch (error) {
    console.error('Failed to initialize Firestore:', error.message);
    console.error('Make sure firebase-admin is installed and properly configured.');
    throw error;
  }
}

class FirestoreClient {
  static getInstance() {
    return getFirestoreClient();
  }

  static reset() {
    firestoreInstance = null;
  }
}

module.exports = FirestoreClient;
