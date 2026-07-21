# Governance v1

## Purpose

This document defines how architectural knowledge is created,
reviewed, approved, and maintained.

---

# G-01
One Decision = One ADR

Every architectural decision has exactly one canonical ADR.

Duplicate ADRs are prohibited.

---

# G-02
Foundational Changes Require ADRs

The following changes require an ADR before implementation is
considered complete:

• Database technology
• Authentication provider
• Messaging/Event platform
• Deployment architecture
• Storage technology
• Platform boundaries
• Bounded contexts
• Multi-tenancy strategy

If immediate delivery is required, the PR must either:
- include the ADR, or
- create a tracked "ADR Required" issue before merge.

---

# G-03
Mechanical Trigger

Any pull request that changes one or more of the following must
reference an ADR:

- prisma/
- schema.prisma
- docker-compose.yml
- terraform/
- kubernetes/
- docs/platform/**
- docs/architecture/**
- src/infrastructure/**
- src/platform/**

---

Evidence and findings are recorded separately from governance
interpretations.

---

# G-04
Evidence Confidence Required

Backfilled ADRs must declare evidence confidence.

Required fields:

- Implementation Confidence
- Decision Confidence
- Rationale Confidence

Confidence levels:

High:
Directly supported by repository artifacts, commits, or tests.

Medium:
Decision is clear, but original approval record is unavailable.

Low:
Reasoning or alternatives cannot be verified from available evidence.

The purpose is to distinguish verified facts from reconstructed context.
---

# G-05
ADR Location Standard

All architectural decision records must be stored under:

docs/architecture/decisions/

ADR files must follow the naming convention:

ADR-NNN-short-description.md

Example:

ADR-008-bounded-contexts.md

No architectural ADRs may exist outside the canonical ADR directory.
---

# G-06
ADR Lifecycle Rules

Architectural decisions must follow a defined lifecycle.

Allowed ADR statuses:

- Proposed
- Accepted
- Accepted (Backfilled)
- Superseded
- Deprecated
- Rejected

Rules:

- Proposed ADRs must not be treated as implementation authority.
- Accepted ADRs represent current architectural decisions.
- Superseded ADRs remain for historical traceability.
- Deprecated ADRs should not guide new implementation.
- Rejected ADRs document considered alternatives.

Any implementation that contradicts an Accepted ADR requires:
- ADR update,
- new ADR,
- or explicit superseding decision.
---

# G-07
ADR Ownership and Review

Every Accepted ADR must have an owner responsible for maintaining accuracy.

Required ADR metadata:

- Status
- Date
- Owner
- Review responsibility

ADR owners are responsible for:

- keeping decisions aligned with implementation,
- updating ADRs when architecture changes,
- marking obsolete decisions as Superseded or Deprecated.

Architecture changes without an updated ADR owner review are considered governance violations.
