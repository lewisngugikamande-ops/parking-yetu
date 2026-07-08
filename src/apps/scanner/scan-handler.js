// ==========================================
// SCAN HANDLER - Process QR scans
// ==========================================

export function handleGateQR(gateData) {
    console.log('📷 Gate QR scanned:', gateData);
    
    // The gate data contains:
    // - organizationId
    // - locationId
    // - accessPointId
    // - name
    // - capacity
    // - direction
    
    // Store gate data
    localStorage.setItem('current_gate', JSON.stringify(gateData));
    
    // Show the entry flow
    showEntryFlow(gateData);
}

function showEntryFlow(gateData) {
    const container = document.getElementById('app');
    if (!container) return;
    
    container.innerHTML = `
        <div style="max-width:480px;margin:40px auto;padding:20px;text-align:center;">
            <div style="font-size:48px;margin-bottom:8px;">🚗</div>
            <h1 style="font-size:24px;font-weight:700;margin:0;">${gateData.name}</h1>
            <p style="color:var(--text-muted);margin-top:4px;">${gateData.organizationId}</p>
            <p style="color:var(--text-muted);font-size:13px;">Capacity: ${gateData.capacity} vehicles</p>
            
            <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;margin:20px 0;border:1px solid rgba(255,255,255,0.08);">
                <p style="font-size:14px;color:var(--text-muted);">Enter your vehicle plate</p>
                <input id="plateInput" placeholder="e.g. KDG 832A" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;text-transform:uppercase;margin-bottom:12px;">
                <button id="enterBtn" style="width:100%;padding:14px;border-radius:12px;border:none;background:#6C3CE1;color:white;font-weight:600;cursor:pointer;font-size:16px;">
                    ✅ Enter
                </button>
            </div>
            
            <div style="font-size:12px;color:var(--text-muted);">
                No login required • Self-service parking
            </div>
        </div>
    `;
    
    document.getElementById('enterBtn')?.addEventListener('click', () => {
        const plate = document.getElementById('plateInput').value.trim().toUpperCase();
        if (!plate) {
            alert('Please enter your vehicle plate');
            return;
        }
        startSession(gateData, plate);
    });
}

function startSession(gateData, plate) {
    console.log('🚗 Starting session for:', plate);
    
    // Show session started
    const container = document.getElementById('app');
    if (!container) return;
    
    container.innerHTML = `
        <div style="max-width:480px;margin:40px auto;padding:20px;text-align:center;">
            <div style="font-size:64px;margin-bottom:12px;">✅</div>
            <h1 style="font-size:24px;font-weight:700;margin:0;">Session Started!</h1>
            <p style="color:var(--text-muted);margin-top:8px;">${plate} at ${gateData.name}</p>
            
            <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;margin:20px 0;border:1px solid rgba(255,255,255,0.08);text-align:left;">
                <div style="display:flex;justify-content:space-between;padding:4px 0;">
                    <span style="color:var(--text-muted);">Vehicle</span>
                    <span style="font-weight:600;">${plate}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                    <span style="color:var(--text-muted);">Gate</span>
                    <span style="font-weight:600;">${gateData.name}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid var(--glass-border);">
                    <span style="color:var(--text-muted);">Status</span>
                    <span style="font-weight:600;color:var(--accent);">🟢 Active</span>
                </div>
            </div>
            
            <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:12px;border:1px solid rgba(255,255,255,0.05);margin:12px 0;">
                <p style="font-size:12px;color:var(--text-muted);margin:0;">Exit QR</p>
                <div style="font-size:14px;font-weight:600;color:#00FF88;word-break:break-all;">${'token_' + Date.now() + '_' + plate}</div>
                <p style="font-size:11px;color:var(--text-muted);margin-top:4px;">Show this at the gate to exit</p>
            </div>
            
            <button id="endBtn" style="width:100%;padding:14px;border-radius:12px;border:1px solid var(--danger);background:transparent;color:var(--danger);font-weight:600;cursor:pointer;margin-top:12px;">
                ⏹️ End Visit
            </button>
        </div>
    `;
    
    document.getElementById('endBtn')?.addEventListener('click', () => {
        container.innerHTML = `
            <div style="max-width:480px;margin:40px auto;padding:20px;text-align:center;">
                <div style="font-size:64px;margin-bottom:12px;">🎉</div>
                <h1 style="font-size:24px;font-weight:700;margin:0;">Visit Complete!</h1>
                <p style="color:var(--text-muted);margin-top:8px;">Thank you for using Access Engine</p>
                <button id="newBtn" style="width:100%;padding:14px;border-radius:12px;border:none;background:#6C3CE1;color:white;font-weight:600;cursor:pointer;margin-top:20px;">
                    🔄 New Visit
                </button>
            </div>
        `;
        document.getElementById('newBtn')?.addEventListener('click', () => {
            // Reset and show the scan page
            window.location.href = '/';
        });
    });
}
