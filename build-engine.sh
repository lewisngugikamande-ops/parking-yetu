#!/bin/bash
# build-engine.sh - CTO Edition

set -e

echo "🏗️  BUILDING ACCESS ENGINE - CTO EDITION"
echo "========================================"

# Create root
mkdir -p access-engine
cd access-engine

# Init package.json
npm init -y > /dev/null 2>&1
npm pkg set private=true
npm pkg set workspaces[0]="packages/*"

echo "✅ Created project root"

# ============================================
# 1. ROOT CONFIGURATION FILES
# ============================================

cat > .gitignore << 'EOF'
node_modules/
dist/
coverage/
.env
*.log
.DS_Store
*.tmp
package-lock.json
EOF

cat > .editorconfig << 'EOF'
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
EOF

cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
EOF

cat > eslint.config.js << 'EOF'
module.exports = [
  {
    files: ['**/*.js'],
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
];
EOF

cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['packages/**/src/**/*.js', '!**/node_modules/**'],
  verbose: true,
};
EOF

# ============================================
# 2. DOCUMENTATION
# ============================================

mkdir -p docs/adr

cat > VISION.md << 'EOF'
# Access Engine Vision

> **"An operating system for trusted interactions between identities and resources."**

## The Problem

Most access control systems are built for one use case. This leads to duplicated code, inconsistent security, and high costs to launch new products.

## The Solution

A single, reusable core that can power any physical access use case.

## The 10-Year Test

> "Will this still make sense when we have 10 million users across 100 different industries?"

## Success Metric

> **"If you delete Parking Yetu, the engine keeps working for everything else."**
EOF

cat > CONSTITUTION.md << 'EOF'
# Access Engine Constitution

## Article 1: Identity is Global
Identities exist once, across all organizations.

## Article 2: Sessions are the Source of Truth
Everything derives from sessions: analytics, billing, occupancy, attendance.

## Article 3: Events are Immutable
Events are append-only. Never deleted or modified.

## Article 4: The Engine is Application-Agnostic
The engine never knows what application is using it.

## Article 5: Credentials Prove Identity, Not Tenancy
Tenancy is resolved from context.

## Article 6: Policies are Owned by Organizations
Applications provide templates. Organizations own rules.

## Article 7: Infrastructure Depends on the Engine
The engine depends on interfaces. Infrastructure implements them.

## Article 8: The Request Pipeline is the Only Entry Point
All requests flow through the pipeline. No bypassing.

## Article 9: Kernel Owns Startup
The kernel loads plugins, configures DI, and starts the system.

## Article 10: Applications are Replaceable
Deleting an application should not change the core.
EOF

cat > CODING_LAWS.md << 'EOF'
# Coding Laws

## LAW 1: Core Never Imports Infrastructure
## LAW 2: Plugins Never Import Each Other
## LAW 3: Everything Enters Through RequestPipeline
## LAW 4: Everything Important Emits an Event
## LAW 5: Sessions Are Immutable
## LAW 6: Repositories Are Interfaces
## LAW 7: Infrastructure Implements Interfaces
## LAW 8: Applications Are Replaceable
## LAW 9: Kernel Owns Startup
## LAW 10: Engine Knows Nothing About Parking
## LAW 11: No Utils Folder
## LAW 12: Tests Beside Code
EOF

cat > ROADMAP.md << 'EOF'
# Roadmap

## Milestone 0 — Foundation
- [ ] Repository
- [ ] ADRs
- [ ] Coding laws
- [ ] Monorepo
- [ ] CI
- [ ] Linting
- [ ] Testing

## Milestone 1 — Kernel
- [ ] Dependency Injection
- [ ] Plugin Loader
- [ ] Middleware
- [ ] Event Dispatcher
- [ ] Request Pipeline

## Milestone 2 — Core
- [ ] Organization
- [ ] Identity
- [ ] Membership
- [ ] Role
- [ ] Resource
- [ ] Credential
- [ ] Request
- [ ] Policy
- [ ] Session
- [ ] Access Point
- [ ] Event
- [ ] Audit

## Milestone 3 — Infrastructure
- [ ] Memory Adapter
- [ ] Firestore Adapter
- [ ] REST API
- [ ] Authentication
- [ ] Notifications

## Milestone 4 — Reference Application
- [ ] Parking Yetu

## Milestone 5 — Second Reference Application
- [ ] Visitor Management
EOF

# ============================================
# 3. ADRs
# ============================================

cat > docs/adr/0001-engine-is-application-agnostic.md << 'EOF'
# ADR 0001: Engine is Application-Agnostic

**Status:** Accepted

**Context:** The Access Engine will power multiple applications.

**Decision:** The engine will never know what application is using it.

**Consequences:** Applications are plugins. Deleting an application doesn't change the engine.
EOF

cat > docs/adr/0002-event-driven-architecture.md << 'EOF'
# ADR 0002: Event-Driven Architecture

**Status:** Accepted

**Context:** The system needs real-time updates, auditing, and analytics.

**Decision:** Every important action emits an event.

**Consequences:** Loose coupling, built-in audit trail, replayable history.
EOF

cat > docs/adr/0003-request-pipeline.md << 'EOF'
# ADR 0003: Request Pipeline

**Status:** Accepted

**Context:** The system needs a single, consistent way to process all requests.

**Decision:** All requests flow through a single pipeline.

**Consequences:** Single source of truth, consistent behavior, easy to audit.
EOF

cat > docs/adr/0004-session-is-source-of-truth.md << 'EOF'
# ADR 0004: Session is the Source of Truth

**Status:** Accepted

**Context:** The system needs to answer who is inside, who entered, who exited.

**Decision:** Sessions are the source of truth.

**Consequences:** Everything derives from sessions: analytics, billing, occupancy.
EOF

cat > docs/adr/0005-global-identities.md << 'EOF'
# ADR 0005: Global Identities

**Status:** Accepted

**Context:** A person can be a resident in one estate and a doctor in a hospital.

**Decision:** Identity is global. Organizations grant membership.

**Consequences:** One credential for everything. Tenancy resolved from context.
EOF

cat > docs/adr/0006-membership-model.md << 'EOF'
# ADR 0006: Membership Model

**Status:** Accepted

**Context:** The system needs multi-tenancy with identities in multiple orgs.

**Decision:** Memberships link identities to organizations with roles and dates.

**Consequences:** Flexible multi-tenancy, expiring memberships, audit trail.
EOF

cat > docs/adr/0007-policy-engine.md << 'EOF'
# ADR 0007: Policy Engine

**Status:** Accepted

**Context:** The system needs flexible, configurable access rules.

**Decision:** Policies are JSON-based DSL rules owned by organizations.

**Consequences:** Organizations customize rules. No code changes needed.
EOF

# ============================================
# 4. CREATE CORE PACKAGES (12 Bounded Contexts)
# ============================================

echo "📦 Creating core packages..."

for pkg in organization identity membership role resource credential request policy session event audit access-point; do
  mkdir -p packages/core/$pkg/src
  mkdir -p packages/core/$pkg/tests
  
  cat > packages/core/$pkg/package.json << EOF
{
  "name": "@access-engine/$pkg",
  "version": "0.1.0",
  "main": "src/index.js",
  "peerDependencies": {
    "@access-engine/kernel": "*"
  }
}
EOF

  cat > packages/core/$pkg/src/index.js << EOF
// @access-engine/$pkg
module.exports = {
  // Export model, repository, service
};
EOF

  cat > packages/core/$pkg/tests/${pkg}.test.js << EOF
// @access-engine/$pkg tests
describe('@access-engine/$pkg', () => {
  test('should work', () => {
    expect(true).toBe(true);
  });
});
EOF

  echo "  ✅ packages/core/$pkg"
done

# ============================================
# 5. CREATE KERNEL
# ============================================

echo "📦 Creating kernel..."

mkdir -p packages/kernel/src/{di,pipeline,middleware,events,lifecycle}
mkdir -p packages/kernel/tests

cat > packages/kernel/package.json << 'EOF'
{
  "name": "@access-engine/kernel",
  "version": "0.1.0",
  "description": "DI, pipeline, events, lifecycle",
  "main": "src/index.js",
  "dependencies": {
    "uuid": "^9.0.1"
  }
}
EOF

cat > packages/kernel/src/index.js << 'EOF'
module.exports = {
  Container: require('./di/Container'),
  RequestPipeline: require('./pipeline/RequestPipeline'),
  EventBus: require('./events/EventBus'),
  Middleware: require('./middleware/Middleware'),
  LifecycleManager: require('./lifecycle/LifecycleManager'),
};
EOF

cat > packages/kernel/src/di/Container.js << 'EOF'
class Container {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  register(name, factory, singleton = false) {
    this.services.set(name, { factory, singleton });
  }

  resolve(name) {
    const registration = this.services.get(name);
    if (!registration) {
      throw new Error(`Service ${name} not found`);
    }

    if (registration.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, registration.factory(this));
      }
      return this.singletons.get(name);
    }

    return registration.factory(this);
  }

  has(name) {
    return this.services.has(name);
  }
}

module.exports = Container;
EOF

cat > packages/kernel/src/pipeline/RequestPipeline.js << 'EOF'
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
EOF

cat > packages/kernel/src/events/EventBus.js << 'EOF'
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
        console.error(`Error in event listener for ${type}:`, error);
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
EOF

cat > packages/kernel/tests/kernel.test.js << 'EOF'
const { Container, RequestPipeline, EventBus } = require('../src');

describe('Kernel', () => {
  test('Container works', () => {
    const container = new Container();
    container.register('test', () => ({ value: 42 }), true);
    expect(container.resolve('test').value).toBe(42);
  });

  test('EventBus works', () => {
    const bus = new EventBus();
    let called = false;
    bus.subscribe('test', () => { called = true; });
    bus.publish('test', {});
    expect(called).toBe(true);
  });
});
EOF

echo "  ✅ packages/kernel"

# ============================================
# 6. CREATE INFRASTRUCTURE
# ============================================

echo "📦 Creating infrastructure..."

mkdir -p packages/infrastructure/src/{adapters,api,auth,realtime,notifications}
mkdir -p packages/infrastructure/src/adapters/{memory,firestore}
mkdir -p packages/infrastructure/tests

cat > packages/infrastructure/package.json << 'EOF'
{
  "name": "@access-engine/infrastructure",
  "version": "0.1.0",
  "description": "Infrastructure adapters and services",
  "main": "src/index.js",
  "peerDependencies": {
    "@access-engine/kernel": "*",
    "@access-engine/core/*": "*"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "optionalDependencies": {
    "firebase-admin": "^12.0.0"
  }
}
EOF

cat > packages/infrastructure/src/index.js << 'EOF'
module.exports = {
  // Adapters
  MemoryAdapter: require('./adapters/memory'),
  FirestoreAdapter: require('./adapters/firestore'),
  // Services
  ApiService: require('./api/ApiService'),
  AuthService: require('./auth/AuthService'),
  NotificationService: require('./notifications/NotificationService'),
  RealtimeService: require('./realtime/RealtimeService'),
};
EOF

cat > packages/infrastructure/src/adapters/memory/index.js << 'EOF'
// In-memory adapter for testing
class MemoryAdapter {
  constructor() {
    this.data = new Map();
  }

  async get(key) {
    return this.data.get(key) || null;
  }

  async set(key, value) {
    this.data.set(key, value);
    return value;
  }

  async delete(key) {
    this.data.delete(key);
  }

  async clear() {
    this.data.clear();
  }
}

module.exports = MemoryAdapter;
EOF

echo "  ✅ packages/infrastructure"

# ============================================
# 7. CREATE PLUGINS
# ============================================

echo "📦 Creating plugins..."

mkdir -p packages/plugins/src/{validator-registry,template-provider}
mkdir -p packages/plugins/tests

cat > packages/plugins/package.json << 'EOF'
{
  "name": "@access-engine/plugins",
  "version": "0.1.0",
  "description": "Plugin system",
  "main": "src/index.js",
  "peerDependencies": {
    "@access-engine/kernel": "*"
  }
}
EOF

cat > packages/plugins/src/index.js << 'EOF'
module.exports = {
  ValidatorRegistry: require('./validator-registry/ValidatorRegistry'),
  TemplateProvider: require('./template-provider/TemplateProvider'),
};
EOF

cat > packages/plugins/src/validator-registry/ValidatorRegistry.js << 'EOF'
class ValidatorRegistry {
  constructor() {
    this.validators = new Map();
  }

  register(name, validator) {
    this.validators.set(name, validator);
  }

  async validate(name, context) {
    const validator = this.validators.get(name);
    if (!validator) {
      throw new Error(`Validator ${name} not found`);
    }
    return await validator(context);
  }

  getValidators() {
    return Array.from(this.validators.keys());
  }
}

module.exports = ValidatorRegistry;
EOF

echo "  ✅ packages/plugins"

# ============================================
# 8. CREATE APPLICATIONS
# ============================================

echo "📦 Creating applications..."

mkdir -p packages/applications/parking/src/{workflows,dashboards,config,validators}
mkdir -p packages/applications/parking/tests
mkdir -p packages/applications/visitor/src
mkdir -p packages/applications/building/src

cat > packages/applications/parking/package.json << 'EOF'
{
  "name": "@access-engine/app-parking",
  "version": "0.1.0",
  "description": "Parking Yetu - Reference application",
  "main": "src/index.js",
  "peerDependencies": {
    "@access-engine/kernel": "*",
    "@access-engine/plugins": "*",
    "@access-engine/infrastructure": "*",
    "@access-engine/core/*": "*"
  }
}
EOF

cat > packages/applications/parking/src/index.js << 'EOF'
module.exports = {
  EntryWorkflow: require('./workflows/EntryWorkflow'),
  ExitWorkflow: require('./workflows/ExitWorkflow'),
  Validators: require('./validators'),
  Dashboard: require('./dashboards'),
};
EOF

cat > packages/applications/parking/src/workflows/EntryWorkflow.js << 'EOF'
class EntryWorkflow {
  constructor({ kernel, core }) {
    this.kernel = kernel;
    this.core = core;
  }

  async execute(request) {
    // 1. Resolve organization from access point
    // 2. Resolve identity from credential
    // 3. Check membership
    // 4. Validate credential
    // 5. Run validators
    // 6. Evaluate policies
    // 7. Create session
    // 8. Emit events
    // 9. Return instructions

    return {
      allowed: true,
      sessionId: 'session-123',
      instructions: ['OPEN_GATE'],
    };
  }
}

module.exports = EntryWorkflow;
EOF

echo "  ✅ packages/applications"

# ============================================
# 9. CREATE SDK
# ============================================

echo "📦 Creating SDK..."

mkdir -p packages/sdk/javascript/src
mkdir -p packages/sdk/flutter/lib

cat > packages/sdk/package.json << 'EOF'
{
  "name": "@access-engine/sdk",
  "version": "0.1.0",
  "description": "SDK",
  "main": "javascript/src/index.js"
}
EOF

cat > packages/sdk/javascript/src/index.js << 'EOF'
// JavaScript SDK
module.exports = {
  // Export client
};
EOF

echo "  ✅ packages/sdk"

# ============================================
# 10. ROOT PACKAGE.JSON
# ============================================

echo "📦 Updating root package.json..."

npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.lint="eslint packages/**/src/**/*.js"
npm pkg set scripts.format="prettier --write packages/**/src/**/*.js"

# ============================================
# 11. INSTALL DEPENDENCIES
# ============================================

echo "📦 Installing dependencies..."

npm install -D jest @jest/globals eslint prettier > /dev/null 2>&1
npm install uuid dotenv > /dev/null 2>&1

# ============================================
# 12. FINAL README
# ============================================

cat > README.md << 'EOF'
# Access Engine

> **"An operating system for trusted interactions between identities and resources."**

## 🚀 Quick Start

```bash
npm install
npm test
