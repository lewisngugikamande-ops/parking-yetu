// src/core/shared/PlateNumber.js

import { ValueObject } from './ValueObject.js';

export class PlateNumber extends ValueObject {
    constructor(value) {
        super();
        if (!value) throw new Error('Plate is required');
        const trimmed = value.trim().toUpperCase();
        if (!PlateNumber.isValid(trimmed)) {
            throw new Error(`Invalid plate: ${value}`);
        }
        this.value = trimmed;
    }

    static isValid(value) {
        return /^[A-Z]{3}\s?\d{3}[A-Z]?$/.test(value);
    }

    toString() { return this.value; }
}
