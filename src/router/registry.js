// ==========================================
// REGISTRY - Application Registry
// ==========================================

const appRegistry = new Map();

export function registerApp(id, config) {
    if (appRegistry.has(id)) {
        console.warn(`⚠️ App "${id}" already registered, overwriting`);
    }
    appRegistry.set(id, {
        id,
        ...config,
        registeredAt: new Date().toISOString()
    });
    console.log(`📝 App registered: "${id}"`);
    return true;
}

export function getApp(id) {
    return appRegistry.get(id) || null;
}

export function getAppList() {
    return Array.from(appRegistry.keys());
}

export function hasApp(id) {
    return appRegistry.has(id);
}

export function getAllApps() {
    return Array.from(appRegistry.entries()).map(([id, config]) => ({
        id,
        ...config
    }));
}

export function unregisterApp(id) {
    if (!appRegistry.has(id)) return false;
    appRegistry.delete(id);
    console.log(`🗑️ App unregistered: "${id}"`);
    return true;
}
