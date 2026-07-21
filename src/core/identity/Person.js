// src/core/identity/Person.js

import { DomainError } from '../shared/DomainError.js';
import { DomainEvent } from '../shared/DomainEvent.js';

export class Person {
    constructor({ id, name, email, phone, type, status, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.type = type;
        this.status = status || 'active';
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this._events = [];
        this._validate();
    }

    static create({ id, name, email, phone, type, createdAt }) {
        const person = new Person({
            id,
            name,
            email,
            phone,
            type,
            status: 'active',
            createdAt,
            updatedAt: createdAt
        });
        person._recordEvent('PERSON_CREATED', { name, email, phone, type });
        return person;
    }

    _validate() {
        if (!this.name) throw new DomainError('Name required', 'PERSON_NAME_REQUIRED');
        if (!this.email && !this.phone) {
            throw new DomainError('Email or phone required', 'PERSON_CONTACT_REQUIRED');
        }
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
        this._recordEvent('PERSON_ACTIVATED', { status: 'active' });
    }

    suspend(timestamp) {
        if (this.status === 'suspended') return;
        this.status = 'suspended';
        this.updatedAt = timestamp;
        this._recordEvent('PERSON_SUSPENDED', { status: 'suspended' });
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
            email: this.email,
            phone: this.phone,
            type: this.type,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static rehydrate(data) {
        return new Person({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            type: data.type,
            status: data.status,
            createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
        });
    }
}
