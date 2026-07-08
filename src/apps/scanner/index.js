// ==========================================
// SCANNER APP - QR Code Entry Scanner
// ==========================================

import { Application } from '../../core/application/Application.js';

class ScannerApp extends Application {
    constructor() {
        super({
            id: 'scanner',
            name: 'QR Scanner',
            version: '1.0.0',
            description: 'Scan QR codes at the gate'
        });
    }

    onMount() {
        console.log('📷 Scanner app mounting...');
        this.render(`
            <div style="max-width:500px;margin:20px auto;padding:20px;text-align:center;">
                <div style="font-size:48px;margin-bottom:8px;">📷</div>
                <h1 style="font-size:20px;font-weight:700;margin:0;">QR Scanner</h1>
                <p style="color:var(--text-muted);margin-top:4px;font-size:14px;">Scan the QR code at the gate</p>
                <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:30px;margin:16px 0;border:1px solid rgba(255,255,255,0.08);">
                    <div style="font-size:48px;margin-bottom:8px;">⬜</div>
                    <p style="color:var(--text-muted);font-size:13px;">Point your camera at the gate QR</p>
                    <button id="mockScanBtn" style="padding:10px 28px;border-radius:10px;border:none;background:#6C3CE1;color:white;font-weight:600;cursor:pointer;margin-top:8px;font-size:14px;">📸 Mock Scan</button>
                </div>
                <div id="scanResult" style="display:none;padding:12px;border-radius:10px;background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.1);margin-top:8px;font-size:14px;"></div>
                <div style="margin-top:12px;font-size:11px;color:var(--text-muted);">No login required</div>
            </div>
        `);

        this.on(this.find('#mockScanBtn'), 'click', () => {
            const result = this.find('#scanResult');
            if (result) {
                result.style.display = 'block';
                result.innerHTML = '✅ Gate QR scanned!<br><span style="font-size:12px;color:var(--text-muted);">Organization: P.C.E.A Lang\'ata • Location: Main Gate</span>';
            }
        });
    }

    onUnmount() {
        console.log('📷 Scanner app unmounting...');
    }
}

const scannerApp = new ScannerApp();

export function initScannerApp(container) {
    scannerApp.mount(container);
    return scannerApp;
}

export default { initScannerApp, app: scannerApp };
