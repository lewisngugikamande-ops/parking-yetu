/**
 * Lifecycle Manager
 * 
 * Manages the lifecycle of the application:
 * - Startup
 * - Shutdown
 * - Health checks
 * - Graceful termination
 */
class LifecycleManager {
  constructor() {
    this.hooks = {
      preStart: [],
      postStart: [],
      preStop: [],
      postStop: []
    };
    this.isRunning = false;
    this.isStarting = false;
    this.isStopping = false;
  }

  /**
   * Register a hook
   * @param {string} phase - 'preStart', 'postStart', 'preStop', 'postStop'
   * @param {Function} hook - The hook function
   */
  register(phase, hook) {
    if (!this.hooks[phase]) {
      throw new Error(`Invalid phase: ${phase}`);
    }
    this.hooks[phase].push(hook);
  }

  /**
   * Start the application
   * @param {Object} context - The context to pass to hooks
   * @returns {Promise<void>}
   */
  async start(context = {}) {
    if (this.isRunning || this.isStarting) {
      return;
    }

    this.isStarting = true;

    try {
      // Run pre-start hooks
      for (const hook of this.hooks.preStart) {
        await hook(context);
      }

      // Start the application
      // (Applications can override this)
      this.isRunning = true;

      // Run post-start hooks
      for (const hook of this.hooks.postStart) {
        await hook(context);
      }
    } finally {
      this.isStarting = false;
    }
  }

  /**
   * Stop the application
   * @param {Object} context - The context to pass to hooks
   * @returns {Promise<void>}
   */
  async stop(context = {}) {
    if (!this.isRunning || this.isStopping) {
      return;
    }

    this.isStopping = true;

    try {
      // Run pre-stop hooks
      for (const hook of this.hooks.preStop) {
        await hook(context);
      }

      // Stop the application
      // (Applications can override this)
      this.isRunning = false;

      // Run post-stop hooks
      for (const hook of this.hooks.postStop) {
        await hook(context);
      }
    } finally {
      this.isStopping = false;
    }
  }

  /**
   * Check if the application is running
   * @returns {boolean}
   */
  isActive() {
    return this.isRunning;
  }

  /**
   * Get the current status
   * @returns {string}
   */
  getStatus() {
    if (this.isStarting) return 'starting';
    if (this.isStopping) return 'stopping';
    return this.isRunning ? 'running' : 'stopped';
  }
}

module.exports = LifecycleManager;
