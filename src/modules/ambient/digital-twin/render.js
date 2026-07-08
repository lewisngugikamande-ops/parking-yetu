// ==========================================
// RENDER HELPER - For Digital Twin
// ==========================================

export function renderBuildings(container, count = 15) {
    if (!container) {
        container = document.createElement('div');
        container.id = 'building-container';
        container.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50vh;
            pointer-events: none;
            z-index: 0;
            opacity: 0.4;
        `;
        document.body.appendChild(container);
    }
    
    let svg = '<svg width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid meet">';
    svg += `<rect x="0" y="520" width="1200" height="80" fill="rgba(10,10,20,0.5)" />`;
    
    const colors = [
        'rgba(40, 40, 60, 0.7)',
        'rgba(50, 50, 70, 0.6)',
        'rgba(60, 60, 80, 0.5)',
        'rgba(30, 30, 50, 0.8)',
        'rgba(45, 45, 65, 0.6)',
    ];
    
    for (let i = 0; i < count; i++) {
        const x = 50 + i * 75 + Math.random() * 20;
        const width = 40 + Math.random() * 50;
        const height = 80 + Math.random() * 250;
        const y = 520 - height;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const litWindows = Math.floor(Math.random() * 15) + 5;
        
        svg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" stroke="rgba(255,255,255,0.05)" stroke-width="1" rx="2" />`;
        
        const cols = Math.floor(width / 12);
        const rows = Math.floor(height / 18);
        let litCount = 0;
        
        for (let row = 0; row < Math.min(rows, 10); row++) {
            for (let col = 0; col < Math.min(cols, 6); col++) {
                const wx = x + 4 + col * 12;
                const wy = y + 6 + row * 18;
                const isLit = litCount < litWindows;
                litCount++;
                svg += `<rect x="${wx}" y="${wy}" width="5" height="8" fill="${isLit ? 'rgba(255,255,200,0.5)' : 'rgba(80,80,120,0.2)'}" rx="1" />`;
            }
        }
        
        if (Math.random() > 0.6) {
            svg += `<rect x="${x + width/2 - 5}" y="${y - 8}" width="10" height="8" fill="rgba(60,60,80,0.4)" rx="1" />`;
        }
    }
    
    svg += '</svg>';
    container.innerHTML = svg;
    return container;
}

export function renderParking(container) {
    if (!container) {
        container = document.createElement('div');
        container.id = 'parking-container';
        container.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 15vh;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.appendChild(container);
    }
    
    let svg = '<svg width="100%" height="100%" viewBox="0 0 1200 200">';
    svg += `<rect x="100" y="20" width="1000" height="160" fill="rgba(30,30,50,0.3)" rx="4" />`;
    svg += `<rect x="100" y="20" width="1000" height="160" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2" rx="4" />`;
    
    const spots = 20;
    const spotsPerRow = 10;
    const spotWidth = 70;
    const spotHeight = 40;
    const startX = 130;
    const startY = 40;
    
    for (let i = 0; i < spots; i++) {
        const row = Math.floor(i / spotsPerRow);
        const col = i % spotsPerRow;
        const x = startX + col * (spotWidth + 10);
        const y = startY + row * (spotHeight + 10);
        const isOccupied = Math.random() > 0.4;
        
        svg += `<rect x="${x}" y="${y}" width="${spotWidth}" height="${spotHeight}" fill="${isOccupied ? 'rgba(0,255,136,0.05)' : 'rgba(255,255,255,0.03)'}" stroke="rgba(255,255,255,0.08)" stroke-width="1" rx="2" />`;
        
        if (isOccupied) {
            const carColors = ['#4a90d9', '#e74c3c', '#f1c40f', '#2ecc71', '#e67e22', '#9b59b6'];
            const color = carColors[Math.floor(Math.random() * carColors.length)];
            svg += `<rect x="${x + 8}" y="${y + 8}" width="${spotWidth - 16}" height="${spotHeight - 16}" fill="${color}" rx="3" opacity="0.6" />`;
            svg += `<rect x="${x + 12}" y="${y + 12}" width="8" height="10" fill="rgba(255,255,255,0.1)" rx="1" />`;
            svg += `<rect x="${x + spotWidth - 20}" y="${y + 12}" width="8" height="10" fill="rgba(255,255,255,0.1)" rx="1" />`;
        }
    }
    
    svg += '</svg>';
    container.innerHTML = svg;
    return container;
}
