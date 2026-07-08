// ==========================================
// AMBIENT - Cityscape Engine
// ==========================================

class CityscapeEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.buildings = [];
    }

    init() {
        this.canvas = document.getElementById('cityCanvas');
        if (!this.canvas) {
            console.warn('Cityscape canvas not found');
            return;
        }

        this.canvas.width = window.innerWidth;
        this.canvas.height = 200;
        this.ctx = this.canvas.getContext('2d');
        
        this.generateBuildings();
        this.draw();
        
        console.log('🏙️ Cityscape Engine initialized');
    }

    generateBuildings() {
        this.buildings = [];
        const count = 40;
        const spacing = this.canvas.width / count;
        
        for (let i = 0; i < count; i++) {
            const width = 15 + Math.random() * 40;
            const height = 30 + Math.random() * 130;
            const x = i * spacing + (spacing - width) / 2;
            this.buildings.push({ x, w: width, h: height });
        }
    }

    draw() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.buildings.forEach(b => {
            // Building body
            this.ctx.fillStyle = `rgba(255,255,255,${0.04 + Math.random() * 0.06})`;
            this.ctx.fillRect(b.x, this.canvas.height - b.h, b.w, b.h);
            
            // Windows
            for (let r = 0; r < Math.floor(b.h / 15); r++) {
                for (let c = 0; c < Math.floor(b.w / 12); c++) {
                    if (Math.random() > 0.5) {
                        this.ctx.fillStyle = `rgba(255,200,100,${0.05 + Math.random() * 0.15})`;
                        this.ctx.fillRect(b.x + c * 12 + 2, this.canvas.height - b.h + r * 15 + 5, 5, 7);
                    }
                }
            }
        });
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = 200;
        this.generateBuildings();
        this.draw();
    }
}

export default new CityscapeEngine();
