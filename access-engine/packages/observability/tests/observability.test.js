const { CorrelationId, Logger, MetricsCollector, HealthChecks } = require('../src');

describe('@access-engine/observability', () => {
  test('CorrelationId generates valid IDs', () => {
    const id = CorrelationId.generate();
    expect(id.startsWith('REQ-')).toBe(true);
    expect(id.length).toBeGreaterThan(10);
  });

  test('Logger creates structured logs', () => {
    const logger = new Logger({ correlationId: 'REQ-test-123' });
    const spy = jest.spyOn(console, 'log').mockImplementation();
    
    logger.info('Test message', { extra: 'data' });
    
    expect(spy).toHaveBeenCalled();
    const log = JSON.parse(spy.mock.calls[0][0]);
    expect(log.level).toBe('info');
    expect(log.message).toBe('Test message');
    expect(log.correlationId).toBe('REQ-test-123');
    
    spy.mockRestore();
  });

  test('MetricsCollector tracks counters', () => {
    const metrics = new MetricsCollector();
    metrics.increment('requests');
    metrics.increment('requests', 2);
    metrics.increment('success');
    
    const result = metrics.getMetrics();
    expect(result.counters.requests).toBe(3);
    expect(result.counters.success).toBe(1);
  });

  test('HealthChecks checks health', async () => {
    const health = new HealthChecks();
    health.register('test', HealthChecks.healthyCheck);
    
    const result = await health.check();
    expect(result.status).toBe('healthy');
    expect(result.checks.test.status).toBe('healthy');
  });
});
