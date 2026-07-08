// ==========================================
// NAVIGATION - Navigation Helpers
// ==========================================

import { navigateTo } from './router.js';

export function goToAccessPortal() { navigateTo('/access'); }
export function goToWorkstation() { navigateTo('/'); }
export function goToAdmin() { navigateTo('/admin'); }
export function goToOrgAdmin() { navigateTo('/org-admin'); }
export function goToScanner() { navigateTo('/access'); }
export function goToManagement() { navigateTo('/manage'); }

export function createNavButtons() {
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        gap: 4px;
        background: rgba(10, 10, 20, 0.7);
        padding: 4px 12px;
        border-radius: 20px;
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    `;
    
    const buttons = [
        { label: '🏢 Workstation', action: goToWorkstation },
        { label: '🚪 Access', action: goToAccessPortal },
        { label: '🔧 QR Gen', action: goToAdmin },
        { label: '🏛️ Org Admin', action: goToOrgAdmin }
    ];
    
    buttons.forEach(({ label, action }) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = `
            padding: 4px 14px;
            border-radius: 14px;
            border: none;
            background: rgba(108, 60, 225, 0.15);
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            white-space: nowrap;
            font-family: system-ui, -apple-system, sans-serif;
        `;
        
        // Hover effects
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(108, 60, 225, 0.25)';
            btn.style.transform = 'scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(108, 60, 225, 0.15)';
            btn.style.transform = 'scale(1)';
        });
        
        // Click handler
        btn.addEventListener('click', action);
        container.appendChild(btn);
    });
    
    return container;
}
