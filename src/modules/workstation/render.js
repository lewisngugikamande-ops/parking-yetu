import { openEntryModal } from './entry-modal.js';
import { openExitModal } from './exit-modal.js';

export function renderWorkstation(app) {
    app.innerHTML = `
        <div style="padding:20px;max-width:1200px;margin:0 auto;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <h1 style="font-size:24px;font-weight:700;">🚗 Parking Yetu</h1>
                <div style="display:flex;gap:10px;">
                    <button id="entryButton" class="btn-primary" style="padding:10px 20px;border-radius:12px;border:none;background:var(--primary);color:white;font-weight:600;cursor:pointer;font-size:14px;">📥 Entry</button>
                    <button id="exitButton" class="btn-danger" style="padding:10px 20px;border-radius:12px;border:none;background:var(--danger);color:white;font-weight:600;cursor:pointer;font-size:14px;">📤 Exit</button>
                    <button id="logoutButton" class="btn-secondary" style="padding:10px 20px;border-radius:12px;border:1px solid var(--glass-border);background:var(--glass-bg);color:var(--text-primary);cursor:pointer;font-size:14px;">🚪 Logout</button>
                </div>
            </div>
            
            <div id="statsContainer" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:20px;">
                <div class="stat-card" style="padding:16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);">
                    <div style="font-size:12px;color:var(--text-muted);">Today's Entries</div>
                    <div id="todayCount" style="font-size:32px;font-weight:700;">0</div>
                </div>
                <div class="stat-card" style="padding:16px;border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);">
                    <div style="font-size:12px;color:var(--text-muted);">Active Sessions</div>
                    <div id="activeCount" style="font-size:32px;font-weight:700;">0</div>
                </div>
            </div>
            
            <div id="activityFeed" style="border-radius:16px;border:1px solid var(--glass-border);background:var(--glass-bg);padding:16px;min-height:200px;">
                <h3 style="margin-bottom:12px;">📋 Recent Activity</h3>
                <div id="activityList" style="display:flex;flex-direction:column;gap:8px;">
                    <div style="color:var(--text-muted);text-align:center;padding:20px;">No recent activity</div>
                </div>
            </div>
        </div>
    `;

    // Event Listeners
    document.getElementById('entryButton')?.addEventListener('click', openEntryModal);
    document.getElementById('exitButton')?.addEventListener('click', openExitModal);
    document.getElementById('logoutButton')?.addEventListener('click', () => {
        window.handleLogout?.();
    });

    // Initial stats load
    import('./stats.js').then(module => {
        module.refreshData();
    });
}
