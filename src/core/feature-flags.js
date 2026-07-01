// ============================================
// Feature Flags
// ============================================

const featureFlags = {
    // Core features - always on
    workstation: true,
    auth: true,
    
    // Admin features
    admin: true,
    userManagement: true,
    
    // Reporting
    reports: false,
    analytics: false,
    
    // Payments
    payments: false,
    
    // Integrations
    anpr: false,
    mpesa: false,
    notifications: false,
    
    // Experimental
    experimentalUi: false,
    betaFeatures: false
};

export function isFeatureEnabled(feature) {
    return featureFlags[feature] || false;
}

export function enableFeature(feature) {
    if (featureFlags.hasOwnProperty(feature)) {
        featureFlags[feature] = true;
        return true;
    }
    return false;
}

export function disableFeature(feature) {
    if (featureFlags.hasOwnProperty(feature)) {
        featureFlags[feature] = false;
        return true;
    }
    return false;
}

export function getFeatureFlags() {
    return { ...featureFlags };
}

export function getEnabledFeatures() {
    return Object.keys(featureFlags).filter(key => featureFlags[key]);
}

// For development: enable all features
export function enableAllFeatures() {
    Object.keys(featureFlags).forEach(key => {
        featureFlags[key] = true;
    });
}

// For production: enable only stable features
export function setProductionFeatures() {
    Object.keys(featureFlags).forEach(key => {
        if (['workstation', 'auth', 'admin', 'userManagement'].includes(key)) {
            featureFlags[key] = true;
        } else {
            featureFlags[key] = false;
        }
    });
}
