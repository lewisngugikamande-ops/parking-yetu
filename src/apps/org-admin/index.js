// ==========================================
// ORGANIZATION ADMIN APP
// ==========================================

import { Application } from '../../core/application/Application.js';
import { getOrganization } from '../../services/organization.js';

class OrgAdminApp extends Application {
    constructor() {
        super({
            id: 'org-admin',
            name: 'Organization Admin',
            version: '1.0.0',
            description: 'Manage your organization'
        });
        this.orgId = 'org_pcea_langata';
    }

    onMount() {
        console.log('🏛️ Organization Admin mounting...');
        this.renderDashboard();
    }

    onUnmount() {
        console.log('🏛️ Organization Admin unmounting...');
    }

    renderDashboard() {
        const org = getOrganization(this.orgId);
        
        if (!org) {
            this.render(`
                <div style="max-width:600px;margin:40px auto;padding:20px;text-align:center;">
                    <h1 style="font-size:24px;">❌ Organization not found</h1>
                    <p style="color:var(--text-muted);">Please select a valid organization</p>
                </div>
            `);
            return;
        }
        
        this.render(`
            <div style="max-width:900px;margin:20px auto;padding:20px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <div>
                        <h1 style="font-size:24px;margin:0;">🏛️ ${org.name}</h1>
                        <p style="color:var(--text-muted);font-size:13px;">Organization Admin Dashboard</p>
                    </div>
                </div>
                
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px;">
                    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;border:1px solid rgba(255,255,255,0.05);">
                        <div style="font-size:12px;color:var(--text-muted);">Total Gates</div>
                        <div style="font-size:28px;font-weight:700;">${org.locations?.reduce((acc, loc) => acc + (loc.accessPoints?.length || 0), 0) || 0}</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;border:1px solid rgba(255,255,255,0.05);">
                        <div style="font-size:12px;color:var(--text-muted);">Total Capacity</div>
                        <div style="font-size:28px;font-weight:700;">${org.locations?.reduce((acc, loc) => acc + (loc.accessPoints?.reduce((sum, ap) => sum + (ap.capacity || 0), 0) || 0), 0) || 0}</div>
                    </div>
                    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;border:1px solid rgba(255,255,255,0.05);">
                        <div style="font-size:12px;color:var(--text-muted);">Locations</div>
                        <div style="font-size:28px;font-weight:700;">${org.locations?.length || 0}</div>
                    </div>
                </div>
                
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;border:1px solid rgba(255,255,255,0.05);">
                        <h3 style="font-size:16px;">📍 Gates</h3>
                        ${org.locations?.map(loc => `
                            <div style="margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.02);border-radius:8px;">
                                <div style="font-weight:600;font-size:13px;">${loc.name}</div>
                                ${loc.accessPoints?.map(ap => `
                                    <div style="display:flex;justify-content:space-between;padding:2px 0;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.03);">
                                        <span>${ap.name}</span>
                                        <span style="color:var(--text-muted);">🚗 ${ap.capacity || 'N/A'}</span>
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;border:1px solid rgba(255,255,255,0.05);">
                        <h3 style="font-size:16px;">🔑 Quick Actions</h3>
                        <button onclick="window.__router.switchToApp('admin')" style="width:100%;padding:10px;border-radius:8px;border:none;background:#6C3CE1;color:white;cursor:pointer;text-align:left;margin-bottom:6px;">📷 Generate Gate QR</button>
                        <button onclick="window.__router.switchToApp('workstation')" style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--glass-border);background:transparent;color:var(--text-primary);cursor:pointer;text-align:left;">← Back to Workstation</button>
                    </div>
                </div>
            </div>
        `);
    }
}

const orgAdminApp = new OrgAdminApp();

export function initOrgAdmin(container) {
    orgAdminApp.mount(container);
    return orgAdminApp;
}

export default { initOrgAdmin, app: orgAdminApp };
