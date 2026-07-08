// ==========================================
// DOMAIN - Exports
// ==========================================

export { AccessPoint } from './AccessPoint.js';
export { AccessRequest } from './AccessRequest.js';
export { Credential } from './Credential.js';
export { Session } from './Session.js';
export { Event, EventTypes, createEvent } from './Event.js';

// Utility to generate IDs
export function generateId(prefix = 'id') {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

// Utility to validate plate
export function validatePlate(plate) {
    if (!plate || plate.length < 3) return false;
    const cleaned = plate.toUpperCase().trim();
    // Kenyan plate: 3 letters + 3 numbers + optional letter
    const kenyanPlate = /^[A-Z]{3}\d{3}[A-Z]?$/;
    return kenyanPlate.test(cleaned);
}

// Utility to validate phone
export function validatePhone(phone) {
    if (!phone) return false;
    const cleaned = phone.replace(/\s/g, '');
    const kenyaPhone = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;
    return kenyaPhone.test(cleaned);
}
