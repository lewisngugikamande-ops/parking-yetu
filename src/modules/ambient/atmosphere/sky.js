// ==========================================
// SKY ENGINE - Time-Based Sky (Kenyan Theme)
// ==========================================

class SkyEngine {
    constructor() {
        this.element = null;
        this.currentPhase = 'day';
        this.currentTime = new Date();
        this.updateInterval = null;
        
        // Time-based sky colors - Kenyan theme
        this.phases = {
            dawn: {
                name: '🌅 Dawn',
                colors: ['#1a0a1a', '#3a1a2a', '#5a2a3a', '#7a3a4a'],
                stars: false
            },
            morning: {
                name: '☀️ Morning',
                colors: ['#4A80C9', '#6AAEE8', '#8ACAF0', '#B0E0F8'],
                stars: false
            },
            day: {
                name: '☀️ Day',
                colors: ['#3A70B9', '#5A9ED8', '#7ABAE8', '#9AD4F0'],
                stars: false
            },
            afternoon: {
                name: '☀️ Afternoon',
                colors: ['#2A60A9', '#4A8EC8', '#6AAEE0', '#8AC8E8'],
                stars: false
            },
            dusk: {
                name: '🌅 Dusk',
                colors: ['#1a0a05', '#4a2a0a', '#8a3a0a', '#ba5a1a'],
                stars: false
            },
            night: {
                name: '🌙 Night',
                colors: ['#050510', '#0a0a1a', '#0f0a1f', '#1a0a2e'],
                stars: true
            },
            midnight: {
                name: '🌌 Midnight',
                colors: ['#020208', '#050510', '#0a0a1a', '#0f0a1f'],
                stars: true
            }
        };
    }

    init() {
        this.element = document.getElementById('ambientSky');
        if (!this.element) {
            console.warn('Sky element not found');
            return;
        }

        this.updatePhase();
        this.applyGradient();
        
        // Update sky every minute
        this.updateInterval = setInterval(() => {
            this.updatePhase();
            this.applyGradient();
        }, 60000);
        
        console.log('🌤️ Sky Engine initialized (Kenyan theme)');
    }

    getTimePhase() {
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const time = hour + minute / 60;
        
        if (time >= 5 && time < 7) return 'dawn';
        if (time >= 7 && time < 9) return 'morning';
        if (time >= 9 && time < 13) return 'day';
        if (time >= 13 && time < 16) return 'afternoon';
        if (time >= 16 && time < 19) return 'dusk';
        if (time >= 19 && time < 23) return 'night';
        if (time >= 23 || time < 5) return 'midnight';
        return 'day';
    }

    updatePhase() {
        this.currentTime = new Date();
        this.currentPhase = this.getTimePhase();
        console.log(`🌤️ Sky: ${this.currentPhase} at ${this.currentTime.toLocaleTimeString()}`);
    }

    applyGradient() {
        if (!this.element) return;
        const phase = this.phases[this.currentPhase] || this.phases.day;
        const colors = phase.colors;
        const [top, mid1, mid2, bottom] = colors;
        
        this.element.style.background = `
            linear-gradient(180deg, 
                ${top} 0%, 
                ${mid1} 25%, 
                ${mid2} 50%, 
                ${bottom} 75%, 
                ${top} 100%
            )
        `;
        this.element.style.display = 'block';
        this.element.style.opacity = '1';
        
        // Show/hide stars
        const starsCanvas = document.getElementById('starsCanvas');
        if (starsCanvas) {
            starsCanvas.style.display = phase.stars ? 'block' : 'none';
        }
    }

    getCurrentPhase() {
        return {
            name: this.currentPhase,
            time: this.currentTime.toLocaleTimeString(),
            stars: this.phases[this.currentPhase]?.stars || false
        };
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

export default new SkyEngine();
