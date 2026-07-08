// ==========================================
// BUILDINGS ENGINE - Full Width Edge to Edge (with debug)
// ==========================================

import eventBus from '../../../core/events.js';

class BuildingsEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.buildings = [];
        this.isInitialized = false;
        this.organizationId = 'church_a';
        this.isNight = false;
        this.totalSessions = 0;
        this.theme = 'church';
        this.retryCount = 0;
        this.maxRetries = 10;
    }

    init(organizationId = 'church_a', theme = 'church') {
        this.organizationId = organizationId;
        this.theme = theme;
        
        // Try to find canvas
        this.canvas = document.getElementById('cityscape-canvas');
        if (!this.canvas) {
            console.warn('🏢 Cityscape canvas not found, retrying...');
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                setTimeout(() => this.init(organizationId, theme), 500);
            } else {
                console.error('🏢 Cityscape canvas not found after max retries');
                this.isInitialized = false;
                return false;
            }
            return false;
        }
        
        console.log('🏢 Cityscape canvas found!');
        console.log('📐 Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        this.retryCount = 0;

        // Set canvas to FULL SCREEN width
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.min(window.innerHeight * 0.5, 400);
        this.canvas.style.width = '100%';
        this.canvas.style.display = 'block';
        this.canvas.style.opacity = '0.4';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.position = 'fixed';
        this.canvas.style.bottom = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '0';
        
        this.ctx = this.canvas.getContext('2d');
        console.log('📐 Canvas dimensions after resize:', this.canvas.width, 'x', this.canvas.height);
        
        this.checkTimeOfDay();
        this.generateBuildings();
        console.log('🏢 Generated', this.buildings.length, 'buildings');
        this.render();
        console.log('🏢 Render complete');
        
        eventBus.on('session:started', (data) => {
            this.totalSessions++;
            this.reactToEntry(data);
        });

        eventBus.on('session:ended', (data) => {
            this.totalSessions = Math.max(0, this.totalSessions - 1);
            this.reactToExit(data);
        });

        setInterval(() => {
            this.checkTimeOfDay();
        }, 60000);

        window.addEventListener('resize', () => {
            this.resize();
        });

        this.isInitialized = true;
        console.log('🏢 Buildings Engine initialized with theme:', this.theme);
        return true;
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
                id: i,
                x: x,
                width: width,
                height: height,
                color: colors[Math.floor(Math.random() * colors.length)],
                windows: Math.floor(Math.random() * 20) + 10,
                litWindows: Math.floor(Math.random() * 15) + 5,
                hasAntenna: Math.random() > 0.7,
            });
        }
        
        // Debug first building
        if (this.buildings.length > 0) {
            console.log('🏢 First building:', this.buildings[0]);
        }
    }

    render() {
        if (!this.isInitialized || !this.ctx) {
            console.warn('🏢 Render called but not initialized');
            return;
        }
        
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        console.log('🏢 Rendering:', width, 'x', height, 'with', this.buildings.length, 'buildings');
        
        // Clear canvas with RED to see if it's working
        ctx.fillStyle = 'rgba(20, 20, 40, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw a red rectangle to verify canvas is working
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fillRect(10, 10, 50, 50);
        
        // Ground
        const groundY = height * 0.85;
        ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
        ctx.fillRect(0, groundY, width, height - groundY);
        
        // Draw each building
        this.buildings.forEach((building, index) => {
            const x = (building.x / 100) * width * 0.9 + width * 0.05;
            const y = groundY - building.height;
            const w = building.width;
            const h = building.height;
            
            // Debug first building
            if (index === 0) {
                console.log('🏢 Building 0:', { x, y, w, h, groundY, buildingHeight: building.height });
            }
            
            ctx.fillStyle = building.color;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
            
            // Windows
            const cols = Math.floor(w / 12);
            const rows = Math.floor(h / 18);
            let litCount = 0;
            
            for (let row = 0; row < Math.min(rows, 8); row++) {
                for (let col = 0; col < Math.min(cols, 6); col++) {
                    const wx = x + 3 + col * 12;
                    const wy = y + 4 + row * 18;
                    const isLit = litCount < building.litWindows;
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

    checkTimeOfDay() {
        const hour = new Date().getHours();
        this.isNight = hour < 6 || hour > 18;
    }

    setTheme(theme) {
        this.theme = theme;
        this.render();
    }

    reactToEntry(data) {
        console.log('🪟 Reacting to entry:', data);
        this.buildings.forEach((building) => {
            building.litWindows = Math.min(building.litWindows + 3, building.windows);
        });
        this.render();
    }

    reactToExit(data) {
        console.log('🪟 Reacting to exit:', data);
        this.buildings.forEach((building) => {
            building.litWindows = Math.max(building.litWindows - 2, 0);
        });
        this.render();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.min(window.innerHeight * 0.5, 400);
        this.render();
    }
}

export default new BuildingsEngine();
