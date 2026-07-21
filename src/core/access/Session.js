// src/core/access/Session.js

import { DomainError } from '../shared/DomainError.js';
import { DomainEvent } from '../shared/DomainEvent.js';

export class Session {
    constructor({ id, organizationId, accessPointId, personId, credentialId, token, startedAt, endedAt }) {
        this.id = id;
        this.organizationId = organizationId;
        this.accessPointId = accessPointId;
        this.personId = personId;
        this.credentialId = credentialId;
        this.token = token;
        this.startedAt = startedAt;
        this.endedAt = endedAt || null;
        this._events = [];
        this._validate();
    }

    static create({ id, organizationId, accessPointId, personId, credentialId, token, startedAt }) {
        const session = new Session({
            id,
            organizationId,
            accessPointId,
            personId,
            credentialId,
            token,
            startedAt,
            endedAt: null
        });
        session._recordEvent('SESSION_STARTED', { organizationId, accessPointId, personId, credentialId });
        return session;
    }

    _validate() {
        if (!this.organizationId) throw new DomainError('Organization ID required', 'SESSION_ORG_REQUIRED');
        if (!this.accessPointId) throw new DomainError('Access point ID required', 'SESSION_ACCESS_POINT_REQUIRED');
        if (!this.personId) throw new DomainError('Person ID required', 'SESSION_PERSON_REQUIRED');
        if (!this.credentialId) throw new DomainError('Credential ID required', 'SESSION_CREDENTIAL_REQUIRED');
        if (!this.token) throw new DomainError('Token required', 'SESSION_TOKEN_REQUIRED');
    }

    _recordEvent(type, payload) {
        this._events.push(new DomainEvent({
            type,
            aggregateId: this.id,
            occurredAt: new Date()
        }));
    }

    confirmEntry(timestamp) {
        if (this.endedAt) {
            throw new DomainError('Session already completed', 'SESSION_COMPLETED');
        }
        this._recordEvent('ENTRY_CONFIRMED', { timestamp });
    }

    requestExit(timestamp) {
        if (this.endedAt) {
            throw new DomainError('Session already completed', 'SESSION_COMPLETED');
        }
        this._recordEvent('EXIT_REQUESTED', { timestamp });
    }

    confirmExit(timestamp) {
        if (this.endedAt) {
            throw new DomainError('Session already completed', 'SESSION_COMPLETED');
        }
        this.endedAt = timestamp;
        const duration = Math.floor((this.endedAt - this.startedAt) / 1000);
        this._recordEvent('SESSION_COMPLETED', { duration, endedAt: timestamp });
    }

    isActive() {
        return !this.endedAt;
    }

    getDuration() {
        if (!this.endedAt) return null;
        return Math.floor((this.endedAt - this.startedAt) / 1000);
    }

    pullEvents() {
        const events = [...this._events];
        this._events = [];
        return events;
    }

    toJSON() {
        return {
            id: this.id,
            organizationId: this.organizationId,
            accessPointId: this.accessPointId,
            personId: this.personId,
            credentialId: this.credentialId,
            token: this.token,
            startedAt: this.startedAt,
            endedAt: this.endedAt
        };
    }

    static rehydrate(data) {
        return new Session({
            id: data.id,
            organizationId: data.organizationId,
            accessPointId: data.accessPointId,
            personId: data.personId,
            credentialId: data.credentialId,
            token: data.token,
            startedAt: data.startedAt ? new Date(data.startedAt) : new Date(),
            endedAt: data.endedAt ? new Date(data.endedAt) : null
        });
    }
}
