// ==========================================
// WORKFLOW - Base Workflow Class
// ==========================================

export class Workflow {
    constructor(config) {
        this.id = config.id;
        this.name = config.name;
        this.version = config.version || '1.0.0';
        this.states = config.states || {};
        this.initialState = config.initialState || 'idle';
        this.currentState = this.initialState;
        this.context = {};
        this.history = [];
        this.listeners = [];
        this.isComplete = false;
        this.isCancelled = false;
    }

    // ==========================================
    // LIFECYCLE METHODS
    // ==========================================

    start(data = {}) {
        console.log(`🔄 Workflow "${this.id}" starting...`);
        this.context = { ...this.context, ...data };
        this.currentState = this.initialState;
        this.isComplete = false;
        this.isCancelled = false;
        this._notify(this.currentState, this.context);
        return this;
    }

    async next(action, data = {}) {
        if (this.isComplete) {
            console.warn(`⚠️ Workflow "${this.id}" is already complete`);
            return this;
        }
        if (this.isCancelled) {
            console.warn(`⚠️ Workflow "${this.id}" was cancelled`);
            return this;
        }

        const previous = this.currentState;
        const transition = this._getTransition(previous, action);
        
        if (!transition) {
            console.warn(`⚠️ No transition from "${previous}" with action "${action}"`);
            return this;
        }

        console.log(`🔄 Workflow "${this.id}": ${previous} --${action}--> ${transition.target}`);
        
        // Save history
        this.history.push({
            from: previous,
            to: transition.target,
            action,
            data,
            timestamp: new Date().toISOString()
        });

        // Update state
        this.currentState = transition.target;
        this.context = { ...this.context, ...data };

        // Execute transition handler
        if (transition.handler) {
            await transition.handler(this.context);
        }

        // Check if complete
        if (transition.target === this.states.COMPLETE) {
            this.isComplete = true;
        }

        this._notify(this.currentState, this.context);
        return this;
    }

    cancel() {
        if (this.isComplete) {
            console.warn(`⚠️ Workflow "${this.id}" is already complete`);
            return this;
        }
        console.log(`🔄 Workflow "${this.id}" cancelled`);
        this.isCancelled = true;
        this._notify('cancelled', this.context);
        return this;
    }

    reset() {
        console.log(`🔄 Workflow "${this.id}" reset`);
        this.currentState = this.initialState;
        this.context = {};
        this.history = [];
        this.isComplete = false;
        this.isCancelled = false;
        this._notify(this.currentState, this.context);
        return this;
    }

    // ==========================================
    // ABSTRACT METHODS (override)
    // ==========================================

    _getTransition(state, action) {
        // Override in child class
        return null;
    }

    // ==========================================
    // HELPERS
    // ==========================================

    getState() {
        return this.currentState;
    }

    getContext() {
        return { ...this.context };
    }

    getHistory() {
        return [...this.history];
    }

    isInState(state) {
        return this.currentState === state;
    }

    getProgress() {
        const states = Object.values(this.states);
        const index = states.indexOf(this.currentState);
        return index >= 0 ? (index / (states.length - 1)) * 100 : 0;
    }

    // ==========================================
    // EVENTS
    // ==========================================

    onStateChange(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    _notify(state, context) {
        this.listeners.forEach(listener => {
            try {
                listener(state, context);
            } catch (e) {
                console.error('Workflow listener error:', e);
            }
        });
    }

    // ==========================================
    // SERIALIZATION
    // ==========================================

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            currentState: this.currentState,
            context: this.context,
            history: this.history.slice(-20),
            isComplete: this.isComplete,
            isCancelled: this.isCancelled,
            progress: this.getProgress()
        };
    }
}

export default Workflow;
