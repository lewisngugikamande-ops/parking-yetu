// ============================================
// Exit Modal - Process Vehicle Exit
// ============================================

import { createModal, closeModal, isExitModalOpen, setExitModalOpen } from './modals.js';
import { showToast } from './toast.js';
import { refreshData, decrementTodayCount } from './stats.js';
import { processExit } from '../../services/api-client.js';
import eventBus from '../../core/events.js';

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

function validateExitForm(data) {
    const errors = [];
    
    const plateResult = validatePlate(data.plate);
    if (!plateResult.valid) errors.push(plateResult.error);
    
    return {
        valid: errors.length === 0,
        errors,
        data: {
            plate: plateResult.valid ? plateResult.value : data.plate,
            type: plateResult.type || 'plate'
        }
    };
}

// ==========================================
// Modal
// ==========================================

export function openExitModal() {
    if (isExitModalOpen()) return;
    setExitModalOpen(true);

    const content = `
        <form id="exitForm">
            <div style="margin-bottom:16px;">
                <label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:4px;">
                    License Plate or QR Code *
                </label>
                <input type="text" id="exitPlate" placeholder="e.g. KDG832A or TEST-QR-123" style="text-transform:uppercase;width:100%;padding:12px 16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);font-size:16px;">
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Format: KDG832A (plate) or TEST-QR-123 (QR code)</div>
            </div>
            <div style="background:rgba(255,165,0,0.1);border:1px solid var(--warning);border-radius:12px;padding:12px;margin-bottom:16px;color:var(--text-muted);font-size:14px;">
                ⚠️ This will process the exit for the vehicle. Please confirm the vehicle is leaving.
            </div>
            <button type="submit" class="btn-danger" style="padding:16px;font-size:18px;width:100%;border:none;border-radius:16px;background:var(--danger);color:white;font-weight:600;cursor:pointer;">🚗 Process Exit</button>
            <div id="exitError" style="display:none;padding:12px;border-radius:12px;margin-top:12px;background:rgba(255,45,85,0.1);color:var(--danger);font-size:14px;"></div>
        </form>
    `;

    createModal('exitModal', '🚗 Vehicle Exit', content);

    document.getElementById('exitForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleExitSubmit();
    });
}

async function handleExitSubmit() {
    const plate = document.getElementById('exitPlate')?.value?.trim();
    const errorDiv = document.getElementById('exitError');

    const validation = validateExitForm({ plate });
    if (!validation.valid) {
        errorDiv.textContent = `❌ ${validation.errors.join('\n')}`;
        errorDiv.style.display = 'block';
        return;
    }

    errorDiv.style.display = 'none';
    const { plate: validPlate } = validation.data;
    const credentialValue = validPlate;

    try {
        const submitBtn = document.querySelector('#exitForm .btn-danger');
        submitBtn.textContent = '⏳ Processing...';
        submitBtn.disabled = true;

        const result = await processExit(
            credentialValue,
            'gate-a',
            'test-org',
            {
                locationId: 'church_a',
                credentialType: validation.data.type || 'plate'
            }
        );

        if (result && result.success) {
            decrementTodayCount();
            closeModal('exitModal');
            showToast(`✅ ${validPlate} exited successfully!`, 'success');
            await refreshData();
            // Emit event for atmosphere
            eventBus.emit('session:ended', { sessionId: result.sessionId, vehicle: validPlate });
        } else {
            throw new Error(result?.error || 'Exit failed');
        }

    } catch (error) {
        errorDiv.textContent = `❌ ${error.message}`;
        errorDiv.style.display = 'block';
        const submitBtn = document.querySelector('#exitForm .btn-danger');
        submitBtn.textContent = '🚗 Process Exit';
        submitBtn.disabled = false;
    }
}
