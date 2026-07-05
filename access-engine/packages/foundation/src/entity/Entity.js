/**
 * Entity - Something with identity
 * 
 * Entities have:
 * - An identity (id)
 * - Behavior (methods)
 * - Invariants (rules that must hold)
 * - Domain events (things that happened)
 */
class Entity {
  constructor(id) {
    this._id = id;
    this._events = [];
    this._version = 0;
  }

  /**
   * Get the entity's identity
   */
  get id() {
    return this._id;
  }

  /**
   * Get the entity's version
   */
  get version() {
    return this._version;
  }

  /**
   * Check if two entities are the same
   */
  equals(other) {
    if (!other) return false;
    if (!(other instanceof Entity)) return false;
    return this._id.equals(other._id);
  }

  /**
   * Register a domain event
   */
  _addEvent(event) {
    this._events.push(event);
  }

  /**
   * Get all domain events
   */
  getEvents() {
    return [...this._events];
  }

  /**
   * Clear domain events
   */
  clearEvents() {
    this._events = [];
  }

  /**
   * Increment version
   */
  _incrementVersion() {
    this._version += 1;
  }
}

module.exports = Entity;
