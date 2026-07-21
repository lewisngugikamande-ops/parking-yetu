const { ValueObject, Guard, Result } = require('@access-engine/foundation');

class PhoneNumber extends ValueObject {
  constructor(value) {
    super();
    const validation = Guard.againstInvalidPhone(value);
    if (validation.isErr()) {
      throw validation.unwrapErr();
    }
    this._value = value;
  }
  
  get value() { return this._value; }
  
  _equalsCore(other) {
    return this._value === other._value;
  }
  
  toJSON() {
    return this._value;
  }
}

module.exports = PhoneNumber;
