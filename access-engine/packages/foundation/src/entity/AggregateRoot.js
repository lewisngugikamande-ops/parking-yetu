const Entity = require('./Entity');

/**
 * AggregateRoot - A special entity that is the root of an aggregate
 * 
 * Aggregates are clusters of domain objects that can be treated as a unit.
 * The root ensures consistency within the aggregate.
 */
class AggregateRoot extends Entity {
  constructor(id) {
    super(id);
    this._childEntities = [];
  }

  /**
   * Add a child entity to the aggregate
   */
  _addChild(entity) {
    this._childEntities.push(entity);
  }

  /**
   * Get all child entities
   */
  getChildren() {
    return [...this._childEntities];
  }

  /**
   * Ensure the aggregate is in a valid state
   * (override in subclasses)
   */
  _validate() {
    // Override in subclasses
  }
}

module.exports = AggregateRoot;
