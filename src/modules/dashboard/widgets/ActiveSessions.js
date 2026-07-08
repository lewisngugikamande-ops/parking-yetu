export function ActiveSessions({ data }) {
  const active = data?.active || 0;
  const today = data?.today || 0;
  const exits = data?.exits || 0;
  
  return `
    <div class="widget widget-sessions" data-widget="ActiveSessions">
      <div class="widget-header">
        <span class="widget-icon">🚗</span>
        <span class="widget-title">Active Sessions</span>
        <span class="widget-badge">${active}</span>
      </div>
      <div class="widget-body">
        <div class="stat-number">${active}</div>
        <div class="stat-label">vehicles currently inside</div>
      </div>
      <div class="widget-footer">
        <span>📥 Today: ${today}</span>
        <span>📤 Exits: ${exits}</span>
      </div>
    </div>
  `;
}

export function initActiveSessions() {
  // No initialization needed
}
