// ==========================================
// ROUTER - Main Export
// ==========================================

import { registerApp, getApp, getAppList, hasApp, getAllApps } from './registry.js';
import { initRouter, resolveRoute, navigateTo, mountApp, getCurrentApp, addRoute, getCurrentAppInstance } from './router.js';
import { goToScanner, goToWorkstation, goToManagement, goToAdmin, goToOrgAdmin, createNavButtons } from './navigation.js';

// Import app initializers
import { initAccessPortal } from '../apps/access-portal/index.js';
import { initWorkstation } from '../modules/workstation/index.js';
import { initAdminApp } from '../apps/admin/index.js';
import { initOrgAdmin } from '../apps/org-admin/index.js';

// Register apps
registerApp('workstation', {
    name: 'Workstation',
    description: 'Main parking operations',
    init: initWorkstation,
    requiresAuth: true,
    roles: ['user', 'guard', 'manager', 'admin']
});

registerApp('access-portal', {
    name: 'Access Portal',
    description: 'Complete access journey',
    init: initAccessPortal,
    requiresAuth: false,
    roles: []
});

registerApp('admin', {
    name: 'Admin',
    description: 'System administration and QR generation',
    init: initAdminApp,
    requiresAuth: true,
    roles: ['admin']
});

registerApp('org-admin', {
    name: 'Organization Admin',
    description: 'Per-organization administration',
    init: initOrgAdmin,
    requiresAuth: true,
    roles: ['admin', 'manager']
});

// Add routes
addRoute('/', 'workstation');
addRoute('/access', 'access-portal');
addRoute('/scan', 'access-portal');
addRoute('/admin', 'admin');
addRoute('/org-admin', 'org-admin');

// Expose for debugging
if (typeof window !== 'undefined') {
    window.__router = {
        registerApp,
        getApp,
        getAppList,
        hasApp,
        getAllApps,
        initRouter,
        resolveRoute,
        navigateTo,
        mountApp,
        getCurrentApp,
        getCurrentAppInstance,
        addRoute,
        goToScanner,
        goToWorkstation,
        goToManagement,
        goToAdmin,
        goToOrgAdmin,
        createNavButtons,
        switchToApp: function(appId) {
            const app = getApp(appId);
            if (app) {
                mountApp(appId);
                return true;
            }
            console.warn('⚠️ App "' + appId + '" not found');
            return false;
        }
    };
    console.log('🗺️ Router exposed to window');
}

// Export everything
export {
    registerApp,
    getApp,
    getAppList,
    hasApp,
    getAllApps,
    initRouter,
    resolveRoute,
    navigateTo,
    mountApp,
    getCurrentApp,
    getCurrentAppInstance,
    addRoute,
    goToScanner,
    goToWorkstation,
    goToManagement,
    goToAdmin,
    goToOrgAdmin,
    createNavButtons
};

export default {
    registerApp,
    getApp,
    getAppList,
    hasApp,
    getAllApps,
    initRouter,
    resolveRoute,
    navigateTo,
    mountApp,
    getCurrentApp,
    getCurrentAppInstance,
    addRoute,
    goToScanner,
    goToWorkstation,
    goToManagement,
    goToAdmin,
    goToOrgAdmin,
    createNavButtons
};

// Expose router to window for debugging
if (typeof window !== 'undefined') {
    window.__router = {
        getCurrentApp: () => currentApp,
        getAppList: () => getAppList(),
        navigateTo: navigateTo,
        mountApp: mountApp,
        getCurrentAppInstance: getCurrentAppInstance
    };
    console.log('🗺️ Router exposed as window.__router');
}
