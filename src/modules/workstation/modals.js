// ============================================
// Modal Management
// ============================================

let entryModalOpen = false;
let exitModalOpen = false;

export function isEntryModalOpen() { return entryModalOpen; }
export function setEntryModalOpen(val) { entryModalOpen = val; }

export function isExitModalOpen() { return exitModalOpen; }
export function setExitModalOpen(val) { exitModalOpen = val; }

export function createModal(id, title, content) {
    const existing = document.getElementById(`modal-${id}`);
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = `modal-${id}`;
    overlay.style.cssText = `
        position:fixed;top:0;left:0;right:0;bottom:0;
        background:rgba(0,0,0,0.6);
        display:flex;align-items:center;justify-content:center;
        z-index:1000;
        backdrop-filter:blur(4px);
        animation:fadeIn 0.2s ease;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background:var(--bg-primary);
        border-radius:24px;
        max-width:500px;
        width:90%;
        max-height:90vh;
        overflow-y:auto;
        padding:24px;
        box-shadow:0 20px 60px rgba(0,0,0,0.3);
        border:1px solid var(--glass-border);
        animation:slideUp 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <h2 style="font-size:20px;font-weight:700;margin:0;">${title}</h2>
            <button id="closeModalBtn" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--text-muted);padding:4px 8px;">✕</button>
        </div>
        <div>${content}</div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById('closeModalBtn')?.addEventListener('click', () => {
        closeModal(id);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(id);
        }
    });

    // Add keydown handler for Escape
    const keyHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal(id);
            document.removeEventListener('keydown', keyHandler);
        }
    };
    document.addEventListener('keydown', keyHandler);
}

export function closeModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) modal.remove();
    
    if (id === 'entryModal') setEntryModalOpen(false);
    if (id === 'exitModal') setExitModalOpen(false);
}
