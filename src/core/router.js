// ============================================
// Router & Route Protection
// ============================================

import { hasSession, getSession } from './session.js';
import { hasPermission } from './permissions.js';
import { getState } from './store.js';

const routes = {
    '/': { module: 'workstation', permission: null, label: 'Workstation' },
    '/workstation': { module: 'workstation', permission: null, label: 'Workstation' },
    '/entry': { module: 'workstation', permission: null, label: 'Entry' },
    '/security': { module: 'workstation', permission: null, label: 'Security' },
    '/admin': { module: 'admin', permission: 'canCreateUsers', label: 'Admin' },
    '/reports': { module: 'reports', permission: 'canViewReports', label: 'Reports' },
    '/settings': { module: 'settings', permission: 'canManageSettings', label: 'Settings' },
    '/vehicles': { module: 'vehicles', permission: null, label: 'Vehicles' }
};

let currentRoute = null;

export function getRoute(route) {
    return routes[route] || routes['/'];
}

export function navigateTo(route) {
    if (!requireAuth(route)) return;
    if (!requirePermission(route)) return;
    
    const routeConfig = getRoute(route);
    if (routeConfig) {
        currentRoute = route;
        loadModule(routeConfig.module);
    }
}

export function requireAuth(route) {
    if (!hasSession()) {
        showLogin();
        return false;
    }
    return true;
}

export function requirePermission(route) {
    const routeConfig = getRoute(route);
    if (routeConfig && routeConfig.permission) {
        if (!hasPermission(routeConfig.permission)) {
            showAccessDenied();
            return false;
        }
    }
    return true;
}

export function getCurrentRoute() {
    return currentRoute;
}

function showLogin() {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
    const app = document.getElementById('app');
    if (app) app.innerHTML = '';
}

function showAccessDenied() {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;min-height:50vh;">
                <div style="text-align:center;color:var(--text-secondary);">
                    <div style="font-size:48px;margin-bottom:16px;">🚫</div>
                    <h2 style="margin-bottom:8px;">Access Denied</h2>
                    <p>You don't have permission to view this page.</p>
                    <button onclick="window.navigateTo('/')" class="btn-primary" style="margin-top:16px;max-width:200px;">
                        Back to Workstation
                    </button>
                </div>
            </div>
        `;
    }
}

async function loadModule(moduleName) {
    const app = document.getElementById('app');
    if (!app) return;

    try {
        // Show loading
        app.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;min-height:50vh;">
                <div style="text-align:center;">
                    <div class="spinner"></div>
                    <p style="margin-top:12px;color:var(--text-muted);">Loading...</p>
                </div>
            </div>
        `;

        // Load module dynamically
        const module = await import(`../modules/${moduleName}/index.js`);
        if (module.default) {
            module.default();
        }
    } catch (error) {
        console.error(`Failed to load module: ${moduleName}`, error);
        app.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;min-height:50vh;">
                <div style="text-align:center;color:var(--text-secondary);">
                    <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
                    <h2 style="margin-bottom:8px;">Could not load module</h2>
                    <p style="font-size:14px;color:var(--text-muted);">${error.message}</p>
                </div>
            </div>
        `;
    }
}

// Make navigateTo available globally
window.navigateTo = navigateTo;
