// ============================================
// Organization Mapper - Firestore ↔ Organization
// ============================================

import { Organization } from '../models/Organization.js';
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function toDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp.toDate) return timestamp.toDate();
    return timestamp;
}

export const OrganizationMapper = {
    fromFirestore: (doc) => {
        const data = doc.data ? doc.data() : doc;
        return Organization.fromPlain({
            ...data,
            id: data.id || doc.id,
            createdAt: toDate(data.createdAt) || new Date(),
            updatedAt: toDate(data.updatedAt) || new Date()
        });
    },

    toFirestore: (organization) => {
        const plain = organization.toPlain();
        return {
            name: plain.name,
            type: plain.type,
            settings: plain.settings,
            gates: plain.gates,
            branding: plain.branding,
            createdAt: plain.createdAt || serverTimestamp(),
            updatedAt: serverTimestamp()
        };
    },

    toFirestoreUpdate: (organization) => {
        const plain = organization.toPlain();
        return {
            name: plain.name,
            type: plain.type,
            settings: plain.settings,
            gates: plain.gates,
            branding: plain.branding,
            updatedAt: serverTimestamp()
        };
    }
};
