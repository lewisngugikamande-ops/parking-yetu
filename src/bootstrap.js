// ============================================
// Bootstrap - Loads Workstation on Login
// ============================================

import { initTheme } from './utils/theme.js';
import { initAuth } from './modules/auth/auth.js';
import { getCurrentUser, onAuthStateChange } from './platform/auth.js';

let bootstrapped = false;

export async function bootstrap() {
    if (bootstrapped) return;

    console.log('🚀 Starting Parking Yetu (Access Engine)...');

    // 1. Theme
    initTheme();
    console.log('✅ Theme ready');

    // 2. Auth (exposes window functions and listens for auth changes)
    console.log('🔐 Initializing auth...');
    initAuth();
    console.log('✅ Auth initialized');

    // 3. Wait for auth state to be determined
    // The auth module will handle showing/hiding the auth screen
    // based on the auth state

    console.log('🚀 Ready!');
    bootstrapped = true;
}
