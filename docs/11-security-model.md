# Parking Yetu - Security Model

## Multi-Tenant Isolation
All data is scoped by organizationId.

## Role-Based Access Control
| Role | Access Level |
|------|--------------|
| Administrator | Full system access |
| Security Manager | Security + limited admin |
| Security Guard | Security operations only |
| Receptionist | Entry + basic reporting |
| Driver | Self-service only |

## Threat Model
| Threat | Mitigation |
|--------|------------|
| Fake QR | Signed tokens |
| Unauthorized exit | Role validation |
| Privilege escalation | Firestore rules |
| Data leakage | Organization scoping |

---

*Parking Yetu - Security Model - Version 3.1.0*
