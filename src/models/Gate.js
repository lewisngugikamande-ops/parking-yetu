// ============================================
// Domain Model: Gate
// ============================================

export class Gate {
    constructor({ id, name, type, locationId, organizationId, status }) {
        this.id = id || this.generateId();
        this.name = name || 'Gate A';
        this.type = type || 'both'; // 'entry', 'exit', 'both'
        this.locationId = locationId || 'church_a';
        this.organizationId = organizationId || 'org_church_a';
        this.status = status || 'closed'; // 'open', 'closed', 'maintenance'
        this.lastAction = null;
        this.lastActionTime = null;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    generateId() {
        return 'gat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    }

    // Open gate
    open(operator) {
        this.status = 'open';
        this.lastAction = 'opened';
        this.lastActionTime = new Date();
        this.updatedAt = new Date();
        return this;
    }

    // Close gate
    close(operator) {
        this.status = 'closed';
        this.lastAction = 'closed';
        this.lastActionTime = new Date();
        this.updatedAt = new Date();
        return this;
    }

    // Check if gate is open
    isOpen() {
        return this.status === 'open';
    }

    // Check if gate is closed
    isClosed() {
        return this.status === 'closed';
    }

    // Check if gate is in maintenance
    isUnderMaintenance() {
        return this.status === 'maintenance';
    }

    // Convert to Firestore document
    toFirestore() {
        return {
            name: this.name,
            type: this.type,
            locationId: this.locationId,
            organizationId: this.organizationId,
            status: this.status,
            lastAction: this.lastAction,
            lastActionTime: this.lastActionTime,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Create from Firestore document
    static fromFirestore(id, data) {
        const gate = new Gate({
            id: id,
            name: data.name,
            type: data.type,
            locationId: data.locationId,
            organizationId: data.organizationId,
            status: data.status
        });
        gate.lastAction = data.lastAction || null;
        gate.lastActionTime = data.lastActionTime?.toDate?.() || data.lastActionTime || null;
        gate.createdAt = data.createdAt?.toDate?.() || data.createdAt || new Date();
        gate.updatedAt = data.updatedAt?.toDate?.() || data.updatedAt || new Date();
        return gate;
    }
}
