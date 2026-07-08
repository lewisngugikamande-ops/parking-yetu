// ============================================
// Bootstrap - Single Application Orchestrator
// ============================================

import { initTheme } from './utils/theme.js';
import { initAuth } from './modules/auth/auth.js';
import ambientEngine from './modules/ambient/index.js';

let bootstrapped = false;

export async function bootstrap() {
    if (bootstrapped) return;

    console.log('🚀 Starting Access Engine...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 1. Theme
    console.log('🎨 Initializing theme...');
    initTheme();
    console.log('✅ Theme ready');

    // 2. Ambient Engine (Background, Sky, Particles, Digital Twin)
    console.log('🌅 Initializing Ambient Engine...');
    try {
        ambientEngine.init(document.body);
        console.log('✅ Ambient Engine ready');
    } catch (error) {
        console.error('❌ Ambient Engine failed:', error);
    }

    // 3. Auth (exposes window functions and listens for auth changes)
    console.log('🔐 Initializing auth...');
    try {
        initAuth();
        console.log('✅ Auth initialized');
    } catch (error) {
        console.error('❌ Auth initialization failed:', error);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Ready!');
    bootstrapped = true;
}
