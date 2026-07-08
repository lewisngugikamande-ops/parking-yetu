// ==========================================
// APPLICATION - Base Application Class
// ==========================================

export class Application {
    constructor(config = {}) {
        this.id = config.id || 'app_' + Date.now();
        this.name = config.name || 'Unnamed App';
        this.version = config.version || '1.0.0';
        this.container = null;
        this.isMounted = false;
        this._listeners = [];
        this._intervals = [];
        this._timeouts = [];
        console.log(`📦 App initialized: ${this.name} (${this.id})`);
    }
    
    mount(container) {
        console.group(`🔧 mount() called for "${this.name}"`);
        console.log('Container:', container);
        console.log('Container type:', typeof container);
        console.log('Container is null?', container === null);
        console.log('Container is undefined?', container === undefined);
        console.log('Previous isMounted:', this.isMounted);
        console.trace('Mount call stack');
        
        if (this.isMounted) {
            console.warn(`⚠️ App "${this.name}" is already mounted`);
            console.groupEnd();
            return;
        }
        
        // Set container and mounted state BEFORE calling onMount
        this.container = container;
        this.isMounted = true;
        
        console.log('After setting - container:', this.container);
        console.log('After setting - isMounted:', this.isMounted);
        
        // Now call onMount (which can safely call render)
        this.onMount();
        
        console.log(`✅ App mounted: "${this.name}"`);
        console.groupEnd();
    }
    
    unmount() {
        if (!this.isMounted) {
            console.warn(`⚠️ App "${this.name}" is not mounted`);
            return;
        }
        
        this.onUnmount();
        this._cleanup();
        this.container = null;
        this.isMounted = false;
        console.log(`🔄 App unmounted: "${this.name}"`);
    }
    
    // Override these in child classes
    onMount() {
        console.log(`📌 App "${this.name}" onMount() not implemented`);
    }
    
    onUnmount() {
        console.log(`📌 App "${this.name}" onUnmount() not implemented`);
    }
    
    // Rendering
    render(html) {
        console.group(`🎨 render() called for "${this.name}"`);
        console.log('isMounted:', this.isMounted);
        console.log('container:', this.container);
        console.log('container is null?', this.container === null);
        console.trace('Render call stack');
        
        if (!this.container) {
            console.warn(`⚠️ Cannot render: App "${this.name}" not mounted`);
            console.groupEnd();
            return;
        }
        
        console.log('Setting HTML...');
        this.container.innerHTML = html;
        this._bindEvents();
        this._applyAnimation();
        console.log('✅ Render complete');
        console.groupEnd();
    }
    
    find(selector) {
        if (!this.container) return null;
        return this.container.querySelector(selector);
    }
    
    findAll(selector) {
        if (!this.container) return [];
        return this.container.querySelectorAll(selector);
    }
    
    // Event handling
    on(element, event, handler) {
        if (!element) return;
        element.addEventListener(event, handler);
        this._listeners.push({ element, event, handler });
    }
    
    off(element, event, handler) {
        if (!element) return;
        element.removeEventListener(event, handler);
        this._listeners = this._listeners.filter(
            l => !(l.element === element && l.event === event && l.handler === handler)
        );
    }
    
    // Timing
    setInterval(fn, ms) {
        const id = setInterval(fn, ms);
        this._intervals.push(id);
        return id;
    }
    
    setTimeout(fn, ms) {
        const id = setTimeout(fn, ms);
        this._timeouts.push(id);
        return id;
    }
    
    // Cleanup
    _cleanup() {
        this._listeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this._listeners = [];
        
        this._intervals.forEach(id => clearInterval(id));
        this._intervals = [];
        
        this._timeouts.forEach(id => clearTimeout(id));
        this._timeouts = [];
        
        console.log(`🧹 Cleaned up app: "${this.name}"`);
    }
    
    _bindEvents() {
        // Override in child classes if needed
    }
    
    _applyAnimation() {
        if (this.container) {
            this.container.classList.add('fade-in');
        }
    }
}

export default Application;
