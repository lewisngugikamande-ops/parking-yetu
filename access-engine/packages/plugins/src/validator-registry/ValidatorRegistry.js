class ValidatorRegistry {
  constructor() {
    this.validators = new Map();
  }

  register(name, validator) {
    this.validators.set(name, validator);
  }

  async validate(name, context) {
    const validator = this.validators.get(name);
    if (!validator) {
      throw new Error(`Validator ${name} not found`);
    }
    return await validator(context);
  }

  getValidators() {
    return Array.from(this.validators.keys());
  }
}

module.exports = ValidatorRegistry;
