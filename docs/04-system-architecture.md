# Parking Yetu - System Architecture

## Architectural Overview

Parking Yetu follows a **domain-driven design** with a **modular architecture** that separates concerns into distinct layers. The architecture is designed to be:

- **Scalable** - Each module can be extended independently
- **Maintainable** - Clear separation of business logic from infrastructure
- **Testable** - Isolated layers enable comprehensive testing
- **Secure** - Multi-tenant isolation at the data layer

## Architecture Layers


[200~
## Domain Entities

### Vehicle
Represents a vehicle with its business rules.
~

### ParkingSession
Manages the lifecycle of a parking session.


## Modules

### Core Module
- Firebase configuration
- Authentication
- Audit logging
- Utility functions (validation, correlation)

### Parking Module
- Repository layer (data access)
- Service layer (business logic)
- Domain entities (Vehicle, ParkingSession)

### UI Module
- Page components (Entry, Security, Admin)
- Reusable UI components
- Styles and theming

## Data Flow

### Vehicle Entry

### Vehicle Exit

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vanilla JavaScript, Vite |
| Backend | Firebase (Serverless) |
| Database | Cloud Firestore |
| Authentication | Firebase Auth |
| Hosting | Firebase Hosting |
| Build Tool | Vite |
| Language | JavaScript (ES Modules) |

## Security Architecture

### Multi-Tenant Isolation
All data is scoped by `organizationId`, ensuring that organizations cannot access each other's data.

### Authentication
- Firebase Authentication with email/password
- Custom claims for role-based access control
- JWT tokens for API authentication

### Authorization
- Role-based access control (Admin, Security Manager, Guard, Receptionist, Driver)
- Firestore security rules enforce data isolation
- Permissions are validated at the service layer

### Audit Logging
All critical actions are logged with:
- User ID and role
- Timestamp
- Location
- Target resource
- Correlation ID
- Action performed

## Data Storage

### Collections

| Collection | Purpose |
|------------|---------|
| `organizations` | Multi-tenant organizations |
| `users` | User accounts and roles |
| `vehicles` | Vehicle registry |
| `parking_sessions` | Active and historical parking sessions |
| `audit_logs` | Audit trail of all actions |
| `incidents` | Security incidents and flags |
| `shifts` | Security guard shift schedules |

### Indexes

Required Firestore indexes are defined in `firestore.indexes.json`.

## Deployment Architecture


## Principles

### Domain-Driven Design
Business logic is encapsulated in domain entities and services. The repository pattern abstracts data access, and the service layer orchestrates business operations.

### Repository Pattern
Data access is abstracted through repositories, making the codebase easier to test and maintain while keeping business logic independent of the underlying data store.

### Audit Trail
Every critical system action is logged with correlation IDs, enabling full traceability for investigations and compliance.

### Multi-Tenancy
The platform supports multiple organizations with complete data isolation at the database level.

### Offline First
Firestore's offline persistence enables the application to work even when connectivity is limited.

---

*Parking Yetu - System Architecture*
*Version 3.1.0*
