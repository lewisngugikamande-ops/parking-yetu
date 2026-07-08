export function MyVehicles({ data }) {
  const vehicles = data?.vehicles || [];
  
  if (vehicles.length === 0) {
    return `
      <div class="widget widget-vehicles" data-widget="MyVehicles">
        <div class="widget-header">
          <span class="widget-icon">🚗</span>
          <span class="widget-title">My Vehicles</span>
        </div>
        <div class="widget-body">
          <div class="vehicles-empty">No vehicles registered</div>
          <button class="btn-secondary" onclick="window.addVehicle()" style="margin-top:12px;width:100%;">
            ➕ Add Vehicle
          </button>
        </div>
      </div>
    `;
  }
  
  const items = vehicles.map(vehicle => `
    <div class="vehicle-item ${vehicle.isActive ? 'vehicle-active' : 'vehicle-inactive'}">
      <span class="vehicle-plate">${vehicle.plate}</span>
      <span class="vehicle-type">${vehicle.type}</span>
      <span class="vehicle-status">${vehicle.isActive ? '🟢 Active' : '⚪ Inactive'}</span>
    </div>
  `).join('');
  
  return `
    <div class="widget widget-vehicles" data-widget="MyVehicles">
      <div class="widget-header">
        <span class="widget-icon">🚗</span>
        <span class="widget-title">My Vehicles</span>
        <span class="widget-badge">${vehicles.length}</span>
      </div>
      <div class="widget-body">
        ${items}
        <button class="btn-secondary" onclick="window.addVehicle()" style="margin-top:12px;width:100%;">
          ➕ Add Vehicle
        </button>
      </div>
    </div>
  `;
}

export function initMyVehicles() {
  window.addVehicle = function() {
    // Open entry modal to add a vehicle
    import('../../workstation/entry-modal.js').then(module => {
      module.openEntryModal();
    });
  };
}
