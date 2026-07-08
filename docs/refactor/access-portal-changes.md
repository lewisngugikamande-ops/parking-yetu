# Access Portal Refactor - Specific Changes

## File: src/apps/access-portal/index.js

### 1. Remove these state variables
- this.step = 'scan';
- this.gateData = null;
- this.credential = null;
- this.session = null;
- this.policy = null;

### 2. Add workflow instance
- this.journey = new AccessJourney({
    credentialService,
    sessionService,
    policyService,
    organizationService
  });
- this.unsubscribe = null;
- this.currentState = null;
- this.context = {};

### 3. Update onMount() to subscribe to workflow

### 4. Add renderState() method

### 5. Update button handlers to call workflow methods
