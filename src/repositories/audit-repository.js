// ============================================
// Audit Repository - Data Access Layer
// ============================================

import { getDb } from '../services/firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const COLLECTION = 'audit_logs';

export class AuditRepository {
    constructor(db) {
        this.db = db || getDb();
    }

    async log(entry) {
        const data = {
            ...entry,
            timestamp: serverTimestamp()
        };
        const ref = await addDoc(collection(this.db, COLLECTION), data);
        return { id: ref.id, ...data };
    }
}

// Singleton instance
let instance = null;
export function getAuditRepository() {
    if (!instance) {
        instance = new AuditRepository(getDb());
    }
    return instance;
}
