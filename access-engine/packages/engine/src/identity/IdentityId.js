const { Identifier } = require('@access-engine/foundation');

class IdentityId extends Identifier {
  constructor(value) {
    super(value);
  }

  get type() { return 'identity'; }

  /**
   * Explicit serialization for Firestore
   */
  toJSON() {
    return this.value;
  }
}

module.exports = IdentityId;
