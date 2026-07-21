/**
 * Dependency Injection Container
 * 
 * Simple, powerful DI that supports:
 * - Transient services (new instance each time)
 * - Singleton services (one instance shared)
 * - Factory registration
 * - Lazy resolution
 */
class Container {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
    this.factories = new Map();
  }

  /**
   * Register a service
   * @param {string} name - Service identifier
   * @param {Function} factory - Factory function that returns the service
   * @param {Object} options - Registration options
   * @param {boolean} options.singleton - Whether to use singleton pattern
   * @param {boolean} options.lazy - Whether to lazy load
   */
  register(name, factory, options = {}) {
    const { singleton = false, lazy = true } = options;
    this.services.set(name, { factory, singleton, lazy });
    return this;
  }

  /**
   * Register a singleton service
   */
  singleton(name, factory) {
    return this.register(name, factory, { singleton: true });
  }

  /**
   * Register a factory (always creates new instance)
   */
  factory(name, factory) {
    return this.register(name, factory, { singleton: false });
  }

  /**
   * Resolve a service
   * @param {string} name - Service identifier
   * @param {Array} args - Arguments to pass to the factory
   * @returns {any} - The resolved service
   */
  resolve(name, args = []) {
    const registration = this.services.get(name);
    if (!registration) {
      throw new Error(`Service "${name}" not found in container`);
    }

    const { factory, singleton, lazy } = registration;

    // Return singleton if exists
    if (singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Create instance
    const instance = factory(this, ...args);

    // Store singleton
    if (singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  /**
   * Check if a service is registered
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Get all registered service names
   */
  getServiceNames() {
    return Array.from(this.services.keys());
  }

  /**
   * Clear all services (useful for testing)
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
    this.factories.clear();
  }
}

module.exports = Container;
