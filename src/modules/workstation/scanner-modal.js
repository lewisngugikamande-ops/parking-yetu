// ============================================
// Scanner Modal
// ============================================

import { 
    createModal, 
    closeModal, 
    getScannerSessionData, 
    setScannerSessionData, 
    isScannerActive,
    setScannerActive
} from './modals.js';
import { getSessionRepository } from '../../repositories/session-repository.js';
import { Audit } from '../../core/audit.js';
import { emit } from '../../core/events.js';
import { config } from '../../config/index.js';
import { showToast } from './toast.js';
import { refreshData } from './stats.js';

const sessionRepo = getSessionRepository();

export function openScanner() {
    if (isScannerActive()) return;
    setScannerActive(true);

    const content = `
        <div id="scannerContainer" style="background:var(--glass-bg);border-radius:16px;padding:20px;border:2px dashed var(--glass-border);min-height:200px;display:flex;align-items:center;justify-content:center;flex-direction:column;">
            <div style="font-size:48px;margin-bottom:12px;">📷</div>
            <div style="color:var(--text-muted);">Camera will open here</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:8px;">For now, enter plate manually below</div>
        </div>

        <div style="margin-top:16px;">
            <input type="text" id="scannerPlateInput" placeholder="Enter plate to exit" style="text-transform:uppercase;width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
            <button id="scannerExitBtn" class="btn-danger" style="margin-top:8px;padding:14px;font-size:16px;">🔍 Find & Exit</button>
        </div>

        <div id="scannerResult" style="display:none;margin-top:12px;padding:16px;background:var(--glass-bg);border-radius:16px;border:1px solid var(--glass-border);">
            <div id="scannerVehicleInfo"></div>
            <button id="scannerConfirmExit" class="btn-success" style="margin-top:12px;padding:12px;font-size:16px;">✅ Confirm Exit</button>
        </div>

        <div id="scannerError" style="display:none;padding:12px;border-radius:12px;margin-top:12px;background:rgba(255,45,85,0.1);color:var(--danger);font-size:14px;"></div>
    `;

    createModal('scannerModal', '📷 Scan QR', content);

    document.getElementById('scannerExitBtn')?.addEventListener('click', handleScannerSearch);
    document.getElementById('scannerPlateInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleScannerSearch();
    });
    document.getElementById('scannerConfirmExit')?.addEventListener('click', handleScannerExit);
}

async function handleScannerSearch() {
    const plate = document.getElementById('scannerPlateInput')?.value?.trim()?.toUpperCase();
    const resultDiv = document.getElementById('scannerResult');
    const errorDiv = document.getElementById('scannerError');

    if (!plate) {
        errorDiv.textContent = '❌ Enter a plate number';
        errorDiv.style.display = 'block';
        return;
    }

    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';

    try {
        const sessions = await sessionRepo.getActive(config.app.defaultOrganization);
        const found = sessions.find(s => s.vehiclePlate === plate);

        if (!found) {
            errorDiv.textContent = '❌ No active session found for this vehicle';
            errorDiv.style.display = 'block';
            return;
        }

        setScannerSessionData(found);

        const duration = found.getDurationText ? found.getDurationText() : `${found.duration || 0}m`;
        const isVIP = found.isVIP ? '⭐ ' : '';
        const isStaff = found.isStaff ? '👤 ' : '';

        document.getElementById('scannerVehicleInfo').innerHTML = `
            <div style="font-family:Orbitron,monospace;font-size:24px;font-weight:700;color:var(--primary);">${found.vehiclePlate}</div>
            <div style="font-size:13px;color:var(--text-secondary);">${isVIP}${isStaff}${found.driverName || 'Unknown'}</div>
            <div style="font-size:13px;color:var(--text-muted);">🕐 ${duration} • 🚪 ${found.gate || 'Gate A'}</div>
        `;

        resultDiv.style.display = 'block';

    } catch (error) {
        errorDiv.textContent = '❌ Error: ' + error.message;
        errorDiv.style.display = 'block';
    }
}

async function handleScannerExit() {
    const data = getScannerSessionData();
    if (!data) return;

    try {
        const exited = await sessionRepo.exit(data.id, config.app.defaultGate);
        await Audit.vehicleExit(exited);
        await emit('vehicle:exited', { session: exited });

        closeModal('scannerModal');
        showToast(`✅ ${exited.vehiclePlate} exited successfully!`, 'success');
        await refreshData();

    } catch (error) {
        showToast('❌ Error: ' + error.message, 'error');
    }
}
