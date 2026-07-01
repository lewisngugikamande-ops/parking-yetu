import { validatePlate } from '../core/utils/validation.js';

export class Vehicle {
  constructor({ licensePlate, make, model, color, type = 'Sedan', organizationId }) {
    this.id = this.generateId();
    this.licensePlate = licensePlate?.toUpperCase() || '';
    this.make = make || '';
    this.model = model || '';
    this.color = color || '';
    this.type = type;
    this.organizationId = organizationId;
    this.blacklisted = false;
    this.blacklistReason = '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.createdBy = null;
  }

  generateId() {
    return 'veh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  }

  validate() {
    const result = validatePlate(this.licensePlate);
    if (!result.valid) throw new Error(result.error);
    this.licensePlate = result.value;
    return this;
  }

  createSnapshot() {
    return {
      plate: this.licensePlate,
      make: this.make,
      model: this.model,
      type: this.type,
      color: this.color
    };
  }

  toFirestore() {
    return {
      licensePlate: this.licensePlate,
      make: this.make,
      model: this.model,
      color: this.color,
      type: this.type,
      organizationId: this.organizationId,
      isBlacklisted: this.blacklisted,
      blacklistReason: this.blacklistReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy
    };
  }

  static fromFirestore(id, data) {
    const vehicle = new Vehicle({
      licensePlate: data.licensePlate,
      make: data.make,
      model: data.model,
      color: data.color,
      type: data.type,
      organizationId: data.organizationId
    });
    vehicle.id = id;
    vehicle.blacklisted = data.isBlacklisted || false;
    vehicle.blacklistReason = data.blacklistReason || '';
    vehicle.createdAt = data.createdAt?.toDate?.() || data.createdAt || new Date();
    vehicle.updatedAt = data.updatedAt?.toDate?.() || data.updatedAt || new Date();
    vehicle.createdBy = data.createdBy || null;
    return vehicle;
  }
}
