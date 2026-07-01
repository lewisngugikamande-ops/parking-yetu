// ============================================
// Session Management
// ============================================

import { getState, setState } from './store.js';
import { User } from '../models/User.js';
import { getAuth } from '../services/firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getDb } from '../services/firebase.js';

let currentSession = null;
let sessionListeners = [];

export function createSession(userData) {
    const user = userData instanceof User ? userData : User.fromFirestore(userData);
    currentSession = user;
    setState({ user });
    notifySessionListeners(user);
    return user;
}

export function getSession() {
    return currentSession || getState().user;
}

export function clearSession() {
    currentSession = null;
    setState({ user: null });
    notifySessionListeners(null);
}

export function hasSession() {
    return !!currentSession || !!getState().user;
}

export function subscribeToSession(listener) {
    sessionListeners.push(listener);
    return () => {
        const index = sessionListeners.indexOf(listener);
        if (index > -1) sessionListeners.splice(index, 1);
    };
}

function notifySessionListeners(session) {
    sessionListeners.forEach(listener => listener(session));
}

export async function loadSession() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        clearSession();
        return null;
    }

    try {
        const db = getDb();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const userModel = User.fromFirestore(userData);
            createSession(userModel);
            return userModel;
        } else {
            clearSession();
            return null;
        }
    } catch (error) {
        console.error('Error loading session:', error);
        clearSession();
        return null;
    }
}
