/**
 * Metrics Collector
 * Tracks counters, gauges, and histograms
 */
class MetricsCollector {
  constructor() {
    this.counters = new Map();
    this.gauges = new Map();
    this.histograms = new Map();
  }

  /**
   * Increment a counter
   */
  increment(name, value = 1) {
    if (!this.counters.has(name)) {
      this.counters.set(name, 0);
    }
    this.counters.set(name, this.counters.get(name) + value);
  }

  /**
   * Set a gauge value
   */
  gauge(name, value) {
    this.gauges.set(name, value);
  }

  /**
   * Record a value in a histogram
   */
  histogram(name, value) {
    if (!this.histograms.has(name)) {
      this.histograms.set(name, []);
    }
    this.histograms.get(name).push(value);
  }

  /**
   * Get all metrics
   */
  getMetrics() {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: Object.fromEntries(
        Array.from(this.histograms.entries()).map(([key, values]) => [
          key,
          {
            count: values.length,
            sum: values.reduce((a, b) => a + b, 0),
            avg: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
            min: values.length > 0 ? Math.min(...values) : 0,
            max: values.length > 0 ? Math.max(...values) : 0,
          },
        ])
      ),
    };
  }

  /**
   * Reset all metrics
   */
  reset() {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }
}

module.exports = MetricsCollector;
