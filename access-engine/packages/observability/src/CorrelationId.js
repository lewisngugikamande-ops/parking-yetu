const crypto = require('crypto');

/**
 * Generates unique correlation IDs for request tracing
 * Format: REQ-{timestamp}-{random}
 * Example: REQ-20260704-9b2c8d3f
 */
class CorrelationId {
  static generate() {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 14);
    const random = crypto.randomBytes(4).toString('hex');
    return `REQ-${timestamp}-${random}`;
  }

  static fromString(id) {
    return id;
  }

  static isValid(id) {
    return /^REQ-\d{14}-[a-f0-9]{8}$/.test(id);
  }
}

module.exports = CorrelationId;
