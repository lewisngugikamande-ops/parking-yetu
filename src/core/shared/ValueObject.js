// src/core/shared/ValueObject.js

export class ValueObject {
    equals(other) {
        if (!other || !(other instanceof ValueObject)) return false;
        return JSON.stringify(this) === JSON.stringify(other);
    }
}
