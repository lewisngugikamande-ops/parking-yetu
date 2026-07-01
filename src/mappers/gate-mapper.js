// ============================================
// Gate Mapper - Firestore ↔ Gate Model
// ============================================

import { Gate } from '../models/Gate.js';
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function toDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp.toDate) return timestamp.toDate();
    return timestamp;
}

export const GateMapper = {
    fromFirestore: (doc) => {
        const data = doc.data ? doc.data() : doc;
        return Gate.fromPlain({
            ...data,
            id: data.id || doc.id,
            createdAt: toDate(data.createdAt) || new Date(),
            updatedAt: toDate(data.updatedAt) || new Date()
        });
    },

    toFirestore: (gate) => {
        const plain = gate.toPlain();
        return {
            name: plain.name,
            type: plain.type,
            locationId: plain.locationId,
            organizationId: plain.organizationId,
            status: plain.status,
            lastAction: plain.lastAction || null,
            lastActionTime: plain.lastActionTime || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
    },

    toFirestoreUpdate: (gate) => {
        const plain = gate.toPlain();
        return {
            name: plain.name,
            type: plain.type,
            locationId: plain.locationId,
            organizationId: plain.organizationId,
            status: plain.status,
            lastAction: plain.lastAction || null,
            lastActionTime: plain.lastActionTime || null,
            updatedAt: serverTimestamp()
        };
    }
};
