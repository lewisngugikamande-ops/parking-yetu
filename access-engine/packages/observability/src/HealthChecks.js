/**
 * Health Checks
 * Manages and executes health checks for service monitoring
 */
class HealthChecks {
  constructor(options = {}) {
    this.checks = options.checks || {};
    this.serviceName = options.serviceName || 'access-engine';
  }

  /**
   * Register a health check
   */
  register(name, checkFn) {
    this.checks[name] = checkFn;
  }

  /**
   * Run all health checks
   */
  async check() {
    const results = {};
    let overall = 'healthy';

    for (const [name, checkFn] of Object.entries(this.checks)) {
      try {
        const result = await checkFn();
        results[name] = {
          status: result.status || 'healthy',
          message: result.message || null,
          timestamp: new Date().toISOString(),
        };
        if (result.status === 'unhealthy' || result.status === 'degraded') {
          overall = result.status;
        }
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          message: error.message,
          timestamp: new Date().toISOString(),
        };
        overall = 'unhealthy';
      }
    }

    return {
      service: this.serviceName,
      status: overall,
      timestamp: new Date().toISOString(),
      checks: results,
    };
  }

  /**
   * Simple health check that always passes
   */
  static healthyCheck() {
    return Promise.resolve({ status: 'healthy' });
  }
}

module.exports = HealthChecks;
