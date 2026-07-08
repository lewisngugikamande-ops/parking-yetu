// ==========================================
// DOMAIN - Credential
// ==========================================

export class Credential {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.identityId = data.identityId || null;
        this.type = data.type || 'visitor'; // member, visitor, staff, contractor, vip
        this.status = data.status || 'active'; // active, inactive, suspended, expired
        
        // Identity fields
        this.name = data.name || null;
        this.email = data.email || null;
        this.phone = data.phone || null;
        
        // Vehicle fields
        this.vehiclePlate = data.vehiclePlate || null;
        this.vehicleMake = data.vehicleMake || null;
        this.vehicleModel = data.vehicleModel || null;
        this.vehicleColor = data.vehicleColor || null;
        this.vehicleType = data.vehicleType || null;
        this.vehicleEmoji = data.vehicleEmoji || '🚗';
        
        // Organization
        this.organizationId = data.organizationId;
        this.locationId = data.locationId || null;
        
        // Stats
        this.visitCount = data.visitCount || 0;
        this.lastVisit = data.lastVisit || null;
        this.firstVisit = data.firstVisit || new Date();
        
        // Metadata
        this.metadata = data.metadata || {};
        this.tags = data.tags || [];
        this.notes = data.notes || null;
        
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    generateId() {
        return 'cred_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    getDisplayName() {
        if (this.name) return this.name;
        if (this.vehiclePlate) return this.vehiclePlate;
        return 'Unknown Visitor';
    }

    getVehicleDisplay() {
        if (this.vehiclePlate) {
            return `${this.vehicleEmoji} ${this.vehiclePlate}`;
        }
        return 'No vehicle';
    }

    recordVisit() {
        this.visitCount++;
        this.lastVisit = new Date();
        this.updatedAt = new Date();
    }

    updateVehicle(data) {
        if (data.plate) this.vehiclePlate = data.plate;
        if (data.make) this.vehicleMake = data.make;
        if (data.model) this.vehicleModel = data.model;
        if (data.color) this.vehicleColor = data.color;
        if (data.type) this.vehicleType = data.type;
        if (data.emoji) this.vehicleEmoji = data.emoji;
        this.updatedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            identityId: this.identityId,
            type: this.type,
            status: this.status,
            name: this.name,
            email: this.email,
            phone: this.phone,
            vehiclePlate: this.vehiclePlate,
            vehicleMake: this.vehicleMake,
            vehicleModel: this.vehicleModel,
            vehicleColor: this.vehicleColor,
            vehicleType: this.vehicleType,
            vehicleEmoji: this.vehicleEmoji,
            organizationId: this.organizationId,
            locationId: this.locationId,
            visitCount: this.visitCount,
            lastVisit: this.lastVisit,
            firstVisit: this.firstVisit,
            metadata: this.metadata,
            tags: this.tags,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
