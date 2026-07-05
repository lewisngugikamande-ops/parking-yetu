const { ValueObject, Guard, Result } = require('@access-engine/foundation');

class IdentityProfile extends ValueObject {
  constructor(data) {
    super();
    this._name = data.name || null;
    this._email = data.email || null;
    this._phone = data.phone || null;
    this._metadata = data.metadata || {};
    
    const validation = this._validate();
    if (validation.isErr()) {
      throw validation.unwrapErr();
    }
  }
  
  _validate() {
    if (this._email) {
      return Guard.againstInvalidEmail(this._email);
    }
    if (this._phone) {
      return Guard.againstInvalidPhone(this._phone);
    }
    return Result.ok(true);
  }
  
  get name() { return this._name; }
  get email() { return this._email; }
  get phone() { return this._phone; }
  get metadata() { return { ...this._metadata }; }
  
  _equalsCore(other) {
    return this._name === other._name &&
           this._email === other._email &&
           this._phone === other._phone;
  }
  
  toJSON() {
    return {
      name: this._name,
      email: this._email,
      phone: this._phone,
      metadata: this._metadata
    };
  }
}

module.exports = IdentityProfile;
