import { renderDashboard } from '../dashboard/index.js';

export function renderWorkstation(app) {
    // NO NAVIGATION - Router handles everything
    app.innerHTML = `
        <div id="dashboard" style="padding:10px;"></div>
    `;
    renderDashboard();
}
