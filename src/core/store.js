// ============================================
// App Store - Single Source of Truth
// ============================================

const initialState = {
    user: null,
    session: null,
    organization: null,
    location: null,
    gate: null,
    theme: localStorage.getItem('parking-theme') || 'dark',
    networkStatus: navigator.onLine ? 'online' : 'offline',
    permissions: [],
    features: {
        workstation: true,
        admin: true,
        reports: false,
        analytics: false,
        payments: false
    },
    isLoading: false,
    error: null
};

let state = { ...initialState };
const listeners = [];

export function getState() {
    return state;
}

export function setState(newState) {
    state = { ...state, ...newState };
    listeners.forEach(listener => listener(state));
}

export function subscribe(listener) {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
    };
}

export function resetState() {
    state = { ...initialState };
    listeners.forEach(listener => listener(state));
}

export function getStore() {
    return {
        state,
        getState,
        setState,
        subscribe,
        resetState
    };
}
