class SkyRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        console.log('🌤️ SkyRenderer ready');
    }

    render(state) {
        if (!this.ctx) return;
        // Sky is rendered by Ambient Engine
        // This is a placeholder for future enhancements
    }
}

export default SkyRenderer;
