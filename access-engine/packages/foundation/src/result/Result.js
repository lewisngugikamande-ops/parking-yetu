/**
 * Result - Explicit error handling
 * 
 * Inspired by Rust's Result and Haskell's Either.
 * Every operation that can fail returns a Result.
 * No throwing exceptions for business logic.
 */
class Result {
  constructor(value, error = null) {
    this._value = value;
    this._error = error;
    this._isOk = error === null;
    this._isErr = error !== null;
  }

  /**
   * Create a successful result
   */
  static ok(value) {
    return new Result(value, null);
  }

  /**
   * Create an error result
   */
  static err(error) {
    if (typeof error === 'string') {
      error = new Error(error);
    }
    return new Result(null, error);
  }

  /**
   * Check if successful
   */
  isOk() {
    return this._isOk;
  }

  /**
   * Check if error
   */
  isErr() {
    return this._isErr;
  }

  /**
   * Get the value (throws if error)
   */
  unwrap() {
    if (this._isErr) {
      throw this._error;
    }
    return this._value;
  }

  /**
   * Get the value or a default
   */
  unwrapOr(defaultValue) {
    return this._isOk ? this._value : defaultValue;
  }

  /**
   * Get the error (throws if ok)
   */
  unwrapErr() {
    if (this._isOk) {
      throw new Error('Called unwrapErr on an Ok result');
    }
    return this._error;
  }

  /**
   * Map the value if ok
   */
  map(fn) {
    if (this._isOk) {
      return Result.ok(fn(this._value));
    }
    return this;
  }

  /**
   * Map the error if err
   */
  mapErr(fn) {
    if (this._isErr) {
      return Result.err(fn(this._error));
    }
    return this;
  }

  /**
   * Chain operations
   */
  andThen(fn) {
    if (this._isOk) {
      return fn(this._value);
    }
    return this;
  }

  /**
   * Fallback to another result
   */
  orElse(fn) {
    if (this._isErr) {
      return fn(this._error);
    }
    return this;
  }

  /**
   * Match on the result
   */
  match({ ok, err }) {
    if (this._isOk && ok) {
      return ok(this._value);
    }
    if (this._isErr && err) {
      return err(this._error);
    }
    return null;
  }

  /**
   * Convert to Promise
   */
  toPromise() {
    return this._isOk
      ? Promise.resolve(this._value)
      : Promise.reject(this._error);
  }

  /**
   * Create from Promise
   */
  static fromPromise(promise) {
    return promise
      .then(value => Result.ok(value))
      .catch(error => Result.err(error));
  }
}

module.exports = Result;
