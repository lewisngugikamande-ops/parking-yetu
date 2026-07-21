/**
 * Middleware interface for the request pipeline
 * 
 * Middleware functions receive a context object and can:
 * - Modify the context
 * - Halt processing by setting ctx.halted = true
 * - Pass control to the next middleware
 */
class Middleware {
  /**
   * Process the middleware
   * @param {Object} ctx - The context object
   * @param {Object} ctx.request - The original request
   * @param {Object} ctx.metadata - Metadata for the request
   * @param {Object} ctx.result - The result of processing
   * @param {boolean} ctx.halted - Whether to halt processing
   * @param {Function} next - The next middleware function
   * @returns {Promise<void>}
   */
  async handle(ctx, next) {
    throw new Error('Not implemented');
  }
}

module.exports = Middleware;
