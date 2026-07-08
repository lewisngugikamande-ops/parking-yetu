// ==========================================
// PLATFORM AUTH - Authentication Module
// ==========================================

import apiClient from '../services/api-client.js';

let currentUser = null;
let authListeners = [];

// Load user from localStorage on init
try {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
} catch (e) {
    console.warn('Failed to load saved user:', e);
}

export async function login(email, password) {
    try {
        const result = await apiClient.login(email, password);
        if (result.success) {
            currentUser = result.data;
            localStorage.setItem('auth_user', JSON.stringify(currentUser));
            notifyListeners('login', currentUser);
            return { success: true, user: currentUser };
        }
        return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

export async function register(name, email, password) {
    try {
        const result = await apiClient.post('/auth/register', { name, email, password });
        if (result.success) {
            currentUser = result.data;
            localStorage.setItem('auth_user', JSON.stringify(currentUser));
            notifyListeners('register', currentUser);
            return { success: true, user: currentUser };
        }
        return { success: false, error: result.error || 'Registration failed' };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
    }
}

export async function logout() {
    try {
        await apiClient.logout();
        currentUser = null;
        localStorage.removeItem('auth_user');
        notifyListeners('logout', null);
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
}

export function getCurrentUser() {
    return currentUser;
}

export function onAuthStateChange(callback) {
    authListeners.push(callback);
    // Immediately call with current state
    callback(currentUser);
    return () => {
        authListeners = authListeners.filter(cb => cb !== callback);
    };
}

function notifyListeners(event, user) {
    authListeners.forEach(callback => {
        try {
            callback(user);
        } catch (e) {
            console.warn('Auth listener error:', e);
        }
    });
}

// Expose for window
if (typeof window !== 'undefined') {
    window.__auth = {
        login,
        register,
        logout,
        getCurrentUser,
        onAuthStateChange
    };
}
