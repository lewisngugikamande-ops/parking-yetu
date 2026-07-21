const { v4: uuidv4 } = require('uuid');

/**
 * DomainEvent - Something that happened in the domain
 * 
 * Domain events:
 * - Are immutable facts
 * - Have a unique ID
 * - Have a timestamp
 * - Describe something that happened
 * - Are the source of truth
 */
class DomainEvent {
  constructor(type, data, aggregateId) {
    this._id = uuidv4();
    this._type = type;
    this._data = data;
    this._aggregateId = aggregateId;
    this._timestamp = new Date().toISOString();
    this._version = 1;
  }

  /**
   * Get the event ID
   */
  get id() {
    return this._id;
  }

  /**
   * Get the event type
   */
  get type() {
    return this._type;
  }

  /**
   * Get the event data
   */
  get data() {
    return { ...this._data };
  }

  /**
   * Get the aggregate ID
   */
  get aggregateId() {
    return this._aggregateId;
  }

  /**
   * Get the timestamp
   */
  get timestamp() {
    return this._timestamp;
  }

  /**
   * Get the version
   */
  get version() {
    return this._version;
  }

  /**
   * Get the event as a plain object
   */
  toJSON() {
    return {
      id: this._id,
      type: this._type,
      data: this._data,
      aggregateId: this._aggregateId,
      timestamp: this._timestamp,
      version: this._version
    };
  }
}

module.exports = DomainEvent;
