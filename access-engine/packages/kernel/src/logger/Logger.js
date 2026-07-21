/**
 * Logger interface
 * 
 * The engine depends on this interface, not a specific logger.
 * Applications can implement with Winston, Pino, console, etc.
 */
class Logger {
  /**
   * Log at debug level
   */
  debug(message, ...args) {
    throw new Error('Not implemented');
  }

  /**
   * Log at info level
   */
  info(message, ...args) {
    throw new Error('Not implemented');
  }

  /**
   * Log at warn level
   */
  warn(message, ...args) {
    throw new Error('Not implemented');
  }

  /**
   * Log at error level
   */
  error(message, ...args) {
    throw new Error('Not implemented');
  }

  /**
   * Log at fatal level
   */
  fatal(message, ...args) {
    throw new Error('Not implemented');
  }

  /**
   * Create a child logger with context
   */
  child(context) {
    throw new Error('Not implemented');
  }
}

module.exports = Logger;
