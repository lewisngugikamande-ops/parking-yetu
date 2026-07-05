const { Identifier } = require('@access-engine/foundation');

class IdentityId extends Identifier {
  constructor(value) {
    super(value);
  }
  
  get type() { return 'identity'; }
}

module.exports = IdentityId;
