# ADR 001: Multi-Tenant Isolation Strategy

**Status:** Accepted - 2026-07-07

**Context:** The platform needs to support multiple organizations while ensuring complete data isolation.

**Decision:** Implement Tenant-Per-Organization isolation using organizationId filtering.

**Benefits:** Complete data isolation, scalable, audit friendly.

**Consequences:** Must include organizationId in all queries.
