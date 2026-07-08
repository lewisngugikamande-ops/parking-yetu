// ==========================================
// CINEMATIC BACKGROUND INITIALIZER
// ==========================================

import trafficSystem from './traffic.js';

export function initCinematicBackground() {
    // Create sky
    const sky = document.createElement('div');
    sky.className = `sky ${isNight() ? 'night' : 'day'}`;
    document.body.prepend(sky);

    // Create cityscape
    const cityscape = document.createElement('div');
    cityscape.className = 'cityscape';
    cityscape.innerHTML = `
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" style="width:100%;height:100%;">
            <rect x="0" y="40" width="40" height="80" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="50" y="20" width="30" height="100" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="90" y="50" width="25" height="70" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="130" y="10" width="35" height="110" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="180" y="35" width="20" height="85" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="215" y="55" width="40" height="65" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="270" y="15" width="25" height="105" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="310" y="45" width="30" height="75" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="355" y="25" width="35" height="95" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="405" y="55" width="20" height="65" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="440" y="5" width="40" height="115" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="495" y="35" width="25" height="85" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="535" y="50" width="30" height="70" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="580" y="20" width="35" height="100" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="630" y="45" width="20" height="75" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="665" y="10" width="40" height="110" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="720" y="40" width="25" height="80" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="760" y="55" width="30" height="65" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="805" y="25" width="35" height="95" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="855" y="45" width="20" height="75" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="890" y="15" width="40" height="105" rx="2" fill="rgba(255,255,255,0.1)"/>
            <rect x="945" y="35" width="30" height="85" rx="2" fill="rgba(255,255,255,0.1)"/>
        </svg>
    `;
    document.body.prepend(cityscape);

    // Create roads
    const roads = document.createElement('div');
    roads.className = 'roads';
    roads.innerHTML = `
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style="width:100%;height:100%;">
            <line x1="200" y1="200" x2="350" y2="0" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
            <line x1="500" y1="200" x2="500" y2="0" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
            <line x1="800" y1="200" x2="650" y2="0" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
            <line x1="0" y1="200" x2="250" y2="0" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
            <line x1="1000" y1="200" x2="750" y2="0" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
        </svg>
    `;
    document.body.prepend(roads);

    // Create traffic lanes
    const traffic = document.createElement('div');
    traffic.className = 'traffic-container';
    traffic.innerHTML = `
        <div class="lane lane-far"></div>
        <div class="lane lane-mid"></div>
        <div class="lane lane-near"></div>
    `;
    document.body.prepend(traffic);

    // Create scanner pulse
    const scanner = document.createElement('div');
    scanner.className = 'scanner-pulse';
    document.body.prepend(scanner);

    // Initialize traffic system
    setTimeout(() => {
        trafficSystem.init();
    }, 500);

    // Theme toggle handler
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const skyEl = document.querySelector('.sky');
            if (skyEl) {
                skyEl.className = `sky ${isNight() ? 'night' : 'day'}`;
            }
        });
    }
}

function isNight() {
    const hour = new Date().getHours();
    return hour < 6 || hour > 18;
}

export function updateTrafficDensity(sessionCount) {
    trafficSystem.updateSessionCount(sessionCount);
}
