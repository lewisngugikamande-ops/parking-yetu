// ==========================================
// AMBIENT ENGINE CONFIGURATION
// ==========================================

export const ambientConfig = {
  // Default organization settings
  default: {
    capacity: 10,
    maxDisplayCars: 15,
    carScale: 1.0,
    parkingSpotSize: 60,
    animationSpeed: 1.0,
  },
  
  // Organization-specific overrides
  organizations: {
    'church_a': {
      capacity: 12,
      maxDisplayCars: 20,
    },
    'mall_b': {
      capacity: 200,
      maxDisplayCars: 40,
    },
    'office_c': {
      capacity: 50,
      maxDisplayCars: 25,
    },
    'hospital_d': {
      capacity: 80,
      maxDisplayCars: 30,
    },
    'airport_e': {
      capacity: 500,
      maxDisplayCars: 50,
    },
  }
};

// Helper to get config for an organization
export function getAmbientConfig(organizationId = 'default') {
  const base = ambientConfig.default;
  const org = ambientConfig.organizations[organizationId] || {};
  return { ...base, ...org };
}

// Helper to calculate display scale
export function getDisplayScale(sessionCount, maxDisplayCars) {
  return Math.min(sessionCount, maxDisplayCars);
}
