// ==========================================
// WEATHER ENGINE - Dynamic Weather Effects
// ==========================================

import eventBus from '../../../core/events.js';

class WeatherEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.weatherType = 'clear'; // clear, cloudy, rain, fog, storm
        this.intensity = 0.5;
        this.drops = [];
        this.clouds = [];
        this.fogParticles = [];
        this.isRunning = false;
        this.animationId = null;
        this.weatherUpdateInterval = null;
        this.weathers = ['clear', 'cloudy', 'rain', 'fog', 'storm'];
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'weatherCanvas';
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:0;pointer-events:none;display:block;';
        document.body.prepend(this.canvas);
        
        this.resize();
        this.ctx = this.canvas.getContext('2d');
        
        // Start with random weather
        this.changeWeather();
        
        // Update weather every 2-5 minutes
        this.weatherUpdateInterval = setInterval(() => {
            this.changeWeather();
        }, 120000 + Math.random() * 180000);
        
        // Listen for time changes (night/day affects weather)
        eventBus.on('time:changed', () => {
            this.updateWeatherForTime();
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.resize();
        });

        this.isRunning = true;
        this.animate();
        
        console.log('🌤️ Weather Engine initialized');
        console.log('   Current weather:', this.weatherType);
        console.log('   Intensity:', this.intensity);
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    changeWeather() {
        // Random weather change with weighted probabilities
        const rand = Math.random();
        let newWeather = 'clear';
        
        if (rand < 0.4) newWeather = 'clear';
        else if (rand < 0.65) newWeather = 'cloudy';
        else if (rand < 0.85) newWeather = 'rain';
        else if (rand < 0.95) newWeather = 'fog';
        else newWeather = 'storm';
        
        this.weatherType = newWeather;
        this.intensity = 0.3 + Math.random() * 0.7;
        
        // Generate particles for new weather
        this.generateParticles();
        
        // Emit weather change event
        eventBus.emit('weather:changed', {
            type: this.weatherType,
            intensity: this.intensity
        });
        
        console.log('🌤️ Weather changed to:', this.weatherType, 'Intensity:', this.intensity.toFixed(2));
    }

    updateWeatherForTime() {
        // Night time might be more foggy, day more clear
        const hour = new Date().getHours();
        const isNight = hour < 6 || hour > 18;
        
        if (isNight && this.weatherType === 'clear') {
            // Sometimes night gets foggy
            if (Math.random() > 0.6) {
                this.weatherType = 'fog';
                this.intensity = 0.3 + Math.random() * 0.4;
                this.generateParticles();
                console.log('🌫️ Night fog rolled in');
            }
        }
    }

    generateParticles() {
        this.drops = [];
        this.clouds = [];
        this.fogParticles = [];
        
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        switch (this.weatherType) {
            case 'rain':
            case 'storm':
                // Rain drops
                const count = this.weatherType === 'storm' ? 400 : 200;
                for (let i = 0; i < count; i++) {
                    this.drops.push({
                        x: Math.random() * canvasWidth,
                        y: Math.random() * canvasHeight,
                        length: 10 + Math.random() * 20,
                        speed: 5 + Math.random() * 15,
                        opacity: 0.2 + Math.random() * 0.3,
                        width: 0.5 + Math.random() * 1
                    });
                }
                break;
                
            case 'cloudy':
                // Clouds
                for (let i = 0; i < 8; i++) {
                    this.clouds.push({
                        x: Math.random() * canvasWidth - canvasWidth * 0.2,
                        y: Math.random() * canvasHeight * 0.3,
                        width: 100 + Math.random() * 250,
                        height: 30 + Math.random() * 60,
                        speed: 0.1 + Math.random() * 0.3,
                        opacity: 0.3 + Math.random() * 0.4
                    });
                }
                break;
                
            case 'fog':
                // Fog particles
                for (let i = 0; i < 30; i++) {
                    this.fogParticles.push({
                        x: Math.random() * canvasWidth,
                        y: Math.random() * canvasHeight * 0.6 + canvasHeight * 0.2,
                        radius: 80 + Math.random() * 150,
                        opacity: 0.05 + Math.random() * 0.1,
                        speed: 0.1 + Math.random() * 0.3
                    });
                }
                break;
        }
    }

    drawRain() {
        if (!this.ctx || this.drops.length === 0) return;
        const ctx = this.ctx;
        
        // Slightly darken the scene
        ctx.fillStyle = 'rgba(0,0,50,0.02)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drops.forEach(drop => {
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x + 2, drop.y + drop.length);
            ctx.strokeStyle = `rgba(150, 180, 255, ${drop.opacity * 0.6})`;
            ctx.lineWidth = drop.width;
            ctx.stroke();
            
            // Move drops
            drop.x += 1 + drop.speed * 0.2;
            drop.y += drop.speed;
            
            // Reset drops that go off screen
            if (drop.y > this.canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
            if (drop.x > this.canvas.width) {
                drop.x = -10;
            }
        });
    }

    drawClouds() {
        if (!this.ctx || this.clouds.length === 0) return;
        const ctx = this.ctx;
        
        this.clouds.forEach(cloud => {
            // Draw fluffy cloud
            ctx.fillStyle = `rgba(200, 210, 230, ${cloud.opacity * 0.6})`;
            ctx.shadowColor = 'rgba(200, 210, 230, 0.1)';
            ctx.shadowBlur = 40;
            
            const circles = [
                { x: 0, y: 0, r: cloud.height * 0.6 },
                { x: cloud.width * 0.3, y: -cloud.height * 0.2, r: cloud.height * 0.5 },
                { x: -cloud.width * 0.25, y: cloud.height * 0.1, r: cloud.height * 0.5 },
                { x: cloud.width * 0.5, y: cloud.height * 0.1, r: cloud.height * 0.4 },
                { x: -cloud.width * 0.1, y: cloud.height * 0.3, r: cloud.height * 0.4 }
            ];
            
            circles.forEach(c => {
                ctx.beginPath();
                ctx.arc(cloud.x + c.x, cloud.y + c.y, c.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.shadowBlur = 0;
            
            // Move cloud
            cloud.x += cloud.speed;
            if (cloud.x > this.canvas.width + cloud.width) {
                cloud.x = -cloud.width;
            }
        });
    }

    drawFog() {
        if (!this.ctx || this.fogParticles.length === 0) return;
        const ctx = this.ctx;
        
        this.fogParticles.forEach(particle => {
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius
            );
            gradient.addColorStop(0, `rgba(200, 210, 230, ${particle.opacity * 0.8})`);
            gradient.addColorStop(0.5, `rgba(180, 190, 210, ${particle.opacity * 0.4})`);
            gradient.addColorStop(1, `rgba(160, 170, 190, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Move fog
            particle.x += particle.speed;
            if (particle.x > this.canvas.width + particle.radius) {
                particle.x = -particle.radius;
                particle.y = Math.random() * this.canvas.height * 0.6 + this.canvas.height * 0.2;
            }
        });
    }

    drawStorm() {
        // Same as rain but more intense with lightning flashes
        this.drawRain();
        
        // Random lightning flash
        if (Math.random() < 0.002) { // 0.2% chance per frame
            const ctx = this.ctx;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            // Flash quickly fades
            setTimeout(() => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }, 100);
        }
    }

    animate() {
        if (!this.isRunning) return;
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw based on weather type
        switch (this.weatherType) {
            case 'rain':
                this.drawRain();
                break;
            case 'storm':
                this.drawStorm();
                break;
            case 'cloudy':
                this.drawClouds();
                break;
            case 'fog':
                this.drawFog();
                break;
            case 'clear':
            default:
                // Clear weather - do nothing
                break;
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    getWeather() {
        return {
            type: this.weatherType,
            intensity: this.intensity,
            isRaining: this.weatherType === 'rain' || this.weatherType === 'storm',
            isFoggy: this.weatherType === 'fog',
            isCloudy: this.weatherType === 'cloudy' || this.weatherType === 'storm'
        };
    }

    setWeather(type, intensity = 0.5) {
        if (this.weathers.includes(type)) {
            this.weatherType = type;
            this.intensity = Math.max(0, Math.min(1, intensity));
            this.generateParticles();
            console.log('🌤️ Weather manually set to:', type);
            return true;
        }
        return false;
    }

    destroy() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.weatherUpdateInterval) {
            clearInterval(this.weatherUpdateInterval);
            this.weatherUpdateInterval = null;
        }
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
    }
}

export default new WeatherEngine();
