const { Identifier } = require('@access-engine/foundation');

class MembershipId extends Identifier {
  constructor(value) {
    super(value);
  }

  get type() { return 'membership'; }

  toJSON() {
    return this.value;
  }
}

module.exports = MembershipId;
