// ============================================
// Authentication Module - Only Load After Login
// ============================================

import { getAuth, getDb } from '../../services/firebase.js';
import { translateError } from '../../core/errors.js';
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

var auth = getAuth();
var db = getDb();
var loginInProgress = false;
var isInitialLoad = true;

export function initAuth() {
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.switchAuthMode = switchAuthMode;
    window.handleLogout = handleLogout;

    onAuthStateChanged(auth, function(user) {
        if (user) {
            console.log('✅ User authenticated:', user.email);
            
            // Only load workstation if this is a new login, not on initial load
            if (!isInitialLoad || loginInProgress) {
                showAppAndLoadWorkstation();
            } else {
                console.log('ℹ️ Stale session detected - showing login screen');
                showLogin();
            }
            isInitialLoad = false;
            loginInProgress = false;
        } else {
            console.log('🔐 User logged out');
            showLogin();
        }
    });

    console.log('✅ Auth initialized');
}

function showAppAndLoadWorkstation() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    
    try {
        import('../../modules/workstation/index.js').then(function(module) {
            var init = module.default;
            init();
            console.log('✅ Workstation loaded');
        }).catch(function(error) {
            console.error('❌ Workstation error:', error);
        });
    } catch (error) {
        console.error('❌ Workstation error:', error);
    }
}

function showLogin() {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

async function handleLogin() {
    console.log('🔐 Login clicked');
    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value.trim();
    var errorDiv = document.getElementById('loginError');
    if (errorDiv) errorDiv.classList.remove('show');

    if (!email || !password) {
        if (errorDiv) {
            errorDiv.textContent = 'Please fill in all fields';
            errorDiv.classList.add('show');
        }
        return;
    }

    try {
        loginInProgress = true;
        isInitialLoad = false;
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Login successful');
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
        var userCredential = await createUserWithEmailAndPassword(auth, email, password);
        var user = userCredential.user;
        await updateProfile(user, { displayName: name });
        
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            role: role,
            organizationId: 'org_church_a',
            locationId: 'church_a',
            isActive: true,
            createdAt: serverTimestamp()
        });
        
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
        await signOut(auth);
        // Clear the flag so login screen shows
        isInitialLoad = true;
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
    }
}
