// ==========================================
// ORG ADMIN APP - Organization Admin
// ==========================================

import { Application } from '../../core/application/Application.js';

class OrgAdminApp extends Application {
    constructor() {
        super({
            id: 'org-admin',
            name: 'Organization Admin',
            version: '1.0.0'
        });
    }
    
    onMount() {
        console.log('🏛️ Organization Admin mounting...');
        this.render(`
            <div style="max-width:600px;margin:40px auto;padding:20px;text-align:center;">
                <div style="font-size:48px;margin-bottom:12px;">🏛️</div>
                <h1 style="font-size:24px;font-weight:700;">Organization Admin</h1>
                <p style="color:var(--text-muted);">Manage organizations and gates</p>
                <div class="glass" style="padding:20px;margin-top:20px;">
                    <p style="color:var(--text-muted);">🚧 Under Construction</p>
                    <p style="font-size:12px;color:var(--text-muted);">Organization management coming soon</p>
                </div>
            </div>
        `);
    }
    
    onUnmount() {
        console.log('🏛️ Organization Admin unmounting...');
    }
}

const orgAdminApp = new OrgAdminApp();

// Default export
export default function initOrgAdmin(container) {
    orgAdminApp.mount(container);
    return orgAdminApp;
}

// Named export (for router compatibility)
export { initOrgAdmin };
