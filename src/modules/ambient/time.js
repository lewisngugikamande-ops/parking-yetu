// ==========================================
// TIME ENGINE - Sunrise/Sunset Calculations
// ==========================================

export class TimeEngine {
    constructor() {
        this.phase = 'day';
        this.sunrise = '06:30';
        this.sunset = '18:30';
        this.goldenHour = '17:30';
        this.update();
    }

    update() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const time = hours + minutes / 60;

        // Define phases
        if (time < 5 || time > 20) {
            this.phase = 'night';
        } else if (time >= 5 && time < 7) {
            this.phase = 'dawn';
        } else if (time >= 7 && time < 10) {
            this.phase = 'morning';
        } else if (time >= 10 && time < 16) {
            this.phase = 'day';
        } else if (time >= 16 && time < 18) {
            this.phase = 'afternoon';
        } else if (time >= 18 && time < 20) {
            this.phase = 'dusk';
        }

        // Calculate sun position (simplified)
        const sunAngle = ((time - 6) / 12) * 180;
        this.sunPosition = Math.max(0, Math.min(180, sunAngle));
        
        // Update every minute
        setTimeout(() => this.update(), 60000);
    }

    getPhase() {
        return this.phase;
    }

    getSunPosition() {
        return this.sunPosition;
    }

    getTimeOfDay() {
        return {
            phase: this.phase,
            sunPosition: this.sunPosition,
            isDay: this.phase !== 'night' && this.phase !== 'dawn' && this.phase !== 'dusk',
            isNight: this.phase === 'night'
        };
    }
}

export default new TimeEngine();
