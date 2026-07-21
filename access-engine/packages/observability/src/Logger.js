const CorrelationId = require('./CorrelationId');

/**
 * Structured logger with correlation ID support
 * Logs are JSON-formatted for easy parsing
 */
class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.service = options.service || 'access-engine';
    this.correlationId = options.correlationId || null;
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
  }

  child(context) {
    return new Logger({
      level: this.level,
      service: this.service,
      correlationId: context.correlationId || this.correlationId,
    });
  }

  log(level, message, data = {}) {
    if (this.levels[level] < this.levels[this.level]) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      correlationId: this.correlationId || CorrelationId.generate(),
      message,
      ...data,
    };

    const consoleMethod = level === 'error' ? console.error :
                          level === 'warn' ? console.warn :
                          level === 'debug' ? console.debug :
                          console.log;

    consoleMethod(JSON.stringify(logEntry));
  }

  debug(message, data = {}) { this.log('debug', message, data); }
  info(message, data = {}) { this.log('info', message, data); }
  warn(message, data = {}) { this.log('warn', message, data); }
  error(message, data = {}) { this.log('error', message, data); }
}

module.exports = Logger;
