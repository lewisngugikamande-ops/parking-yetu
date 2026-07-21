# ADR-006: Platform Persistence Strategy

## Status

**Accepted (Backfilled)**

---

## Decision Type

Platform Architecture

---

## Context

The initial Parking Yetu architecture adopted Firebase as the primary backend,
using Firestore for persistence together with Firebase Authentication.

Repository evidence shows that the platform architecture later evolved toward
PostgreSQL with Prisma as the persistence layer.

The following evidence exists:

- `prisma/schema.prisma` defines a PostgreSQL datasource.
- `docs/platform/data/schema-design.md` identifies PostgreSQL as the target
  database for both operational and commercial platform domains.
- Commit `147a603` ("Migrated to Access Engine: Full auth, entry, and exit
  working without Firebase") records the migration away from Firebase-centric
  application architecture.

No ADR documenting this architectural transition was found during the
Governance Audit.

This ADR is therefore created as a **backfilled architectural record** to
capture an already-implemented platform decision.

> Note:
>
> The original evaluation process, alternatives considered, and acceptance
> discussion were not documented at the time of implementation and therefore
> cannot be reconstructed from repository evidence alone.

---

## Decision

The Access Engine platform shall use **PostgreSQL** as its primary operational
database.

Persistence shall be implemented through **Prisma ORM**.

Firestore is retained only as legacy technology for historical compatibility
during migration and is **not** considered the target persistence architecture
for future platform development.

---

## Consequences

### Benefits

- ACID transactional guarantees.
- Strong relational integrity.
- Better support for complex commercial workflows.
- Better reporting and analytics.
- Mature migration tooling.
- Clear separation between application logic and persistence.

### Trade-offs

- Database infrastructure must be managed.
- Schema migrations become part of the delivery process.
- Additional operational complexity compared to fully managed Firestore.

---

## Evidence

Repository evidence supporting this ADR:

1. Commit `147a603`
   - *Migrated to Access Engine: Full auth, entry, and exit working without Firebase*

2. `prisma/schema.prisma`
   - PostgreSQL datasource definition.

3. `docs/platform/data/schema-design.md`
   - Platform schema designed around PostgreSQL.

4. Governance Audit Finding **A-003**
   - Major architectural decision implemented without a corresponding ADR.

---

## Related Documents

- ADR-001 — Use Firebase as Backend
- ADR-005 — Use Firestore as Primary Database
- Governance v1
- Platform Schema Design

---

## Provenance

This ADR was created during the Governance Audit to backfill an architectural
decision that had already been implemented within the repository.

---

## Evidence Confidence

| Area | Confidence | Evidence |
|------|------------|----------|
| Implementation | High | Verified through Git history, `prisma/schema.prisma`, and platform documentation. |
| Decision | Medium | The decision is clearly reflected in the repository, but no original ADR exists. |
| Rationale | Low | The original discussion, alternatives considered, and acceptance rationale were not documented when the migration occurred. |

### Reasoning

The implementation itself is well evidenced through commits, source code,
and documentation.

However, the architectural reasoning that led to selecting PostgreSQL over
alternative persistence technologies was not captured in a contemporaneous ADR.

This ADR therefore backfills the architectural record while explicitly
distinguishing verified implementation evidence from reconstructed context.
