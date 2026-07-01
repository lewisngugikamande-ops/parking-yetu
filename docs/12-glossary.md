# Parking Yetu - Glossary

## Core Domain Terms

### Organization
A tenant in the multi-tenant system. All data is scoped to an organization.
- Example: "Catholic Diocese of Nairobi"

### Campus
A physical grouping of locations within an organization.
- Example: "St. Mary's Parish"

### Location
A physical parking area within a campus.
- Example: "Parking Lot A"

### Gate
An entry or exit point at a location.
- Example: "Gate East"

### Parking Session
A record of a vehicle's parking activity from entry to exit.

### Vehicle
A vehicle that can be parked. Identified by license plate.

### Driver
The person operating the vehicle.

### VIP
A driver who receives priority handling.

### Staff
An employee of the organization who receives priority handling.

### Incident
A security or operational event that requires attention.

### Shift
A security guard's work period.

### Guard
Security personnel responsible for vehicle exits and safety.

### Audit Event
A record of any critical system action.

### Correlation ID
A unique identifier that traces a request across the entire system.

## Technical Terms

### RBAC
Role-Based Access Control - permissions assigned by role.

### Multi-Tenancy
A single instance serving multiple organizations with data isolation.

### Repository Pattern
An abstraction layer between business logic and data storage.

### Domain-Driven Design
An approach that models software around business domains.

### Firestore
Firebase's NoSQL document database.

### Vite
A modern frontend build tool.

### Firebase Auth
Firebase's authentication service.

## Statuses

### Parking Session Statuses
- `PARKED` - Vehicle is currently parked
- `EXITED` - Vehicle has left
- `OVERDUE` - Vehicle exceeded time limit
- `CANCELLED` - Session was cancelled

### Incident Statuses
- `OPEN` - Incident reported, not resolved
- `RESOLVED` - Incident resolved
- `CLOSED` - Incident closed

### Shift Statuses
- `SCHEDULED` - Shift planned
- `ACTIVE` - Shift in progress
- `COMPLETED` - Shift finished
- `CANCELLED` - Shift cancelled

## Roles

### Administrator
Full system access and configuration.

### Security Manager
Security operations oversight.

### Security Guard
Day-to-day security operations.

### Receptionist
Vehicle entry and guest management.

### Driver
Self-service vehicle check-in.

---

*Parking Yetu - Glossary*
*Version 3.1.0*
