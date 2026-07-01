// ============================================
// Workstation Render - Permanent Fix
// ============================================

import { openEntryModal } from './entry-modal.js';
import { openKnownVehicleModal } from './known-modal.js';
import { openScanner } from './scanner-modal.js';

// Helper: Safe DOM updates
function safeGetElement(id) {
    return document.getElementById(id);
}

export function renderWorkstation(app) {
    app.innerHTML = getHTML();
    connectButtons();
}

function getHTML() {
    return `
        <!-- Header -->
        <div style="padding:16px 20px;background:var(--glass-bg);border-radius:24px;border:1px solid var(--glass-border);margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div>
                    <div style="font-family:Orbitron,monospace;font-size:24px;font-weight:900;background:var(--gradient-primary);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                        🚗 Parking Yetu
                    </div>
                    <div style="font-size:11px;color:var(--text-muted);letter-spacing:2px;text-transform:uppercase;">
                        Gate Operations
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                    <div style="font-size:13px;color:var(--text-muted);" id="liveClock"></div>
                    <div style="background:var(--glass-bg);padding:4px 12px;border-radius:20px;border:1px solid var(--glass-border);font-size:12px;color:var(--text-secondary);">
                        👤 Operator
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:12px;margin-top:10px;flex-wrap:wrap;font-size:12px;color:var(--text-muted);">
                <span>🚪 Gate: <strong style="color:var(--text-secondary);">Gate A</strong></span>
                <span id="lastActivityTime">🟢 Last entry: --</span>
            </div>
        </div>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
            <div style="background:var(--glass-bg);padding:16px;border-radius:16px;border:1px solid var(--glass-border);text-align:center;">
                <div style="font-family:Orbitron,monospace;font-size:28px;font-weight:700;color:var(--accent);" id="insideCount">0</div>
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Vehicles Inside</div>
            </div>
            <div style="background:var(--glass-bg);padding:16px;border-radius:16px;border:1px solid var(--glass-border);text-align:center;">
                <div style="font-family:Orbitron,monospace;font-size:28px;font-weight:700;color:var(--secondary);" id="availableCount">0</div>
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Available Spaces</div>
                <div style="margin-top:4px;height:6px;background:var(--glass-bg);border-radius:4px;overflow:hidden;border:1px solid var(--glass-border);">
                    <div id="occupancyBar" style="height:100%;width:0%;background:var(--gradient-primary);border-radius:4px;transition:width 0.8s cubic-bezier(0.34,1.56,0.64,1);"></div>
                </div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;" id="occupancyPercent">0%</div>
            </div>
            <div style="background:var(--glass-bg);padding:16px;border-radius:16px;border:1px solid var(--glass-border);text-align:center;">
                <div style="font-family:Orbitron,monospace;font-size:28px;font-weight:700;color:var(--primary);" id="todayCount">0</div>
                <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Today's Entries</div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:grid;gap:12px;margin-bottom:16px;">
            <button id="newEntryBtn" class="btn-primary" style="padding:20px;font-size:18px;min-height:72px;text-align:left;display:flex;align-items:center;gap:12px;">
                <span style="font-size:28px;">🟦</span>
                <div>
                    <div style="font-weight:700;">NEW ENTRY</div>
                    <div style="font-size:12px;font-weight:400;opacity:0.7;text-transform:none;">Register a new vehicle</div>
                </div>
            </button>
            <button id="knownVehicleBtn" class="btn-secondary" style="padding:20px;font-size:18px;min-height:72px;text-align:left;display:flex;align-items:center;gap:12px;">
                <span style="font-size:28px;">🟩</span>
                <div>
                    <div style="font-weight:700;">KNOWN VEHICLE</div>
                    <div style="font-size:12px;font-weight:400;opacity:0.7;text-transform:none;">Quick entry for returning vehicles</div>
                </div>
            </button>
            <button id="scanQrBtn" class="btn-danger" style="padding:20px;font-size:18px;min-height:72px;text-align:left;display:flex;align-items:center;gap:12px;">
                <span style="font-size:28px;">🟥</span>
                <div>
                    <div style="font-weight:700;">SCAN QR</div>
                    <div style="font-size:12px;font-weight:400;opacity:0.7;text-transform:none;">Process exit or access</div>
                </div>
            </button>
        </div>

        <!-- Recent Activity -->
        <div style="background:var(--glass-bg);border-radius:16px;border:1px solid var(--glass-border);padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <h3 style="font-family:Orbitron,monospace;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:var(--text-secondary);">
                    ⚡ Recent Activity
                </h3>
                <span style="font-size:11px;color:var(--text-muted);" id="activityCount">0 active</span>
            </div>
            <div id="activityFeed" style="max-height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
                <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">
                    No active vehicles
                </div>
            </div>
        </div>
    `;
}

function connectButtons() {
    const newBtn = safeGetElement('newEntryBtn');
    const knownBtn = safeGetElement('knownVehicleBtn');
    const scanBtn = safeGetElement('scanQrBtn');
    
    if (newBtn) newBtn.addEventListener('click', openEntryModal);
    if (knownBtn) knownBtn.addEventListener('click', openKnownVehicleModal);
    if (scanBtn) scanBtn.addEventListener('click', openScanner);
}
