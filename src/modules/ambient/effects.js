// ==========================================
// EFFECTS ENGINE - Ripples & Scanner
// ==========================================

class EffectsEngine {
    constructor() {
        this.ripples = [];
        this.scannerElement = null;
    }

    init() {
        // Create scanner pulse
        this.scannerElement = document.createElement('div');
        this.scannerElement.className = 'scanner-pulse';
        document.body.prepend(this.scannerElement);
    }

    createRipple(x, y, color = 'rgba(108, 60, 225, 0.2)') {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.borderColor = color;
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 1500);
    }

    entryFlash() {
        this.flash('#00FF88', 300);
        this.createRipple(window.innerWidth / 2, window.innerHeight / 2, 'rgba(0, 255, 136, 0.3)');
    }

    exitFlash() {
        this.flash('#FF6B35', 300);
        this.createRipple(window.innerWidth / 2 + 100, window.innerHeight / 2 - 50, 'rgba(255, 107, 53, 0.3)');
    }

    flash(color, duration = 300) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${color};
            opacity: 0.05;
            pointer-events: none;
            z-index: 100;
            animation: flashFade ${duration}ms ease-out forwards;
        `;
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, duration);
    }

    scannerPulse() {
        // Scanner pulse is handled by CSS animation
        // We just need to trigger it occasionally
        if (this.scannerElement) {
            this.scannerElement.style.animation = 'none';
            requestAnimationFrame(() => {
                this.scannerElement.style.animation = 'scannerPulse 6s ease-in-out infinite';
            });
        }
    }
}

export default new EffectsEngine();
