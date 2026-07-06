/**
 * API Client for Access Engine
 * Handles authentication and API calls
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Session storage
let sessionToken = null;
let currentUser = null;

export function setSessionToken(token) {
  sessionToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getSessionToken() {
  if (!sessionToken) {
    sessionToken = localStorage.getItem('auth_token');
  }
  return sessionToken;
}

function setUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
}

function getUser() {
  if (currentUser) return currentUser;
  
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      return currentUser;
    } catch (e) {
      localStorage.removeItem('user');
    }
  }
  return null;
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getSessionToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    setSessionToken(null);
    setUser(null);
    throw new Error('Session expired. Please login again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'API request failed');
  }

  return data;
}

// ============================================
// Auth API
// ============================================

export async function login(username, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  // Store the token
  if (data.token) {
    setSessionToken(data.token);
  }

  // Store the user
  if (data.principal) {
    setUser(data.principal);
  }

  return data;
}

export async function logout() {
  // If there's a logout endpoint, call it
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    // Ignore errors on logout
    console.warn('Logout API error:', error.message);
  }
  
  setSessionToken(null);
  setUser(null);
}

export async function getCurrentUser() {
  // Check memory first
  if (currentUser) return currentUser;
  
  // Check localStorage
  const stored = getUser();
  if (stored) return stored;
  
  try {
    const data = await apiRequest('/auth/me', { method: 'GET' });
    const user = data.principal || data.user || data;
    if (user) {
      setUser(user);
    }
    return user;
  } catch (error) {
    if (error.message.includes('Session expired')) {
      setUser(null);
    }
    return null;
  }
}

// ============================================
// Parking API
// ============================================

export async function processEntry(credential, accessPointId, organizationId, metadata = {}) {
  return apiRequest('/api/entry', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      accessPointId,
      organizationId,
      metadata,
    }),
  });
}

export async function processExit(credential, accessPointId, organizationId, metadata = {}) {
  return apiRequest('/api/exit', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      accessPointId,
      organizationId,
      metadata,
    }),
  });
}

// ============================================
// Dashboard API
// ============================================

export async function getDashboard() {
  return apiRequest('/api/dashboard', { method: 'GET' });
}

// ============================================
// Export convenience
// ============================================

export default {
  login,
  logout,
  getCurrentUser,
  processEntry,
  processExit,
  getDashboard,
  setSessionToken,
  getSessionToken,
  setUser,
  getUser,
};
