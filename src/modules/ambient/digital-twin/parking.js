// ==========================================
// DIGITAL TWIN - Parking Renderer
// ==========================================

import eventBus from '../../../core/events.js';

class ParkingRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.parkedCars = [];
        this.spots = [];
        this.isRunning = false;
        this.isNight = false;
        this.totalSessions = 0;
        this.isInitialized = false;
        this.organizationId = 'church_a';
        this.config = {
            capacity: 10,
            maxDisplayCars: 15
        };
    }

    init(organizationId = 'church_a') {
        this.organizationId = organizationId;
        
        // Canvas should exist (created by Ambient Engine)
        this.canvas = document.getElementById('traffic-canvas');
        if (!this.canvas) {
            console.error('🅿️ traffic-canvas missing! Ambient Engine should create it.');
            return false;
        }
        
        console.log('🅿️ Canvas found, initializing...');
        
        // Set canvas dimensions
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width || window.innerWidth;
        this.canvas.height = rect.height || Math.min(window.innerHeight * 0.3, 200);
        
        this.ctx = this.canvas.getContext('2d');
        
        this.isRunning = true;
        this.checkTimeOfDay();
        this.initParkingSpots();
        this.render();
        
        // Listen for session events
        eventBus.on('session:started', (data) => {
            this.handleEntry(data);
        });

        eventBus.on('session:ended', (data) => {
            this.handleExit(data);
        });

        // Update time every minute
        setInterval(() => {
            this.checkTimeOfDay();
        }, 60000);
        
        this.isInitialized = true;
        console.log(`✅ Parking Renderer initialized with ${this.spots.length} spots`);
        return true;
    }

    initParkingSpots() {
        this.spots = [];
        this.parkedCars = [];
        const totalSpots = this.config.capacity || 10;
        
        for (let i = 1; i <= totalSpots; i++) {
            const isOccupied = Math.random() > 0.5;
            this.spots.push({
                id: i,
                occupied: isOccupied,
                vehicle: isOccupied ? `CAR-${String(i).padStart(3, '0')}` : null
            });
            if (isOccupied) {
                this.parkedCars.push({ spotId: i, vehicle: `CAR-${String(i).padStart(3, '0')}` });
            }
        }
    }

    render() {
        if (!this.isInitialized || !this.ctx) return;
        
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const lotX = width * 0.05;
        const lotY = height * 0.1;
        const lotWidth = width * 0.9;
        const lotHeight = height * 0.8;
        
        ctx.fillStyle = 'rgba(20, 20, 40, 0.3)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 2;
        ctx.fillRect(lotX, lotY, lotWidth, lotHeight);
        ctx.strokeRect(lotX, lotY, lotWidth, lotHeight);
        
        const spotsPerRow = Math.min(8, Math.floor((lotWidth - 20) / 45));
        const rows = Math.min(3, Math.floor((lotHeight - 20) / 35));
        const spotWidth = (lotWidth - 20) / spotsPerRow;
        const spotHeight = (lotHeight - 20) / rows;
        
        this.spots.forEach((spot, index) => {
            if (index >= spotsPerRow * rows) return;
            
            const row = Math.floor(index / spotsPerRow);
            const col = index % spotsPerRow;
            const x = lotX + 10 + col * spotWidth;
            const y = lotY + 10 + row * spotHeight;
            
            ctx.fillStyle = spot.occupied ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 255, 255, 0.03)';
            ctx.strokeStyle = spot.occupied ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.fillRect(x, y, spotWidth - 2, spotHeight - 2);
            ctx.strokeRect(x, y, spotWidth - 2, spotHeight - 2);
            
            if (spot.occupied) {
                const carColors = ['#4a90d9', '#e74c3c', '#f1c40f', '#2ecc71', '#e67e22', '#9b59b6'];
                const color = carColors[Math.floor(Math.random() * carColors.length)];
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.6;
                ctx.fillRect(x + 4, y + 4, spotWidth - 8, spotHeight - 8);
                ctx.globalAlpha = 1;
            }
        });
        
        const occupiedCount = this.spots.filter(s => s.occupied).length;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '12px sans-serif';
        ctx.fillText(`🅿️ ${occupiedCount}/${this.spots.length} spots occupied`, 10, 20);
    }

    checkTimeOfDay() {
        const hour = new Date().getHours();
        this.isNight = hour < 6 || hour > 18;
        this.render();
    }

    handleEntry(data) {
        console.log('🚗 Parking entry:', data);
        const emptySpot = this.spots.find(s => !s.occupied);
        if (emptySpot) {
            emptySpot.occupied = true;
            emptySpot.vehicle = data.vehicle || `CAR-${String(emptySpot.id).padStart(3, '0')}`;
            this.parkedCars.push({ spotId: emptySpot.id, vehicle: emptySpot.vehicle });
            this.render();
            return emptySpot.id;
        }
        console.warn('🅿️ No empty spots!');
        return null;
    }

    handleExit(data) {
        console.log('🚗 Parking exit:', data);
        if (this.parkedCars.length > 0) {
            const car = this.parkedCars.pop();
            const spot = this.spots.find(s => s.id === car.spotId);
            if (spot) {
                spot.occupied = false;
                spot.vehicle = null;
            }
            this.render();
        }
    }

    updateOrganization(organizationId) {
        this.organizationId = organizationId;
        this.render();
    }
}

export default new ParkingRenderer();
