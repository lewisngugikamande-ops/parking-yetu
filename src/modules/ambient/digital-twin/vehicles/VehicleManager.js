// ==========================================
// VEHICLE MANAGER - Animated Cars
// ==========================================

import eventBus from '../../../../core/events.js';

class VehicleManager {
    constructor() {
        this.vehicles = [];
        this.animationId = null;
        this.isRunning = false;
        this.canvas = null;
        this.ctx = null;
        this.speed = 0.5;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        console.log('🚗 VehicleManager initialized');
        
        // Listen for session events
        eventBus.on('session:started', (data) => {
            this.addVehicle(data);
        });

        eventBus.on('session:ended', (data) => {
            this.removeVehicle(data);
        });

        this.isRunning = true;
        this.animate();
    }

    addVehicle(data) {
        const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#e67e22', '#9b59b6'];
        
        this.vehicles.push({
            id: data.vehicle || `CAR-${Date.now()}`,
            x: -50 - Math.random() * 100,
            y: this.canvas.height * (0.5 + Math.random() * 0.3),
            width: 40 + Math.random() * 20,
            height: 20 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: this.speed + Math.random() * 0.3,
            direction: 1,
            entered: false,
            parkingSpot: null
        });
        
        console.log('🚗 Vehicle added:', this.vehicles.length);
    }

    removeVehicle(data) {
        const index = this.vehicles.findIndex(v => v.id === data.vehicle);
        if (index !== -1) {
            this.vehicles.splice(index, 1);
            console.log('🚗 Vehicle removed:', this.vehicles.length);
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    update() {
        const width = this.canvas.width;
        
        this.vehicles.forEach(vehicle => {
            vehicle.x += vehicle.speed * vehicle.direction;
            
            // Wrap around
            if (vehicle.x > width + 50) {
                vehicle.x = -50;
            }
        });
    }

    render() {
        if (!this.ctx) return;
        
        const ctx = this.ctx;
        const height = this.canvas.height;
        
        this.vehicles.forEach(vehicle => {
            const x = vehicle.x;
            const y = vehicle.y;
            const w = vehicle.width;
            const h = vehicle.height;
            
            // Car body
            ctx.fillStyle = vehicle.color;
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 4);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Windshield
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(x + 4, y + 3, w * 0.25, h * 0.4);
            ctx.fillRect(x + w - 4 - w * 0.25, y + 3, w * 0.25, h * 0.4);
            
            // Headlights
            ctx.fillStyle = 'rgba(255,255,200,0.3)';
            ctx.fillRect(x + w - 2, y + 3, 3, 4);
            ctx.fillRect(x + w - 2, y + h - 7, 3, 4);
            
            // Taillights
            ctx.fillStyle = 'rgba(255,0,0,0.2)';
            ctx.fillRect(x, y + 3, 3, 4);
            ctx.fillRect(x, y + h - 7, 3, 4);
        });
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Polyfill roundRect if needed
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

export default new VehicleManager();
