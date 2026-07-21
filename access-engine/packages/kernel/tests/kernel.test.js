const { Container, EventBus, Result, RequestPipeline } = require('../src');

describe('@access-engine/kernel', () => {
  describe('Container', () => {
    test('should register and resolve services', () => {
      const container = new Container();
      container.register('test', () => ({ value: 42 }));
      const service = container.resolve('test');
      expect(service.value).toBe(42);
    });

    test('should support singletons', () => {
      const container = new Container();
      let counter = 0;
      container.singleton('counter', () => ({ value: ++counter }));
      const a = container.resolve('counter');
      const b = container.resolve('counter');
      expect(a.value).toBe(1);
      expect(b.value).toBe(1);
      expect(a).toBe(b);
    });

    test('should support factories', () => {
      const container = new Container();
      let counter = 0;
      container.factory('counter', () => ({ value: ++counter }));
      const a = container.resolve('counter');
      const b = container.resolve('counter');
      expect(a.value).toBe(1);
      expect(b.value).toBe(2);
      expect(a).not.toBe(b);
    });

    test('should throw when service not found', () => {
      const container = new Container();
      expect(() => container.resolve('not-found')).toThrow(
        'Service "not-found" not found in container'
      );
    });
  });

  describe('EventBus', () => {
    test('should publish and subscribe', () => {
      const bus = new EventBus();
      let called = false;
      bus.subscribe('test', () => { called = true; });
      bus.publish('test', {});
      expect(called).toBe(true);
    });

    test('should support once subscriptions', () => {
      const bus = new EventBus();
      let count = 0;
      bus.once('test', () => count++);
      bus.publish('test', {});
      bus.publish('test', {});
      expect(count).toBe(1);
    });

    test('should store history', () => {
      const bus = new EventBus();
      bus.publish('test', { id: 1 });
      bus.publish('test', { id: 2 });
      expect(bus.getHistory()).toHaveLength(2);
    });
  });

  describe('Result', () => {
    test('should create Ok', () => {
      const result = Result.ok(42);
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe(42);
    });

    test('should create Err', () => {
      const result = Result.err('error');
      expect(result.isErr()).toBe(true);
      expect(() => result.unwrap()).toThrow('error');
    });

    test('should map Ok', () => {
      const result = Result.ok(5).map(x => x * 2);
      expect(result.unwrap()).toBe(10);
    });

    test('should support unwrapOr', () => {
      const ok = Result.ok(5);
      const err = Result.err('error');
      expect(ok.unwrapOr(0)).toBe(5);
      expect(err.unwrapOr(0)).toBe(0);
    });
  });

  describe('RequestPipeline', () => {
    test('should process requests through middleware', async () => {
      const pipeline = new RequestPipeline();
      let called = false;

      pipeline.use(async (ctx) => {
        called = true;
      });

      pipeline.registerHandler('test', async (req) => {
        return { success: true };
      });

      const result = await pipeline.process({ type: 'test' });
      expect(called).toBe(true);
      expect(result.success).toBe(true);
    });

    test('should halt on middleware result', async () => {
      const pipeline = new RequestPipeline();

      pipeline.use(async (ctx) => {
        ctx.halted = true;
        ctx.result = { halted: true };
      });

      pipeline.use(async () => {
        throw new Error('Should not be called');
      });

      pipeline.registerHandler('test', async () => {
        return { success: true };
      });

      const result = await pipeline.process({ type: 'test' });
      expect(result.halted).toBe(true);
    });
  });
});
