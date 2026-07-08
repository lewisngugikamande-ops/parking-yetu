// ==========================================
// AMBIENT - Stars Engine
// ==========================================

class StarsEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.stars = [];
    }

    init() {
        this.canvas = document.getElementById('starsCanvas');
        if (!this.canvas) {
            console.warn('Stars canvas not found');
            return;
        }

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        
        this.generateStars();
        this.draw();
        
        console.log('⭐ Stars Engine initialized');
    }

    generateStars() {
        this.stars = [];
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.7,
                r: 0.5 + Math.random() * 1.5,
                opacity: 0.3 + Math.random() * 0.7
            });
        }
    }

    draw() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255,255,255,${star.opacity * 0.6})`;
            this.ctx.fill();
            
            // Glow for bigger stars
            if (star.r > 1.2) {
                this.ctx.shadowColor = `rgba(255,255,255,${star.opacity * 0.1})`;
                this.ctx.shadowBlur = 10;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        });
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateStars();
        this.draw();
    }
}

export default new StarsEngine();
