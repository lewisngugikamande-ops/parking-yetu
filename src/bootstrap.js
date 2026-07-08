// ============================================
// Bootstrap - Single Application Orchestrator
// ============================================

import { initTheme } from './utils/theme.js';
import { initAuth, getCurrentUser } from './modules/auth/auth.js';
import ambientEngine from './modules/ambient/index.js';
import { initRouter, mountApp, getCurrentApp, createNavButtons } from './router/index.js';

let bootstrapped = false;
let routerInitialized = false;
let navigationElement = null;
let currentUser = null;

// Store cleanup functions
let routerCleanup = null;

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

    // 3. Auth - Gatekeeper with callback
    console.log('🔐 Initializing auth...');
    try {
        initAuth((authState) => {
            if (authState.authenticated) {
                console.log('👤 User authenticated, starting application...');
                currentUser = authState.user;
                startApplication();
            } else {
                console.log('🔐 No user, login screen shown');
                // If application was running, shut it down
                if (routerInitialized) {
                    shutdownApplication();
                }
            }
        });
        console.log('✅ Auth initialized');
    } catch (error) {
        console.error('❌ Auth initialization failed:', error);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Ready!');
    bootstrapped = true;
}

function startApplication() {
    if (routerInitialized) {
        console.log('⚠️ Application already running');
        return;
    }
    
    console.log('▶️ Starting Application...');
    console.log('🗺️ Initializing Router...');
    try {
        const container = document.getElementById('app-container');
        
        if (!container) {
            throw new Error('Fatal: #app-container is missing from index.html');
        }
        
        // Container should already be visible (showApp was called by auth)
        console.log('📦 Container ready');
        
        // Initialize router - this handles the initial route
        routerCleanup = initRouter(container);
        console.log('✅ Router initialized');
        
        // Create navigation (only once)
        if (!navigationElement) {
            navigationElement = createNavButtons();
            if (navigationElement) {
                document.body.appendChild(navigationElement);
                console.log('✅ Navigation created with icons');
            }
        } else {
            // Show existing navigation
            navigationElement.style.display = 'flex';
            console.log('✅ Navigation shown');
        }
        
        routerInitialized = true;
        console.log('✅ Application started for user:', currentUser?.name || 'Unknown');
    } catch (error) {
        console.error('❌ Application startup failed:', error);
    }
}

function shutdownApplication() {
    if (!routerInitialized) {
        console.log('⚠️ Application not running, nothing to shut down');
        return;
    }
    
    console.log('⏹️ Shutting down Application...');
    
    try {
        // 1. Unmount current app
        const currentApp = getCurrentApp();
        if (currentApp) {
            console.log(`🔄 Unmounting current app: "${currentApp}"`);
            // The router's mountApp handles unmounting
        }
        
        // 2. Hide navigation
        if (navigationElement) {
            navigationElement.style.display = 'none';
            console.log('✅ Navigation hidden');
        }
        
        // 3. Clean up router
        if (routerCleanup && typeof routerCleanup === 'function') {
            routerCleanup();
            routerCleanup = null;
        }
        
        routerInitialized = false;
        console.log('✅ Application shutdown complete');
    } catch (error) {
        console.error('❌ Application shutdown failed:', error);
    }
}

// Expose for debugging and logout
if (typeof window !== 'undefined') {
    window.__app = {
        start: startApplication,
        stop: shutdownApplication,
        isRunning: () => routerInitialized,
        getUser: () => currentUser
    };
    console.log('📱 App controller exposed as window.__app');
}
