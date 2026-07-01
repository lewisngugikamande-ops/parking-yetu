// ============================================
// Firebase Service - No Offline Persistence
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth as fbGetAuth,
    setPersistence, 
    browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    getFirestore as fbGetFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage as fbGetStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { config } from '../config/index.js';

let app = null;
let auth = null;
let db = null;
let storage = null;
let initialized = false;

export function initializeFirebase() {
    if (initialized && app) {
        return { app, auth, db, storage };
    }
    
    try {
        console.log('🔥 Initializing Firebase...');
        app = initializeApp(config.firebase);
        auth = fbGetAuth(app);
        db = fbGetFirestore(app);
        storage = fbGetStorage(app);
        
        // IMPORTANT: Remove offline persistence to avoid multi-tab errors
        // enableIndexedDbPersistence is REMOVED
        
        setPersistence(auth, browserLocalPersistence);
        
        initialized = true;
        console.log('🔥 Firebase initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        throw error;
    }
    
    return { app, auth, db, storage };
}

export function getAuth() {
    if (!auth) {
        if (!initialized) {
            initializeFirebase();
        }
        if (!auth) {
            throw new Error('Firebase not initialized - call initializeFirebase() first');
        }
    }
    return auth;
}

export function getDb() {
    if (!db) {
        if (!initialized) {
            initializeFirebase();
        }
        if (!db) {
            throw new Error('Firebase not initialized - call initializeFirebase() first');
        }
    }
    return db;
}

export function getStorage() {
    if (!storage) {
        if (!initialized) {
            initializeFirebase();
        }
        if (!storage) {
            throw new Error('Firebase not initialized - call initializeFirebase() first');
        }
    }
    return storage;
}

export function getFirebase() {
    if (!initialized || !app) {
        initializeFirebase();
    }
    return { app, auth, db, storage };
}
