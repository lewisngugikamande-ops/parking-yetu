// ============================================
// Parking Service - Business Logic Layer
// ============================================

import { getSessionRepository } from '../repositories/session-repository.js';
import { getVehicleRepository } from '../repositories/vehicle-repository.js';
import { getGateRepository } from '../repositories/gate-repository.js';
import { Audit } from '../core/audit.js';
import { emit } from '../core/events.js';
import { Session } from '../models/Session.js';
import { Vehicle } from '../models/Vehicle.js';
import { config } from '../config/index.js';

export class ParkingService {
    constructor() {
        this.sessionRepo = getSessionRepository();
        this.vehicleRepo = getVehicleRepository();
        this.gateRepo = getGateRepository();
    }

    async enterVehicle({ licensePlate, driverName, driverPhone, gate, locationId, isVIP = false, isStaff = false }) {
        // 1. Find or create vehicle
        let vehicle = await this.vehicleRepo.findByPlate(licensePlate);
        if (!vehicle) {
            vehicle = new Vehicle({
                licensePlate,
                organizationId: config.app.defaultOrganization
            });
            vehicle = await this.vehicleRepo.create(vehicle);
        }

        // 2. Create session
        const session = new Session({
            vehicleId: vehicle.id,
            vehiclePlate: licensePlate,
            driverName,
            driverPhone,
            gate,
            locationId: locationId || config.app.defaultLocation,
            organizationId: config.app.defaultOrganization
        });
        
        if (isVIP) session.setVIP();
        if (isStaff) session.setStaff();

        // 3. Save session
        const saved = await this.sessionRepo.create(session);

        // 4. Audit
        await Audit.vehicleEntry(saved);

        // 5. Emit event
        await emit('vehicle:entered', { session: saved });

        return saved;
    }

    async exitVehicle(sessionId, gate) {
        const session = await this.sessionRepo.exit(sessionId, gate);
        
        // Audit
        await Audit.vehicleExit(session);
        
        // Emit event
        await emit('vehicle:exited', { session });
        
        return session;
    }

    async getActiveSessions(organizationId) {
        return await this.sessionRepo.getActive(organizationId || config.app.defaultOrganization);
    }

    async findVehicle(licensePlate) {
        return await this.vehicleRepo.findByPlate(licensePlate);
    }

    async getOccupancy(organizationId) {
        const sessions = await this.getActiveSessions(organizationId);
        return {
            count: sessions.length,
            capacity: config.parking.maxCapacity,
            percentage: (sessions.length / config.parking.maxCapacity) * 100
        };
    }
}

// Singleton instance
let instance = null;
export function getParkingService() {
    if (!instance) {
        instance = new ParkingService();
    }
    return instance;
}
