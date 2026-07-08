k// ==========================================
// ATMOSPHERE - Parking Lot View
// ==========================================

import eventBus from "../../core/events.js";

class Atmosphere {
    constructor() {
        this.sky = null;
        this.stars = null;
        this.cityscape = null;
        this.traffic = null;
        this.isInitialized = false;
        this.cars = [];
        this.spots = [];
        this.updateInterval = null;
        this.animationId = null;
    }

    init() {
        if (this.isInitialized) return;
        console.log("🌅 Creating Parking Lot Atmosphere...");
        
        // Sky
        this.sky = document.createElement("div");
        this.sky.className = "atmosphere-sky";
        this.sky.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;z-index:0;background:linear-gradient(180deg,#050510 0%,#0a0a1a 30%,#1a0a2e 60%,#2a1a4e 100%);pointer-events:none;display:block;opacity:1;";
        document.body.prepend(this.sky);

        // Stars
        this.stars = document.createElement("canvas");
        this.stars.id = "starsCanvas";
        this.stars.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;z-index:0;pointer-events:none;display:block;";
        document.body.prepend(this.stars);
        this.drawStars();

        // Cityscape
        this.cityscape = document.createElement("canvas");
        this.cityscape.id = "cityCanvas";
        this.cityscape.style.cssText = "position:fixed;bottom:0;left:0;right:0;height:200px;z-index:0;pointer-events:none;opacity:0.2;display:block;";
        document.body.prepend(this.cityscape);
        this.drawCityscape();

        // Parking Lot Canvas
        this.traffic = document.createElement("canvas");
        this.traffic.id = "trafficCanvas";
        this.traffic.style.cssText = "position:fixed;bottom:0;left:0;right:0;top:0;z-index:0;pointer-events:none;display:block;";
        document.body.prepend(this.traffic);
        
        // Initialize parking spots
        this.initParkingSpots();
        this.initTraffic();

        // Make dashboard transparent
        const app = document.getElementById("app");
        if (app) {
            app.style.background = "transparent";
            app.style.position = "relative";
            app.style.zIndex = "1";
        }

        // Listen for events
        eventBus.on("session:started", (data) => {
            console.log("🚗 Car arriving:", data);
            this.addCar(data);
        });

        eventBus.on("session:ended", (data) => {
            console.log("🚗 Car leaving:", data);
            this.removeCar(data);
        });

        // Handle resize
        window.addEventListener("resize", () => {
            this.handleResize();
        });

        this.isInitialized = true;
        console.log("🎨 Parking Lot Atmosphere ready!");
    }

    handleResize() {
        const canvas = this.traffic;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.initParkingSpots();
        }
    }

    initParkingSpots() {
        this.spots = [];
        const spotCount = 10;
        const canvasWidth = window.innerWidth;
        const spotWidth = (canvasWidth - 100) / spotCount;
        
        for (let i = 0; i < spotCount; i++) {
            this.spots.push({
                x: 50 + i * spotWidth + spotWidth / 2,
                y: window.innerHeight - 130,
                occupied: false,
                car: null
            });
        }
    }

    drawParkingSpots(ctx) {
        this.spots.forEach(spot => {
            ctx.strokeStyle = spot.occupied ? "rgba(108,60,225,0.3)" : "rgba(255,255,255,0.05)";
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(spot.x - 35, spot.y - 20, 70, 40);
            ctx.setLineDash([]);
        });
    }

    addCar(data) {
        const emptySpot = this.spots.find(s => !s.occupied);
        if (!emptySpot) {
            console.log("No empty spots!");
            return;
        }

        const emojiMap = {
            "sedan": "🚗",
            "suv": "🚙",
            "pickup": "🛻",
            "van": "🚐",
            "bike": "🏍️",
            "truck": "🚛",
            "bus": "🚌",
            "taxi": "🚕",
            "other": "🚗"
        };
        const emoji = data.emoji || emojiMap[data.category] || "🚗";

        const car = {
            id: data.sessionId || Date.now().toString(),
            emoji: emoji,
            category: data.category || "sedan",
            x: -50,
            y: window.innerHeight - 110,
            targetX: emptySpot.x,
            targetY: emptySpot.y,
            spotIndex: this.spots.indexOf(emptySpot),
            state: "arriving",
            progress: 0,
            speed: 0.02 + Math.random() * 0.02,
            size: 30 + Math.random() * 10,
            plate: data.vehicle || "UNKNOWN"
        };

        emptySpot.occupied = true;
        emptySpot.car = car;
        this.cars.push(car);
        console.log("🚗 Car arriving:", car.emoji, this.cars.length, "cars now");
    }

    removeCar(data) {
        const carIndex = this.cars.findIndex(c => c.id === data.sessionId);
        if (carIndex === -1) {
            console.log("Car not found:", data);
            return;
        }

        const car = this.cars[carIndex];
        car.state = "leaving";
        
        const spot = this.spots[car.spotIndex];
        if (spot) {
            spot.occupied = false;
            spot.car = null;
        }

        setTimeout(() => {
            this.cars = this.cars.filter(c => c.id !== car.id);
            console.log("🚗 Car left,", this.cars.length, "cars remaining");
        }, 2000);
    }

    initTraffic() {
        const canvas = this.traffic;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw parking spots
            this.drawParkingSpots(ctx);
            
            // Draw cars
            this.cars.forEach(car => {
                this.drawCar(ctx, car);
            });
            
            // Update car positions
            this.cars.forEach(car => {
                if (car.state === "arriving") {
                    const dx = car.targetX - car.x;
                    const dy = car.targetY - car.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 5) {
                        car.x = car.targetX;
                        car.y = car.targetY;
                        car.state = "parked";
                        console.log("🚗 Car parked!");
                    } else {
                        const speed = Math.max(3, dist * 0.05);
                        car.x += (dx / dist) * speed;
                        car.y += (dy / dist) * speed;
                    }
                } else if (car.state === "leaving") {
                    car.x += 4;
                    if (car.x > canvas.width + 50) {
                        car.visible = false;
                    }
                }
            });
            
            this.cars = this.cars.filter(c => c.state !== "leaving" || c.x < canvas.width + 50);
            
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    drawCar(ctx, car) {
        const { x, y, emoji, size, state } = car;
        
        // Glow effect
        const grad = ctx.createRadialGradient(x, y, 2, x, y, size * 2);
        const glowColor = state === "parked" ? "rgba(0,255,136,0.05)" : "rgba(255,200,50,0.05)";
        grad.addColorStop(0, glowColor);
        grad.addColorStop(1, "rgba(255,200,50,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Car emoji
        ctx.shadowColor = state === "parked" ? "rgba(0,255,136,0.1)" : "rgba(255,200,50,0.15)";
        ctx.shadowBlur = state === "parked" ? 30 : 20;
        ctx.font = size + "px \"Segoe UI Emoji\", \"Apple Color Emoji\", \"Noto Color Emoji\", sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(emoji, x, y);
        ctx.shadowBlur = 0;
        
        // Plate label when parked
        if (state === "parked" && car.plate) {
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.font = "8px monospace";
            ctx.textAlign = "center";
            ctx.fillText(car.plate || "", x, y + size/2 + 12);
        }
    }

    drawStars() {
        const canvas = document.getElementById("starsCanvas");
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.7;
            const r = 0.5 + Math.random() * 1.5;
            const opacity = 0.3 + Math.random() * 0.7;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255," + (opacity * 0.6) + ")";
            ctx.fill();
        }
    }

    drawCityscape() {
        const canvas = document.getElementById("cityCanvas");
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");
        const buildings = [
            { x: 10, w: 30, h: 80 }, { x: 50, w: 25, h: 60 },
            { x: 85, w: 35, h: 100 }, { x: 130, w: 20, h: 50 },
            { x: 160, w: 40, h: 120 }, { x: 210, w: 25, h: 70 },
            { x: 245, w: 30, h: 90 }, { x: 285, w: 20, h: 55 },
            { x: 315, w: 35, h: 110 }, { x: 360, w: 25, h: 65 },
            { x: 395, w: 40, h: 130 }, { x: 445, w: 20, h: 45 },
            { x: 475, w: 30, h: 85 }, { x: 515, w: 35, h: 95 },
            { x: 560, w: 25, h: 75 }, { x: 595, w: 40, h: 115 },
            { x: 645, w: 20, h: 60 }, { x: 675, w: 30, h: 105 },
            { x: 715, w: 35, h: 88 }, { x: 760, w: 25, h: 70 },
            { x: 800, w: 30, h: 95 }, { x: 840, w: 20, h: 50 },
            { x: 870, w: 35, h: 110 }, { x: 915, w: 25, h: 65 },
            { x: 950, w: 40, h: 125 }, { x: 1000, w: 20, h: 45 }
        ];
        buildings.forEach(b => {
            ctx.fillStyle = "rgba(255,255,255,0.08)";
            ctx.fillRect(b.x, canvas.height - b.h, b.w, b.h);
            for (let r = 0; r < Math.floor(b.h / 15); r++) {
                for (let c = 0; c < Math.floor(b.w / 12); c++) {
                    if (Math.random() > 0.4) {
                        ctx.fillStyle = "rgba(255,200,100," + (0.1 + Math.random() * 0.2) + ")";
                        ctx.fillRect(b.x + c * 12 + 2, canvas.height - b.h + r * 15 + 5, 6, 8);
                    }
                }
            }
        });
    }

    destroy() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.isInitialized = false;
    }
}

export default new Atmosphere();
