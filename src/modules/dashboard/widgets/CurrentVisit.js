import { endVisit } from '../../../services/api-client.js';

export function CurrentVisit({ data }) {
  const visit = data?.currentVisit;
  
  if (!visit || !visit.hasActiveVisit) {
    return `
      <div class="widget widget-current-visit" data-widget="CurrentVisit">
        <div class="widget-header">
          <span class="widget-icon">📍</span>
          <span class="widget-title">Current Visit</span>
        </div>
        <div class="widget-body">
          <div class="visit-empty">No active visit</div>
          <button class="btn-primary" onclick="window.startVisit()" style="margin-top:12px;">
            🚗 Start Visit
          </button>
        </div>
      </div>
    `;
  }
  
  const session = visit.session;
  const duration = session.duration || 0;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  
  return `
    <div class="widget widget-current-visit" data-widget="CurrentVisit">
      <div class="widget-header">
        <span class="widget-icon">📍</span>
        <span class="widget-title">Current Visit</span>
        <span class="widget-badge" style="background:var(--accent);">Active</span>
      </div>
      <div class="widget-body">
        <div class="visit-vehicle">${session.vehiclePlate || 'Unknown'}</div>
        <div class="visit-duration">⏱️ ${durationText}</div>
        <div class="visit-time">Started: ${new Date(session.entryTime).toLocaleTimeString()}</div>
        <button class="btn-danger" onclick="window.endCurrentVisit('${session.id}')" style="margin-top:12px;">
          🚪 End Visit
        </button>
      </div>
    </div>
  `;
}

export function initCurrentVisit({ data }) {
  // Add global functions for the buttons
  window.startVisit = function() {
    // Open entry modal
    import('../../workstation/entry-modal.js').then(module => {
      module.openEntryModal();
    });
  };
  
  window.endCurrentVisit = async function(sessionId) {
    try {
      await endVisit(sessionId);
      // Refresh the dashboard
      const { refreshDashboard } = await import('../index.js');
      await refreshDashboard();
      alert('✅ Visit ended successfully!');
    } catch (error) {
      alert('❌ Error ending visit: ' + error.message);
    }
  };
}
