// @access-engine/foundation

// Entity
const Entity = require('./entity/Entity');
const AggregateRoot = require('./entity/AggregateRoot');

// Value Object
const ValueObject = require('./value-object/ValueObject');

// Identifier
const Identifier = require('./identifier/Identifier');

// Events
const DomainEvent = require('./events/DomainEvent');

// Result
const Result = require('./result/Result');

// Guard
const Guard = require('./guard/Guard');

module.exports = {
  Entity,
  AggregateRoot,
  ValueObject,
  Identifier,
  DomainEvent,
  Result,
  Guard,
};
