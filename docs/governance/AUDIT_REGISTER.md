# Governance Audit Register

## Audit

Architecture Governance Audit — July 2026

Purpose:

Establish a single, evidence-based architectural governance model for the
Access Engine platform.

---

| ID | Finding | Confidence | Status |
|----|----------|------------|--------|
| A-001 | Duplicate multi-tenant ADRs describe the same architectural decision using different templates. | High | Open |
| A-002 | Metadata inconsistency between Git history and ADR acceptance dates. | Medium | Open |
| A-003 | PostgreSQL platform persistence decision exists in implementation but had no ADR. | High | **Resolved by ADR-006** |
| A-004 | `src/services/user-service.js` is orphaned after repository migration. Imports deleted dependencies and has no remaining callers. | High | Open |
| A-005 | Architectural evolution outpaced ADR governance, allowing foundational decisions to be implemented without corresponding ADRs. | High | Addressed by Governance v1 |

---

## Scope

This audit reviewed:

- Multi-tenant ADR lineage.
- Firebase / Firestore persistence decisions.
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

