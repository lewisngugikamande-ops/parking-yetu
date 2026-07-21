// src/core/organization/Organization.js

import { DomainError } from '../shared/DomainError.js';
import { DomainEvent } from '../shared/DomainEvent.js';

export class Organization {
    constructor({ id, name, code, type, status, settings, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.type = type;
        this.status = status || 'active';
        this.settings = settings || {};
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this._events = [];
        this._validate();
    }

    static create({ id, name, code, type, settings, createdAt }) {
        const org = new Organization({
            id,
            name,
            code,
            type,
            status: 'active',
            settings,
            createdAt,
            updatedAt: createdAt
        });
        org._recordEvent('ORGANIZATION_CREATED', { name, code, type });
        return org;
    }

    _validate() {
        if (!this.name) throw new DomainError('Name required', 'ORG_NAME_REQUIRED');
        if (!this.code) throw new DomainError('Code required', 'ORG_CODE_REQUIRED');
        if (!this.type) throw new DomainError('Type required', 'ORG_TYPE_REQUIRED');
    }

    _recordEvent(type, payload) {
        this._events.push(new DomainEvent({
            type,
            aggregateId: this.id,
            occurredAt: new Date()
        }));
    }

    activate(timestamp) {
        if (this.status === 'active') return;
        this.status = 'active';
        this.updatedAt = timestamp;
        this._recordEvent('ORGANIZATION_ACTIVATED', { status: 'active' });
    }

    suspend(timestamp) {
        if (this.status === 'suspended') return;
        this.status = 'suspended';
        this.updatedAt = timestamp;
        this._recordEvent('ORGANIZATION_SUSPENDED', { status: 'suspended' });
    }

    pullEvents() {
        const events = [...this._events];
        this._events = [];
        return events;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            code: this.code,
            type: this.type,
            status: this.status,
            settings: this.settings,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static rehydrate(data) {
        return new Organization({
            id: data.id,
            name: data.name,
            code: data.code,
            type: data.type,
            status: data.status,
            settings: data.settings || {},
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
        });
    }
}
