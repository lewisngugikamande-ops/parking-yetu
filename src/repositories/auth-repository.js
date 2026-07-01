// ============================================
// Auth Repository - Authentication Abstraction
// ============================================

import { getAuth, getDb } from '../services/firebase.js';
import { 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export class AuthRepository {
    constructor() {
        this.auth = getAuth();
        this.db = getDb();
        this.authListeners = [];
        this.currentUser = null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Sign in with email/password
    async signInWithEmail(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            await this.loadUserFromAuth(userCredential.user);
            return this.currentUser;
        } catch (error) {
            throw error;
        }
    }

    // Sign out
    async signOut() {
        await signOut(this.auth);
        this.currentUser = null;
        this.notifyListeners();
    }

    // Listen for auth state changes
    onAuthStateChanged(callback) {
        const unsub = onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                await this.loadUserFromAuth(user);
            } else {
                this.currentUser = null;
            }
            callback(this.currentUser);
        });
        this.authListeners.push(unsub);
        return unsub;
    }

    // Load user data from Firestore
    async loadUserFromAuth(user) {
        try {
            const userDoc = await getDoc(doc(this.db, 'users', user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                this.currentUser = {
                    id: user.uid,
                    email: user.email,
                    displayName: data.name || user.displayName || 'User',
                    role: data.role || 'driver',
                    permissions: data.permissions || {},
                    organizationId: data.organizationId,
                    locationId: data.locationId,
                    isActive: data.isActive !== false,
                    authMethod: 'email',
                    lastActive: new Date()
                };
            } else {
                // Create minimal user if not exists
                const newUser = {
                    uid: user.uid,
                    name: user.displayName || 'User',
                    email: user.email,
                    role: 'driver',
                    organizationId: 'org_church_a',
                    locationId: 'church_a',
                    isActive: true,
                    permissions: {},
                    createdAt: serverTimestamp()
                };
                await setDoc(doc(this.db, 'users', user.uid), newUser);
                this.currentUser = {
                    id: user.uid,
                    email: user.email,
                    displayName: newUser.name,
                    role: newUser.role,
                    permissions: {},
                    organizationId: newUser.organizationId,
                    locationId: newUser.locationId,
                    isActive: true,
                    authMethod: 'email',
                    lastActive: new Date()
                };
            }
            this.notifyListeners();
            return this.currentUser;
        } catch (error) {
            console.error('Error loading user:', error);
            return null;
        }
    }

    // Notify listeners
    notifyListeners() {
        this.authListeners.forEach(listener => listener(this.currentUser));
    }

    // Cleanup
    cleanup() {
        this.authListeners.forEach(listener => listener());
        this.authListeners = [];
    }
}

// Singleton
let instance = null;

export function getAuthRepository() {
    if (!instance) {
        instance = new AuthRepository();
    }
    return instance;
}
