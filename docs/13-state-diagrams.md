# Parking Yetu - State Diagrams

## Parking Session Lifecycle


### Transitions

| From | To | Trigger |
|------|----|---------|
| NEW | PARKED | Vehicle entry processed |
| PARKED | EXITED | Normal exit processed |
| PARKED | OVERDUE | Time limit exceeded (auto) |
| PARKED | FLAGGED | Security flags vehicle |
| FLAGGED | HOLD | Admin holds for review |
| FLAGGED | EXITED | Security releases after review |
| HOLD | RESOLVED | Admin releases |
| OVERDUE | EXITED | Security releases |
| OVERDUE | RESOLVED | Admin override |

## Incident Lifecycle


### Transitions

| From | To | Trigger |
|------|----|---------|
| OPEN | IN_PROGRESS | Security assigned |
| OPEN | RESOLVED | Direct resolution |
| IN_PROGRESS | RESOLVED | Issue resolved |
| RESOLVED | CLOSED | Verification complete |

## Shift Lifecycle


### Transitions

| From | To | Trigger |
|------|----|---------|
| SCHEDULED | ACTIVE | Guard logs in |
| SCHEDULED | CANCELLED | Admin cancels |
| ACTIVE | COMPLETED | Guard logs out |

## Permission Evaluation Flow


---

*Parking Yetu - State Diagrams*
*Version 3.1.0*
