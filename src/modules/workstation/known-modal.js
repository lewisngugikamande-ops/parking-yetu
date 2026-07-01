// ============================================
// Known Vehicle Modal
// ============================================

import { 
    createModal, 
    closeModal, 
    getKnownVehicleData, 
    setKnownVehicleData, 
    isKnownVehicleModalOpen,
    setKnownVehicleModalOpen
} from './modals.js';
import { Session } from '../../models/Session.js';
import { getVehicleRepository } from '../../repositories/vehicle-repository.js';
import { getSessionRepository } from '../../repositories/session-repository.js';
import { Audit } from '../../core/audit.js';
import { emit } from '../../core/events.js';
import { config } from '../../config/index.js';
import { showToast } from './toast.js';
import { refreshData, incrementTodayCount } from './stats.js';
import { openEntryModal } from './entry-modal.js';
import { getTimeAgo } from '../../utils/time.js';

const vehicleRepo = getVehicleRepository();
const sessionRepo = getSessionRepository();

export function openKnownVehicleModal() {
    if (isKnownVehicleModalOpen()) return;
    setKnownVehicleModalOpen(true);

    const content = `
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Search by Plate</label>
            <div style="display:flex;gap:8px;">
                <input type="text" id="knownPlate" placeholder="e.g. KDG832A" style="text-transform:uppercase;flex:1;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <button id="knownSearchBtn" class="btn-secondary" style="padding:12px 20px;min-height:auto;width:auto;font-size:14px;">🔍 Search</button>
            </div>
        </div>

        <div id="knownResult" style="display:none;padding:16px;background:var(--glass-bg);border-radius:16px;border:1px solid var(--glass-border);margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-family:Orbitron,monospace;font-size:20px;font-weight:700;" id="knownPlateDisplay">KDG832A</div>
                    <div style="font-size:13px;color:var(--text-muted);" id="knownDriverDisplay">👤 John Otieno</div>
                    <div style="font-size:13px;color:var(--text-muted);" id="knownPhoneDisplay">📱 0712345678</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:11px;color:var(--text-muted);">Last visit</div>
                    <div style="font-size:13px;color:var(--text-secondary);" id="knownLastVisit">2 days ago</div>
                </div>
            </div>
            <button id="knownQuickEntryBtn" class="btn-success" style="margin-top:12px;padding:12px;font-size:16px;">✅ Quick Entry</button>
        </div>

        <div id="knownNotFound" style="display:none;padding:16px;text-align:center;color:var(--text-muted);">
            ❌ Vehicle not found. <button id="knownRegisterBtn" style="background:transparent;border:none;color:var(--primary);cursor:pointer;font-weight:600;min-height:auto;width:auto;padding:0;">Register as new</button>
        </div>

        <div id="knownError" style="display:none;padding:12px;border-radius:12px;margin-top:12px;background:rgba(255,45,85,0.1);color:var(--danger);font-size:14px;"></div>
    `;

    createModal('knownVehicleModal', '🟩 Known Vehicle', content);

    document.getElementById('knownSearchBtn')?.addEventListener('click', handleKnownSearch);
    document.getElementById('knownPlate')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleKnownSearch();
    });
    document.getElementById('knownQuickEntryBtn')?.addEventListener('click', handleKnownQuickEntry);
    document.getElementById('knownRegisterBtn')?.addEventListener('click', () => {
        closeModal('knownVehicleModal');
        openEntryModal();
    });
}

async function handleKnownSearch() {
    const plate = document.getElementById('knownPlate')?.value?.trim()?.toUpperCase();
    const resultDiv = document.getElementById('knownResult');
    const notFoundDiv = document.getElementById('knownNotFound');
    const errorDiv = document.getElementById('knownError');

    if (!plate) {
        errorDiv.textContent = '❌ Enter a plate number';
        errorDiv.style.display = 'block';
        return;
    }

    errorDiv.style.display = 'none';
    resultDiv.style.display = 'none';
    notFoundDiv.style.display = 'none';

    try {
        const vehicle = await vehicleRepo.findByPlate(plate);
        if (!vehicle) {
            notFoundDiv.style.display = 'block';
            return;
        }

        const sessions = await sessionRepo.getByVehicle(vehicle.id);
        const lastSession = sessions.length > 0 ? sessions[0] : null;

        document.getElementById('knownPlateDisplay').textContent = vehicle.licensePlate;
        document.getElementById('knownDriverDisplay').textContent = `👤 ${lastSession?.driverName || 'No previous visits'}`;
        document.getElementById('knownPhoneDisplay').textContent = `📱 ${lastSession?.driverPhone || 'N/A'}`;
        document.getElementById('knownLastVisit').textContent = lastSession ? getTimeAgo(lastSession.entryTime) : 'No visits';

        resultDiv.style.display = 'block';
        setKnownVehicleData({ vehicle, lastSession });

    } catch (error) {
        errorDiv.textContent = '❌ Error: ' + error.message;
        errorDiv.style.display = 'block';
    }
}

async function handleKnownQuickEntry() {
    const data = getKnownVehicleData();
    if (!data) return;

    const { vehicle, lastSession } = data;

    try {
        const session = new Session({
            vehicleId: vehicle.id,
            vehiclePlate: vehicle.licensePlate,
            driverName: lastSession?.driverName || 'Known Driver',
            driverPhone: lastSession?.driverPhone || 'N/A',
            gate: config.app.defaultGate,
            locationId: config.app.defaultLocation,
            organizationId: config.app.defaultOrganization
        });

        const saved = await sessionRepo.create(session);
        await Audit.vehicleEntry(saved);
        await emit('vehicle:entered', { session: saved });

        incrementTodayCount();

        closeModal('knownVehicleModal');
        showToast(`✅ ${vehicle.licensePlate} checked in!`, 'success');
        await refreshData();

    } catch (error) {
        showToast('❌ Error: ' + error.message, 'error');
    }
}
