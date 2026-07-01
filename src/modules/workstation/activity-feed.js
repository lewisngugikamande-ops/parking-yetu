// ============================================
// Activity Feed
// ============================================

import { getTimeAgo } from '../../utils/time.js';

export function updateActivityFeed(sessions) {
    const feed = document.getElementById('activityFeed');
    const countEl = document.getElementById('activityCount');
    
    if (!feed) return;
    
    if (!sessions || sessions.length === 0) {
        feed.innerHTML = `
            <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">
                No active vehicles
            </div>
        `;
        if (countEl) countEl.textContent = '0 active';
        return;
    }
    
    if (countEl) countEl.textContent = `${sessions.length} active`;
    
    // Sort by entry time (newest first)
    const sorted = [...sessions].sort((a, b) => 
        new Date(b.entryTime) - new Date(a.entryTime)
    );
    const recent = sorted.slice(0, 10);
    
    feed.innerHTML = recent.map(s => {
        const duration = s.getDurationText ? s.getDurationText() : `${s.duration || 0}m`;
        const plate = s.vehiclePlate || 'Unknown';
        const driver = s.driverName || 'Unknown';
        const isVIP = s.isVIP || false;
        const isOverdue = s.isOverdue ? s.isOverdue() : false;
        
        let icon = '🟢';
        let badge = '';
        if (isVIP) {
            icon = '⭐';
            badge = '<span style="background:var(--gradient-primary);padding:2px 8px;border-radius:12px;font-size:10px;color:white;font-weight:700;margin-left:4px;">VIP</span>';
        }
        if (isOverdue) {
            icon = '⚠️';
            badge = '<span style="background:rgba(255,45,85,0.2);padding:2px 8px;border-radius:12px;font-size:10px;color:var(--danger);font-weight:700;margin-left:4px;">OVERDUE</span>';
        }
        
        const entryTime = s.entryTime ? new Date(s.entryTime) : new Date();
        const timeAgo = getTimeAgo(entryTime);
        
        return `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg-card);border-radius:12px;border:1px solid var(--glass-border);">
                <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
                    <span style="font-size:18px;">${icon}</span>
                    <div style="min-width:0;">
                        <div style="font-weight:600;font-family:Orbitron,monospace;font-size:14px;letter-spacing:0.5px;">
                            ${plate} ${badge}
                        </div>
                        <div style="font-size:12px;color:var(--text-muted);">
                            👤 ${driver} • ${timeAgo} • 🕐 ${duration}
                        </div>
                    </div>
                </div>
                <div style="font-size:12px;color:var(--text-muted);">
                    Gate ${s.gate || 'A'}
                </div>
            </div>
        `;
    }).join('');
}
