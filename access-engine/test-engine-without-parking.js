// This should work even if Parking doesn't exist
const { AccessEngine } = require('@access-engine/engine');
const { MemoryRepository } = require('@access-engine/infrastructure');

const engine = new AccessEngine({
  repositories: new MemoryRepository()
});

const result = await engine.process({
  credential: { type: 'qr', value: 'test' },
  accessPoint: 'gate-a',
  action: 'enter'
});

console.log('Engine works without Parking:', result);
