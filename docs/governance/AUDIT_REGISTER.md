# Governance Audit Register

## Audit

Architecture Governance Audit — July 2026

Purpose:

Establish a single, evidence-based architectural governance model for the
Access Engine platform.

---

| ID | Finding | Confidence | Status |
|----|----------|------------|--------|
| A-001 | Duplicate ADR numbering caused multiple ADR-003 records. | High | **Resolved by ADR-008** |
| A-002 | Metadata inconsistency between Git history and ADR acceptance dates. | Medium | Open |
| A-003 | PostgreSQL platform persistence decision exists in implementation but had no ADR. | High | **Resolved by ADR-006** |
| A-004 | `src/services/user-service.js` is orphaned after repository migration. Imports deleted dependencies and has no remaining callers. | High | Open |
| A-005 | Architectural evolution outpaced ADR governance, allowing foundational decisions to be implemented without corresponding ADRs. | High | Addressed by Governance v1 |

---

## Scope

This audit reviewed:

- Multi-tenant ADR lineage.
- ADR numbering consistency.
- Firebase / Firestore persistence decisions.
- PostgreSQL platform migration.
- Platform persistence architecture.
- Selected legacy service dependencies.
- Governance process.

The audit methodology was validated on representative samples.

Remaining ADRs are scheduled for subsequent review.

---

## Evidence Standard

Every finding must satisfy the following:

- Repository evidence.
- Commit history.
- Source code.
- Documentation.

Interpretations and governance recommendations are recorded separately from
evidence.

---

# Finding Details

## A-001 Duplicate ADR Numbering Conflict

Status: Resolved

Confidence: High

Resolution:

ADR-008 was created for Bounded Contexts to resolve the duplicate ADR-003
numbering conflict.

Evidence:

- `docs/adr/ADR-003-repository-pattern.md`
- `docs/architecture/decisions/ADR-008-bounded-contexts.md`

---

## A-002 ADR Metadata Inconsistency

Status: Open

Confidence: Medium

Finding:

ADR metadata dates may not consistently match implementation history.

---

## A-003 PostgreSQL Decision Missing ADR

Status: Resolved

Confidence: High

Resolution:

ADR-006 documents the PostgreSQL platform persistence decision.

Evidence:

- Commit `147a603`
- `prisma/schema.prisma`
- `docs/platform/data/schema-design.md`
- `docs/adr/ADR-006-postgresql-platform.md`

---

## A-004 Legacy User Service Orphan

Status: Open

Confidence: High

Finding:

`src/services/user-service.js` remains after repository migration and references
removed dependencies.

---

## A-005 Governance Process Gap

Status: Addressed

Confidence: High

Resolution:

Governance v1 introduced:

- One Decision = One ADR rule.
- Foundational change ADR requirements.
- Mechanical ADR triggers.
- Evidence confidence requirements.
- Evidence register.

---

## Governance Status

Current governance controls:

✅ ADR numbering normalized  
✅ PostgreSQL migration documented through ADR-006  
✅ Evidence confidence policy established  
✅ Evidence register established  
✅ Decision types documented  
✅ Governance rules established  

Remaining open findings:

- A-002 ADR metadata consistency review.
- A-004 Legacy user-service cleanup.
