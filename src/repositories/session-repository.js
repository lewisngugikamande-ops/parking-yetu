// ============================================
// Session Repository - Data Access Layer
// ============================================

import { getDb } from '../services/firebase.js';
import { 
    collection, doc, getDoc, getDocs, query, where, 
    orderBy, limit, addDoc, setDoc, updateDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { SessionMapper } from '../mappers/session-mapper.js';
import { Session } from '../models/Session.js';

const COLLECTION = 'parking_sessions';

export class SessionRepository {
    constructor(db) {
        this.db = db || getDb();
    }

    async create(session) {
        const ref = doc(collection(this.db, COLLECTION));
        session.id = ref.id;
        const data = SessionMapper.toFirestore(session);
        await setDoc(ref, data);
        return session;
    }

    async getById(id) {
        const docRef = doc(this.db, COLLECTION, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return SessionMapper.fromFirestore(snapshot);
    }

    async getActive(organizationId, limitCount = 50) {
        const q = query(
            collection(this.db, COLLECTION),
            where('organizationId', '==', organizationId),
            where('status', '==', 'PARKED'),
            orderBy('entryTime', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        const sessions = [];
        snapshot.forEach(doc => sessions.push(SessionMapper.fromFirestore(doc)));
        return sessions;
    }

    async getByVehicle(vehicleId) {
        const q = query(
            collection(this.db, COLLECTION),
            where('vehicleId', '==', vehicleId),
            orderBy('entryTime', 'desc')
        );
        const snapshot = await getDocs(q);
        const sessions = [];
        snapshot.forEach(doc => sessions.push(SessionMapper.fromFirestore(doc)));
        return sessions;
    }

    async update(session) {
        const data = SessionMapper.toFirestoreUpdate(session);
        await updateDoc(doc(this.db, COLLECTION, session.id), data);
        return session;
    }

    async delete(id) {
        await deleteDoc(doc(this.db, COLLECTION, id));
        return true;
    }

    async exit(id, gate) {
        const session = await this.getById(id);
        if (!session) throw new Error('Session not found');
        session.exit(gate);
        return await this.update(session);
    }
}

// Singleton instance
let instance = null;
export function getSessionRepository() {
    if (!instance) {
        instance = new SessionRepository(getDb());
    }
    return instance;
}
