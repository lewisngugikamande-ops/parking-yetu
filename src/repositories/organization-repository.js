// ============================================
// Organization Repository - Data Access Layer
// ============================================

import { getDb } from '../services/firebase.js';
import { doc, getDoc, onSnapshot, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { Organization } from '../models/Organization.js';
import { OrganizationMapper } from '../mappers/organization-mapper.js';

const COLLECTION = 'organizations';

export class OrganizationRepository {
    constructor(db) {
        this.db = db || getDb();
        this.listeners = [];
    }

    async getById(id) {
        const docRef = doc(this.db, COLLECTION, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return OrganizationMapper.fromFirestore(snapshot);
    }

    async update(organization) {
        const data = OrganizationMapper.toFirestore(organization);
        await updateDoc(doc(this.db, COLLECTION, organization.id), data);
        return organization;
    }

    subscribeToChanges(id, callback) {
        const docRef = doc(this.db, COLLECTION, id);
        const unsub = onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                const org = OrganizationMapper.fromFirestore(snapshot);
                callback(org);
            }
        });
        this.listeners.push(unsub);
        return unsub;
    }

    cleanup() {
        this.listeners.forEach(unsub => unsub());
        this.listeners = [];
    }
}

// Singleton
let instance = null;

export function getOrganizationRepository() {
    if (!instance) {
        instance = new OrganizationRepository(getDb());
    }
    return instance;
}
