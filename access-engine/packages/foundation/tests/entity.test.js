const { Entity, Identifier, DomainEvent } = require('../src');

describe('Entity', () => {
  class TestId extends Identifier {}
  
  class TestEvent extends DomainEvent {
    constructor(aggregateId, data) {
      super('test.event', data, aggregateId);
    }
  }
  
  class TestEntity extends Entity {
    constructor(id, name) {
      super(id);
      this._name = name;
      this._version = 0;
    }
    
    get name() { return this._name; }
    get version() { return this._version; }
    
    changeName(newName) {
      this._name = newName;
      this._addEvent(new TestEvent(this._id, { oldName: this._name, newName }));
      this._incrementVersion();
    }
  }
  
  test('entities have identity', () => {
    const id = new TestId('test-123');
    const entity = new TestEntity(id, 'Test');
    expect(entity.id.equals(id)).toBe(true);
  });
  
  test('entities can be compared', () => {
    const id1 = new TestId('test-123');
    const id2 = new TestId('test-123');
    const entity1 = new TestEntity(id1, 'Test');
    const entity2 = new TestEntity(id2, 'Test');
    expect(entity1.equals(entity2)).toBe(true);
  });
  
  test('different entities are not equal', () => {
    const id1 = new TestId('test-123');
    const id2 = new TestId('test-456');
    const entity1 = new TestEntity(id1, 'Test');
    const entity2 = new TestEntity(id2, 'Test');
    expect(entity1.equals(entity2)).toBe(false);
  });
  
  test('entities track domain events', () => {
    const id = new TestId('test-123');
    const entity = new TestEntity(id, 'Test');
    expect(entity.getEvents()).toHaveLength(0);
    
    entity.changeName('New Name');
    const events = entity.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('test.event');
    expect(events[0].aggregateId.equals(id)).toBe(true);
  });
  
  test('entities increment version on change', () => {
    const id = new TestId('test-123');
    const entity = new TestEntity(id, 'Test');
    expect(entity.version).toBe(0);
    
    entity.changeName('New Name');
    expect(entity.version).toBe(1);
    
    entity.changeName('Another Name');
    expect(entity.version).toBe(2);
  });
  
  test('entities can clear events', () => {
    const id = new TestId('test-123');
    const entity = new TestEntity(id, 'Test');
    entity.changeName('New Name');
    expect(entity.getEvents()).toHaveLength(1);
    
    entity.clearEvents();
    expect(entity.getEvents()).toHaveLength(0);
  });
});
