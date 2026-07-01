import { db } from '../../core/firebase/config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ParkingSession } from '../../domain/ParkingSession.js';
import { Vehicle } from '../../domain/Vehicle.js';
import { ParkingRepository } from './repository.js';
import { validatePlate, validatePhone, validateName } from '../../core/utils/validation.js';
import { createAuditLog } from '../../core/audit/audit.js';

export class ParkingService {
  constructor(organizationId, locationId) {
    this.organizationId = organizationId;
    this.locationId = locationId;
    this.repository = new ParkingRepository(organizationId);
  }

  async enterVehicle(vehicleData, driverData, entryGate, userId) {
    const plateValidation = validatePlate(vehicleData.licensePlate);
    if (!plateValidation.valid) throw new Error(plateValidation.error);
    
    const phoneValidation = validatePhone(driverData.phone);
    if (!phoneValidation.valid) throw new Error(phoneValidation.error);
    
    const nameValidation = validateName(driverData.name);
    if (!nameValidation.valid) throw new Error(nameValidation.error);

    const vehicle = new Vehicle({
      licensePlate: plateValidation.value,
      make: vehicleData.make || '',
      model: vehicleData.model || '',
      type: vehicleData.type || 'Sedan',
      organizationId: this.organizationId
    });
    vehicle.validate();

    const session = new ParkingSession({
      vehicleId: vehicle.id,
      vehicleSnapshot: vehicle.createSnapshot(),
      driverName: nameValidation.value,
      driverPhone: phoneValidation.value,
      driverId: driverData.id || '',
      locationId: this.locationId,
      organizationId: this.organizationId,
      entryGate: entryGate,
      isVIP: driverData.isVIP || false,
      isStaff: driverData.isStaff || false,
      checkedInBy: userId
    });

    const sessionId = await this.repository.save(session, {
      action: 'VEHICLE_ENTERED',
      userId: userId,
      organizationId: this.organizationId,
      locationId: this.locationId,
      details: {
        plate: vehicle.licensePlate,
        vehicleType: vehicle.type,
        driverName: driverData.name,
        isVIP: driverData.isVIP || false,
        isStaff: driverData.isStaff || false
      }
    });

    return { sessionId, session, correlationId: session.correlationId };
  }

  async findVehicleForExit(licensePlate) {
    const validation = validatePlate(licensePlate);
    if (!validation.valid) throw new Error(validation.error);
    
    const q = query(
      collection(db, 'parking_sessions'),
      where('organizationId', '==', this.organizationId),
      where('status', '==', 'PARKED')
    );
    const snapshot = await getDocs(q);
    
    let found = null;
    snapshot.forEach(doc => {
      const data = doc.data();
      const plate = data.vehicleSnapshot?.plate || data.plate || '';
      if (plate === validation.value) {
        found = { id: doc.id, ...data };
      }
    });
    
    return found;
  }

  async exitVehicle(sessionId, exitGate, userId, notes = '') {
    const data = await this.repository.findById(sessionId);
    if (!data) throw new Error('Session not found');
    
    const session = ParkingSession.fromFirestore(sessionId, data);
    if (session.status === 'EXITED') throw new Error('Vehicle already exited');
    
    const duration = session.calculateDuration();
    session.exit(exitGate, userId);
    
    await this.repository.update(sessionId, {
      status: session.status,
      exitTime: session.exitTime,
      exitGate: session.exitGate,
      duration: session.duration,
      exitedBy: session.exitedBy
    });

    await createAuditLog({
      action: 'VEHICLE_EXITED',
      targetId: sessionId,
      targetType: 'parking_session',
      details: {
        plate: session.vehicleSnapshot?.plate || 'Unknown',
        duration: session.duration,
        exitGate: exitGate,
        notes: notes
      }
    });

    return { session, correlationId: session.correlationId };
  }

  async getActiveSessions() {
    return this.repository.findActiveSessions();
  }

  async getTodayExits() {
    return this.repository.findTodayExits();
  }

  async getStats() {
    return this.repository.getStats();
  }

  subscribeToActive(callback) {
    return this.repository.subscribeToActive(callback);
  }
}
