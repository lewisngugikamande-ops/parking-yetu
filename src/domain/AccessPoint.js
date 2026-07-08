// ==========================================
// DOMAIN - Access Point
// ==========================================

export class AccessPoint {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.organizationId = data.organizationId;
        this.locationId = data.locationId;
        this.name = data.name;
        this.type = data.type || 'gate'; // gate, door, elevator, etc.
        this.direction = data.direction || 'entry'; // entry, exit, both
        this.qrCode = data.qrCode || this.generateQR();
        this.policyIds = data.policyIds || [];
        this.status = data.status || 'active';
        this.metadata = data.metadata || {};
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    generateId() {
        return 'ap_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    generateQR() {
        // QR contains org, location, access point, direction
        const payload = {
            organizationId: this.organizationId,
            locationId: this.locationId,
            accessPointId: this.id,
            direction: this.direction
        };
        return JSON.stringify(payload);
    }

    toJSON() {
        return {
            id: this.id,
            organizationId: this.organizationId,
            locationId: this.locationId,
            name: this.name,
            type: this.type,
            direction: this.direction,
            qrCode: this.qrCode,
            policyIds: this.policyIds,
            status: this.status,
            metadata: this.metadata,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
