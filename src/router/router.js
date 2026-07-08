// ==========================================
// ROUTER - Core Router
// ==========================================

import { getApp, getAppList } from './registry.js';

let currentApp = null;
let container = null;
let routes = new Map();
let currentAppInstance = null;
let popStateHandler = null;

export function initRouter(containerElement) {
    container = containerElement;
    console.log('🗺️ Router initialized');
    
    // Handle browser back/forward
    popStateHandler = () => {
        const path = window.location.pathname || '/';
        handleRoute(path);
    };
    window.addEventListener('popstate', popStateHandler);
    
    const initialPath = window.location.pathname || '/';
    handleRoute(initialPath);
    
    // Return cleanup function
    return function cleanup() {
        console.log('🗺️ Cleaning up router...');
        if (popStateHandler) {
            window.removeEventListener('popstate', popStateHandler);
            popStateHandler = null;
        }
        // Unmount current app
        if (currentAppInstance && currentAppInstance.unmount) {
            currentAppInstance.unmount();
            currentAppInstance = null;
        }
        currentApp = null;
        container = null;
        console.log('🗺️ Router cleaned up');
    };
}

export function addRoute(path, appId) {
    routes.set(path, appId);
    console.log('🗺️ Route added: "' + path + '" -> "' + appId + '"');
    return true;
}

export function resolveRoute(path) {
    const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';
    
    if (routes.has(cleanPath)) {
        return routes.get(cleanPath);
    }
    
    for (const [route, appId] of routes) {
        if (route.includes('*')) {
            const pattern = new RegExp('^' + route.replace(/\*/g, '.*') + '$');
            if (pattern.test(cleanPath)) {
                return appId;
            }
        }
    }
    
    return routes.get('/') || 'workstation';
}

export function navigateTo(path, pushState = true) {
    if (pushState) {
        window.history.pushState(null, '', path);
    }
    handleRoute(path);
    return true;
}

export function mountApp(appId) {
    const appConfig = getApp(appId);
    if (!appConfig) {
        console.error('❌ App "' + appId + '" not found in registry');
        return false;
    }
    
    if (currentAppInstance && currentAppInstance.unmount) {
        currentAppInstance.unmount();
        currentAppInstance = null;
    }
    
    if (appConfig.init && typeof appConfig.init === 'function') {
        currentAppInstance = appConfig.init(container);
        currentApp = appId;
        console.log('🗺️ App mounted: "' + appId + '"');
        return true;
    } else {
        console.error('❌ App "' + appId + '" has no init function');
        return false;
    }
}

export function getCurrentApp() {
    return currentApp;
}

export function getCurrentAppInstance() {
    return currentAppInstance;
}

function handleRoute(path) {
    const appId = resolveRoute(path);
    const appConfig = getApp(appId);
    
    if (!appConfig) {
        console.warn('⚠️ No app found for path "' + path + '", using default');
        mountApp('workstation');
        return;
    }
    
    mountApp(appId);
}
