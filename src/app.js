// ============================================
// Parking Yetu - Entry Point
// ============================================

import { bootstrap } from './bootstrap.js';

bootstrap().catch(error => {
    console.error('❌ Failed to start:', error);
    document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;padding:20px;text-align:center;background:#0A0A0F;color:white;">
            <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
            <h2>Failed to Start</h2>
            <p style="color:#6A6A8A;">${error.message}</p>
            <button onclick="location.reload()" style="margin-top:16px;padding:12px 32px;background:#6C3CE1;color:white;border:none;border-radius:12px;cursor:pointer;">Retry</button>
        </div>
    `;
});
