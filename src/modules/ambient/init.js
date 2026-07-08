// ==========================================
// AMBIENT - Initializer
// ==========================================

import ambient from './index.js';

export function initAmbient(organizationId = 'church_a') {
    console.log(`🌅 Starting Ambient for: ${organizationId}`);
    ambient.init(organizationId);
}
