export const dashboardConfig = {
  guard: {
    id: 'guard',
    name: 'Guard Dashboard',
    widgets: ['ActiveSessions', 'LiveFeed', 'QuickSearch', 'ScanQR', 'Alerts']
  },
  manager: {
    id: 'manager',
    name: 'Security Manager Dashboard',
    widgets: ['ActiveSessions', 'LiveFeed', 'MultiSite', 'StaffActivity', 'Alerts']
  },
  admin: {
    id: 'admin',
    name: 'Admin Dashboard',
    widgets: ['ActiveSessions', 'LiveFeed', 'Analytics', 'Reports', 'Users', 'Vehicles', 'Organizations', 'Alerts']
  },
  member: {
    id: 'member',
    name: 'My Dashboard',
    widgets: ['CurrentVisit', 'EntryQR', 'ExitQR', 'MyHistory', 'MyVehicles']
  }
};
