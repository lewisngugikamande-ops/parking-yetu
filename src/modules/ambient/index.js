// ==========================================
// AMBIENT ENGINE - Background Environment
// ==========================================

import digitalTwin from './digital-twin/index.js';
import weatherEngine from './weather.js';
import vehicleManager from './digital-twin/vehicles/VehicleManager.js';

class AmbientEngine {
    constructor() {
        this.isRunning = false;
        this.container = null;
        this.digitalTwin = digitalTwin;
        this.weatherEngine = weatherEngine;
        this.vehicleManager = vehicleManager;
        this.skyColors = {
            dawn: ['#2c1b4d', '#6b3fa0', '#e8a87c'],
            morning: ['#4a90d9', '#87CEEB', '#f0e6d3'],
            day: ['#2d89ef', '#6cb2eb', '#f5f5f5'],
            afternoon: ['#1a6bc4', '#f4a460', '#f5deb3'],
            dusk: ['#6b3fa0', '#e8a87c', '#f4a460'],
            night: ['#0a0a1a', '#1a1a3e', '#2d2d5e'],
            midnight: ['#050510', '#0a0a2a', '#1a1a3e']
        };
        this.currentTheme = 'day';
        this.interval = null;
        this.particles = null;
        this.digitalTwinInitialized = false;
    }

    init(container) {
        this.container = container || document.body;
        console.log('🌅 Ambient Engine initializing...');
        
        const oldStyle = document.getElementById('ambient-styles');
        if (oldStyle) oldStyle.remove();
        
        this.setupBackground();
        this.createParticles();
        this.createCanvases();
        this.initDigitalTwin();
        
        // Initialize vehicle manager on traffic canvas
        setTimeout(() => {
            const trafficCanvas = document.getElementById('traffic-canvas');
            if (trafficCanvas && this.vehicleManager) {
                this.vehicleManager.init(trafficCanvas);
                console.log('🚗 Vehicle manager started');
            }
        }, 1000);
        
        // Initialize weather on cityscape canvas
        setTimeout(() => {
            const cityCanvas = document.getElementById('cityscape-canvas');
            if (cityCanvas && this.weatherEngine) {
                this.weatherEngine.init(cityCanvas);
                console.log('🌤️ Weather engine started');
            }
        }, 1000);
        
        this.start();
        console.log('🌅 Ambient Engine initialized with theme:', this.currentTheme);
    }

    createCanvases() {
        const canvases = [
            {
                id: 'cityscape-canvas',
                style: `
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 45vh;
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0.25;
                `
            },
            {
                id: 'traffic-canvas',
                style: `
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: 30vh;
                    pointer-events: none;
                    z-index: 1;
                    opacity: 0.35;
                `
            }
        ];

        canvases.forEach(cfg => {
            let canvas = document.getElementById(cfg.id);
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.id = cfg.id;
                canvas.style.cssText = cfg.style;
                document.body.prepend(canvas);
                console.log(`✅ Created ${cfg.id}`);
            } else {
                console.log(`✅ ${cfg.id} already exists`);
            }
        });
    }

    setupBackground() {
        const style = document.createElement('style');
        style.id = 'ambient-styles';
        style.textContent = `
            body {
                background: #0a0a1a;
                transition: background 2s ease;
                min-height: 100vh;
                position: relative;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
            }
            
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    radial-gradient(ellipse at 50% 80%, rgba(108, 60, 225, 0.15) 0%, transparent 70%),
                    radial-gradient(ellipse at 20% 20%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 20%, rgba(0, 212, 255, 0.05) 0%, transparent 50%);
                pointer-events: none;
                z-index: 0;
            }
            
            #app-container {
                position: relative;
                z-index: 10;
            }
            
            .ambient-particles {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 0;
                overflow: hidden;
            }
            
            .particle {
                position: absolute;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 50%;
                animation: float linear infinite;
                box-shadow: 0 0 6px rgba(255, 255, 255, 0.05);
            }
            
            @keyframes float {
                0% { 
                    transform: translateY(100vh) translateX(0px) scale(1);
                    opacity: 0; 
                }
                10% { 
                    opacity: 1; 
                }
                90% { 
                    opacity: 1; 
                }
                100% { 
                    transform: translateY(-10vh) translateX(20px) scale(0.5);
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);
        this.updateSky();
        console.log('✅ Ambient styles applied');
    }

    createParticles() {
        const oldParticles = document.querySelector('.ambient-particles');
        if (oldParticles) oldParticles.remove();
        
        const container = document.createElement('div');
        container.className = 'ambient-particles';
        
        const count = 40 + Math.floor(Math.random() * 20);
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = 1 + Math.random() * 4;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.animationDuration = (15 + Math.random() * 35) + 's';
            particle.style.animationDelay = (Math.random() * 40) + 's';
            particle.style.opacity = 0.1 + Math.random() * 0.3;
            container.appendChild(particle);
        }
        
        document.body.insertBefore(container, document.body.firstChild);
        this.particles = container;
        console.log('✨ Created ' + count + ' particles');
    }

    initDigitalTwin() {
        if (this.digitalTwinInitialized) return;
        
        try {
            console.log('🏗️ Initializing Digital Twin...');
            const success = this.digitalTwin.init('org_pcea_langata', 'church');
            
            if (success) {
                this.digitalTwinInitialized = true;
                console.log('🏗️ Digital Twin fully initialized');
            } else {
                console.warn('⚠️ Digital Twin initialization failed');
            }
        } catch (err) {
            console.error('❌ Digital Twin initialization error:', err);
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.updateSky();
        this.interval = setInterval(() => this.updateSky(), 30000);
        console.log('⏰ Ambient engine started (updates every 30s)');
    }

    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        console.log('⏰ Ambient engine stopped');
    }

    updateSky() {
        const hour = new Date().getHours();
        let theme;
        
        if (hour >= 5 && hour < 7) theme = 'dawn';
        else if (hour >= 7 && hour < 9) theme = 'morning';
        else if (hour >= 9 && hour < 16) theme = 'day';
        else if (hour >= 16 && hour < 18) theme = 'afternoon';
        else if (hour >= 18 && hour < 20) theme = 'dusk';
        else if (hour >= 20 && hour < 23) theme = 'night';
        else theme = 'midnight';
        
        this.currentTheme = theme;
        const colors = this.skyColors[theme];
        const gradient = 'linear-gradient(180deg, ' + colors[0] + ', ' + colors[1] + ', ' + colors[2] + ')';
        
        document.body.style.background = gradient;
        document.body.style.backgroundAttachment = 'fixed';
        
        console.log('🌅 Sky updated: ' + theme);
    }

    setTheme(theme) {
        if (this.skyColors[theme]) {
            this.currentTheme = theme;
            const colors = this.skyColors[theme];
            const gradient = 'linear-gradient(180deg, ' + colors[0] + ', ' + colors[1] + ', ' + colors[2] + ')';
            document.body.style.background = gradient;
            document.body.style.backgroundAttachment = 'fixed';
            console.log('🎨 Theme manually set to: ' + theme);
            return true;
        }
        return false;
    }

    setOrganization(orgId, theme = 'church') {
        if (this.digitalTwin) {
            this.digitalTwin.updateOrganization(orgId, theme);
            console.log('🏗️ Organization updated to: ' + orgId);
        }
    }
}

const ambientEngine = new AmbientEngine();

if (typeof window !== 'undefined') {
    window.__ambient = ambientEngine;
    window.__ambient.digitalTwin = ambientEngine.digitalTwin;
    window.__ambient.weatherEngine = ambientEngine.weatherEngine;
    window.__ambient.vehicleManager = ambientEngine.vehicleManager;
    console.log('🌅 Ambient Engine exposed as window.__ambient');
    console.log('🏗️ Digital Twin exposed as window.__ambient.digitalTwin');
    console.log('🌤️ Weather Engine exposed as window.__ambient.weatherEngine');
    console.log('🚗 Vehicle Manager exposed as window.__ambient.vehicleManager');
}

export default ambientEngine;
