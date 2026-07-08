// ==========================================
// ORGANIZATION SERVICE - Manage Organizations
// ==========================================

import { pceaLangata, generateGateQR } from '../data/organizations/pcea-langata.js';

// In-memory store (replace with real DB later)
const organizations = new Map();

// Load default organization
organizations.set('org_pcea_langata', pceaLangata);

export function getOrganization(id) {
    return organizations.get(id) || null;
}

export function getOrganizations() {
    return Array.from(organizations.values());
}

export function createOrganization(data) {
    const id = data.id || 'org_' + Date.now();
    const org = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    organizations.set(id, org);
    return org;
}

export function updateOrganization(id, data) {
    const org = organizations.get(id);
    if (!org) return null;
    const updated = {
        ...org,
        ...data,
        updatedAt: new Date()
    };
    organizations.set(id, updated);
    return updated;
}

export function deleteOrganization(id) {
    return organizations.delete(id);
}

export function getLocation(orgId, locationId) {
    const org = organizations.get(orgId);
    if (!org) return null;
    return org.locations?.find(l => l.id === locationId) || null;
}

export function getAccessPoint(orgId, locationId, accessPointId) {
    const location = getLocation(orgId, locationId);
    if (!location) return null;
    return location.accessPoints?.find(ap => ap.id === accessPointId) || null;
}

export function generateQRForAccessPoint(orgId, locationId, accessPointId) {
    const accessPoint = getAccessPoint(orgId, locationId, accessPointId);
    if (!accessPoint) return null;
    return generateGateQR(accessPoint);
}

export function getOrganizationByQR(qrData) {
    try {
        const data = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
        const org = organizations.get(data.organizationId);
        if (!org) return null;
        const location = org.locations?.find(l => l.id === data.locationId);
        if (!location) return null;
        const accessPoint = location.accessPoints?.find(ap => ap.id === data.accessPointId);
        if (!accessPoint) return null;
        return {
            organization: org,
            location: location,
            accessPoint: accessPoint
        };
    } catch (error) {
        console.error('Invalid QR data:', error);
        return null;
    }
}

// Expose for debugging
if (typeof window !== 'undefined') {
    window.__organizations = {
        getOrganization,
        getOrganizations,
        getOrganizationByQR,
        generateQRForAccessPoint
    };
}
