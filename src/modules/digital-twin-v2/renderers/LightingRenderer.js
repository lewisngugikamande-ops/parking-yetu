class LightingRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        console.log('💡 LightingRenderer ready');
    }

    render(state) {
        if (!this.ctx) return;
        // Lighting is handled by Ambient Engine
        // This is a placeholder for dynamic lighting
    }
}

export default LightingRenderer;
