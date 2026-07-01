// ============================================
// Event Bus - Decoupled Communication (Async)
// ============================================

const listeners = {};

export const Events = {
    // Subscribe to an event
    on(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        listeners[event].push(callback);
        return () => this.off(event, callback);
    },

    // Unsubscribe from an event
    off(event, callback) {
        if (!listeners[event]) return;
        listeners[event] = listeners[event].filter(cb => cb !== callback);
    },

    // Emit an event (async)
    async emit(event, data = {}) {
        if (!listeners[event]) return;
        
        const promises = listeners[event].map(async (callback) => {
            try {
                await callback(data);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        });
        
        await Promise.allSettled(promises);
    },

    // Emit an event (sync - fire and forget)
    emitSync(event, data = {}) {
        if (!listeners[event]) return;
        listeners[event].forEach(callback => {
            try {
                queueMicrotask(() => callback(data));
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        });
    },

    // Clear all listeners for an event
    clear(event) {
        if (event) {
            delete listeners[event];
        } else {
            Object.keys(listeners).forEach(key => delete listeners[key]);
        }
    }
};

// Export convenience methods
export const emit = Events.emit.bind(Events);
export const emitSync = Events.emitSync.bind(Events);
export const on = Events.on.bind(Events);
export const off = Events.off.bind(Events);
