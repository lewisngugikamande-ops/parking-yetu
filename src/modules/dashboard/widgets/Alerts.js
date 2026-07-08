export function Alerts({ data }) {
  const alerts = data?.alerts || [];
  
  const items = alerts.length > 0
    ? alerts.map(alert => `
      <div class="alert-item alert-${alert.severity || 'low'}">
        <span class="alert-icon">⚠️</span>
        <span class="alert-message">${alert.message || 'Unknown alert'}</span>
        <span class="alert-time">${alert.time || 'just now'}</span>
      </div>
    `).join('')
    : '<div class="alert-empty">No alerts</div>';
  
  return `
    <div class="widget widget-alerts" data-widget="Alerts">
      <div class="widget-header">
        <span class="widget-icon">⚠️</span>
        <span class="widget-title">Alerts</span>
        <span class="widget-badge">${alerts.length}</span>
      </div>
      <div class="widget-body">
        ${items}
      </div>
    </div>
  `;
}

export function initAlerts() {
  // No initialization needed
}
