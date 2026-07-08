// ==========================================
// DIGITAL TWIN - Real Traffic Engine
// ==========================================

import eventBus from '../../core/events.js';

class TrafficEngine {
    constructor() {
        this.activeSessions = 0;
        this.targetCount = 0;
        this.cars = [];
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.animationId = null;
        this.vehicleTypes = ['sedan', 'suv', 'pickup', 'minivan'];
        this.colors = ['#6C3CE1', '#00D4FF', '#00FF88', '#FF6B35', '#FF2D55', '#FFFFFF', '#4A4A5A'];
    }

    init() {
        this.canvas = document.getElementById('traffic-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'traffic-canvas';
            this.canvas.className = 'traffic-canvas';
            this.canvas.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:0;pointer-events:none;';
            document.body.prepend(this.canvas);
        }
        
        this.resize();
        this.ctx = this.canvas.getContext('2d');
        this.isRunning = true;
        
        // Listen for session updates
        eventBus.on('sessions:sync', (data) => {
            this.updateSessions(data.count);
        });
        
        // Listen for entry/exit events
        eventBus.on('session:started', () => {
            setTimeout(() => {
                this.updateSessions(this.activeSessions);
            }, 300);
        });
        
        eventBus.on('session:ended', () => {
            setTimeout(() => {
                this.updateSessions(this.activeSessions);
            }, 300);
        });
        
        // Start animation loop
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
        
        console.log('🚗 Traffic Engine initialized');
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    updateSessions(count) {
        this.activeSessions = count;
        this.targetCount = Math.min(count * 2, 150);
        // The animate loop will handle the transition
    }

    animate() {
        if (!this.isRunning) return;
        
        const ctx = this.ctx;
        if (!ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Adjust car count
        while (this.cars.length < this.targetCount) {
            this.addCar();
        }
        while (this.cars.length > this.targetCount) {
            this.cars.pop();
        }
        
        // Update and draw cars
        this.cars.forEach(car => {
            car.x += car.speed;
            
            // Wrap around
            if (car.x > this.canvas.width + 100) {
                car.x = -100;
            }
            if (car.x < -100) {
                car.x = this.canvas.width + 100;
            }
            
            this.drawCar(ctx, car);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    addCar() {
        const type = this.vehicleTypes[Math.floor(Math.random() * this.vehicleTypes.length)];
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        const lane = Math.floor(Math.random() * 3); // 0=near, 1=mid, 2=far
        
        const speeds = [1.5, 1.0, 0.6];
        const sizes = [55, 38, 24];
        const yPositions = [
            this.canvas.height - 70,
            this.canvas.height - 130,
            this.canvas.height - 180
        ];
        
        this.cars.push({
            type: type,
            color: color,
            lane: lane,
            speed: speeds[lane] * (0.7 + Math.random() * 0.6),
            size: sizes[lane] * (0.8 + Math.random() * 0.2),
            x: Math.random() * this.canvas.width,
            y: yPositions[lane] + (Math.random() - 0.5) * 10,
            direction: Math.random() > 0.5 ? 1 : -1
        });
    }

    drawCar(ctx, car) {
        const { x, y, size, color, direction, type } = car;
        const w = size * 2;
        const h = size;
        
        ctx.save();
        ctx.translate(x, y);
        
        if (direction === -1) {
            ctx.scale(-1, 1);
        }
        
        // Car body
        ctx.fillStyle = color;
        ctx.shadowColor = 'rgba(255,200,50,0.1)';
        ctx.shadowBlur = 20;
        
        // Main body
        ctx.beginPath();
        ctx.roundRect(-w/2, -h/2, w, h * 0.7, 4);
        ctx.fill();
        
        // Cabin
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.roundRect(-w/4, -h/2 - 4, w/2, h * 0.35, 3);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Wheels
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(-w/3, h/2 - 2, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w/3, h/2 - 2, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        
        // Headlight glow
        const gradient = ctx.createRadialGradient(w/2, -h/4, 2, w/2 + 20, -h/4, 40);
        gradient.addColorStop(0, 'rgba(255,200,50,0.3)');
        gradient.addColorStop(1, 'rgba(255,200,50,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(w/2, -h/4, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    destroy() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
        this.cars = [];
    }
}

// Add roundRect polyfill if needed
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (r > w/2) r = w/2;
        if (r > h/2) r = h/2;
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        return this;
    };
}

export default new TrafficEngine();
