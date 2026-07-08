// ==========================================
// ACCESS PORTAL - Complete Access Journey
// ==========================================

import { Application } from '../../core/application/Application.js';
import credentialService from '../../services/CredentialService.js';
import sessionService from '../../services/SessionService.js';
import policyService from '../../services/PolicyService.js';
import organizationService from '../../services/OrganizationService.js';

class AccessPortalApp extends Application {
    constructor() {
        super({
            id: 'access-portal',
            name: 'Access Portal',
            version: '1.0.0'
        });

        // State
        this.step = 'scan';
        this.gateData = null;
        this.credential = null;
        this.session = null;
        this.policy = null;
    }

    onMount() {
        console.log('🚪 Access Portal mounting...');
        
        const params = new URLSearchParams(window.location.search);
        const gateParam = params.get('gate');
        
        if (gateParam) {
            try {
                const gateData = JSON.parse(decodeURIComponent(gateParam));
                this.gateData = gateData;
                this.showIdentify();
            } catch (e) {
                this.showScan();
            }
        } else {
            this.showScan();
        }
    }

    onUnmount() {
        console.log('🚪 Access Portal unmounting...');
    }

    // ==========================================
    // SCREEN: Scan Gate QR
    // ==========================================

    showScan() {
        this.step = 'scan';
        this.render(`
            <div style="max-width:480px;margin:20px auto;padding:20px;text-align:center;">
                <div style="font-size:64px;margin-bottom:12px;">📷</div>
                <h1 style="font-size:24px;font-weight:700;margin:0;">Scan Gate QR</h1>
                <p style="color:var(--text-muted);margin-top:8px;">Point your camera at the QR code at the gate</p>
                <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:40px;margin:20px 0;border:1px solid rgba(255,255,255,0.08);">
                    <div style="font-size:48px;margin-bottom:8px;">⬜</div>
                    <button id="mockScanBtn" style="padding:12px 32px;border-radius:12px;border:none;background:#6C3CE1;color:white;font-weight:600;cursor:pointer;font-size:16px;">📸 Simulate Scan</button>
                </div>
                <div id="scanResult" style="margin-top:12px;"></div>
                <div style="font-size:12px;color:var(--text-muted);margin-top:12px;">No login required</div>
            </div>
        `);

        this.on(this.find('#mockScanBtn'), 'click', async () => {
            const mockQR = {
                organizationId: 'org_pcea_langata',
                locationId: 'loc_langata_main',
                accessPointId: 'ap_gate_1',
                name: 'Gate 1 - Parking',
                capacity: 20,
                direction: 'entry'
            };
            
            this.gateData = mockQR;
            
            // Load organization details
            const org = await organizationService.findById(mockQR.organizationId);
            const ap = await organizationService.findAccessPoint(
                mockQR.organizationId,
                mockQR.accessPointId
            );
            
            const result = this.find('#scanResult');
            if (result) {
                result.innerHTML = `
                    <div style="padding:12px;border-radius:12px;background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.1);color:var(--text-primary);font-size:14px;">
                        ✅ ${org?.name || 'Organization'} • ${ap?.name || 'Gate'}
                        <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Capacity: ${ap?.capacity || 'N/A'}</div>
                    </div>
                `;
            }
            
            setTimeout(() => this.showIdentify(), 1000);
        });
    }

    // ==========================================
    // SCREEN: Identify
    // ==========================================

    showIdentify() {
        this.step = 'identify';
        const gate = this.gateData;
        
        this.render(`
            <div style="max-width:480px;margin:20px auto;padding:20px;">
                <div style="text-align:center;margin-bottom:24px;">
                    <div style="font-size:32px;margin-bottom:4px;">🏛️</div>
                    <h1 style="font-size:20px;font-weight:700;margin:0;">${gate?.name || 'Gate'}</h1>
                    <p style="color:var(--text-muted);margin-top:4px;font-size:13px;">${gate?.organizationId || 'Organization'}</p>
                </div>
                <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.08);">
                    <p style="font-size:14px;color:var(--text-muted);margin-bottom:12px;">Enter your vehicle plate</p>
                    <input id="plateInput" placeholder="e.g. KDG 832A" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;text-transform:uppercase;">
                    <button id="identifyBtn" style="width:100%;padding:14px;border-radius:12px;border:none;background:#6C3CE1;color:white;font-weight:600;cursor:pointer;margin-top:8px;font-size:16px;">🔍 Identify</button>
                    <button id="registerBtn" style="width:100%;padding:14px;border-radius:12px;border:1px solid var(--glass-border);background:transparent;color:var(--text-muted);cursor:pointer;margin-top:4px;font-size:14px;">📝 Register New</button>
                </div>
                <div id="resultArea" style="margin-top:12px;"></div>
            </div>
        `);

        this.on(this.find('#identifyBtn'), 'click', async () => {
            const plate = this.find('#plateInput')?.value.trim().toUpperCase();
            if (!plate) {
                this.showResult('⚠️ Please enter a vehicle plate', 'error');
                return;
            }
            await this.identifyCredential(plate);
        });

        this.on(this.find('#registerBtn'), 'click', () => {
            this.showRegister();
        });
    }

    async identifyCredential(plate) {
        const credential = await credentialService.findByPlate(plate);
        
        if (credential) {
            this.credential = credential;
            this.showResult(`👋 Welcome back, ${credential.name || credential.vehiclePlate}!`, 'success');
            await this.evaluatePolicy();
        } else {
            this.showResult('📝 New visitor. Please register.', 'info');
            setTimeout(() => this.showRegister(), 500);
        }
    }

    // ==========================================
    // SCREEN: Register
    // ==========================================

    showRegister() {
        this.step = 'register';
        this.render(`
            <div style="max-width:480px;margin:20px auto;padding:20px;">
                <div style="text-align:center;margin-bottom:24px;">
                    <div style="font-size:32px;margin-bottom:4px;">📝</div>
                    <h1 style="font-size:20px;font-weight:700;margin:0;">Register</h1>
                    <p style="color:var(--text-muted);margin-top:4px;font-size:13px;">Quick registration</p>
                </div>
                <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.08);">
                    <input id="regName" placeholder="Full Name" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);margin-bottom:8px;font-size:14px;">
                    <input id="regPhone" placeholder="Phone Number" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);margin-bottom:8px;font-size:14px;">
                    <input id="regPlate" placeholder="License Plate" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);margin-bottom:8px;font-size:14px;text-transform:uppercase;">
                    <button id="registerSubmitBtn" style="width:100%;padding:14px;border-radius:12px;border:none;background:#00FF88;color:#0a0a0f;font-weight:600;cursor:pointer;font-size:16px;">✅ Register & Enter</button>
                    <button id="registerBackBtn" style="width:100%;padding:14px;border-radius:12px;border:1px solid var(--glass-border);background:transparent;color:var(--text-muted);cursor:pointer;margin-top:4px;font-size:14px;">← Back</button>
                </div>
                <div id="resultArea" style="margin-top:12px;"></div>
            </div>
        `);

        this.on(this.find('#registerSubmitBtn'), 'click', async () => {
            const name = this.find('#regName')?.value.trim();
            const phone = this.find('#regPhone')?.value.trim();
            const plate = this.find('#regPlate')?.value.trim().toUpperCase();
            
            if (!name || !phone || !plate) {
                this.showResult('⚠️ Please fill in all fields', 'error');
                return;
            }
            
            this.credential = await credentialService.create({
                name,
                phone,
                vehiclePlate: plate,
                role: 'visitor'
            });
            
            this.showResult(`✅ Welcome, ${name}!`, 'success');
            await this.evaluatePolicy();
        });

        this.on(this.find('#registerBackBtn'), 'click', () => {
            this.showIdentify();
        });
    }

    // ==========================================
    // SCREEN: Evaluate Policy
    // ==========================================

    async evaluatePolicy() {
        this.showResult('🔍 Checking access policy...', 'info');
        
        const decision = await policyService.evaluate({
            credential: this.credential,
            gate: this.gateData
        });
        
        this.policy = decision;
        
        if (decision.granted) {
            this.showResult(`✅ Access granted: ${decision.reason}`, 'success');
            await this.createSession();
        } else {
            this.showResult(`❌ Access denied: ${decision.reason}`, 'error');
        }
    }

    // ==========================================
    // SCREEN: Create Session
    // ==========================================

    async createSession() {
        this.session = await sessionService.create({
            credentialId: this.credential.id,
            organizationId: this.gateData?.organizationId,
            gateId: this.gateData?.accessPointId
        });
        
        this.credential = await credentialService.recordVisit(this.credential.id);
        
        this.showSession();
    }

    // ==========================================
    // SCREEN: Session Active
    // ==========================================

    showSession() {
        this.step = 'session';
        this.render(`
            <div style="max-width:480px;margin:20px auto;padding:20px;text-align:center;">
                <div style="font-size:64px;margin-bottom:12px;">✅</div>
                <h1 style="font-size:24px;font-weight:700;margin:0;">Access Granted!</h1>
                <p style="color:var(--text-muted);margin-top:8px;">${this.credential?.name || this.credential?.vehiclePlate} at ${this.gateData?.name || 'Gate'}</p>
                <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;margin:20px 0;border:1px solid rgba(255,255,255,0.08);text-align:left;">
                    <div style="display:flex;justify-content:space-between;padding:4px 0;">
                        <span style="color:var(--text-muted);">Vehicle</span>
                        <span style="font-weight:600;">${this.credential?.vehiclePlate}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                        <span style="color:var(--text-muted);">Visitor</span>
                        <span style="font-weight:600;">${this.credential?.name || 'Unknown'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                        <span style="color:var(--text-muted);">Status</span>
                        <span style="font-weight:600;color:var(--accent);">🟢 Active</span>
                    </div>
                </div>
                <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;border:1px solid rgba(255,255,255,0.05);">
                    <p style="font-size:12px;color:var(--text-muted);margin:0;">Exit Credential</p>
                    <div style="font-size:14px;font-weight:600;color:#00FF88;word-break:break-all;">${this.session?.token}</div>
                    <p style="font-size:11px;color:var(--text-muted);margin-top:4px;">Show this at the gate to exit</p>
                </div>
                <button id="endBtn" style="width:100%;padding:14px;border-radius:12px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-weight:600;cursor:pointer;margin-top:12px;font-size:16px;">⏹️ End Visit</button>
            </div>
        `);

        this.on(this.find('#endBtn'), 'click', async () => {
            await this.closeSession();
        });
    }

    // ==========================================
    // SCREEN: Close Session
    // ==========================================

    async closeSession() {
        if (this.session) {
            const closed = await sessionService.close(this.session.id);
            this.session = closed;
        }
        
        this.showComplete();
    }

    // ==========================================
    // SCREEN: Complete
    // ==========================================

    showComplete() {
        this.step = 'complete';
        this.render(`
            <div style="max-width:480px;margin:20px auto;padding:20px;text-align:center;">
                <div style="font-size:64px;margin-bottom:12px;">🎉</div>
                <h1 style="font-size:24px;font-weight:700;margin:0;">Visit Complete!</h1>
                <p style="color:var(--text-muted);margin-top:8px;">Thank you for visiting</p>
                <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:16px;margin:16px 0;border:1px solid rgba(255,255,255,0.08);text-align:left;">
                    <div style="display:flex;justify-content:space-between;padding:4px 0;">
                        <span style="color:var(--text-muted);">Vehicle</span>
                        <span style="font-weight:600;">${this.credential?.vehiclePlate || 'N/A'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                        <span style="color:var(--text-muted);">Visitor</span>
                        <span style="font-weight:600;">${this.credential?.name || 'N/A'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                        <span style="color:var(--text-muted);">Status</span>
                        <span style="font-weight:600;color:var(--danger);">✅ Completed</span>
                    </div>
                </div>
                <button id="newBtn" style="width:100%;padding:14px;border-radius:12px;border:none;background:#6C3CE1;color:white;font-weight:600;cursor:pointer;font-size:16px;">🔄 New Visit</button>
            </div>
        `);

        this.on(this.find('#newBtn'), 'click', () => {
            this.gateData = null;
            this.credential = null;
            this.session = null;
            this.policy = null;
            this.showScan();
        });
    }

    // ==========================================
    // HELPERS
    // ==========================================

    showResult(message, type = 'info') {
        const area = this.find('#resultArea') || this.find('#scanResult');
        if (!area) return;
        
        const colors = {
            success: 'rgba(0,255,136,0.05)',
            error: 'rgba(255,45,85,0.05)',
            info: 'rgba(0,212,255,0.05)'
        };
        
        const borderColors = {
            success: 'rgba(0,255,136,0.1)',
            error: 'rgba(255,45,85,0.1)',
            info: 'rgba(0,212,255,0.1)'
        };
        
        area.innerHTML = `
            <div style="padding:12px 16px;border-radius:12px;background:${colors[type]};border:1px solid ${borderColors[type]};color:var(--text-primary);font-size:14px;text-align:center;">
                ${message}
            </div>
        `;
    }
}

const accessPortalApp = new AccessPortalApp();

export function initAccessPortal(container) {
    accessPortalApp.mount(container);
    return accessPortalApp;
}

export default { initAccessPortal, app: accessPortalApp };
