// ==========================================
// DOMAIN - Event
// ==========================================

export class Event {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.type = data.type; // AccessRequested, CredentialRecognized, PolicyEvaluated, SessionStarted, SessionEnded
        this.aggregateId = data.aggregateId; // ID of the related entity
        this.aggregateType = data.aggregateType; // AccessPoint, Credential, Session, etc.
        this.data = data.data || {};
        this.metadata = data.metadata || {};
        this.timestamp = data.timestamp || new Date();
        this.source = data.source || 'system';
        this.correlationId = data.correlationId || this.generateCorrelationId();
        this.userId = data.userId || null;
        this.ipAddress = data.ipAddress || null;
        this.userAgent = data.userAgent || null;
    }

    generateId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    }

    generateCorrelationId() {
        return 'corr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    }

    toJSON() {
        return {
            id: this.id,
            type: this.type,
            aggregateId: this.aggregateId,
            aggregateType: this.aggregateType,
            data: this.data,
            metadata: this.metadata,
            timestamp: this.timestamp,
            source: this.source,
            correlationId: this.correlationId,
            userId: this.userId,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent
        };
    }
}

// Event factory
export const EventTypes = {
    ACCESS_REQUESTED: 'AccessRequested',
    CREDENTIAL_RECOGNIZED: 'CredentialRecognized',
    CREDENTIAL_CREATED: 'CredentialCreated',
    POLICY_EVALUATED: 'PolicyEvaluated',
    SESSION_STARTED: 'SessionStarted',
    SESSION_ENDED: 'SessionEnded',
    SESSION_REVOKED: 'SessionRevoked',
    GATE_OPENED: 'GateOpened',
    GATE_CLOSED: 'GateClosed',
    ALERT_TRIGGERED: 'AlertTriggered'
};

export function createEvent(type, aggregateId, aggregateType, data = {}, metadata = {}) {
    return new Event({
        type,
        aggregateId,
        aggregateType,
        data,
        metadata
    });
}
