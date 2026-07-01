// ============================================
// Gate Repository - Data Access Layer
// ============================================

import { getDb } from '../services/firebase.js';
import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { GateMapper } from '../mappers/gate-mapper.js';
import { Gate } from '../models/Gate.js';

const COLLECTION = 'gates';

export class GateRepository {
    constructor(db) {
        this.db = db || getDb();
    }

    async create(gate) {
        const id = gate.id || doc(collection(this.db, COLLECTION)).id;
        gate.id = id;
        const data = GateMapper.toFirestore(gate);
        await setDoc(doc(this.db, COLLECTION, id), data);
        return gate;
    }

    async getById(id) {
        const docRef = doc(this.db, COLLECTION, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return GateMapper.fromFirestore(snapshot);
    }

    async getByLocation(locationId) {
        const q = query(collection(this.db, COLLECTION), where('locationId', '==', locationId));
        const snapshot = await getDocs(q);
        const gates = [];
        snapshot.forEach(doc => gates.push(GateMapper.fromFirestore(doc)));
        return gates;
    }

    async update(gate) {
        const data = GateMapper.toFirestoreUpdate(gate);
        await updateDoc(doc(this.db, COLLECTION, gate.id), data);
        return gate;
    }

    async open(id, operator) {
        const gate = await this.getById(id);
        if (!gate) throw new Error('Gate not found');
        gate.open(operator);
        return await this.update(gate);
    }

    async close(id, operator) {
        const gate = await this.getById(id);
        if (!gate) throw new Error('Gate not found');
        gate.close(operator);
        return await this.update(gate);
    }
}

// Singleton instance
let instance = null;
export function getGateRepository() {
    if (!instance) {
        instance = new GateRepository(getDb());
    }
    return instance;
}
