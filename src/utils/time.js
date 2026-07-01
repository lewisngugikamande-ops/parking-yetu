// ============================================
// Time Utilities
// ============================================

export function getTimeAgo(date) {
    if (!date) return 'Never';
    
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

export function formatDate(date) {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-KE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function getTodayStart() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

export function getTomorrowStart() {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}
