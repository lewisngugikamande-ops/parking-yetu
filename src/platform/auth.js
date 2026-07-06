/**
 * Authentication Platform Adapter
 * Uses Access Engine API via the API client
 */

import { 
  login as apiLogin, 
  logout as apiLogout, 
  getCurrentUser as apiGetCurrentUser 
} from '../services/api-client.js';

let currentUser = null;
let authListeners = [];

export async function login(username, password) {
  const result = await apiLogin(username, password);
  currentUser = result.principal || null;
  // Notify listeners
  notifyListeners(currentUser);
  return result;
}

export async function logout() {
  await apiLogout();
  currentUser = null;
  notifyListeners(null);
}

export function getCurrentUser() {
  if (!currentUser) {
    currentUser = apiGetCurrentUser();
  }
  return currentUser;
}

// Register is not yet implemented in the API
// This is a placeholder that will be updated when the API has a register endpoint
export async function register(name, email, password, role) {
  // TODO: Implement when API has /auth/register
  throw new Error('Registration not yet implemented in Access Engine API');
}

function notifyListeners(user) {
  authListeners.forEach(callback => {
    try {
      callback(user);
    } catch (e) {
      console.error('Auth listener error:', e);
    }
  });
}

export function onAuthStateChange(callback) {
  authListeners.push(callback);
  
  // Immediately check auth status
  const checkAuth = async () => {
    const user = await apiGetCurrentUser();
    currentUser = user;
    callback(user);
  };
  checkAuth();
  
  // Return unsubscribe function
  return () => {
    authListeners = authListeners.filter(cb => cb !== callback);
  };
}
