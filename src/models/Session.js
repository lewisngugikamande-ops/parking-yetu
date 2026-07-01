// ============================================
// Domain Model: Parking Session
// ============================================

export class Session {
    constructor({ id, vehicleId, vehiclePlate, driverName, driverPhone, gate, locationId, organizationId, status, entryTime }) {
        this.id = id || null;
        this.vehicleId = vehicleId;
        this.vehiclePlate = vehiclePlate || '';
        this.driverName = driverName || '';
        this.driverPhone = driverPhone || '';
        this.gate = gate || 'Gate A';
        this.locationId = locationId || 'church_a';
        this.organizationId = organizationId || 'org_church_a';
        this.status = status || 'PARKED';
        this.entryTime = entryTime || new Date();
        this.exitTime = null;
        this.exitGate = null;
        this.duration = 0;
        this.isVIP = false;
        this.isStaff = false;
        this.notes = [];
        this.correlationId = this.generateCorrelationId();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    generateCorrelationId() {
        return 'corr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    }

    // Check if session is active (parked)
    isActive() {
        return this.status === 'PARKED';
    }

    // Check if session is overdue
    isOverdue(limitMinutes = 180) {
        if (!this.isActive()) return false;
        return this.getDuration() > limitMinutes;
    }

    // Get duration in minutes
    getDuration() {
        if (this.status === 'EXITED') return this.duration;
        return Math.floor((Date.now() - this.entryTime.getTime()) / 60000);
    }

    // Get formatted duration
    getDurationText() {
        const minutes = this.getDuration();
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    }

    // Exit the session
    exit(gate) {
        if (this.status === 'EXITED') throw new Error('Session already exited');
        this.status = 'EXITED';
        this.exitTime = new Date();
        this.exitGate = gate;
        this.duration = this.getDuration();
        this.updatedAt = new Date();
        return this;
    }

    // Add a note
    addNote(note, author) {
        this.notes.push({
            text: note,
            author: author || 'System',
            timestamp: new Date()
        });
        this.updatedAt = new Date();
        return this;
    }

    // Mark as VIP
    setVIP() {
        this.isVIP = true;
        this.updatedAt = new Date();
        return this;
    }

    // Mark as Staff
    setStaff() {
        this.isStaff = true;
        this.updatedAt = new Date();
        return this;
    }

    // Convert to plain object
    toPlain() {
        return {
            id: this.id,
            vehicleId: this.vehicleId,
            vehiclePlate: this.vehiclePlate,
            driverName: this.driverName,
            driverPhone: this.driverPhone,
            gate: this.gate,
            locationId: this.locationId,
            organizationId: this.organizationId,
            status: this.status,
            entryTime: this.entryTime,
            exitTime: this.exitTime,
            exitGate: this.exitGate,
            duration: this.duration,
            isVIP: this.isVIP,
            isStaff: this.isStaff,
            notes: this.notes,
            correlationId: this.correlationId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Create from plain object
    static fromPlain(data) {
        const session = new Session({
            id: data.id,
            vehicleId: data.vehicleId,
            vehiclePlate: data.vehiclePlate,
            driverName: data.driverName,
            driverPhone: data.driverPhone,
            gate: data.gate,
            locationId: data.locationId,
            organizationId: data.organizationId,
            status: data.status,
            entryTime: data.entryTime
        });
        session.exitTime = data.exitTime || null;
        session.exitGate = data.exitGate || null;
        session.duration = data.duration || 0;
        session.isVIP = data.isVIP || false;
        session.isStaff = data.isStaff || false;
        session.notes = data.notes || [];
        session.correlationId = data.correlationId || session.generateCorrelationId();
        session.createdAt = data.createdAt || new Date();
        session.updatedAt = data.updatedAt || new Date();
        return session;
    }
}
