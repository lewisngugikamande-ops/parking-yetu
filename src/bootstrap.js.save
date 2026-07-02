// ============================================
// Bootstrap - Loads Workstation on Login
// ============================================

import { initializeFirebase } from './services/firebase.js';
import { initTheme } from './utils/theme.js';
import { OrganizationService } from './core/organization-service.js';
import { OperatorService } from './core/operator-service.js';
import { initAuth } from './modules/auth/auth.js';
import { navigateTo } from './core/router.js';

let bootstrapped = false;

export async function bootstrap() {
    if (bootstrapped) return;

    console.log('🚀 Starting Parking Yetu...');

    // 1. Firebase
    console.log('📡 Initializing Firebase...');
    initializeFirebase();
    console.log('✅ Firebase ready');

    // 2. Theme
    initTheme();
    console.log('✅ Theme ready');

    // 3. Organization
    console.log('🏢 Loading organization...');
    try {
        await OrganizationService.load('org_church_a');
        console.log('✅ Organization loaded');
    } catch (error) {
        console.error('❌ Failed to load organization:', error);
    }

    // 4. Auth (exposes window functions)
    console.log('🔐 Initializing auth...');
    initAuth();
    console.log('✅ Auth initialized');

    // 5. Operator Service
    console.log('👤 Initializing operator service...');
    OperatorService.init();
    console.log('✅ Operator service ready');

    // 6. Check if already logged in
    const operator = OperatorService.getCurrent();
    if (operator) {
        console.log('👤 Welcome back,', operator.displayName);
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        await loadWorkstation();
    } else {
        console.log('🔐 Please login');
    }

    console.log('🚀 Ready!');
    bootstrapped = true;
}

// Function to load workstation dynamically
async function loadWorkstation() {
    try {
        console.log('🚗 Loading Workstation...');
        const { default: initWorkstation } = await import('./modules/workstation/index.js');
        await initWorkstation();
        console.log('✅ Workstation loaded');
    } catch (error) {
        console.error('❌ Failed to load workstation:', error);
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div style="padding:20px;text-align:center;color:var(--text-secondary);">
                    <div style="font-size:48px;margin-bottom:16px;">⚠️</div>
                    <h3>Failed to load workstation</h3>
                    <p style="color:var(--text-muted);">${error.message}</p>
                </div>
            `;
        }
    }
}
