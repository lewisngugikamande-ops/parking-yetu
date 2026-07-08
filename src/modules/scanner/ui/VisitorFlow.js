// ==========================================
// VISITOR FLOW UI - Registration & Entry
// ==========================================

import { 
    scanGateQR, 
    identifyVisitor, 
    registerVisitor, 
    startSession, 
    endSession,
    getState,
    saveCredential,
    saveSession
} from '../index.js';

export function renderVisitorFlow(container, qrData = null) {
    if (qrData) {
        const result = scanGateQR(qrData);
        if (result.error) {
            renderError(container, result);
            return;
        }
        renderIdentification(container);
    } else {
        renderScanInstructions(container);
    }
}

function renderScanInstructions(container) {
    container.innerHTML = `
        <div style="max-width:480px;margin:40px auto;padding:20px;text-align:center;">
            <div style="font-size:64px;margin-bottom:16px;">📷</div>
            <h1 style="font-size:24px;font-weight:700;margin:0;">Scan Gate QR</h1>
            <p style="color:var(--text-muted);margin-top:8px;">Point your camera at the QR code at the gate</p>
            
            <div style="margin:20px 0;padding:40px;border:2px dashed var(--glass-border);border-radius:16px;background:var(--glass-bg);">
                <div style="font-size:48px;">⬜</div>
                <div style="font-size:13px;color:var(--text-muted);margin-top:8px;">QR Code will appear here</div>
            </div>
            
            <button id="scanBtn" style="width:100%;padding:14px;border-radius:12px;border:none;background:var(--primary);color:white;font-weight:600;cursor:pointer;font-size:16px;">
                📸 Scan QR
            </button>
            
            <div style="margin-top:16px;font-size:12px;color:var(--text-muted);">
                No login required
            </div>
        </div>
    `;
    
    container.querySelector('#scanBtn').addEventListener('click', () => {
        // Simulate scanning a QR
        const mockQR = {
            organizationId: 'org_church_a',
            locationId: 'loc_church_a_main',
            accessPointId: 'gate_001',
            name: 'Main Vehicle Gate',
            direction: 'entry'
        };
        const result = scanGateQR(mockQR);
        if (!result.error) {
            renderIdentification(container);
        }
    });
}

function renderIdentification(container) {
    const state = getState();
    const ap = state.accessPoint;
    
    container.innerHTML = `
        <div style="max-width:480px;margin:40px auto;padding:20px;">
            <div style="text-align:center;margin-bottom:24px;">
                <div style="font-size:32px;margin-bottom:4px;">🏢</div>
                <h1 style="font-size:20px;font-weight:700;margin:0;">${ap?.name || 'Gate'}</h1>
                <p style="color:var(--text-muted);margin-top:4px;font-size:13px;">
                    ${ap?.organizationId || 'Organization'} • ${ap?.locationId || 'Location'}
                </p>
            </div>
            
            <div style="background:var(--glass-bg);border-radius:16px;padding:20px;border:1px solid var(--glass-border);margin-bottom:16px;">
                <p style="font-size:14px;color:var(--text-muted);margin-bottom:12px;">Enter your vehicle plate to identify yourself</p>
                <input id="identifierInput" placeholder="e.g. KDG 832A" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;text-transform:uppercase;">
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <button id="identifyBtn" style="flex:1;padding:12px;border-radius:12px;border:none;background:var(--primary);color:white;font-weight:600;cursor:pointer;">🔍 Identify</button>
                    <button id="registerBtn" style="padding:12px 20px;border-radius:12px;border:1px solid var(--glass-border);background:transparent;color:var(--text-muted);cursor:pointer;">📝 New</button>
                </div>
            </div>
            
            <div id="resultArea"></div>
            
            <div style="margin-top:16px;font-size:12px;color:var(--text-muted);text-align:center;">
                ${ap?.qrCode || 'Scan gate QR to start'}
            </div>
        </div>
    `;
    
    container.querySelector('#identifyBtn').addEventListener('click', () => {
        const input = container.querySelector('#identifierInput');
        const plate = input.value.trim().toUpperCase();
        if (!plate) {
            showResult(container, '⚠️ Please enter a vehicle plate', 'error');
            return;
        }
        
        const result = identifyVisitor(plate);
        if (result.credential) {
            // Save credential
            saveCredential(result.credential);
            showResult(container, `👋 ${result.message}`, 'success');
            setTimeout(() => renderStartSession(container), 1000);
        } else {
            showResult(container, '📝 New visitor. Please register.', 'info');
            renderRegistration(container);
        }
    });
    
    container.querySelector('#registerBtn').addEventListener('click', () => {
        renderRegistration(container);
    });
}

function renderRegistration(container) {
    const state = getState();
    const ap = state.accessPoint;
    
    container.innerHTML = `
        <div style="max-width:480px;margin:40px auto;padding:20px;">
            <div style="text-align:center;margin-bottom:24px;">
                <div style="font-size:32px;margin-bottom:4px;">📝</div>
                <h1 style="font-size:20px;font-weight:700;margin:0;">Register</h1>
                <p style="color:var(--text-muted);margin-top:4px;font-size:13px;">
                    ${ap?.name || 'Gate'} • Quick registration
                </p>
            </div>
            
            <div style="background:var(--glass-bg);border-radius:16px;padding:20px;border:1px solid var(--glass-border);">
                <input id="regName" placeholder="Full Name" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);margin-bottom:8px;font-size:14px;">
                <input id="regPhone" placeholder="Phone Number" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);margin-bottom:8px;font-size:14px;">
                <input id="regPlate" placeholder="License Plate" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);margin-bottom:8px;font-size:14px;text-transform:uppercase;">
                <input id="regMake" placeholder="Vehicle Make (optional)" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);margin-bottom:8px;font-size:14px;">
                <input id="regModel" placeholder="Vehicle Model (optional)" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);margin-bottom:8px;font-size:14px;">
                
                <div style="display:flex;gap:8px;margin-top:4px;">
                    <button id="registerSubmitBtn" style="flex:1;padding:12px;border-radius:12px;border:none;background:var(--primary);color:white;font-weight:600;cursor:pointer;">✅ Register & Enter</button>
                    <button id="registerCancelBtn" style="padding:12px 20px;border-radius:12px;border:1px solid var(--glass-border);background:transparent;color:var(--text-muted);cursor:pointer;">Cancel</button>
                </div>
            </div>
            
            <div id="resultArea"></div>
        </div>
    `;
    
    container.querySelector('#registerSubmitBtn').addEventListener('click', () => {
        const name = container.querySelector('#regName').value.trim();
        const phone = container.querySelector('#regPhone').value.trim();
        const plate = container.querySelector('#regPlate').value.trim().toUpperCase();
        const make = container.querySelector('#regMake').value.trim();
        const model = container.querySelector('#regModel').value.trim();
        
        if (!name || !phone || !plate) {
            showResult(container, '⚠️ Please fill in all required fields', 'error');
            return;
        }
        
        const result = registerVisitor({ name, phone, plate, make, model });
        if (result.credential) {
            saveCredential(result.credential);
            showResult(container, `✅ ${result.message}`, 'success');
            setTimeout(() => renderStartSession(container), 1000);
        }
    });
    
    container.querySelector('#registerCancelBtn').addEventListener('click', () => {
        renderIdentification(container);
    });
}

function renderStartSession(container) {
    const state = getState();
    const credential = state.credential;
    const ap = state.accessPoint;
    
    if (!credential) {
        renderIdentification(container);
        return;
    }
    
    const result = startSession();
    
    container.innerHTML = `
        <div style="max-width:480px;margin:40px auto;padding:20px;text-align:center;">
            <div style="font-size:64px;margin-bottom:12px;">✅</div>
            <h1 style="font-size:24px;font-weight:700;margin:0;">Session Started!</h1>
            <p style="color:var(--text-muted);margin-top:8px;">
                ${credential.name || credential.vehiclePlate} at ${ap?.name || 'Gate'}
            </p>
            
            <div style="background:var(--glass-bg);border-radius:16px;padding:20px;margin:16px 0;border:1px solid var(--glass-border);text-align:left;">
                <div style="display:flex;justify-content:space-between;padding:4px 0;">
                    <span style="color:var(--text-muted);">Vehicle</span>
                    <span style="font-weight:600;">${credential.getVehicleDisplay()}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                    <span style="color:var(--text-muted);">Visitor</span>
                    <span style="font-weight:600;">${credential.name || 'Unknown'}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                    <span style="color:var(--text-muted);">Status</span>
                    <span style="font-weight:600;color:var(--accent);">🟢 Active</span>
                </div>
            </div>
            
            <div style="background:white;padding:20px;border-radius:12px;display:inline-block;margin:16px auto;">
                <div style="font-size:12px;color:#666;margin-bottom:4px;">Exit QR</div>
                <div style="font-size:32px;font-weight:700;color:#000;">${result.exitQR.substring(0, 8)}...</div>
                <div style="font-size:11px;color:#999;margin-top:4px;">Show this at the gate to exit</div>
            </div>
            
            <button id="endVisitBtn" style="width:100%;padding:14px;border-radius:12px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-weight:600;cursor:pointer;margin-top:8px;">
                ⏹️ End Visit
            </button>
            
            <div style="margin-top:16px;font-size:12px;color:var(--text-muted);">
                Token: ${result.session.sessionToken.substring(0, 16)}...
            </div>
        </div>
    `;
    
    container.querySelector('#endVisitBtn').addEventListener('click', () => {
        const state = getState();
        const session = state.session;
        if (session) {
            const result = endSession(session.sessionToken);
            if (result.error) {
                showResult(container, `❌ ${result.error}`, 'error');
            } else {
                renderVisitComplete(container, result);
            }
        }
    });
}

function renderVisitComplete(container, result) {
    const state = getState();
    const credential = state.credential;
    
    container.innerHTML = `
        <div style="max-width:480px;margin:40px auto;padding:20px;text-align:center;">
            <div style="font-size:64px;margin-bottom:12px;">🎉</div>
            <h1 style="font-size:24px;font-weight:700;margin:0;">Visit Complete!</h1>
            <p style="color:var(--text-muted);margin-top:8px;">${result.message}</p>
            
            <div style="background:var(--glass-bg);border-radius:16px;padding:16px;margin:16px 0;border:1px solid var(--glass-border);text-align:left;">
                <div style="display:flex;justify-content:space-between;padding:4px 0;">
                    <span style="color:var(--text-muted);">Vehicle</span>
                    <span style="font-weight:600;">${credential?.getVehicleDisplay() || 'Unknown'}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                    <span style="color:var(--text-muted);">Duration</span>
                    <span style="font-weight:600;">${result.duration}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                    <span style="color:var(--text-muted);">Status</span>
                    <span style="font-weight:600;color:var(--danger);">✅ Completed</span>
                </div>
            </div>
            
            <button id="newVisitBtn" style="width:100%;padding:14px;border-radius:12px;border:none;background:var(--primary);color:white;font-weight:600;cursor:pointer;">
                🚗 New Visit
            </button>
            
            <div style="margin-top:16px;font-size:12px;color:var(--text-muted);">
                Thank you for using Access Engine
            </div>
        </div>
    `;
    
    container.querySelector('#newVisitBtn').addEventListener('click', () => {
        renderIdentification(container);
    });
}

function showResult(container, message, type = 'info') {
    const area = container.querySelector('#resultArea');
    if (!area) return;
    
    const colors = {
        success: 'var(--accent)',
        error: 'var(--danger)',
        info: 'var(--secondary)'
    };
    
    area.innerHTML = `
        <div style="padding:12px 16px;border-radius:12px;background:${colors[type]}15;border:1px solid ${colors[type]}30;color:var(--text-primary);font-size:14px;margin-top:8px;">
            ${message}
        </div>
    `;
}

function renderError(container, result) {
    container.innerHTML = `
        <div style="max-width:480px;margin:40px auto;padding:20px;text-align:center;">
            <div style="font-size:64px;margin-bottom:12px;">❌</div>
            <h1 style="font-size:24px;font-weight:700;margin:0;">Invalid QR</h1>
            <p style="color:var(--text-muted);margin-top:8px;">${result.message || 'Please scan a valid gate QR'}</p>
            <button id="retryBtn" style="width:100%;padding:14px;border-radius:12px;border:none;background:var(--primary);color:white;font-weight:600;cursor:pointer;margin-top:20px;">
                🔄 Try Again
            </button>
        </div>
    `;
    
    container.querySelector('#retryBtn').addEventListener('click', () => {
        renderScanInstructions(container);
    });
}
