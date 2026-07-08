export const churchTheme = {
    id: 'church',
    name: 'Church',
    colors: {
        primary: '#6C3CE1',
        secondary: '#00D4FF',
        accent: '#00FF88'
    },
    sky: {
        night: { top: '#050510', middle: '#0a0a1a', bottom: '#0f0a1f' },
        dawn: { top: '#1a0a2e', middle: '#2a1a4e', bottom: '#4a2a5e' },
        morning: { top: '#0a0a1a', middle: '#1a1a3e', bottom: '#2a1a4e' },
        day: { top: '#0a0a1a', middle: '#1a1a3e', bottom: '#2a1a4e' },
        dusk: { top: '#2a0a1a', middle: '#4a1a2e', bottom: '#6a2a3e' }
    },
    vehicles: ['sedan', 'suv', 'minivan', 'pickup'],
    buildingStyle: 'modern',
    scannerColor: 'rgba(108, 60, 225, 0.2)',
    trafficDensity: {
        low: 5,
        medium: 20,
        high: 50
    }
};
