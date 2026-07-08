export const airportTheme = {
    id: 'airport',
    name: 'Airport',
    colors: {
        primary: '#00A8E8',
        secondary: '#FF6B35',
        accent: '#FFD700'
    },
    sky: {
        dawn: { top: '#0a1a2e', middle: '#1a3a5e', bottom: '#2a5a6e' },
        day: { top: '#0a0a2a', middle: '#1a2a5e', bottom: '#2a4a7e' },
        dusk: { top: '#2a1a0a', middle: '#4a3a1a', bottom: '#6a4a2a' },
        night: { top: '#050a15', middle: '#0a1520', bottom: '#0f1a25' }
    },
    vehicles: ['shuttle', 'taxi', 'bus', 'staff-van'],
    buildingStyle: 'modern',
    scannerColor: 'rgba(0, 168, 232, 0.2)',
    trafficDensity: {
        low: 3,
        medium: 15,
        high: 40
    }
};
