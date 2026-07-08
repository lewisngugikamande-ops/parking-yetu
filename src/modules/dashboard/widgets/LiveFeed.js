export function LiveFeed({ data }) {
  const activities = data?.activities || [];
  
  const items = activities.length > 0 
    ? activities.map(item => `
      <div class="feed-item ${item.type || 'entry'}">
        <span class="feed-icon">${item.type === 'exit' ? '🔴' : '🟢'}</span>
        <span class="feed-plate">${item.plate || 'Unknown'}</span>
        <span class="feed-action">${item.type === 'exit' ? 'exited' : 'entered'}</span>
        <span class="feed-time">${item.time || 'just now'}</span>
      </div>
    `).join('')
    : '<div class="feed-empty">No recent activity</div>';
  
  return `
    <div class="widget widget-feed" data-widget="LiveFeed">
      <div class="widget-header">
        <span class="widget-icon">📋</span>
        <span class="widget-title">Live Feed</span>
      </div>
      <div class="widget-body">
        ${items}
      </div>
    </div>
  `;
}

export function initLiveFeed() {
  // Auto-refresh handled by dashboard
}
