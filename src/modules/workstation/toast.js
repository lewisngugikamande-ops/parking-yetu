// ============================================
// Toast System
// ============================================

let toastTimeout = null;

export function showToast(message, type = 'success') {
    const container = document.getElementById('app');
    if (!container) return;

    const colors = {
        success: 'rgba(0,255,136,0.08)',
        error: 'rgba(255,45,85,0.08)',
        warning: 'rgba(255,107,53,0.08)',
        info: 'rgba(0,212,255,0.08)'
    };
    const borderColors = {
        success: 'rgba(0,255,136,0.15)',
        error: 'rgba(255,45,85,0.15)',
        warning: 'rgba(255,107,53,0.15)',
        info: 'rgba(0,212,255,0.15)'
    };
    const textColors = {
        success: 'var(--accent)',
        error: 'var(--danger)',
        warning: 'var(--warning)',
        info: 'var(--secondary)'
    };

    // Remove old toast if exists
    const oldToast = document.getElementById('toast-message');
    if (oldToast) {
        oldToast.remove();
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toastTimeout = null;
        }
    }

    const toast = document.createElement('div');
    toast.id = 'toast-message';
    toast.style.cssText = `
        position:fixed;bottom:100px;left:50%;transform:translateX(-50%);
        padding:16px 24px;border-radius:16px;
        background:${colors[type] || colors.success};
        border:1px solid ${borderColors[type] || borderColors.success};
        color:${textColors[type] || textColors.success};
        font-weight:500;font-size:14px;
        z-index:9999;max-width:90%;
        text-align:center;
        animation:slideUp 0.3s ease;
    `;
    toast.textContent = message;

    container.appendChild(toast);

    toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            toast.remove();
            toastTimeout = null;
        }, 300);
    }, 3000);
}
