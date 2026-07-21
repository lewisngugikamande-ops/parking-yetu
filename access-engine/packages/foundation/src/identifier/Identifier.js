const { v4: uuidv4 } = require('uuid');

/**
 * Identifier - Base class for all IDs
 * 
 * Identifiers:
 * - Are value objects
 * - Have no behavior
 * - Are immutable
 * - Can be generated or provided
 */
class Identifier {
  constructor(value) {
    if (value === undefined || value === null) {
      this._value = uuidv4();
    } else {
      this._value = value;
    }
  }

  /**
   * Get the raw value
   */
  get value() {
    return this._value;
  }

  /**
   * Check if two identifiers are equal
   */
  equals(other) {
    if (!other) return false;
    if (!(other instanceof Identifier)) return false;
    return this._value === other._value;
  }

  /**
   * Get the value as a string
   */
  toString() {
    return this._value;
  }

  /**
   * Get the value as a plain object
   */
  toJSON() {
    return this._value;
  }
}

module.exports = Identifier;
