// ==========================================
// ADMIN APP - QR Generator
// ==========================================

import { Application } from '../../core/application/Application.js';
import { initQRGenerator } from './qr-generator.js';

class AdminApp extends Application {
    constructor() {
        super({
            id: 'admin',
            name: 'QR Generator',
            version: '1.0.0',
            description: 'Generate QR codes for gates'
        });
    }

    onMount() {
        console.log('🔧 Admin app mounting...');
        initQRGenerator(this.container);
        console.log('✅ Admin app ready');
    }

    onUnmount() {
        console.log('🔧 Admin app unmounting...');
    }
}

const adminApp = new AdminApp();

export function initAdminApp(container) {
    adminApp.mount(container);
    return adminApp;
}

export default { initAdminApp, app: adminApp };
