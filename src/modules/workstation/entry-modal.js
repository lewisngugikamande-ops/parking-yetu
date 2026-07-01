// ============================================
// New Entry Modal - With Kenya Phone Validation
// ============================================

import { createModal, closeModal, isEntryModalOpen, setEntryModalOpen } from './modals.js';
import { Vehicle } from '../../models/Vehicle.js';
import { Session } from '../../models/Session.js';
import { getVehicleRepository } from '../../repositories/vehicle-repository.js';
import { getSessionRepository } from '../../repositories/session-repository.js';
import { Audit } from '../../core/audit.js';
import { emit } from '../../core/events.js';
import { config } from '../../config/index.js';
import { showToast } from './toast.js';
import { refreshData, incrementTodayCount } from './stats.js';

const vehicleRepo = getVehicleRepository();
const sessionRepo = getSessionRepository();

// ==========================================
// Validation
// ==========================================

function validatePlate(plate) {
    if (!plate || plate.length < 3) {
        return { valid: false, error: 'License plate is required' };
    }
    // Kenyan plate: 3 letters + 3 numbers + optional letter
    const kenyanPlate = /^[A-Z]{3}\d{3}[A-Z]?$/;
    if (!kenyanPlate.test(plate.toUpperCase().replace(/\s/g, ''))) {
        return { valid: false, error: 'Invalid plate format. Use: KDG832A' };
    }
    return { valid: true, value: plate.toUpperCase() };
}

function validatePhone(phone) {
    if (!phone) {
        return { valid: false, error: 'Phone number is required' };
    }
    // Kenya phone: 0712345678, 0112345678, 254712345678, +254712345678
    const cleaned = phone.replace(/\s/g, '');
    const kenyaPhone = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;
    if (!kenyaPhone.test(cleaned)) {
        return { valid: false, error: 'Invalid phone format. Use: 0712345678 or +254712345678' };
    }
    return { valid: true, value: cleaned };
}

function validateName(name) {
    if (!name || name.length < 2) {
        return { valid: false, error: 'Driver name is required' };
    }
    return { valid: true, value: name.trim() };
}

function validateEntryForm(data) {
    const errors = [];
    
    const plateResult = validatePlate(data.plate);
    if (!plateResult.valid) errors.push(plateResult.error);
    
    const nameResult = validateName(data.driver);
    if (!nameResult.valid) errors.push(nameResult.error);
    
    const phoneResult = validatePhone(data.phone);
    if (!phoneResult.valid) errors.push(phoneResult.error);
    
    return {
        valid: errors.length === 0,
        errors,
        data: {
            plate: plateResult.valid ? plateResult.value : data.plate,
            driver: nameResult.valid ? nameResult.value : data.driver,
            phone: phoneResult.valid ? phoneResult.value : data.phone
        }
    };
}

// ==========================================
// Modal
// ==========================================

export function openEntryModal() {
    if (isEntryModalOpen()) return;
    setEntryModalOpen(true);

    const content = `
        <form id="entryForm">
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">License Plate *</label>
                <input type="text" id="entryPlate" placeholder="e.g. KDG832A" style="text-transform:uppercase;width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Format: 3 letters + 3 numbers + optional letter (e.g. KDG832A)</div>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Driver Name *</label>
                <input type="text" id="entryDriver" placeholder="Full name" style="width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Phone Number *</label>
                <input type="tel" id="entryPhone" placeholder="e.g. 0712345678" style="width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Format: 0712345678 or +254712345678</div>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Vehicle Type</label>
                <select id="entryVehicleType" style="width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                    <option value="Sedan">🚗 Sedan</option>
                    <option value="SUV/4x4">🚙 SUV/4x4</option>
                    <option value="Pickup">🛻 Pickup</option>
                    <option value="Motorbike">🏍️ Motorbike</option>
                    <option value="Matatu">🚐 Matatu</option>
                    <option value="Bus">🚌 Bus</option>
                    <option value="Bicycle">🚲 Bicycle</option>
                    <option value="Other">🚘 Other</option>
                </select>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
                <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;">
                    <input type="checkbox" id="entryVIP"> ⭐ VIP
                </label>
                <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;">
                    <input type="checkbox" id="entryStaff"> 👤 Staff
                </label>
            </div>
            <button type="submit" class="btn-primary" style="padding:16px;font-size:18px;">✅ Check In</button>
            <div id="entryError" style="display:none;padding:12px;border-radius:12px;margin-top:12px;background:rgba(255,45,85,0.1);color:var(--danger);font-size:14px;"></div>
        </form>
    `;

    createModal('entryModal', '🟦 New Entry', content);

    document.getElementById('entryForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleEntrySubmit();
    });
}

async function handleEntrySubmit() {
    const plate = document.getElementById('entryPlate')?.value?.trim();
    const driver = document.getElementById('entryDriver')?.value?.trim();
    const phone = document.getElementById('entryPhone')?.value?.trim();
    const vehicleType = document.getElementById('entryVehicleType')?.value || 'Sedan';
    const isVIP = document.getElementById('entryVIP')?.checked || false;
    const isStaff = document.getElementById('entryStaff')?.checked || false;
    const errorDiv = document.getElementById('entryError');

    // Validate
    const validation = validateEntryForm({ plate, driver, phone });
    if (!validation.valid) {
        errorDiv.textContent = `❌ ${validation.errors.join('\n')}`;
        errorDiv.style.display = 'block';
        return;
    }

    errorDiv.style.display = 'none';
    const { plate: validPlate, driver: validDriver, phone: validPhone } = validation.data;

    try {
        const submitBtn = document.querySelector('#entryForm .btn-primary');
        submitBtn.textContent = '⏳ Saving...';
        submitBtn.disabled = true;

        // Find or create vehicle
        let vehicle = await vehicleRepo.findByPlate(validPlate);
        if (!vehicle) {
            vehicle = new Vehicle({
                licensePlate: validPlate,
                type: vehicleType,
                organizationId: config.app.defaultOrganization
            });
            vehicle = await vehicleRepo.create(vehicle);
        }

        // Create session
        const session = new Session({
            vehicleId: vehicle.id,
            vehiclePlate: validPlate,
            driverName: validDriver,
            driverPhone: validPhone,
            gate: config.app.defaultGate,
            locationId: config.app.defaultLocation,
            organizationId: config.app.defaultOrganization
        });
        if (isVIP) session.setVIP();
        if (isStaff) session.setStaff();

        const saved = await sessionRepo.create(session);
        await Audit.vehicleEntry(saved);
        await emit('vehicle:entered', { session: saved });

        incrementTodayCount();

        closeModal('entryModal');
        showToast(`✅ ${validPlate} checked in successfully!`, 'success');
        await refreshData();

    } catch (error) {
        errorDiv.textContent = `❌ ${error.message}`;
        errorDiv.style.display = 'block';
        const submitBtn = document.querySelector('#entryForm .btn-primary');
        submitBtn.textContent = '✅ Check In';
        submitBtn.disabled = false;
    }
}
