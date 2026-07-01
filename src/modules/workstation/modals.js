// ============================================
// Modal Helpers - Immutable State
// ============================================

let state = {
    isEntryModalOpen: false,
    isKnownVehicleModalOpen: false,
    isScannerActive: false,
    knownVehicleData: null,
    scannerSessionData: null
};

// Style injection - only once
if (!document.getElementById('workstation-modals-style')) {
    const style = document.createElement('style');
    style.id = 'workstation-modals-style';
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .modal-close {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
            min-height: auto;
            width: auto;
            padding: 4px 8px;
        }
        .modal-close:hover {
            color: var(--text-primary);
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// State Getters
// ==========================================

export function getModalState() {
    return { ...state }; // Return copy to prevent mutation
}

export function isEntryModalOpen() {
    return state.isEntryModalOpen;
}

export function isKnownVehicleModalOpen() {
    return state.isKnownVehicleModalOpen;
}

export function isScannerActive() {
    return state.isScannerActive;
}

export function getKnownVehicleData() {
    return state.knownVehicleData;
}

export function getScannerSessionData() {
    return state.scannerSessionData;
}

// ==========================================
// State Setters
// ==========================================

export function setEntryModalOpen(value) {
    state.isEntryModalOpen = value;
}

export function setKnownVehicleModalOpen(value) {
    state.isKnownVehicleModalOpen = value;
}

export function setScannerActive(value) {
    state.isScannerActive = value;
}

export function setKnownVehicleData(data) {
    state.knownVehicleData = data;
}

export function setScannerSessionData(data) {
    state.scannerSessionData = data;
}

export function resetModalState() {
    state = {
        isEntryModalOpen: false,
        isKnownVehicleModalOpen: false,
        isScannerActive: false,
        knownVehicleData: null,
        scannerSessionData: null
    };
}

// ==========================================
// Modal Creation
// ==========================================

export function createModal(id, title, content, onClose = null) {
    // Prevent duplicate modals
    if (document.getElementById(id)) {
        return document.getElementById(id);
    }

    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.style.cssText = `
        position:fixed;top:0;left:0;right:0;bottom:0;
        background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);
        z-index:1000;display:flex;align-items:center;justify-content:center;
        padding:20px;animation:fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
        <div style="background:var(--bg-secondary);border-radius:32px;padding:32px;max-width:480px;width:100%;border:1px solid var(--glass-border);max-height:90vh;overflow-y:auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h3 style="font-family:Orbitron,monospace;font-size:20px;">${title}</h3>
                <button class="modal-close" data-modal-id="${id}">✕</button>
            </div>
            ${content}
        </div>
    `;

    document.body.appendChild(overlay);

    // Close button
    overlay.querySelector('.modal-close')?.addEventListener('click', () => {
        closeModal(id);
    });

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(id);
        }
    });

    // Focus first input
    setTimeout(() => {
        const firstInput = overlay.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);

    return overlay;
}

export function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.remove();
    }

    // Reset state based on modal type
    switch(id) {
        case 'entryModal':
            state.isEntryModalOpen = false;
            break;
        case 'knownVehicleModal':
            state.isKnownVehicleModalOpen = false;
            state.knownVehicleData = null;
            break;
        case 'scannerModal':
            state.isScannerActive = false;
            state.scannerSessionData = null;
            break;
    }
}

export function closeAllModals() {
    ['entryModal', 'knownVehicleModal', 'scannerModal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.remove();
        }
    });
    resetModalState();
}
