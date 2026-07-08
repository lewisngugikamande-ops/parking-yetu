import { 
  getDashboard as apiGetDashboard,
  getCurrentVisit as apiGetCurrentVisit,
  getMemberHistory as apiGetMemberHistory,
  getMemberVehicles as apiGetMemberVehicles
} from '../../services/api-client.js';

let dashboardData = {
  active: 0,
  today: 0,
  exits: 0,
  activities: [],
  alerts: [],
  currentVisit: null,
  history: [],
  vehicles: []
};

export async function fetchDashboardData() {
  try {
    // Fetch general dashboard data
    const dashData = await apiGetDashboard();
    dashboardData.active = dashData.activeSessions || 0;
    dashboardData.today = dashData.todayEntries || 0;
    dashboardData.exits = dashData.todayExits || 0;
    dashboardData.activities = dashData.recentActivity || [];
    dashboardData.alerts = dashData.alerts || [];
    
    // Fetch member-specific data
    try {
      const currentVisit = await apiGetCurrentVisit();
      dashboardData.currentVisit = currentVisit;
    } catch (e) {
      console.warn('Failed to fetch current visit:', e.message);
    }
    
    try {
      const history = await apiGetMemberHistory();
      dashboardData.history = history.history || [];
    } catch (e) {
      console.warn('Failed to fetch history:', e.message);
    }
    
    try {
      const vehicles = await apiGetMemberVehicles();
      dashboardData.vehicles = vehicles.vehicles || [];
    } catch (e) {
      console.warn('Failed to fetch vehicles:', e.message);
    }
    
    return dashboardData;
  } catch (error) {
    console.warn('Failed to fetch dashboard data:', error.message);
    return dashboardData;
  }
}

export function getDashboardData() {
  return dashboardData;
}
