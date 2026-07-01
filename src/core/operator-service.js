// ============================================
// Operator Service - No Organization Dependency
// ============================================

import { getAuth, getDb } from '../services/firebase.js';
import { 
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { Operator } from '../models/Operator.js';

let auth = null;
let db = null;
let currentOperator = null;
let listeners = [];
let initialized = false;

function getAuthInstance() {
    if (!auth) {
        try {
            auth = getAuth();
            db = getDb();
            console.log('✅ OperatorService: Firebase instances acquired');
        } catch (e) {
            console.error('❌ OperatorService: Failed to get Firebase instances:', e);
            throw e;
        }
    }
    return auth;
}

function getDbInstance() {
    if (!db) {
        try {
            db = getDb();
        } catch (e) {
            console.error('❌ OperatorService: Failed to get Firestore instance:', e);
            throw e;
        }
    }
    return db;
}

export const OperatorService = {
    init() {
        if (initialized) return;
        
        try {
            const authInstance = getAuthInstance();
            console.log('✅ OperatorService: Setting up auth listener');
            
            onAuthStateChanged(authInstance, async (user) => {
                if (user) {
                    await loadOperatorFromAuth(user);
                } else {
                    currentOperator = null;
                    notifyListeners();
                }
            });
            
            initialized = true;
        } catch (error) {
            console.error('❌ OperatorService: Init failed:', error);
        }
    },

    async signInWithEmail(email, password) {
        try {
            const authInstance = getAuthInstance();
            const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js");
            const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
            await loadOperatorFromAuth(userCredential.user);
            return currentOperator;
        } catch (error) {
            throw error;
        }
    },

    async signOut() {
        try {
            const authInstance = getAuthInstance();
            await signOut(authInstance);
            currentOperator = null;
            notifyListeners();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    },

    getCurrent() {
        return currentOperator;
    },

    isAuthenticated() {
        return !!currentOperator;
    },

    subscribe(callback) {
        listeners.push(callback);
        return () => {
            listeners = listeners.filter(fn => fn !== callback);
        };
    }
};

async function loadOperatorFromAuth(user) {
    try {
        const dbInstance = getDbInstance();
        const userRef = doc(dbInstance, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        let operatorData;
        
        if (userDoc.exists()) {
            const data = userDoc.data();
            operatorData = {
                id: user.uid,
                displayName: data.name || user.displayName || 'User',
                email: user.email,
                role: data.role || 'security',
                authMethod: 'email',
                organizationId: data.organizationId || 'org_church_a',
                siteId: data.siteId || null,
                isActive: data.isActive !== false
            };
            console.log('✅ Operator loaded from Firestore');
        } else {
            // Create new user document - use default org
            operatorData = {
                id: user.uid,
                displayName: user.displayName || user.email || 'User',
                email: user.email,
                role: 'security',
                authMethod: 'email',
                organizationId: 'org_church_a',  // Default organization
                siteId: null,
                isActive: true
            };
            
            try {
                await setDoc(userRef, {
                    name: operatorData.displayName,
                    email: operatorData.email,
                    role: operatorData.role,
                    organizationId: operatorData.organizationId,
                    siteId: operatorData.siteId,
                    isActive: true,
                    createdAt: serverTimestamp()
                });
                console.log('✅ User document created');
            } catch (createError) {
                console.warn('⚠️ Could not create user document:', createError.message);
            }
        }
        
        currentOperator = Operator.fromPlain(operatorData);
        notifyListeners();
        return currentOperator;
        
    } catch (error) {
        console.error('Error loading operator:', error);
        // Fallback: create operator from auth data
        if (user) {
            const fallbackData = {
                id: user.uid,
                displayName: user.displayName || user.email || 'User',
                email: user.email,
                role: 'security',
                authMethod: 'email',
                organizationId: 'org_church_a',
                siteId: null,
                isActive: true
            };
            currentOperator = Operator.fromPlain(fallbackData);
            notifyListeners();
            return currentOperator;
        }
        return null;
    }
}

function notifyListeners() {
    listeners.forEach(fn => fn(currentOperator));
}
