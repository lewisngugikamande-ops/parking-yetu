# Safe Migration Order

## Phase 1: Cleanup AccessJourney
- [ ] Remove duplicate requestExit() and confirmExit()
- [ ] Verify onStateChange() returns unsubscribe

## Phase 2: Connect handleMockScan to Workflow
- [ ] Replace direct gateData assignment with journey.scanGate()
- [ ] Use journey.getContext() to read gate data

## Phase 3: Connect Identify to Workflow
- [ ] Replace direct credential lookup with journey.identify()
- [ ] Use journey.getContext() to read credential

## Phase 4: Add renderState (only after all screen methods exist)
- [ ] Add showRegister() if missing
- [ ] Add showSession() if missing
- [ ] Add showComplete() if missing
- [ ] Add renderState() method
- [ ] Update onMount() to use renderState

## Phase 5: Remove Legacy State
- [ ] Remove this.step
- [ ] Remove this.gateData
- [ ] Remove this.credential
- [ ] Remove this.session
- [ ] Remove this.policy
