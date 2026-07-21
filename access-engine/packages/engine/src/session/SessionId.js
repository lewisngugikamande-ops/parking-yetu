const { Identifier } = require('@access-engine/foundation');

class SessionId extends Identifier {
  constructor(value) {
    super(value);
  }

  get type() { return 'session'; }

  toJSON() {
    return this.value;
  }
}

module.exports = SessionId;
