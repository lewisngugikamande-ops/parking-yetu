const { Identifier } = require('@access-engine/foundation');

class PolicyId extends Identifier {
  constructor(value) {
    super(value);
  }

  get type() { return 'policy'; }

  toJSON() {
    return this.value;
  }
}

module.exports = PolicyId;
