// ==========================================
// CAPABILITY REGISTRY - Manage capabilities
// ==========================================

const capabilities = new Map();

export function registerCapability(capability) {
    if (capabilities.has(capability.id)) {
        console.warn(`⚠️ Capability "${capability.id}" already registered`);
        return;
    }
    capabilities.set(capability.id, capability);
    console.log(`📦 Capability registered: "${capability.id}"`);
    return capability;
}

export function getCapability(id) {
    return capabilities.get(id) || null;
}

export function getCapabilities() {
    return Array.from(capabilities.values());
}

export function getCapabilityList() {
    return Array.from(capabilities.keys());
}

export function hasCapability(id) {
    return capabilities.has(id);
}

export async function initializeAllCapabilities() {
    const results = [];
    for (const [id, cap] of capabilities) {
        try {
            await cap.initialize();
            results.push({ id, success: true });
        } catch (error) {
            console.error(`❌ Failed to initialize capability "${id}":`, error);
            results.push({ id, success: false, error });
        }
    }
    return results;
}

export async function shutdownAllCapabilities() {
    const results = [];
    for (const [id, cap] of capabilities) {
        try {
            await cap.shutdown();
            results.push({ id, success: true });
        } catch (error) {
            console.error(`❌ Failed to shutdown capability "${id}":`, error);
            results.push({ id, success: false, error });
        }
    }
    return results;
}

if (typeof window !== 'undefined') {
    window.__capabilities = {
        registerCapability,
        getCapability,
        getCapabilities,
        getCapabilityList,
        initializeAllCapabilities,
        shutdownAllCapabilities
    };
}
