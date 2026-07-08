// ============================================
// New Entry Modal - With Vehicle Categories
// ============================================

import { createModal, closeModal, isEntryModalOpen, setEntryModalOpen } from './modals.js';
import { showToast } from './toast.js';
import { refreshData, incrementTodayCount } from './stats.js';
import { processEntry } from '../../services/api-client.js';
import eventBus from '../../core/events.js';

// ==========================================
// VEHICLE CATEGORIES
// ==========================================

const VEHICLE_CATEGORIES = [
    { id: 'sedan', label: '🚗 Sedan', emoji: '🚗' },
    { id: 'suv', label: '🚙 SUV', emoji: '🚙' },
    { id: 'pickup', label: '🛻 Pickup', emoji: '🛻' },
    { id: 'van', label: '🚐 Van', emoji: '🚐' },
    { id: 'bike', label: '🏍️ Motorcycle', emoji: '🏍️' },
    { id: 'truck', label: '🚛 Truck', emoji: '🚛' },
    { id: 'bus', label: '🚌 Bus', emoji: '🚌' },
    { id: 'taxi', label: '🚕 Taxi', emoji: '🚕' },
    { id: 'other', label: '❓ Other', emoji: '🚗' },
];

// ==========================================
// Validation
// ==========================================

function validatePlate(plate) {
    if (!plate || plate.length < 3) {
        return { valid: false, error: 'License plate or QR code is required' };
    }
    const cleaned = plate.toUpperCase().trim();
    const isQRCode = /^[A-Z0-9]+(-[A-Z0-9]+)+$/.test(cleaned);
    if (isQRCode) {
        return { valid: true, value: cleaned, type: 'qr' };
    }
    const kenyanPlate = /^[A-Z]{3}\d{3}[A-Z]?$/;
    if (kenyanPlate.test(cleaned.replace(/\s/g, ''))) {
        return { valid: true, value: cleaned, type: 'plate' };
    }
    return { valid: false, error: 'Invalid format. Use: KDG832A or a valid QR code' };
}

function validatePhone(phone) {
    if (!phone) {
        return { valid: false, error: 'Phone number is required' };
    }
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
    if (!data.category) errors.push('Please select a vehicle category');
    
    return {
        valid: errors.length === 0,
        errors,
        data: {
            plate: plateResult.valid ? plateResult.value : data.plate,
            driver: nameResult.valid ? nameResult.value : data.driver,
            phone: phoneResult.valid ? phoneResult.value : data.phone,
            category: data.category || 'sedan',
            type: plateResult.type || 'plate'
        }
    };
}

// ==========================================
// Modal
// ==========================================

let selectedCategory = 'sedan';

export function openEntryModal() {
    if (isEntryModalOpen()) return;
    setEntryModalOpen(true);
    selectedCategory = 'sedan';

    const categoryButtons = VEHICLE_CATEGORIES.map(cat => `
        <button class="category-btn ${cat.id === selectedCategory ? 'active' : ''}" 
                data-category="${cat.id}"
                style="padding:10px 14px;border-radius:12px;border:2px solid ${cat.id === selectedCategory ? 'var(--primary)' : 'var(--glass-border)'};background:${cat.id === selectedCategory ? 'var(--primary)' : 'var(--glass-bg)'};color:${cat.id === selectedCategory ? 'white' : 'var(--text-primary)'};cursor:pointer;font-size:14px;transition:all 0.2s;flex:1;min-width:80px;text-align:center;">
            ${cat.label}
        </button>
    `).join('');

    const content = `
        <form id="entryForm">
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">License Plate or QR Code *</label>
                <input type="text" id="entryPlate" placeholder="e.g. KDG832A or TEST-QR-123" style="text-transform:uppercase;width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Format: KDG832A (plate) or TEST-QR-123 (QR code)</div>
            </div>
            
            <div style="margin-bottom:12px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:8px;">Vehicle Category (for background) *</label>
                <div id="categoryGrid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${categoryButtons}
                </div>
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
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">Vehicle Make Vehicle Type Model (optional)</label>
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

    // Category button click handlers
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('active');
                b.style.borderColor = 'var(--glass-border)';
                b.style.background = 'var(--glass-bg)';
                b.style.color = 'var(--text-primary)';
            });
            this.classList.add('active');
            this.style.borderColor = 'var(--primary)';
            this.style.background = 'var(--primary)';
            this.style.color = 'white';
            selectedCategory = this.dataset.category;
        });
    });

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

    const validation = validateEntryForm({ 
        plate, 
        driver, 
        phone, 
        category: selectedCategory 
    });
    
    if (!validation.valid) {
        errorDiv.textContent = `❌ ${validation.errors.join('\n')}`;
        errorDiv.style.display = 'block';
        return;
    }

    errorDiv.style.display = 'none';
    const { plate: validPlate, driver: validDriver, phone: validPhone, category } = validation.data;
    const credentialValue = validPlate;

    try {
        const submitBtn = document.querySelector('#entryForm .btn-primary');
        submitBtn.textContent = '⏳ Saving...';
        submitBtn.disabled = true;

        // Get emoji for the category
        const categoryInfo = VEHICLE_CATEGORIES.find(c => c.id === category);
        const vehicleEmoji = categoryInfo ? categoryInfo.emoji : '🚗';

        const result = await processEntry(
            credentialValue,
            'gate-a',
            'test-org',
            {
                vehicle: {
                    licensePlate: validPlate,
                    type: vehicleType,
                    category: category,
                    emoji: vehicleEmoji
                },
                driver: {
                    name: validDriver,
                    phone: validPhone
                },
                isVIP: isVIP,
                isStaff: isStaff,
                locationId: 'church_a',
                credentialType: validation.data.type || 'plate',
                vehicleCategory: category
            }
        );

        if (result && result.success) {
            incrementTodayCount();
            closeModal('entryModal');
            showToast(`✅ ${validPlate} (${category}) checked in successfully!`, 'success');
            await refreshData();
            // Emit event for atmosphere with vehicle category
            eventBus.emit('session:started', { 
                sessionId: result.sessionId, 
                vehicle: validPlate,
                category: category,
                emoji: vehicleEmoji
            });
        } else {
            throw new Error(result?.error || 'Entry failed');
        }

    } catch (error) {
        errorDiv.textContent = `❌ ${error.message}`;
        errorDiv.style.display = 'block';
        const submitBtn = document.querySelector('#entryForm .btn-primary');
        submitBtn.textContent = '✅ Check In';
        submitBtn.disabled = false;
    }
}
