// ==========================================
// ATMOSPHERE INITIALIZER
// ==========================================

export function initAtmosphere() {
    console.log('🌅 Initializing Atmosphere...');
    
    // 1. Cityscape
    const cityCanvas = document.getElementById('cityscape-canvas');
    if (cityCanvas) {
        const ctx = cityCanvas.getContext('2d');
        ctx.clearRect(0, 0, cityCanvas.width, cityCanvas.height);
        
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
            ctx.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.08})`;
            ctx.fillRect(b.x, cityCanvas.height - b.h, b.w, b.h);
            
            for (let r = 0; r < Math.floor(b.h / 15); r++) {
                for (let c = 0; c < Math.floor(b.w / 12); c++) {
                    if (Math.random() > 0.4) {
                        ctx.fillStyle = `rgba(255,200,100,${0.05 + Math.random() * 0.15})`;
                        ctx.fillRect(b.x + c * 12 + 2, cityCanvas.height - b.h + r * 15 + 5, 6, 8);
                    }
                }
            }
        });
    }
    
    // 2. Stars
    const starsCanvas = document.getElementById('stars-canvas');
    if (starsCanvas) {
        const ctx = starsCanvas.getContext('2d');
        ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
        
        for (let i = 0; i < 150; i++) {
            const x = Math.random() * starsCanvas.width;
            const y = Math.random() * starsCanvas.height * 0.7;
            const r = 0.5 + Math.random() * 1.5;
            const opacity = 0.3 + Math.random() * 0.7;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${opacity * 0.5})`;
            ctx.fill();
            
            if (r > 1.2) {
                ctx.shadowColor = `rgba(255,255,255,${opacity * 0.1})`;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(x, y, r * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }
    
    // 3. Traffic
    const trafficCanvas = document.getElementById('traffic-canvas');
    if (trafficCanvas) {
        const ctx = trafficCanvas.getContext('2d');
        let cars = [];
        
        for (let i = 0; i < 15; i++) {
            cars.push({
                x: Math.random() * trafficCanvas.width,
                y: trafficCanvas.height - 70 - Math.random() * 120,
                size: 20 + Math.random() * 30,
                speed: 0.5 + Math.random() * 1.5,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            });
        }
        
        function animateTraffic() {
            ctx.clearRect(0, 0, trafficCanvas.width, trafficCanvas.height);
            
            cars.forEach(car => {
                car.x += car.speed;
                if (car.x > trafficCanvas.width + 50) {
                    car.x = -50;
                    car.y = trafficCanvas.height - 70 - Math.random() * 120;
                }
                
                ctx.shadowColor = 'rgba(255,200,50,0.1)';
                ctx.shadowBlur = 15;
                ctx.fillStyle = car.color;
                ctx.fillRect(car.x, car.y - car.size/2, car.size * 1.8, car.size * 0.6);
                
                ctx.fillStyle = car.color;
                ctx.globalAlpha = 0.7;
                ctx.fillRect(car.x + car.size * 0.3, car.y - car.size/2 - 4, car.size * 0.7, car.size * 0.3);
                ctx.globalAlpha = 1;
                
                ctx.shadowBlur = 0;
                const grad = ctx.createRadialGradient(car.x + car.size * 1.8, car.y, 2, car.x + car.size * 2.2, car.y, 30);
                grad.addColorStop(0, 'rgba(255,200,50,0.25)');
                grad.addColorStop(1, 'rgba(255,200,50,0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(car.x + car.size * 2.2, car.y, 30, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animateTraffic);
        }
        
        animateTraffic();
    }
    
    // 4. Enhance sky
    const sky = document.querySelector('.atmosphere-sky');
    if (sky) {
        sky.style.background = 'linear-gradient(180deg, #050510 0%, #0a0a1a 30%, #0f0a1f 60%, #1a0a2e 100%)';
        sky.style.boxShadow = 'inset 0 0 150px rgba(108,60,225,0.08)';
    }
    
    console.log('✅ Atmosphere initialized');
}
