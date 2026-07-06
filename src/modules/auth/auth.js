// ============================================
// Authentication Module - Uses Access Engine
// ============================================

import { 
    login as platformLogin,
    register as platformRegister,
    logout as platformLogout,
    onAuthStateChange,
    getCurrentUser
} from '../../platform/auth.js';
import { translateError } from '../../core/errors.js';

var loginInProgress = false;
var isInitialLoad = true;
var authChecked = false;

export function initAuth() {
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.switchAuthMode = switchAuthMode;
    window.handleLogout = handleLogout;

    // Listen for auth state changes
    onAuthStateChange(function(user) {
        console.log('🔐 Auth state changed:', user ? 'Authenticated' : 'Logged out');
        
        if (user) {
            console.log('✅ User authenticated:', user.subject || user.username || 'User');
            authChecked = true;
            showAppAndLoadWorkstation();
        } else {
            console.log('🔐 User logged out');
            authChecked = true;
            showLogin();
        }
    });

    // Check if we already have a user (from localStorage)
    const existingUser = getCurrentUser();
    if (existingUser) {
        console.log('👤 Found existing user, waiting for auth check...');
        // The onAuthStateChange will handle showing the app
    } else {
        console.log('🔐 No existing user, showing login');
        showLogin();
    }

    console.log('✅ Auth initialized');
}

function showAppAndLoadWorkstation() {
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (authScreen) authScreen.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
    
    // Only load workstation if it hasn't been loaded yet
    if (!window.__workstationLoaded) {
        try {
            import('../../modules/workstation/index.js').then(function(module) {
                var init = module.default;
                init();
                window.__workstationLoaded = true;
                console.log('✅ Workstation loaded');
            }).catch(function(error) {
                console.error('❌ Workstation error:', error);
            });
        } catch (error) {
            console.error('❌ Workstation error:', error);
        }
    }
}

function showLogin() {
    const authScreen = document.getElementById('authScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (authScreen) authScreen.style.display = 'flex';
    if (appContainer) appContainer.style.display = 'none';
}

async function handleLogin() {
    console.log('🔐 Login clicked');
    var username = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value.trim();
    var errorDiv = document.getElementById('loginError');
    if (errorDiv) errorDiv.classList.remove('show');

    if (!username) {
        if (errorDiv) {
            errorDiv.textContent = 'Please enter your username';
            errorDiv.classList.add('show');
        }
        return;
    }

    try {
        loginInProgress = true;
        isInitialLoad = false;
        await platformLogin(username, password || 'mock');
        console.log('✅ Login successful');
        // The onAuthStateChange will handle showing the app
    } catch (error) {
        loginInProgress = false;
        console.error('❌ Login error:', error);
        if (errorDiv) {
            var translated = translateError(error);
            errorDiv.textContent = translated.message + ' ' + translated.action;
            errorDiv.classList.add('show');
        }
    }
}

async function handleRegister() {
    console.log('📝 Register clicked');
    var name = document.getElementById('registerName').value.trim();
    var email = document.getElementById('registerEmail').value.trim();
    var password = document.getElementById('registerPassword').value.trim();
    var role = document.getElementById('registerRole').value;
    var errorDiv = document.getElementById('registerError');
    if (errorDiv) errorDiv.classList.remove('show');

    if (!name || !email || !password) {
        if (errorDiv) {
            errorDiv.textContent = 'Please fill in all fields';
            errorDiv.classList.add('show');
        }
        return;
    }

    if (password.length < 6) {
        if (errorDiv) {
            errorDiv.textContent = 'Password must be at least 6 characters';
            errorDiv.classList.add('show');
        }
        return;
    }

    try {
        await platformRegister(name, email, password, role);
        console.log('✅ Registration successful');
        alert('Registration successful! Please login.');
        switchAuthMode('login');
        var pwdField = document.getElementById('registerPassword');
        if (pwdField) pwdField.value = '';
    } catch (error) {
        console.error('❌ Registration error:', error);
        if (errorDiv) {
            var translated = translateError(error);
            errorDiv.textContent = translated.message + ' ' + translated.action;
            errorDiv.classList.add('show');
        }
    }
}

function switchAuthMode(mode) {
    console.log('🔄 Switching to:', mode);
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    var authSubtitle = document.getElementById('authSubtitle');
    
    if (mode === 'login') {
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
        if (authSubtitle) authSubtitle.textContent = 'Welcome Back';
        var err = document.getElementById('loginError');
        if (err) err.classList.remove('show');
    } else {
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
        if (authSubtitle) authSubtitle.textContent = 'Create Account';
        var err2 = document.getElementById('registerError');
        if (err2) err2.classList.remove('show');
    }
}

async function handleLogout() {
    try {
        await platformLogout();
        window.__workstationLoaded = false;
        isInitialLoad = true;
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
    }
}
