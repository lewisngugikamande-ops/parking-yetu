// ============================================
// Cleanup Functions
// ============================================

import { closeAllModals } from './modals.js';

let clockInterval = null;
let refreshInterval = null;
let eventUnsubscribers = [];

export function setIntervals(clock, refresh) {
    clockInterval = clock;
    refreshInterval = refresh;
}

export function addEventUnsubscriber(unsub) {
    eventUnsubscribers.push(unsub);
}

export function clearEventUnsubscribers() {
    eventUnsubscribers.forEach(unsub => {
        if (typeof unsub === 'function') unsub();
    });
    eventUnsubscribers = [];
}

export function destroyWorkstation() {
    // Clear intervals
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
    if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
    }
    
    // Unsubscribe events
    clearEventUnsubscribers();
    
    // Close all modals
    closeAllModals();
    
}
