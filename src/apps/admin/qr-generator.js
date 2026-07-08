// ==========================================
// QR GENERATOR - Admin Tool (Fixed URLs)
// ==========================================

export function initQRGenerator(container) {
    console.log('📷 QR Generator initializing...');
    
    // Get the base URL - use relative path for local, configurable for production
    const baseUrl = window.location.origin;
    
    const organizations = [
        {
            id: 'org_pcea_langata',
            name: "P.C.E.A Lang'ata",
            locations: [
                {
                    id: 'loc_langata_main',
                    name: "Lang'ata Main",
                    accessPoints: [
                        {
                            id: 'ap_gate_1',
                            name: 'Gate 1 - Parking',
                            capacity: 20,
                            qrCode: 'QR-PCEA-LANGATA-GATE1'
                        },
                        {
                            id: 'ap_gate_2',
                            name: 'Gate 2 - Main Entrance',
                            capacity: 200,
                            qrCode: 'QR-PCEA-LANGATA-GATE2'
                        }
                    ]
                }
            ]
        }
    ];
    
    container.innerHTML = `
        <div style="max-width:800px;margin:20px auto;padding:20px;">
            <h1 style="font-size:24px;">📷 QR Code Generator</h1>
            <p style="color:var(--text-muted);margin-bottom:20px;">Generate QR codes for church gates</p>
            <div style="background:rgba(255,200,0,0.1);border:1px solid rgba(255,200,0,0.2);border-radius:12px;padding:12px;margin-bottom:20px;">
                <p style="font-size:13px;color:var(--text-muted);margin:0;">
                    🔗 QR codes will point to: <span style="color:#00FF88;">${baseUrl}/scan?gate=</span>
                </p>
                <p style="font-size:12px;color:var(--text-muted);margin-top:4px;">
                    ⚠️ For production, replace with your domain: https://your-app.com/scan?gate=
                </p>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                ${organizations.map(org => `
                    <div style="background:rgba(255,255,255,0.05);border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.08);">
                        <h2 style="font-size:18px;margin-bottom:12px;">🏛️ ${org.name}</h2>
                        ${org.locations.map(loc => `
                            <div style="margin-bottom:12px;">
                                <h3 style="font-size:14px;color:var(--text-muted);margin-bottom:8px;">📍 ${loc.name}</h3>
                                ${loc.accessPoints.map(ap => `
                                    <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:12px;margin-bottom:8px;border:1px solid rgba(255,255,255,0.05);">
                                        <div style="display:flex;justify-content:space-between;align-items:center;">
                                            <div>
                                                <div style="font-weight:600;">${ap.name}</div>
                                                <div style="font-size:12px;color:var(--text-muted);">Capacity: ${ap.capacity} • ID: ${ap.id}</div>
                                            </div>
                                            <button class="generate-btn" 
                                                    data-org="${org.id}" 
                                                    data-location="${loc.id}" 
                                                    data-ap="${ap.id}"
                                                    style="padding:8px 16px;border-radius:8px;border:none;background:#6C3CE1;color:white;cursor:pointer;font-size:12px;">
                                                Generate QR
                                            </button>
                                        </div>
                                        <div id="qr-${ap.id}" style="margin-top:8px;display:none;text-align:center;">
                                            <div style="background:white;padding:12px;border-radius:8px;display:inline-block;margin:8px auto;">
                                                <img id="qr-img-${ap.id}" src="" alt="QR Code" style="width:200px;height:200px;">
                                            </div>
                                            <div style="font-size:12px;color:var(--text-muted);">
                                                QR Code: <span id="qr-value-${ap.id}" style="color:#00FF88;"></span>
                                            </div>
                                            <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">
                                                URL: <span style="color:#6C3CE1;word-break:break-all;font-size:10px;" id="qr-url-${ap.id}"></span>
                                            </div>
                                            <button onclick="window.printQR('${ap.id}')" style="margin-top:8px;padding:6px 12px;border-radius:6px;border:1px solid var(--glass-border);background:transparent;color:var(--text-primary);cursor:pointer;font-size:11px;">
                                                🖨️ Print QR
                                            </button>
                                            <button onclick="window.downloadQR('${ap.id}')" style="margin-top:4px;padding:6px 12px;border-radius:6px;border:1px solid var(--glass-border);background:transparent;color:var(--text-primary);cursor:pointer;font-size:11px;">
                                                💾 Download PNG
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top:20px;padding:16px;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.05);">
                <h4 style="font-size:14px;margin-bottom:8px;">📋 QR Code Data</h4>
                <div style="font-size:12px;color:var(--text-muted);font-family:monospace;" id="qrDataDisplay">
                    Select a gate to generate QR
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for generate buttons
    document.querySelectorAll('.generate-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orgId = this.dataset.org;
            const locationId = this.dataset.location;
            const apId = this.dataset.ap;
            
            // Get the access point details
            const org = organizations.find(o => o.id === orgId);
            const loc = org?.locations.find(l => l.id === locationId);
            const ap = loc?.accessPoints.find(a => a.id === apId);
            
            if (!ap) return;
            
            // Generate QR data with URL to your app
            const gateData = {
                organizationId: orgId,
                locationId: locationId,
                accessPointId: apId,
                name: ap.name,
                capacity: ap.capacity,
                direction: 'entry'
            };
            
            // Encode data for URL
            const encodedData = encodeURIComponent(JSON.stringify(gateData));
            
            // The URL that QR will point to - use relative for local, configurable for prod
            const qrUrl = `${baseUrl}/scan?gate=${encodedData}`;
            
            // Generate QR image with the URL
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}`;
            
            // Show the QR
            const qrContainer = document.getElementById(`qr-${apId}`);
            const qrImg = document.getElementById(`qr-img-${apId}`);
            const qrValue = document.getElementById(`qr-value-${apId}`);
            const qrUrlDisplay = document.getElementById(`qr-url-${apId}`);
            
            if (qrContainer && qrImg && qrValue && qrUrlDisplay) {
                qrContainer.style.display = 'block';
                qrImg.src = qrImageUrl;
                qrValue.textContent = ap.qrCode || 'QR-' + apId.toUpperCase();
                qrUrlDisplay.textContent = qrUrl;
            }
            
            // Display QR data
            const dataDisplay = document.getElementById('qrDataDisplay');
            if (dataDisplay) {
                dataDisplay.innerHTML = `
                    <div>🔗 QR URL: <span style="color:#6C3CE1;word-break:break-all;font-size:11px;">${qrUrl}</span></div>
                    <div style="margin-top:8px;">📦 Gate Data:</div>
                    <div style="padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;margin-top:4px;font-size:11px;">
                        ${JSON.stringify(gateData, null, 2)}
                    </div>
                    <div style="margin-top:8px;font-size:11px;color:#FFD700;">
                        💡 When scanned, this QR will open the self-service parking app
                    </div>
                    <div style="margin-top:4px;font-size:10px;color:var(--text-muted);">
                        ${apId === 'ap_gate_1' ? '🅿️ Small Gate (20 capacity)' : '🏛️ Main Gate (200 capacity)'}
                    </div>
                `;
            }
        });
    });
    
    // Add print function to window
    window.printQR = function(apId) {
        const qrImg = document.getElementById(`qr-img-${apId}`);
        if (!qrImg) return;
        
        const win = window.open('', '_blank');
        if (win) {
            win.document.write(`
                <html>
                    <head><title>Gate QR Code</title></head>
                    <body style="text-align:center;padding:40px;background:white;font-family:sans-serif;">
                        <h2>🚗 P.C.E.A Lang'ata</h2>
                        <h3 style="color:#666;">${apId.replace('ap_', '').toUpperCase()}</h3>
                        <img src="${qrImg.src}" style="width:300px;height:300px;margin:20px auto;">
                        <p style="font-size:16px;color:#333;font-weight:600;">Scan to enter</p>
                        <p style="font-size:12px;color:#999;">Powered by Access Engine OS</p>
                        <button onclick="window.print()" style="padding:10px 20px;margin-top:10px;border:none;background:#6C3CE1;color:white;border-radius:8px;cursor:pointer;">🖨️ Print</button>
                    </body>
                </html>
            `);
            win.document.close();
        }
    };
    
    // Add download function
    window.downloadQR = function(apId) {
        const qrImg = document.getElementById(`qr-img-${apId}`);
        if (!qrImg) return;
        
        const link = document.createElement('a');
        link.download = `qr-${apId}.png`;
        link.href = qrImg.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    console.log('✅ QR Generator ready');
}

export default { initQRGenerator };
