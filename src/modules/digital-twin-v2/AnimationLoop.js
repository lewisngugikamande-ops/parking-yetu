class AnimationLoop {
    constructor() {
        this.running = false;
        this.animationId = null;
        this.renderFn = null;
    }

    start(renderFn) {
        if (this.running) return;
        this.running = true;
        this.renderFn = renderFn;
        this.loop();
    }

    loop() {
        if (!this.running) return;
        
        if (this.renderFn) {
            this.renderFn();
        }
        
        this.animationId = requestAnimationFrame(() => this.loop());
    }

    stop() {
        this.running = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

export default AnimationLoop;
