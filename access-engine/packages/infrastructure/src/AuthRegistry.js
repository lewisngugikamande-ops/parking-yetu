/**
 * Auth Registry - Configuration-based dependency injection
 * 
 * Registers authentication adapters and resolves them by name.
 * No switch statements - just registration and lookup.
 */
class AuthRegistry {
  constructor() {
    this.issuers = new Map();
    this.resolvers = new Map();
  }

  registerIssuer(name, issuer) {
    this.issuers.set(name, issuer);
    return this;
  }

  registerResolver(name, resolver) {
    this.resolvers.set(name, resolver);
    return this;
  }

  getIssuer(name) {
    const issuer = this.issuers.get(name);
    if (!issuer) {
      throw new Error(`Issuer '${name}' not registered`);
    }
    return issuer;
  }

  getResolver(name) {
    const resolver = this.resolvers.get(name);
    if (!resolver) {
      throw new Error(`Resolver '${name}' not registered`);
    }
    return resolver;
  }

  getProvider(name) {
    return {
      issuer: this.getIssuer(name),
      resolver: this.getResolver(name),
    };
  }
}

module.exports = AuthRegistry;
