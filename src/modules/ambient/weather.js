// ==========================================
// WEATHER ENGINE - Rain, Clouds, Fog
// ==========================================

class WeatherEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isRunning = false;
        this.animationId = null;
        this.rainDrops = [];
        this.clouds = [];
        this.fog = [];
        this.weatherType = 'clear'; // clear, rain, cloudy, foggy, stormy
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        console.log('🌤️ WeatherEngine initialized');
        
        this.generateRainDrops(100);
        this.generateClouds(5);
        this.generateFog(10);
        
        this.isRunning = true;
        this.animate();
    }

    generateRainDrops(count) {
        this.rainDrops = [];
        for (let i = 0; i < count; i++) {
            this.rainDrops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: 5 + Math.random() * 10,
                length: 10 + Math.random() * 20,
                opacity: 0.1 + Math.random() * 0.3
            });
        }
    }

    generateClouds(count) {
        this.clouds = [];
        for (let i = 0; i < count; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.3,
                width: 100 + Math.random() * 200,
                height: 30 + Math.random() * 50,
                speed: 0.2 + Math.random() * 0.3,
                opacity: 0.1 + Math.random() * 0.2
            });
        }
    }

    generateFog(count) {
        this.fog = [];
        for (let i = 0; i < count; i++) {
            this.fog.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height * 0.5 + Math.random() * this.canvas.height * 0.3,
                width: 150 + Math.random() * 300,
                height: 30 + Math.random() * 60,
                speed: 0.1 + Math.random() * 0.2,
                opacity: 0.05 + Math.random() * 0.1
            });
        }
    }

    setWeather(type) {
        this.weatherType = type;
        console.log('🌤️ Weather changed to:', type);
        
        switch(type) {
            case 'clear':
                this.rainDrops = [];
                this.clouds = [];
                this.fog = [];
                break;
            case 'rain':
                this.generateRainDrops(200);
                break;
            case 'cloudy':
                this.generateClouds(10);
                break;
            case 'foggy':
                this.generateFog(20);
                break;
            case 'stormy':
                this.generateRainDrops(400);
                this.generateClouds(15);
                break;
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
        const height = this.canvas.height;
        
        // Update rain
        this.rainDrops.forEach(drop => {
            drop.y += drop.speed;
            drop.x += 0.5;
            if (drop.y > height) {
                drop.y = -drop.length;
                drop.x = Math.random() * width;
            }
        });
        
        // Update clouds
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed;
            if (cloud.x > width + cloud.width) {
                cloud.x = -cloud.width;
            }
        });
        
        // Update fog
        this.fog.forEach(fog => {
            fog.x += fog.speed;
            if (fog.x > width + fog.width) {
                fog.x = -fog.width;
            }
        });
    }

    render() {
        if (!this.ctx) return;
        
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear with transparent
        ctx.clearRect(0, 0, width, height);
        
        // Draw fog (bottom layer)
        this.fog.forEach(fog => {
            ctx.fillStyle = `rgba(200, 200, 200, ${fog.opacity})`;
            ctx.beginPath();
            ctx.ellipse(fog.x, fog.y, fog.width, fog.height, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw clouds
        this.clouds.forEach(cloud => {
            ctx.fillStyle = `rgba(200, 200, 210, ${cloud.opacity})`;
            ctx.beginPath();
            ctx.ellipse(cloud.x, cloud.y, cloud.width, cloud.height, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw rain (top layer)
        this.rainDrops.forEach(drop => {
            ctx.strokeStyle = `rgba(180, 200, 255, ${drop.opacity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(drop.x + 2, drop.y + drop.length);
            ctx.stroke();
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

export default new WeatherEngine();
