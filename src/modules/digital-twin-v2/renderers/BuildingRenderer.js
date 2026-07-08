class BuildingRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.buildings = [];
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.generateBuildings();
        console.log('🏢 BuildingRenderer ready');
    }

    generateBuildings() {
        this.buildings = [];
        const colors = [
            'rgba(40, 40, 60, 0.7)',
            'rgba(50, 50, 70, 0.6)',
            'rgba(60, 60, 80, 0.5)',
            'rgba(30, 30, 50, 0.8)',
            'rgba(45, 45, 65, 0.6)',
        ];

        for (let i = 0; i < 15; i++) {
            const width = 30 + Math.random() * 40;
            const height = 60 + Math.random() * 180;
            const x = 30 + i * (45 + Math.random() * 20);
            
            this.buildings.push({
                x: x,
                width: width,
                height: height,
                color: colors[Math.floor(Math.random() * colors.length)],
                windows: Math.floor(Math.random() * 20) + 10,
                litWindows: Math.floor(Math.random() * 15) + 5,
                hasAntenna: Math.random() > 0.7,
            });
        }
    }

    render(state) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        const groundY = height * 0.85;
        
        // Draw each building
        this.buildings.forEach((building) => {
            const x = (building.x / 100) * width * 0.9 + width * 0.05;
            const y = groundY - building.height;
            const w = building.width;
            const h = building.height;
            
            ctx.fillStyle = building.color;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
            
            // Windows
            const cols = Math.floor(w / 12);
            const rows = Math.floor(h / 18);
            let litCount = 0;
            const totalSessions = state?.sessions?.length || 0;
            
            for (let row = 0; row < Math.min(rows, 8); row++) {
                for (let col = 0; col < Math.min(cols, 6); col++) {
                    const wx = x + 3 + col * 12;
                    const wy = y + 4 + row * 18;
                    // More sessions = more lit windows
                    const isLit = litCount < (building.litWindows + Math.min(totalSessions, 10));
                    litCount++;
                    
                    ctx.fillStyle = isLit ? 'rgba(255, 255, 200, 0.5)' : 'rgba(80, 80, 120, 0.2)';
                    ctx.fillRect(wx, wy, 5, 8);
                }
            }
            
            // Antenna
            if (building.hasAntenna) {
                ctx.strokeStyle = 'rgba(100, 100, 150, 0.3)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + w/2, y);
                ctx.lineTo(x + w/2, y - 10 - Math.random() * 15);
                ctx.stroke();
                
                ctx.fillStyle = 'rgba(255, 50, 50, 0.3)';
                ctx.beginPath();
                ctx.arc(x + w/2, y - 10 - Math.random() * 15, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
}

export default BuildingRenderer;
