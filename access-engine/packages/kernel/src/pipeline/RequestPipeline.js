class RequestPipeline {
  constructor() {
    this.middleware = [];
    this.handlers = new Map();
  }

  use(middleware) {
    this.middleware.push(middleware);
  }

  registerHandler(type, handler) {
    this.handlers.set(type, handler);
  }

  async process(request) {
    const context = { request, metadata: {}, result: null };

    for (const middleware of this.middleware) {
      await middleware(context);
      if (context.result?.halted) {
        return context.result;
      }
    }

    const handler = this.handlers.get(context.request.type);
    if (!handler) {
      throw new Error(`No handler registered for ${context.request.type}`);
    }

    const result = await handler(context.request);
    context.result = result;
    return result;
  }
}

module.exports = RequestPipeline;
