// ============================================
// Vehicle Mapper - Firestore ↔ Vehicle Model
// ============================================

import { Vehicle } from '../models/Vehicle.js';
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function toDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp.toDate) return timestamp.toDate();
    return timestamp;
}

export const VehicleMapper = {
    fromFirestore: (doc) => {
        const data = doc.data ? doc.data() : doc;
        return Vehicle.fromPlain({
            ...data,
            id: data.id || doc.id,
            createdAt: toDate(data.createdAt) || new Date(),
            updatedAt: toDate(data.updatedAt) || new Date()
        });
    },

    toFirestore: (vehicle) => {
        const plain = vehicle.toPlain();
        return {
            licensePlate: plain.licensePlate,
            make: plain.make,
            model: plain.model,
            color: plain.color,
            type: plain.type,
            organizationId: plain.organizationId,
            blacklisted: plain.blacklisted || false,
            blacklistReason: plain.blacklistReason || '',
            ownerId: plain.ownerId || '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
    },

    toFirestoreUpdate: (vehicle) => {
        const plain = vehicle.toPlain();
        return {
            licensePlate: plain.licensePlate,
            make: plain.make,
            model: plain.model,
            color: plain.color,
            type: plain.type,
            blacklisted: plain.blacklisted || false,
            blacklistReason: plain.blacklistReason || '',
            ownerId: plain.ownerId || '',
            updatedAt: serverTimestamp()
        };
    }
};
