import { generateCorrelationId } from '../core/utils/correlation.js';

export class ParkingSession {
  constructor({
    vehicleId,
    vehicleSnapshot,
    driverName,
    driverPhone,
    driverId,
    locationId,
    organizationId,
    entryGate,
    isVIP = false,
    isStaff = false,
    checkedInBy = null
  }) {
    this.id = this.generateId();
    this.vehicleId = vehicleId;
    this.vehicleSnapshot = vehicleSnapshot;
    this.driverName = driverName || '';
    this.driverPhone = driverPhone || '';
    this.driverId = driverId || '';
    this.locationId = locationId;
    this.organizationId = organizationId;
    this.entryGate = entryGate;
    this.isVIP = isVIP;
    this.isStaff = isStaff;
    this.checkedInBy = checkedInBy;
    this.entryTime = new Date();
    this.status = 'PARKED';
    this.exitTime = null;
    this.exitGate = null;
    this.exitedBy = null;
    this.duration = 0;
    this.flagged = false;
    this.flagReason = '';
    this.currentPaymentStatus = 'PENDING';
    this.photo = null;
    this.correlationId = generateCorrelationId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  generateId() {
    return 'ses_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  }

  calculateDuration(now = new Date()) {
    const diffMs = now - this.entryTime;
    return Math.floor(diffMs / 60000);
  }

  getDurationText(now = new Date()) {
    const minutes = this.calculateDuration(now);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }

  isOverdue(timeLimitMinutes = 180) {
    return this.calculateDuration() > timeLimitMinutes;
  }

  exit(exitGate, exitedBy) {
    if (this.status === 'EXITED') throw new Error('Already exited');
    this.exitTime = new Date();
    this.exitGate = exitGate;
    this.duration = this.calculateDuration(this.exitTime);
    this.status = 'EXITED';
    this.exitedBy = exitedBy;
    this.updatedAt = new Date();
    return this;
  }

  toFirestore() {
    return {
      vehicleId: this.vehicleId,
      vehicleSnapshot: this.vehicleSnapshot,
      driverName: this.driverName,
      driverPhone: this.driverPhone,
      driverId: this.driverId,
      entryTime: this.entryTime,
      entryGate: this.entryGate,
      locationId: this.locationId,
      organizationId: this.organizationId,
      status: this.status,
      isVIP: this.isVIP,
      isStaff: this.isStaff,
      duration: this.duration,
      exitTime: this.exitTime,
      exitGate: this.exitGate,
      exitedBy: this.exitedBy,
      checkedInBy: this.checkedInBy,
      flagged: this.flagged,
      flagReason: this.flagReason,
      currentPaymentStatus: this.currentPaymentStatus,
      photo: this.photo,
      correlationId: this.correlationId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromFirestore(id, data) {
    const session = new ParkingSession({
      vehicleId: data.vehicleId,
      vehicleSnapshot: data.vehicleSnapshot,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      driverId: data.driverId,
      locationId: data.locationId,
      organizationId: data.organizationId,
      entryGate: data.entryGate,
      isVIP: data.isVIP || false,
      isStaff: data.isStaff || false,
      checkedInBy: data.checkedInBy || null
    });
    session.id = id;
    session.entryTime = data.entryTime?.toDate?.() || data.entryTime || new Date();
    session.status = data.status || 'PARKED';
    session.duration = data.duration || 0;
    session.exitTime = data.exitTime?.toDate?.() || data.exitTime || null;
    session.exitGate = data.exitGate || null;
    session.exitedBy = data.exitedBy || null;
    session.flagged = data.flagged || false;
    session.flagReason = data.flagReason || '';
    session.currentPaymentStatus = data.currentPaymentStatus || 'PENDING';
    session.photo = data.photo || null;
    session.correlationId = data.correlationId || generateCorrelationId();
    session.createdAt = data.createdAt?.toDate?.() || data.createdAt || new Date();
    session.updatedAt = data.updatedAt?.toDate?.() || data.updatedAt || new Date();
    return session;
  }
}
