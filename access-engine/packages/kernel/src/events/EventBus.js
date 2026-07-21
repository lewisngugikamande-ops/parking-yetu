class EventBus {
  constructor() {
    this.listeners = new Map();
    this.history = [];
  }

  subscribe(type, callback, once = false) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }

    const listener = { callback, once };
    this.listeners.get(type).push(listener);

    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        this.listeners.set(type, listeners.filter(l => l !== listener));
      }
    };
  }

  once(type, callback) {
    return this.subscribe(type, callback, true);
  }

  publish(type, data) {
    if (!type) {
      console.warn('⚠️ Skipping event with undefined type');
      return null;
    }

    const event = {
      id: require('uuid').v4(),
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    this.history.push(event);

    const listeners = this.listeners.get(type) || [];
    const toRemove = [];

    for (const listener of listeners) {
      try {
        listener.callback(event);
      } catch (error) {
        console.error('Error in event listener for ' + type + ':', error);
      }

      if (listener.once) {
        toRemove.push(listener);
      }
    }

    if (toRemove.length > 0) {
      this.listeners.set(type, listeners.filter(l => !toRemove.includes(l)));
    }

    return event;
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}

module.exports = EventBus;
