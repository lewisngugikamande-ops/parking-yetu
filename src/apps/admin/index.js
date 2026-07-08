// ==========================================
// ADMIN APP - QR Generator
// ==========================================

import { Application } from '../../core/application/Application.js';

class AdminApp extends Application {
    constructor() {
        super({
            id: 'admin',
            name: 'QR Generator',
            version: '1.0.0'
        });
    }
    
    onMount() {
        console.log('🔧 Admin app mounting...');
        this.render(`
            <div style="max-width:600px;margin:40px auto;padding:20px;text-align:center;">
                <div style="font-size:48px;margin-bottom:12px;">🔧</div>
                <h1 style="font-size:24px;font-weight:700;">QR Generator</h1>
                <p style="color:var(--text-muted);">Generate QR codes for gates</p>
                <div class="glass" style="padding:20px;margin-top:20px;">
                    <p style="color:var(--text-muted);">🚧 Under Construction</p>
                    <p style="font-size:12px;color:var(--text-muted);">QR generation coming soon</p>
                </div>
            </div>
        `);
    }
    
    onUnmount() {
        console.log('🔧 Admin app unmounting...');
    }
}

const adminApp = new AdminApp();

// Default export
export default function initAdminApp(container) {
    adminApp.mount(container);
    return adminApp;
}

// Named export (for router compatibility)
export { initAdminApp };
