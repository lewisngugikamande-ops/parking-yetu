// ==========================================
// CITYSCAPE ENGINE - Skyline per Theme
// ==========================================

class CityscapeEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.theme = 'church';
        this.buildingData = [];
    }

    init(theme = 'church') {
        this.theme = theme;
        this.canvas = document.getElementById('cityscape-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'cityscape-canvas';
            this.canvas.className = 'cityscape-canvas';
            this.canvas.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:200px;z-index:0;pointer-events:none;opacity:0.15;';
            document.body.prepend(this.canvas);
        }
        
        this.resize();
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = true;
        this.generateCityscape();
        this.draw();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.draw();
        });
        
        // Listen for theme changes
        window.__events?.on('theme:changed', (data) => {
            this.theme = data.theme;
            this.generateCityscape();
            this.draw();
        });
        
        console.log('🏙️ Cityscape Engine initialized');
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = 200;
        }
    }

    generateCityscape() {
        const buildings = [];
        const count = 30 + Math.floor(Math.random() * 20);
        
        for (let i = 0; i < count; i++) {
            const width = 20 + Math.random() * 60;
            const height = 30 + Math.random() * 120;
            const x = i * (this.canvas.width / count) + (Math.random() - 0.5) * 10;
            
            buildings.push({
                x: x,
                width: width,
                height: height,
                color: this.getBuildingColor(),
                hasWindows: Math.random() > 0.3,
                windows: this.generateWindows(width, height)
            });
        }
        
        this.buildingData = buildings;
    }

    getBuildingColor() {
        const colors = {
            church: ['#2a1a4e', '#3a2a5e', '#1a0a2e', '#4a3a6e'],
            airport: ['#1a3a5e', '#2a4a6e', '#0a2a4e', '#3a5a7e'],
            office: ['#2a2a4e', '#3a3a5e', '#1a1a3e', '#4a4a6e'],
            hospital: ['#2a4a3e', '#3a5a4e', '#1a3a2e', '#4a6a5e']
        };
        
        const palette = colors[this.theme] || colors.church;
        return palette[Math.floor(Math.random() * palette.length)];
    }

    generateWindows(width, height) {
        const windows = [];
        const cols = Math.floor(width / 12);
        const rows = Math.floor(height / 15);
        
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() > 0.4) {
                    windows.push({
                        x: c * 12 + 2,
                        y: r * 15 + 5,
                        lit: Math.random() > 0.5
                    });
                }
            }
        }
        return windows;
    }

    draw() {
        if (!this.ctx) return;
        
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw buildings
        this.buildingData.forEach(building => {
            // Building body
            ctx.fillStyle = building.color;
            ctx.shadowColor = 'rgba(255,255,255,0.02)';
            ctx.shadowBlur = 10;
            ctx.fillRect(building.x, this.canvas.height - building.height, building.width, building.height);
            
            // Windows
            if (building.hasWindows) {
                building.windows.forEach(window => {
                    if (window.lit) {
                        ctx.fillStyle = 'rgba(255,200,100,0.3)';
                    } else {
                        ctx.fillStyle = 'rgba(255,255,255,0.05)';
                    }
                    ctx.shadowBlur = 0;
                    ctx.fillRect(
                        building.x + window.x,
                        this.canvas.height - building.height + window.y,
                        6,
                        8
                    );
                });
            }
        });
        
        // Ground line
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255,255,255,0.02)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.height);
        ctx.lineTo(this.canvas.width, this.canvas.height);
        ctx.stroke();
    }

    setTheme(theme) {
        this.theme = theme;
        this.generateCityscape();
        this.draw();
    }

    destroy() {
        this.isRunning = false;
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
    }
}

export default new CityscapeEngine();
