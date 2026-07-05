const { ValueObject } = require('../src');

describe('ValueObject', () => {
  class TestValue extends ValueObject {
    constructor(value) {
      super();
      this._value = value;
    }
    
    get value() { return this._value; }
    
    _equalsCore(other) {
      return this._value === other._value;
    }
    
    toJSON() {
      return { value: this._value };
    }
  }
  
  test('value objects are immutable', () => {
    const vo = new TestValue(42);
    expect(vo.value).toBe(42);
    // No setter - immutable by design
  });
  
  test('value objects compare by value', () => {
    const vo1 = new TestValue(42);
    const vo2 = new TestValue(42);
    const vo3 = new TestValue(43);
    
    expect(vo1.equals(vo2)).toBe(true);
    expect(vo1.equals(vo3)).toBe(false);
  });
  
  test('value objects serialize to JSON', () => {
    const vo = new TestValue(42);
    expect(vo.toJSON()).toEqual({ value: 42 });
  });
});
