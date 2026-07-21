// src/core/shared/DomainError.js

export class DomainError extends Error {
    constructor(message, code) {
        super(message);
        this.name = this.constructor.name;
        this.code = code || 'DOMAIN_ERROR';
    }
}
