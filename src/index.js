// ============================================
// Main Entry Point - Parking Yetu (Access Engine)
// ============================================

import { bootstrap } from './bootstrap.js';

console.log('🏁 Parking Yetu v3.1.0 - Access Engine Edition');

// Start the app
bootstrap();

// Export for debugging
window.__PARKING_YETU__ = {
    version: '3.1.0',
    engine: 'access-engine'
};
