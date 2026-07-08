// ==========================================
// AUTH MODULE - Authentication UI and Logic
// ==========================================

import { 
    login as platformLogin,
    register as platformRegister,
    logout as platformLogout,
    onAuthStateChange,
    getCurrentUser
} from '../../platform/auth.js';

let loginInProgress = false;
let isInitialLoad = true;

// DOM elements
let authScreen, appContainer, loginForm, registerForm;
let loginEmail, loginPassword, loginError;
let registerName, registerEmail, registerPassword, registerError;

// Callback for when auth state changes
let authStateCallback = null;

// -------- Exported Functions --------

export function initAuth(onAuthStateChangeCallback) {
    // Store the callback
    authStateCallback = onAuthStateChangeCallback;
    
    // Get DOM elements
    authScreen = document.getElementById('authScreen');
    appContainer = document.getElementById('app-container');
    loginForm = document.getElementById('loginForm');
    registerForm = document.getElementById('registerForm');
    loginEmail = document.getElementById('loginEmail');
    loginPassword = document.getElementById('loginPassword');
    loginError = document.getElementById('loginError');
    registerName = document.getElementById('registerName');
    registerEmail = document.getElementById('registerEmail');
    registerPassword = document.getElementById('registerPassword');
    registerError = document.getElementById('registerError');

    // Set up event listeners
    setupEventListeners();

    // Check auth state
    onAuthStateChange((user) => {
        if (user) {
            showApp();
            console.log('👤 User authenticated:', user.name);
            if (authStateCallback) {
                authStateCallback({ authenticated: true, user });
            }
        } else if (!isInitialLoad) {
            showAuth();
            console.log('🔐 User not authenticated');
            if (authStateCallback) {
                authStateCallback({ authenticated: false, user: null });
            }
        }
        isInitialLoad = false;
    });

    // Check existing user and notify immediately
    const existingUser = getCurrentUser();
    if (existingUser) {
        console.log('👤 Found existing user');
        showApp();
        if (authStateCallback) {
            authStateCallback({ authenticated: true, user: existingUser });
        }
    } else {
        console.log('🔐 No existing user, showing login');
        showAuth();
        if (authStateCallback) {
            authStateCallback({ authenticated: false, user: null });
        }
    }
}

export async function logoutWithCleanup() {
    console.log('🚪 Logging out with cleanup...');
    
    // Call the app shutdown if available via callback
    if (authStateCallback) {
        authStateCallback({ authenticated: false, user: null });
    }
    
    // Perform the actual logout
    const result = await platformLogout();
    
    // Show auth screen
    showAuth();
    
    console.log('✅ Logout complete');
    return result;
}

// Re-export from platform/auth.js
export { onAuthStateChange, getCurrentUser };

// -------- Internal Functions --------

function setupEventListeners() {
    // Login form submit
    const loginBtn = document.querySelector('#loginForm .btn-primary');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    // Register form submit
    const registerBtn = document.querySelector('#registerForm .btn-primary');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }

    // Enter key support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (loginForm && loginForm.style.display !== 'none') {
                handleLogin();
            } else if (registerForm && registerForm.style.display !== 'none') {
                handleRegister();
            }
        }
    });
}

async function handleLogin() {
    if (loginInProgress) return;
    
    const email = loginEmail?.value?.trim();
    const password = loginPassword?.value?.trim();

    if (!email || !password) {
        showLoginError('Please enter both email and password');
        return;
    }

    loginInProgress = true;
    hideLoginError();

    try {
        const result = await platformLogin(email, password);
        if (result.success) {
            console.log('✅ Login successful');
            showApp();
            if (authStateCallback) {
                authStateCallback({ authenticated: true, user: result.user });
            }
        } else {
            showLoginError(result.error || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showLoginError('An unexpected error occurred');
    } finally {
        loginInProgress = false;
    }
}

async function handleRegister() {
    const name = registerName?.value?.trim();
    const email = registerEmail?.value?.trim();
    const password = registerPassword?.value?.trim();

    if (!name || !email || !password) {
        showRegisterError('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showRegisterError('Password must be at least 6 characters');
        return;
    }

    try {
        const result = await platformRegister(name, email, password);
        if (result.success) {
            console.log('✅ Registration successful');
            showApp();
            if (authStateCallback) {
                authStateCallback({ authenticated: true, user: result.user });
            }
        } else {
            showRegisterError(result.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showRegisterError('An unexpected error occurred');
    }
}

function showLoginError(message) {
    if (loginError) {
        loginError.textContent = message;
        loginError.style.display = 'block';
    }
}

function hideLoginError() {
    if (loginError) {
        loginError.style.display = 'none';
    }
}

function showRegisterError(message) {
    if (registerError) {
        registerError.textContent = message;
        registerError.style.display = 'block';
    }
}

function showAuth() {
    if (authScreen) authScreen.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
}

function showApp() {
    if (authScreen) authScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
}

// -------- Global Exposures (for onclick handlers) --------

if (typeof window !== 'undefined') {
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.switchAuthMode = function(mode) {
        if (mode === 'login') {
            if (loginForm) loginForm.style.display = 'block';
            if (registerForm) registerForm.style.display = 'none';
            const subtitle = document.getElementById('authSubtitle');
            if (subtitle) subtitle.textContent = 'Smart Parking Platform';
        } else {
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
            const subtitle = document.getElementById('authSubtitle');
            if (subtitle) subtitle.textContent = 'Create your account';
        }
    };
    window.toggleTheme = function() {
        document.body.classList.toggle('dark-theme');
    };
}
