// src/core/shared/EmailAddress.js

import { ValueObject } from './ValueObject.js';

export class EmailAddress extends ValueObject {
    constructor(value) {
        super();
        if (!value) throw new Error('Email is required');
        const trimmed = value.trim().toLowerCase();
        if (!EmailAddress.isValid(trimmed)) {
            throw new Error(`Invalid email: ${value}`);
        }
        this.value = trimmed;
    }

    static isValid(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    toString() { return this.value; }
}
