// ==========================================
// STARS ENGINE - Night Mode
// ==========================================

class StarsEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.stars = [];
        this.isRunning = false;
        this.animationId = null;
    }

    init() {
        this.canvas = document.getElementById('stars-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'stars-canvas';
            this.canvas.className = 'stars-canvas';
            this.canvas.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:0;pointer-events:none;';
            document.body.prepend(this.canvas);
        }
        
        this.resize();
        this.ctx = this.canvas.getContext('2d');
        this.generateStars();
        this.isRunning = true;
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.generateStars();
        });
        
        console.log('⭐ Stars Engine initialized');
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    generateStars() {
        this.stars = [];
        const count = 150 + Math.floor(Math.random() * 100);
        
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.7,
                radius: 0.5 + Math.random() * 1.5,
                twinkleSpeed: 0.02 + Math.random() * 0.04,
                twinklePhase: Math.random() * Math.PI * 2,
                opacity: 0.3 + Math.random() * 0.7
            });
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() / 1000;
        
        this.stars.forEach(star => {
            // Twinkle effect
            const brightness = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
            const opacity = star.opacity * brightness;
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
            ctx.fill();
            
            // Glow for brighter stars
            if (star.radius > 1.2) {
                ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.1})`;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
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
    }
}

export default new StarsEngine();
