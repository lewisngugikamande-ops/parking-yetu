// ============================================
// Session Mapper - Firestore ↔ Session Model
// ============================================

import { Session } from '../models/Session.js';
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function toDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp.toDate) return timestamp.toDate();
    return timestamp;
}

export const SessionMapper = {
    fromFirestore: (doc) => {
        const data = doc.data ? doc.data() : doc;
        return Session.fromPlain({
            ...data,
            id: data.id || doc.id,
            entryTime: toDate(data.entryTime) || new Date(),
            exitTime: toDate(data.exitTime) || null,
            createdAt: toDate(data.createdAt) || new Date(),
            updatedAt: toDate(data.updatedAt) || new Date()
        });
    },

    toFirestore: (session) => {
        const plain = session.toPlain();
        return {
            vehicleId: plain.vehicleId,
            vehiclePlate: plain.vehiclePlate,
            driverName: plain.driverName,
            driverPhone: plain.driverPhone,
            gate: plain.gate,
            locationId: plain.locationId,
            organizationId: plain.organizationId,
            status: plain.status,
            entryTime: serverTimestamp(),
            exitTime: plain.exitTime || null,
            exitGate: plain.exitGate || null,
            duration: plain.duration || 0,
            isVIP: plain.isVIP || false,
            isStaff: plain.isStaff || false,
            notes: plain.notes || [],
            correlationId: plain.correlationId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
    },

    toFirestoreUpdate: (session) => {
        const plain = session.toPlain();
        return {
            status: plain.status,
            exitTime: plain.exitTime || null,
            exitGate: plain.exitGate || null,
            duration: plain.duration || 0,
            updatedAt: serverTimestamp()
        };
    }
};
