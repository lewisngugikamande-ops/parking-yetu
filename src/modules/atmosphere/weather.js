// ==========================================
// WEATHER ENGINE - Real-time Weather
// ==========================================

class WeatherEngine {
    constructor() {
        this.currentWeather = {
            condition: 'clear',
            temperature: 22,
            humidity: 65,
            windSpeed: 5,
            cloudCover: 20
        };
        this.isRunning = false;
        this.updateInterval = null;
    }

    init() {
        this.isRunning = true;
        this.fetchWeather();
        // Update every 15 minutes
        this.updateInterval = setInterval(() => this.fetchWeather(), 900000);
        console.log('🌤️ Weather Engine initialized');
    }

    async fetchWeather() {
        try {
            // Try to get real weather from API
            const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Nairobi&appid=YOUR_API_KEY&units=metric');
            if (response.ok) {
                const data = await response.json();
                this.currentWeather = {
                    condition: data.weather[0].main.toLowerCase(),
                    temperature: Math.round(data.main.temp),
                    humidity: data.main.humidity,
                    windSpeed: Math.round(data.wind.speed),
                    cloudCover: data.clouds.all
                };
                this.updateAtmosphere();
            }
        } catch (error) {
            // Fallback to simulated weather
            this.simulateWeather();
        }
    }

    simulateWeather() {
        const conditions = ['clear', 'clouds', 'rain', 'drizzle', 'mist'];
        this.currentWeather = {
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            temperature: 18 + Math.floor(Math.random() * 12),
            humidity: 50 + Math.floor(Math.random() * 40),
            windSpeed: Math.floor(Math.random() * 15),
            cloudCover: Math.floor(Math.random() * 100)
        };
        this.updateAtmosphere();
    }

    updateAtmosphere() {
        const { condition, cloudCover } = this.currentWeather;
        
        // Emit weather update event
        window.__events?.emit('weather:updated', this.currentWeather);
        
        // Update sky based on weather
        const sky = document.querySelector('.atmosphere-sky');
        if (!sky) return;
        
        let opacity = 1;
        let blur = 0;
        
        if (condition.includes('rain') || condition.includes('drizzle')) {
            opacity = 0.7;
            blur = 2;
            this.createRainEffect();
        } else if (condition.includes('cloud')) {
            opacity = 0.85 - (cloudCover / 100) * 0.2;
        } else if (condition.includes('mist') || condition.includes('fog')) {
            opacity = 0.6;
            blur = 4;
        }
        
        sky.style.opacity = opacity;
        sky.style.filter = `blur(${blur}px)`;
    }

    createRainEffect() {
        // Remove existing rain
        const oldRain = document.querySelector('.rain-effect');
        if (oldRain) oldRain.remove();
        
        // Create rain canvas
        const rain = document.createElement('canvas');
        rain.className = 'rain-effect';
        rain.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:0;pointer-events:none;opacity:0.3;';
        rain.width = window.innerWidth;
        rain.height = window.innerHeight;
        document.body.prepend(rain);
        
        const ctx = rain.getContext('2d');
        const drops = [];
        
        for (let i = 0; i < 200; i++) {
            drops.push({
                x: Math.random() * rain.width,
                y: Math.random() * rain.height,
                length: 10 + Math.random() * 20,
                speed: 5 + Math.random() * 10,
                opacity: 0.2 + Math.random() * 0.3
            });
        }
        
        let frameId;
        const animateRain = () => {
            ctx.clearRect(0, 0, rain.width, rain.height);
            
            drops.forEach(drop => {
                drop.y += drop.speed;
                drop.x += 0.5;
                
                if (drop.y > rain.height) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * rain.width;
                }
                
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x + 1, drop.y + drop.length);
                ctx.strokeStyle = `rgba(200, 220, 255, ${drop.opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            });
            
            frameId = requestAnimationFrame(animateRain);
        };
        
        animateRain();
        
        // Store frameId for cleanup
        this.rainFrameId = frameId;
    }

    getWeather() {
        return this.currentWeather;
    }

    destroy() {
        this.isRunning = false;
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        if (this.rainFrameId) {
            cancelAnimationFrame(this.rainFrameId);
            this.rainFrameId = null;
        }
        const rain = document.querySelector('.rain-effect');
        if (rain) rain.remove();
    }
}

export default new WeatherEngine();
