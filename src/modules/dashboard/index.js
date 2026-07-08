import { dashboardConfig } from '../../config/dashboard.js';
import { getCurrentUser } from '../../platform/auth.js';
import { fetchDashboardData, getDashboardData } from './data.js';
import * as widgets from './widgets/index.js';

let currentConfig = null;
let refreshInterval = null;

export async function renderDashboard() {
  const user = getCurrentUser();
  const role = user?.role || 'member';
  const config = dashboardConfig[role] || dashboardConfig.member;
  currentConfig = config;
  
  const container = document.getElementById('dashboard');
  if (!container) return;
  
  // Fetch fresh data
  await fetchDashboardData();
  const data = getDashboardData();
  
  // Get user display name
  const displayName = user?.subject || user?.username || 'User';
  
  let html = `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>${config.name}</h2>
        <div class="user-badge">
          <span>👤</span>
          <span>${displayName}</span>
        </div>
      </div>
      <div class="dashboard-grid">
  `;
  
  config.widgets.forEach(widgetName => {
    const widget = widgets[widgetName];
    if (widget && typeof widget === 'function') {
      html += widget({ data, user });
    } else if (widget && widget.default) {
      html += widget.default({ data, user });
    }
  });
  
  html += `
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  
  // Initialize each widget
  config.widgets.forEach(widgetName => {
    const widget = widgets[widgetName];
    const initFn = widget?.init || widget?.default?.init;
    if (typeof initFn === 'function') {
      initFn({ data, user });
    }
  });
  
  // Auto-refresh every 30 seconds
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  refreshInterval = setInterval(() => {
    refreshDashboard();
  }, 30000);
}

export async function refreshDashboard() {
  await fetchDashboardData();
  const data = getDashboardData();
  const user = getCurrentUser();
  const config = currentConfig || dashboardConfig.member;
  
  // Re-render the dashboard
  renderDashboard();
}

export function destroyDashboard() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}
