const Result = require('../result/Result');

/**
 * Guard - Defensive programming
 * 
 * Guards ensure that preconditions are met.
 * They return Results, never throw.
 */
class Guard {
  /**
   * Check if a value is truthy
   */
  static againstEmpty(value, message = 'Value cannot be empty') {
    if (value === undefined || value === null || value === '') {
      return Result.err(message);
    }
    return Result.ok(value);
  }

  /**
   * Check if a value is a string
   */
  static againstNonString(value, message = 'Value must be a string') {
    if (typeof value !== 'string') {
      return Result.err(message);
    }
    return Result.ok(value);
  }

  /**
   * Check if a value is a number
   */
  static againstNonNumber(value, message = 'Value must be a number') {
    if (typeof value !== 'number' || isNaN(value)) {
      return Result.err(message);
    }
    return Result.ok(value);
  }

  /**
   * Check if a value is within a range
   */
  static againstOutOfRange(value, min, max, message = 'Value out of range') {
    if (value < min || value > max) {
      return Result.err(message);
    }
    return Result.ok(value);
  }

  /**
   * Check if a value matches a regex
   */
  static againstPattern(value, pattern, message = 'Value does not match pattern') {
    if (!pattern.test(value)) {
      return Result.err(message);
    }
    return Result.ok(value);
  }

  /**
   * Check if an email is valid
   */
  static againstInvalidEmail(email, message = 'Invalid email address') {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.againstPattern(email, pattern, message);
  }

  /**
   * Check if a phone is valid (Kenyan format)
   */
  static againstInvalidPhone(phone, message = 'Invalid phone number') {
    const pattern = /^(\+?254|0)[17]\d{8}$/;
    return this.againstPattern(phone, pattern, message);
  }
}

module.exports = Guard;
