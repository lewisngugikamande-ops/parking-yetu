// ==========================================
// CAPABILITY - Base Capability Class
// ==========================================

export class Capability {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.version = config.version || '1.0.0';
        this.isInitialized = false;
        this.isShutdown = false;
        this._state = {};
    }

    // Lifecycle
    async initialize() {
        if (this.isInitialized) return;
        console.log(`🔧 Capability "${this.id}" initializing...`);
        await this.onInitialize();
        this.isInitialized = true;
        console.log(`✅ Capability "${this.id}" initialized`);
        return this;
    }

    async shutdown() {
        if (this.isShutdown) return;
        console.log(`🔧 Capability "${this.id}" shutting down...`);
        await this.onShutdown();
        this.isShutdown = true;
        this.isInitialized = false;
        console.log(`✅ Capability "${this.id}" shut down`);
        return this;
    }

    // Hooks (override in child classes)
    async onInitialize() {}
    async onShutdown() {}

    // Helpers
    getState(key, defaultValue = null) {
        return this._state[key] ?? defaultValue;
    }

    setState(key, value) {
        this._state[key] = value;
        return this;
    }

    emit(event, data) {
        if (window.__events) {
            window.__events.emit(event, data);
        }
        return this;
    }

    onEvent(event, handler) {
        if (window.__events) {
            const unsubscribe = window.__events.on(event, handler);
            return unsubscribe;
        }
        return null;
    }
}

export default Capability;
