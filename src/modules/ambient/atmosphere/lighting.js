// ==========================================
// LIGHTING ENGINE - Ambient Lighting
// ==========================================

class LightingEngine {
    constructor() {
        this.mood = 'neutral';
        this.timeOfDay = 'day';
        this.brightness = 1.0;
        this.warmth = 0.5;
    }

    init() {
        console.log('💡 Lighting Engine initialized');
        this.updateTime();
    }

    setMood(mood) {
        this.mood = mood;
        this.applyMood();
    }

    applyMood() {
        const moods = {
            'calm': { brightness: 0.8, warmth: 0.3 },
            'neutral': { brightness: 1.0, warmth: 0.5 },
            'busy': { brightness: 1.1, warmth: 0.7 },
            'full': { brightness: 1.2, warmth: 0.8 },
            'emergency': { brightness: 1.3, warmth: 0.9 }
        };

        const mood = moods[this.mood] || moods.neutral;
        this.brightness = mood.brightness;
        this.warmth = mood.warmth;

        // Apply to DOM
        const root = document.documentElement;
        root.style.setProperty('--ambient-brightness', this.brightness);
        root.style.setProperty('--ambient-warmth', this.warmth);

        console.log(`💡 Mood: ${this.mood}, Brightness: ${this.brightness}, Warmth: ${this.warmth}`);
    }

    updateTime() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 18) {
            this.timeOfDay = 'day';
        } else {
            this.timeOfDay = 'night';
        }
        console.log(`💡 Time: ${this.timeOfDay}`);
    }

    getLighting() {
        return {
            mood: this.mood,
            timeOfDay: this.timeOfDay,
            brightness: this.brightness,
            warmth: this.warmth
        };
    }
}

export default new LightingEngine();
