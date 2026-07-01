// ============================================
// Configuration - Now dynamically loaded
// ============================================

import { OrganizationService } from '../core/organization-service.js';

// These are now deprecated - use OrganizationService instead
export const config = {
    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    },

    app: {
        name: import.meta.env.VITE_APP_NAME || 'Parking Yetu',
        version: import.meta.env.VITE_APP_VERSION || '3.1.0'
    },

    parking: {
        timeLimit: 180,
        alertThreshold: 120,
        maxCapacity: 100
    },

    features: {
        workstation: true,
        admin: true,
        reports: false,
        analytics: false,
        payments: false
    },

    // DEPRECATED: Use OrganizationService instead
    // These will be removed in Sprint 3A
    _deprecated: {
        defaultOrganization: 'org_church_a',
        defaultLocation: 'church_a',
        defaultGate: 'Gate A'
    }
};

// Helper to get organization-aware config
export async function getOrgConfig() {
    const org = OrganizationService.getCurrent();
    const settings = OrganizationService.getSettings();
    return {
        organization: org,
        settings: settings,
        defaultGate: settings.defaultGate || 'Gate A',
        defaultLocation: settings.defaultLocation || 'church_a',
        timeLimit: settings.timeLimit || 180,
        authMode: settings.authMode || 'email'
    };
}

export default config;
