// ============================================
// Domain Model: Vehicle
// ============================================

export class Vehicle {
    constructor({ id, licensePlate, make, model, color, type, organizationId, blacklisted, ownerId }) {
        this.id = id || null;
        this.licensePlate = licensePlate?.toUpperCase() || '';
        this.make = make || '';
        this.model = model || '';
        this.color = color || '';
        this.type = type || 'Sedan';
        this.organizationId = organizationId || 'org_church_a';
        this.blacklisted = blacklisted || false;
        this.blacklistReason = '';
        this.ownerId = ownerId || '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    generateId() {
        return 'veh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    }

    // Validate license plate
    isValidPlate() {
        const regex = /^[A-Z]{3}\d{3}[A-Z]?$/;
        return regex.test(this.licensePlate.replace(/\s/g, ''));
    }

    // Get display name
    getDisplayName() {
        return this.licensePlate + (this.make ? ` (${this.make} ${this.model})` : '');
    }

    // Create snapshot for parking session
    createSnapshot() {
        return {
            plate: this.licensePlate,
            make: this.make,
            model: this.model,
            type: this.type,
            color: this.color
        };
    }

    // Convert to plain object
    toPlain() {
        return {
            id: this.id,
            licensePlate: this.licensePlate,
            make: this.make,
            model: this.model,
            color: this.color,
            type: this.type,
            organizationId: this.organizationId,
            blacklisted: this.blacklisted,
            blacklistReason: this.blacklistReason,
            ownerId: this.ownerId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Create from plain object
    static fromPlain(data) {
        const vehicle = new Vehicle({
            id: data.id,
            licensePlate: data.licensePlate,
            make: data.make,
            model: data.model,
            color: data.color,
            type: data.type,
            organizationId: data.organizationId,
            blacklisted: data.blacklisted || false,
            ownerId: data.ownerId
        });
        vehicle.blacklistReason = data.blacklistReason || '';
        vehicle.createdAt = data.createdAt || new Date();
        vehicle.updatedAt = data.updatedAt || new Date();
        return vehicle;
    }
}
