// ============================================
// Organization Service - Creates Default Org
// ============================================

import { getDb } from '../services/firebase.js';
import { doc, getDoc, onSnapshot, updateDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { Organization } from '../models/Organization.js';

const COLLECTION = 'organizations';

let currentOrganization = null;
let listeners = [];

export const OrganizationService = {
    async load(organizationId) {
        console.log('📂 Loading organization:', organizationId);
        const db = getDb();
        const docRef = doc(db, COLLECTION, organizationId);
        const snapshot = await getDoc(docRef);
        
        if (!snapshot.exists()) {
            console.log('📝 Creating default organization:', organizationId);
            // Create default organization
            const defaultOrg = {
                name: 'Default Organization',
                type: 'church',
                settings: {
                    authMode: 'email',
                    timeLimit: 180,
                    alertThreshold: 120,
                    sessionTimeout: 480,
                    defaultGate: 'Gate A',
                    defaultLocation: 'church_a',
                    maxCapacity: 100,
                    allowOvernight: false,
                    currency: 'KES',
                    timezone: 'Africa/Nairobi'
                }
            };
            
            await setDoc(docRef, {
                ...defaultOrg,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log('✅ Default organization created');
            
            currentOrganization = new Organization({ id: organizationId, ...defaultOrg });
            return currentOrganization;
        }
        
        const data = snapshot.data();
        currentOrganization = Organization.fromPlain({ id: snapshot.id, ...data });
        console.log('✅ Organization loaded:', currentOrganization.name);
        
        // Listen for changes
        onSnapshot(docRef, (snap) => {
            if (snap.exists()) {
                const updated = Organization.fromPlain({ id: snap.id, ...snap.data() });
                currentOrganization = updated;
                listeners.forEach(fn => fn(updated));
            }
        });
        
        return currentOrganization;
    },

    getCurrent() {
        if (!currentOrganization) {
            throw new Error('Organization not loaded');
        }
        return currentOrganization;
    },

    async updateSettings(newSettings) {
        if (!currentOrganization) throw new Error('Organization not loaded');
        
        currentOrganization.settings = { ...currentOrganization.settings, ...newSettings };
        currentOrganization.updatedAt = new Date();
        
        const db = getDb();
        const docRef = doc(db, COLLECTION, currentOrganization.id);
        await updateDoc(docRef, {
            settings: currentOrganization.settings,
            updatedAt: serverTimestamp()
        });
        
        return currentOrganization;
    },

    subscribe(callback) {
        listeners.push(callback);
        return () => {
            listeners = listeners.filter(fn => fn !== callback);
        };
    },

    isLoaded() {
        return !!currentOrganization;
    }
};
