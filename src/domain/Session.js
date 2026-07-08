// ==========================================
// DOMAIN - Session
// ==========================================

export class Session {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.credentialId = data.credentialId;
        this.organizationId = data.organizationId;
        this.locationId = data.locationId;
        this.accessPointId = data.accessPointId;
        this.direction = data.direction || 'entry';
        
        // Session details
        this.status = data.status || 'active'; // active, completed, revoked, expired
        this.entryTime = data.entryTime || new Date();
        this.exitTime = data.exitTime || null;
        this.duration = data.duration || null;
        
        // Session token (QR)
        this.sessionToken = data.sessionToken || this.generateToken();
        this.tokenExpiresAt = data.tokenExpiresAt || this.calculateExpiry();
        
        // Context
        this.metadata = data.metadata || {};
        this.entryMetadata = data.entryMetadata || {};
        this.exitMetadata = data.exitMetadata || {};
        
        // Audit
        this.createdBy = data.createdBy || null;
        this.verifiedBy = data.verifiedBy || null;
        this.closedBy = data.closedBy || null;
        
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    generateId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    generateToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 10);
    }

    calculateExpiry() {
        // Token expires in 24 hours by default
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        return expiry;
    }

    complete(exitData) {
        this.status = 'completed';
        this.exitTime = new Date();
        this.duration = this.exitTime - this.entryTime;
        this.updatedAt = new Date();
        if (exitData) {
            this.exitMetadata = exitData;
            if (exitData.closedBy) this.closedBy = exitData.closedBy;
        }
    }

    revoke(reason) {
        this.status = 'revoked';
        this.updatedAt = new Date();
        this.metadata.revokedReason = reason;
    }

    isActive() {
        return this.status === 'active' && !this.isExpired();
    }

    isExpired() {
        return this.tokenExpiresAt && new Date() > this.tokenExpiresAt;
    }

    getDuration() {
        if (this.duration) return this.duration;
        if (this.exitTime) {
            return this.exitTime - this.entryTime;
        }
        return Date.now() - this.entryTime;
    }

    getDurationDisplay() {
        const ms = this.getDuration();
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        }
        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    }

    toJSON() {
        return {
            id: this.id,
            credentialId: this.credentialId,
            organizationId: this.organizationId,
            locationId: this.locationId,
            accessPointId: this.accessPointId,
            direction: this.direction,
            status: this.status,
            entryTime: this.entryTime,
            exitTime: this.exitTime,
            duration: this.duration,
            sessionToken: this.sessionToken,
            tokenExpiresAt: this.tokenExpiresAt,
            metadata: this.metadata,
            entryMetadata: this.entryMetadata,
            exitMetadata: this.exitMetadata,
            createdBy: this.createdBy,
            verifiedBy: this.verifiedBy,
            closedBy: this.closedBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
