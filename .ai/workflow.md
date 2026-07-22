# Architectural Decision Discipline

## Purpose

Architectural decisions are governed by evidence rather than preference or repetition. An idea may be discussed multiple times, but its ADR status changes only when new evidence has been gathered and evaluated.

---

## ADR Lifecycle

### Proposed

A proposed ADR is a hypothesis under evaluation.

- It is **not** a project plan.
- It is **not** an approved direction.
- Work must not proceed on the proposal unless explicitly approved or required for evaluation.

### Accepted

An ADR becomes Accepted only after sufficient evidence has been gathered and documented.

Examples of acceptable evidence include:

- Dependency analysis
- Performance measurements
- Prototype results
- Compatibility assessments
- Operational experience
- Security review
- Stakeholder approval
- Cost and migration analysis

### Rejected

Rejected ADRs remain part of the architectural history.

They should not be deleted, as they document alternatives that were considered and explain why they were not adopted.

---

## Evidence-Based Governance

Architectural discussions must distinguish between:

- **Ideas**
- **Hypotheses**
- **Evidence**
- **Decisions**

A repeated argument is **not** new evidence.

An ADR may only change status when new evidence materially changes the architectural assessment.

---

## Revisiting Existing ADRs

When an architectural topic resurfaces:

1. Locate the existing ADR.
2. Review its current status.
3. Determine whether new evidence exists.
4. If no new evidence exists:
   - Keep the ADR in its current status.
   - Do not restart the decision process.
5. If new evidence exists:
   - Update the ADR.
   - Re-evaluate the decision.
   - Record the rationale for any status change.

---

## Repository Restructuring Example

ADR-007 (Repository Restructuring) remains **Proposed** until:

- A dependency inventory has been completed.
- Repository coupling has been analysed.
- H1–H4 have been evaluated.
- A documented recommendation has been produced.

Until then:

- Do not assume restructuring is the destination.
- Do not begin implementation planning.
- Reference ADR-007 instead of re-opening the discussion.

---

## Governance Principles

- Evidence over intuition.
- Verification over assumption.
- One architectural decision at a time.
- One major migration at a time.
- Preserve a clear and auditable decision history.
- Separate architectural decisions from implementation scheduling.
---

## Workflow Enforcement

Before proposing or revisiting any architectural change:

1. Search for an existing ADR covering the topic.
2. Respect the ADR's current status.
3. Gather and document any new evidence.
4. Only then consider changing the ADR status.
5. If no new evidence exists, continue with the current approved roadmap.

This workflow applies to both human contributors and AI assistants.
