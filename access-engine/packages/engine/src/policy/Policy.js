class Policy {
  constructor(data) {
    this.id = data.id || require('crypto').randomUUID();
    this.name = data.name || 'Default Policy';
    this.organizationId = data.organizationId || 'default-org';
    this.rules = data.rules || [];
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  static create(data) {
    return new Policy(data);
  }
  
  /**
   * Get a value from an object using a dot-notation path
   * e.g., getValue({ a: { b: 1 } }, 'a.b') => 1
   */
  getValue(obj, path) {
    if (!obj || !path) return undefined;
    
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    
    return current;
  }
  
  evaluate(context) {
    for (const rule of this.rules) {
      if (!rule.condition) continue;
      
      const { field, operator, value } = rule.condition;
      
      // Get the actual value from the context using the field path
      const actualValue = this.getValue(context, field);
      
      // Evaluate based on operator
      let matches = false;
      
      switch (operator) {
        case 'equals':
          matches = actualValue === value;
          break;
        case 'not_equals':
          matches = actualValue !== value;
          break;
        case 'contains':
          matches = Array.isArray(actualValue) && actualValue.includes(value);
          break;
        case 'not_contains':
          matches = Array.isArray(actualValue) && !actualValue.includes(value);
          break;
        case 'exists':
          matches = actualValue !== undefined && actualValue !== null;
          break;
        case 'less_than':
          matches = actualValue < value;
          break;
        case 'greater_than':
          matches = actualValue > value;
          break;
        default:
          matches = false;
      }
      
      if (matches) {
        return {
          matched: true,
          effect: rule.effect || 'allow',
          reason: rule.reason || null,
          rule: rule
        };
      }
    }
    
    return { matched: false };
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      organizationId: this.organizationId,
      rules: this.rules,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Policy;
