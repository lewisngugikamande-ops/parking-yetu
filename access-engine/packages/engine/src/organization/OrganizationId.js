const { Identifier } = require('@access-engine/foundation');

class OrganizationId extends Identifier {
  constructor(value) {
    super(value);
  }

  get type() { return 'organization'; }

  toJSON() {
    return this.value;
  }
}

module.exports = OrganizationId;
