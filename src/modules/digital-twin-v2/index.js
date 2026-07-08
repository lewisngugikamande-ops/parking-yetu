// ==========================================
// DIGITAL TWIN V2 - Built on the new architecture
// ==========================================

import SkyRenderer from './renderers/SkyRenderer.js';
import GroundRenderer from './renderers/GroundRenderer.js';
import BuildingRenderer from './renderers/BuildingRenderer.js';
import ParkingRenderer from './renderers/ParkingRenderer.js';
import VehicleRenderer from './renderers/VehicleRenderer.js';
import LightingRenderer from './renderers/LightingRenderer.js';
import AnimationLoop from './AnimationLoop.js';

class DigitalTwinV2 {
    constructor() {
        this.renderers = {
            sky: new SkyRenderer(),
            ground: new GroundRenderer(),
            buildings: new BuildingRenderer(),
            parking: new ParkingRenderer(),
            vehicles: new VehicleRenderer(),
            lighting: new LightingRenderer()
        };
        this.animationLoop = new AnimationLoop();
        this.isRunning = false;
        this.state = {
            sessions: [],
            occupancy: 0,
            capacity: 0,
            vehicles: [],
            time: new Date()
        };
    }

    init(organizationId = 'org_pcea_langata') {
        console.log('🏗️ Digital Twin V2 initializing...');
        
        // Get canvases (created by Ambient Engine)
        const cityscapeCanvas = document.getElementById('cityscape-canvas');
        const trafficCanvas = document.getElementById('traffic-canvas');
        
        if (!cityscapeCanvas || !trafficCanvas) {
            console.error('❌ Digital Twin V2: canvases not found');
            return false;
        }
        
        // Initialize each renderer
        const rendererConfigs = [
            { renderer: this.renderers.sky, canvas: cityscapeCanvas },
            { renderer: this.renderers.ground, canvas: cityscapeCanvas },
            { renderer: this.renderers.buildings, canvas: cityscapeCanvas },
            { renderer: this.renderers.parking, canvas: trafficCanvas },
            { renderer: this.renderers.vehicles, canvas: trafficCanvas },
            { renderer: this.renderers.lighting, canvas: cityscapeCanvas }
        ];
        
        rendererConfigs.forEach(({ renderer, canvas }) => {
            if (renderer && typeof renderer.init === 'function') {
                renderer.init(canvas);
            }
        });
        
        // Start the animation loop
        this.animationLoop.start(() => this.render());
        
        this.isRunning = true;
        console.log('✅ Digital Twin V2 ready');
        return true;
    }

    render() {
        // Each renderer draws independently
        this.renderers.sky.render(this.state);
        this.renderers.ground.render(this.state);
        this.renderers.buildings.render(this.state);
        this.renderers.parking.render(this.state);
        this.renderers.vehicles.render(this.state);
        this.renderers.lighting.render(this.state);
    }

    updateState(newState) {
        this.state = { ...this.state, ...newState };
    }

    addSession(session) {
        this.state.sessions.push(session);
        this.state.occupancy = this.state.sessions.length;
        // A vehicle will appear in the parking lot
        if (session.vehicle) {
            this.state.vehicles.push({
                id: session.id,
                plate: session.vehicle,
                spot: this.renderers.parking.findEmptySpot()
            });
        }
        this.render();
    }

    removeSession(sessionId) {
        this.state.sessions = this.state.sessions.filter(s => s.id !== sessionId);
        this.state.occupancy = this.state.sessions.length;
        this.state.vehicles = this.state.vehicles.filter(v => v.id !== sessionId);
        this.render();
    }

    destroy() {
        this.animationLoop.stop();
        this.isRunning = false;
        console.log('🗑️ Digital Twin V2 destroyed');
    }
}

export default new DigitalTwinV2();
