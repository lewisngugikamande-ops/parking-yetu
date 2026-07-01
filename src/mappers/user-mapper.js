// ============================================
// User Mapper - Firestore ↔ User Model
// ============================================

import { User } from '../models/User.js';
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function toDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp.toDate) return timestamp.toDate();
    return timestamp;
}

export const UserMapper = {
    fromFirestore: (doc) => {
        const data = doc.data ? doc.data() : doc;
        return User.fromPlain({
            ...data,
            id: data.uid || doc.id,
            createdAt: toDate(data.createdAt) || new Date(),
            updatedAt: toDate(data.updatedAt) || new Date()
        });
    },

    toFirestore: (user) => {
        const plain = user.toPlain();
        return {
            uid: plain.id,
            email: plain.email,
            name: plain.name,
            role: plain.role,
            organizationId: plain.organizationId,
            locationId: plain.locationId,
            active: plain.active,
            permissions: plain.permissions,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
    },

    toFirestoreUpdate: (user) => {
        const plain = user.toPlain();
        return {
            name: plain.name,
            role: plain.role,
            organizationId: plain.organizationId,
            locationId: plain.locationId,
            active: plain.active,
            permissions: plain.permissions,
            updatedAt: serverTimestamp()
        };
    }
};
