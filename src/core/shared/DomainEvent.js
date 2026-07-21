// src/core/shared/DomainEvent.js

export class DomainEvent {
    constructor({ type, aggregateId, occurredAt }) {
        this.type = type;
        this.aggregateId = aggregateId;
        this.occurredAt = occurredAt;
        this.id = this._generateId();
    }

    _generateId() {
        return Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
    }
}
