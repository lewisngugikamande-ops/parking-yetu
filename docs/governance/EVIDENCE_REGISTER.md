# Evidence Register

## Purpose

This document records repository evidence supporting architectural findings
and decisions.

Evidence records separate verified artifacts from governance interpretation.

---

# A-003 — PostgreSQL Persistence Decision

## Finding

PostgreSQL became the platform persistence strategy without a corresponding ADR
at the time of implementation.

## Evidence

| Source | Type | Description |
|---|---|---|
| Commit `147a603` | Git History | Migration to Access Engine architecture without Firebase dependency |
| `prisma/schema.prisma` | Source | Defines PostgreSQL datasource |
| `docs/platform/data/schema-design.md` | Documentation | Identifies PostgreSQL as the target platform database |
| ADR-006 | ADR | Backfilled architectural decision record |

## Confidence

| Area | Confidence |
|---|---|
| Implementation Evidence | High |
| Decision Evidence | Medium |
| Rationale Evidence | Low |

---

# A-004 — Legacy User Service Orphan

## Finding

`src/services/user-service.js` remained after repository migration and referenced
a removed repository dependency.

## Evidence

| Source | Type | Description |
|---|---|---|
| `src/services/user-service.js` | Source | Imports removed `user-repository.js` |
| Git history | Git History | Confirms deletion of `src/repositories/user-repository.js` |
| Commit `147a603` | Git History | Repository migration removed Firebase-era implementation |
| Repository search | Source Analysis | No remaining callers found |

## Confidence

| Area | Confidence |
|---|---|
| Implementation Evidence | High |
| Decision Evidence | Not Applicable |
| Rationale Evidence | Not Applicable |

---

# Evidence Rules

Evidence should include where applicable:

- Repository artifacts
- Git history
- Source code
- Documentation
- Tests

Findings describe observed facts.

Governance documents describe interpretation and policy.
