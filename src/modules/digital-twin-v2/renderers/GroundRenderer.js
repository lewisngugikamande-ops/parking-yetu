class GroundRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        console.log('🌍 GroundRenderer ready');
    }

    render(state) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Draw ground at the bottom
        const groundY = height * 0.85;
        ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
        ctx.fillRect(0, groundY, width, height - groundY);
        
        // Draw road
        const roadY = groundY + (height - groundY) * 0.1;
        ctx.fillStyle = 'rgba(30, 30, 50, 0.2)';
        ctx.fillRect(0, roadY, width, (height - groundY) * 0.3);
        
        // Road lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 15]);
        ctx.beginPath();
        ctx.moveTo(0, roadY + (height - groundY) * 0.15);
        ctx.lineTo(width, roadY + (height - groundY) * 0.15);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

export default GroundRenderer;
