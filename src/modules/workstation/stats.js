// ============================================
// Stats Management
// ============================================

let todayCount = 0;
let activeSessions = 0;

export function incrementTodayCount() {
    const today = new Date().toDateString();
    const key = `today_count_${today}`;
    const current = parseInt(localStorage.getItem(key) || "0");
    localStorage.setItem(key, String(current + 1));
    updateTodayCountDisplay();
}

export function decrementTodayCount() {
    const today = new Date().toDateString();
    const key = `today_count_${today}`;
    const current = parseInt(localStorage.getItem(key) || "0");
    if (current > 0) {
        localStorage.setItem(key, String(current - 1));
    }
    updateTodayCountDisplay();
}

export function updateTodayCountDisplay() {
    const today = new Date().toDateString();
    const key = `today_count_${today}`;
    const count = parseInt(localStorage.getItem(key) || "0");
    const el = document.getElementById('todayCount');
    if (el) el.textContent = count;
}

export function updateActiveSessions(count) {
    activeSessions = count;
    const el = document.getElementById('activeCount');
    if (el) el.textContent = count;
}

export async function refreshData() {
    updateTodayCountDisplay();
    
    // Get active sessions from API - fail silently if not authenticated
    try {
        const { getDashboard } = await import('../../services/api-client.js');
        const data = await getDashboard();
        if (data && data.activeSessions !== undefined) {
            updateActiveSessions(data.activeSessions);
        }
    } catch (error) {
        // Don't log 401 errors - they just mean we're not authenticated
        if (error.message && !error.message.includes('401') && !error.message.includes('Session expired')) {
            console.warn('Failed to fetch dashboard data:', error.message);
        }
    }
}
