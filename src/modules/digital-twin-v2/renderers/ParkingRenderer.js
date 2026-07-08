class ParkingRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.spots = [];
        this.occupiedSpots = [];
    }

    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.generateSpots();
        console.log('🅿️ ParkingRenderer ready');
    }

    generateSpots() {
        this.spots = [];
        for (let i = 1; i <= 20; i++) {
            this.spots.push({ id: i, occupied: false });
        }
    }

    findEmptySpot() {
        const empty = this.spots.find(s => !s.occupied);
        if (empty) {
            empty.occupied = true;
            this.occupiedSpots.push(empty.id);
            return empty.id;
        }
        return null;
    }

    render(state) {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const lotX = width * 0.05;
        const lotY = height * 0.05;
        const lotWidth = width * 0.9;
        const lotHeight = height * 0.85;
        
        ctx.fillStyle = 'rgba(20, 20, 40, 0.3)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 2;
        ctx.fillRect(lotX, lotY, lotWidth, lotHeight);
        ctx.strokeRect(lotX, lotY, lotWidth, lotHeight);
        
        const spotsPerRow = 10;
        const rows = 2;
        const spotWidth = (lotWidth - 20) / spotsPerRow;
        const spotHeight = (lotHeight - 20) / rows;
        
        this.spots.forEach((spot, index) => {
            if (index >= spotsPerRow * rows) return;
            
            const row = Math.floor(index / spotsPerRow);
            const col = index % spotsPerRow;
            const x = lotX + 10 + col * spotWidth;
            const y = lotY + 10 + row * spotHeight;
            
            const isOccupied = spot.occupied;
            
            ctx.fillStyle = isOccupied ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 255, 255, 0.03)';
            ctx.strokeStyle = isOccupied ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.fillRect(x, y, spotWidth - 2, spotHeight - 2);
            ctx.strokeRect(x, y, spotWidth - 2, spotHeight - 2);
            
            if (isOccupied) {
                const carColors = ['#4a90d9', '#e74c3c', '#f1c40f', '#2ecc71', '#e67e22', '#9b59b6'];
                const color = carColors[Math.floor(Math.random() * carColors.length)];
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.6;
                ctx.fillRect(x + 4, y + 4, spotWidth - 8, spotHeight - 8);
                ctx.globalAlpha = 1;
            }
        });
        
        const occupied = this.spots.filter(s => s.occupied).length;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '12px sans-serif';
        ctx.fillText(`🅿️ ${occupied}/${this.spots.length} spots occupied`, 10, 15);
    }
}

export default ParkingRenderer;
