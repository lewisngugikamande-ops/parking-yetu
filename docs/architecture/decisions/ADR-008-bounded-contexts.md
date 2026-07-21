# ADR-008: Bounded Contexts

**Status:** Accepted

**Date:** 2026-07-08

## Context

The Access Engine Platform will grow to support multiple applications and teams. Without clear boundaries, the codebase will become tightly coupled and difficult to evolve.

## Decision

We will define the following bounded contexts:

1. **Identity** - People, profiles, authentication
2. **Credentials** - QR, NFC, RFID, biometrics, license plates
3. **Access** - Sessions, access decisions, gate control
4. **Policy** - Rules, schedules, permissions
5. **Organization** - Organizations, locations, zones, access points
6. **Observability** - Events, audit, analytics
7. **Billing** - Subscriptions, invoices, payments

## Context Boundaries

### Identity Context
- Person
- Profile
- Authentication
- Authorization

### Credentials Context
- Credential
- QR
- NFC
- RFID
- Biometric
- License Plate

### Access Context
- Session
- SessionEvent
- AccessDecision
- Gate (depends on Organization context)

### Policy Context
- Policy
- Rule
- Schedule
- Permission

### Organization Context
- Organization
- Location
- Zone
- AccessPoint

### Observability Context
- Event
- AuditLog
- Analytics
- Metrics

### Billing Context
- Subscription
- Invoice
- Payment
- Plan

## Consequences

### Positive

- ✅ Clear ownership boundaries
- ✅ Teams can work independently
- ✅ Contexts can evolve at different speeds
- ✅ Easier to extract services later

### Negative

- ❌ Need to maintain context maps
- ❌ Cross-context communication needs patterns
- ❌ Initial design overhead

## Implementation

Context boundaries will be enforced at the code level through:

- Package/directory structure
- Repository interfaces
- Clear dependency rules
- Event-driven communication between contexts
