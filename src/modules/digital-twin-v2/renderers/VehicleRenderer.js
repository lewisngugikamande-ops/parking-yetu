class VehicleRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.vehicles = [];
        this.animating = false;
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        console.log('🚗 VehicleRenderer ready');
    }

    render(state) {
        if (!this.ctx) return;
        // Vehicles are rendered by ParkingRenderer
        // This is a placeholder for moving vehicles
    }
}

export default VehicleRenderer;
