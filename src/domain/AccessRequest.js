// ==========================================
// DOMAIN - Access Request
// ==========================================

export class AccessRequest {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.organizationId = data.organizationId;
        this.locationId = data.locationId;
        this.accessPointId = data.accessPointId;
        this.direction = data.direction || 'entry';
        this.credentialId = data.credentialId || null;
        this.sessionId = data.sessionId || null;
        this.status = data.status || 'pending'; // pending, authorized, denied, completed
        this.deviceId = data.deviceId || null;
        this.ipAddress = data.ipAddress || null;
        this.userAgent = data.userAgent || null;
        this.metadata = data.metadata || {};
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.resolvedAt = data.resolvedAt || null;
        this.decision = data.decision || null;
        this.reason = data.reason || null;
    }

    generateId() {
        return 'ar_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    authorize(decision, reason) {
        this.status = 'authorized';
        this.decision = decision;
        this.reason = reason;
        this.resolvedAt = new Date();
        this.updatedAt = new Date();
    }

    deny(reason) {
        this.status = 'denied';
        this.decision = 'deny';
        this.reason = reason;
        this.resolvedAt = new Date();
        this.updatedAt = new Date();
    }

    complete() {
        this.status = 'completed';
        this.updatedAt = new Date();
        this.resolvedAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            organizationId: this.organizationId,
            locationId: this.locationId,
            accessPointId: this.accessPointId,
            direction: this.direction,
            credentialId: this.credentialId,
            sessionId: this.sessionId,
            status: this.status,
            deviceId: this.deviceId,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent,
            metadata: this.metadata,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            resolvedAt: this.resolvedAt,
            decision: this.decision,
            reason: this.reason
        };
    }
}
