export function MyHistory({ data }) {
  const history = data?.history || [];
  
  if (history.length === 0) {
    return `
      <div class="widget widget-history" data-widget="MyHistory">
        <div class="widget-header">
          <span class="widget-icon">📜</span>
          <span class="widget-title">My History</span>
        </div>
        <div class="widget-body">
          <div class="history-empty">No visits yet</div>
        </div>
      </div>
    `;
  }
  
  const items = history.map(visit => {
    const hours = Math.floor(visit.duration / 60);
    const minutes = visit.duration % 60;
    const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    const date = new Date(visit.entryTime).toLocaleDateString();
    const time = new Date(visit.entryTime).toLocaleTimeString();
    
    return `
      <div class="history-item">
        <span class="history-plate">${visit.vehiclePlate}</span>
        <span class="history-date">${date}</span>
        <span class="history-time">${time}</span>
        <span class="history-duration">${durationText}</span>
      </div>
    `;
  }).join('');
  
  return `
    <div class="widget widget-history" data-widget="MyHistory">
      <div class="widget-header">
        <span class="widget-icon">📜</span>
        <span class="widget-title">My History</span>
        <span class="widget-badge">${history.length}</span>
      </div>
      <div class="widget-body">
        ${items}
      </div>
    </div>
  `;
}
