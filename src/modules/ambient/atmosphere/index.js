// ==========================================
// ATMOSPHERE ENGINE - Mood, Sky, Lighting, Weather
// ==========================================

import sky from './sky.js';
import stars from './stars.js';
import lighting from './lighting.js';
import weather from './weather.js';

class AtmosphereEngine {
    constructor() {
        this.sky = sky;
        this.stars = stars;
        this.lighting = lighting;
        this.weather = weather;
        this.mood = 'neutral';
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        console.log('🌤️ Atmosphere Engine initializing...');

        try {
            this.sky.init();
        } catch (e) {
            console.warn('Sky init error:', e.message);
        }

        try {
            this.stars.init();
        } catch (e) {
            console.warn('Stars init error:', e.message);
        }

        try {
            this.lighting.init();
        } catch (e) {
            console.warn('Lighting init error:', e.message);
        }

        try {
            this.weather.init();
        } catch (e) {
            console.warn('Weather init error:', e.message);
        }

        this.isInitialized = true;
        console.log('✅ Atmosphere Engine ready');
    }

    setMood(mood) {
        this.mood = mood;
        this.lighting.setMood(mood);
        // Weather can also change based on mood
        if (mood === 'calm') {
            // Calm mood might bring clear weather
        } else if (mood === 'busy') {
            // Busy mood might bring cloudy weather
        }
    }

    updateTime() {
        this.sky.updatePhase();
        this.lighting.updateTime();
    }

    getWeather() {
        return this.weather.getWeather();
    }

    setWeather(type, intensity) {
        return this.weather.setWeather(type, intensity);
    }

    destroy() {
        this.weather.destroy();
        this.isInitialized = false;
    }
}

export default new AtmosphereEngine();
