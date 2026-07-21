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