const { Identifier } = require('@access-engine/foundation');

class CredentialId extends Identifier {
  constructor(value) {
    super(value);
  }

  get type() { return 'credential'; }

  toJSON() {
    return this.value;
  }
}

module.exports = CredentialId;
