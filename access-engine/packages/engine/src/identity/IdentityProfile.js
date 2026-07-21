const { ValueObject, Guard, Result } = require('@access-engine/foundation');

class IdentityProfile extends ValueObject {
  constructor(data) {
    super();
    // Handle both plain objects and undefined
    const profileData = data || {};
    this._name = profileData.name || null;
    this._email = profileData.email || null;
    this._phone = profileData.phone || null;
    this._photo = profileData.photo || null;
    this._metadata = profileData.metadata || {};
    
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
  get photo() { return this._photo; }
  
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
      photo: this._photo,
      metadata: this._metadata
    };
  }
}

module.exports = IdentityProfile;
