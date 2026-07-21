/**
 * ValueObject - Immutable object with no identity
 * 
 * Value objects:
 * - Have no identity (two are equal if all attributes are equal)
 * - Are immutable
 * - Can be composed of other value objects
 */
class ValueObject {
  constructor() {
    // Protected for subclasses
  }

  /**
   * Check if two value objects are equal
   * (Override in subclasses)
   */
  equals(other) {
    if (!other) return false;
    if (!(other instanceof ValueObject)) return false;
    return this._equalsCore(other);
  }

  /**
   * Core equality check
   * (Override in subclasses)
   */
  _equalsCore(other) {
    throw new Error('_equalsCore must be implemented in subclass');
  }

  /**
   * Get the value as a plain object
   * (Override in subclasses)
   */
  toJSON() {
    throw new Error('toJSON must be implemented in subclass');
  }

  /**
   * Get the value as a string
   */
  toString() {
    return JSON.stringify(this.toJSON());
  }
}

module.exports = ValueObject;
