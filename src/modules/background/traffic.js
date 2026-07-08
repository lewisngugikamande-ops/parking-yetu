// ==========================================
// CINEMATIC TRAFFIC SYSTEM
// ==========================================

const CAR_TYPES = ['sedan', 'suv', 'sports', 'truck'];
const CAR_COLORS = [
    '#6C3CE1', // Primary
    '#00D4FF', // Secondary
    '#00FF88', // Accent
    '#FF6B35', // Warning
    '#FF2D55', // Danger
    '#FFFFFF', // White
    '#4A4A5A', // Dark
];

class TrafficSystem {
    constructor() {
        this.container = null;
        this.cars = [];
        this.isRunning = false;
        this.sessionCount = 0;
        this.spawnInterval = null;
    }

    init() {
        this.container = document.querySelector('.traffic-container');
        if (!this.container) {
            console.warn('Traffic container not found');
            return;
        }
        
        this.isRunning = true;
        this.spawnInitialCars();
        this.startSpawnLoop();
    }

    spawnInitialCars() {
        const count = 8 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.spawnCar(), i * 300);
        }
    }

    spawnCar() {
        if (!this.isRunning) return;
        
        const lane = this.getLane();
        const carType = CAR_TYPES[Math.floor(Math.random() * CAR_TYPES.length)];
        const color = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
        const direction = Math.random() > 0.5 ? 'right' : 'left';
        
        const car = document.createElement('div');
        car.className = `car car-${direction}`;
        car.style.setProperty('--car-color', color);
        
        // Use inline SVG instead of fetch for reliability
        const svgContent = this.getCarSVG(carType, color);
        car.innerHTML = svgContent;
        
        // Randomize size slightly
        const sizeVariation = 0.85 + Math.random() * 0.3;
        car.style.transform = `scale(${sizeVariation})`;
        
        // Position in lane
        const laneWidth = this.container.offsetWidth || window.innerWidth;
        const startX = Math.random() * laneWidth;
        car.style.left = `${startX}px`;
        
        // Add to lane
        const laneElement = this.container.querySelector(`.${lane}`);
        if (laneElement) {
            laneElement.appendChild(car);
        }
        
        // Remove after animation completes
        const duration = 18 + Math.random() * 10;
        setTimeout(() => {
            if (car.parentNode) {
                car.remove();
            }
        }, duration * 1000 + 2000);
    }

    getCarSVG(type, color) {
        const svgs = {
            sedan: `<svg viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:40px;">
                <rect x="15" y="15" width="45" height="18" rx="4" fill="${color}" opacity="0.9"/>
                <rect x="20" y="12" width="35" height="6" rx="2" fill="${color}" opacity="0.7"/>
                <circle cx="25" cy="33" r="6" fill="#1a1a2e" opacity="0.6"/>
                <circle cx="25" cy="33" r="3" fill="#333" opacity="0.8"/>
                <circle cx="50" cy="33" r="6" fill="#1a1a2e" opacity="0.6"/>
                <circle cx="50" cy="33" r="3" fill="#333" opacity="0.8"/>
                <rect x="58" y="18" width="6" height="10" rx="1" fill="rgba(255,200,50,0.3)" opacity="0.5"/>
            </svg>`,
            suv: `<svg viewBox="0 0 90 45" xmlns="http://www.w3.org/2000/svg" style="width:90px;height:45px;">
                <rect x="15" y="20" width="55" height="20" rx="4" fill="${color}" opacity="0.9"/>
                <rect x="20" y="16" width="40" height="7" rx="2" fill="${color}" opacity="0.7"/>
                <circle cx="30" cy="38" r="7" fill="#1a1a2e" opacity="0.6"/>
                <circle cx="30" cy="38" r="3.5" fill="#333" opacity="0.8"/>
                <circle cx="60" cy="38" r="7" fill="#1a1a2e" opacity="0.6"/>
                <circle cx="60" cy="38" r="3.5" fill="#333" opacity="0.8"/>
                <rect x="68" y="22" width="8" height="12" rx="1" fill="rgba(255,200,50,0.3)" opacity="0.5"/>
            </svg>`,
            sports: `<svg viewBox="0 0 90 30" xmlns="http://www.w3.org/2000/svg" style="width:90px;height:30px;">
                <path d="M10 20 Q30 10 70 15 L80 20 L75 22 L10 22 Z" fill="${color}" opacity="0.9"/>
                <path d="M25 14 L55 14 L58 18 L22 18 Z" fill="${color}" opacity="0.7"/>
                <circle cx="22" cy="24" r="5" fill="#1a1a2e" opacity="0.6"/>
                <circle cx="22" cy="24" r="2.5" fill="#333" opacity="0.8"/>
                <circle cx="60" cy="24" r="5" fill="#1a1a2e" opacity="0.6"/>
                <circle cx="60" cy="24" r="2.5" fill="#333" opacity="0.8"/>
                <rect x="68" y="16" width="6" height="8" rx="1" fill="rgba(255,200,50,0.3)" opacity="0.5"/>
            </svg>`,
            truck: `<svg viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg" style="width:120px;height:50px;">
                <rect x="10" y="20" width="50" height="24" rx="3" fill="${color}" opacity="0.9"/>
                <rect x="60" y="15" width="45" height="29" rx="3" fill="${color}" opacity="0.85"/>
                <circle cx="22" cy="42" r="7" fill="#1a1a2e" opacity="0.6"/>
                <circle cx="22" cy="42" r="3.5" fill="#333" opacity="0.8"/>
                <circle cx="50" cy="42" r="7" fill="#1a1a2e" opacity="0.6"/>
                <circle cx="50" cy="42" r="3.5" fill="#333" opacity="0.8"/>
                <rect x="95" y="22" width="8" height="14" rx="1" fill="rgba(255,200,50,0.3)" opacity="0.5"/>
            </svg>`
        };
        return svgs[type] || svgs.sedan;
    }

    getLane() {
        const lanes = ['lane-near', 'lane-mid', 'lane-far'];
        const weights = [0.5, 0.3, 0.2];
        
        let totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return lanes[i];
            }
        }
        return lanes[0];
    }

    startSpawnLoop() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        this.spawnInterval = setInterval(() => {
            this.spawnCar();
        }, 3000);
    }

    getSpawnInterval() {
        const baseInterval = 4000;
        const minInterval = 800;
        const factor = Math.max(0, Math.min(1, this.sessionCount / 100));
        return Math.max(minInterval, baseInterval - factor * (baseInterval - minInterval));
    }

    updateSessionCount(count) {
        this.sessionCount = count;
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = setInterval(() => {
                this.spawnCar();
            }, this.getSpawnInterval());
        }
    }

    destroy() {
        this.isRunning = false;
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default new TrafficSystem();
