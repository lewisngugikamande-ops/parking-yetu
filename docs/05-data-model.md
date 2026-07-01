# Parking Yetu - Data Model

## Collection Overview


## Organizations

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Auto-generated document ID |
| `name` | string | ✅ | Organization name |
| `type` | string | ✅ | church, business, school, residential |
| `settings` | object | ✅ | Configuration settings |
| `createdAt` | timestamp | ✅ | Creation timestamp |
| `updatedAt` | timestamp | ✅ | Last update timestamp |

### Settings Object

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `timeLimit` | number | 180 | Maximum parking duration (minutes) |
| `alertThreshold` | number | 120 | Overstay alert threshold (minutes) |
| `currency` | string | KES | Default currency |
| `timezone` | string | Africa/Nairobi | Organization timezone |

## Users

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `uid` | string | ✅ | Firebase Auth UID |
| `email` | string | ✅ | User email address |
| `name` | string | ✅ | User's full name |
| `role` | string | ✅ | admin, security_manager, guard, receptionist, driver |
| `organizationId` | string | ✅ | Reference to organization |
| `locationId` | string | ❌ | Reference to location (optional) |
| `duties` | object | ❌ | Role-specific duties (gate, shift) |
| `isActive` | boolean | ✅ | Account status |
| `createdAt` | timestamp | ✅ | Creation timestamp |

### Duties Object

| Field | Type | Description |
|-------|------|-------------|
| `gate` | string | Assigned gate (gate_a, gate_b, gate_c, all) |
| `shift` | string | Assigned shift (Day, Night, Weekend, Rotating) |
| `isActive` | boolean | Whether the duty assignment is active |
| `assignedBy` | string | UID of the user who assigned the duty |
| `assignedAt` | timestamp | When the duty was assigned |

## Vehicles

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Auto-generated ID |
| `licensePlate` | string | ✅ | Vehicle license plate |
| `type` | string | ✅ | Vehicle type |
| `organizationId` | string | ✅ | Reference to organization |
| `isBlacklisted` | boolean | ❌ | Whether the vehicle is blacklisted |
| `createdAt` | timestamp | ✅ | Creation timestamp |

### Vehicle Types

| Value | Description |
|-------|-------------|
| `Sedan` | Standard passenger car |
| `SUV/4x4` | Sports utility vehicle |
| `Pickup` | Pickup truck |
| `Motorbike` | Motorcycle |
| `Matatu` | Public service vehicle |
| `Bus` | Large passenger vehicle |
| `Bicycle` | Bicycle |
| `Other` | Other vehicle type |

## Parking Sessions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Auto-generated ID |
| `vehicleId` | string | ✅ | Reference to vehicle |
| `vehicleSnapshot` | object | ✅ | Snapshot of vehicle at entry |
| `driverName` | string | ✅ | Driver's full name |
| `driverPhone` | string | ✅ | Driver's phone number |
| `driverId` | string | ❌ | Driver ID/Registration number |
| `locationId` | string | ✅ | Reference to location |
| `organizationId` | string | ✅ | Reference to organization |
| `entryGate` | string | ✅ | Gate where vehicle entered |
| `entryTime` | timestamp | ✅ | Entry timestamp |
| `status` | string | ✅ | PARKED, EXITED, OVERDUE, CANCELLED |
| `isVIP` | boolean | ❌ | Whether driver is VIP |
| `isStaff` | boolean | ❌ | Whether driver is staff |
| `duration` | number | ❌ | Parking duration in minutes |
| `exitTime` | timestamp | ❌ | Exit timestamp |
| `exitGate` | string | ❌ | Gate where vehicle exited |
| `exitedBy` | string | ❌ | UID of user who processed exit |
| `checkedInBy` | string | ❌ | UID of user who checked in |
| `currentPaymentStatus` | string | ❌ | PENDING, PAID, WAIVED |
| `correlationId` | string | ✅ | Correlation ID for tracing |

### VehicleSnapshot Object

| Field | Type | Description |
|-------|------|-------------|
| `plate` | string | License plate at entry |
| `make` | string | Vehicle make (snapshot) |
| `model` | string | Vehicle model (snapshot) |
| `type` | string | Vehicle type (snapshot) |
| `color` | string | Vehicle color (snapshot) |

## Audit Logs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | string | ✅ | Action performed |
| `userId` | string | ✅ | UID of the user |
| `userRole` | string | ✅ | User's role at the time |
| `organizationId` | string | ✅ | Organization ID |
| `locationId` | string | ❌ | Location ID (if applicable) |
| `targetId` | string | ❌ | ID of affected resource |
| `targetType` | string | ❌ | Type of affected resource |
| `details` | object | ❌ | Action-specific details |
| `correlationId` | string | ✅ | Correlation ID |
| `userAgent` | string | ❌ | Browser user agent |
| `timestamp` | timestamp | ✅ | Action timestamp |

### Audit Actions

| Action | Description |
|--------|-------------|
| `VEHICLE_ENTERED` | Vehicle checked in |
| `VEHICLE_EXITED` | Vehicle checked out |
| `ADMIN_OVERRIDE` | Admin override performed |
| `USER_CREATED` | User account created |
| `USER_DELETED` | User account deleted |
| `INCIDENT_CREATED` | Security incident created |
| `INCIDENT_RESOLVED` | Security incident resolved |
| `GATE_OPENED` | Gate opened |
| `GATE_CLOSED` | Gate closed |
| `BROADCAST_SENT` | Broadcast message sent |
| `SETTINGS_UPDATED` | System settings updated |

## Incidents

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Auto-generated ID |
| `locationId` | string | ✅ | Location ID |
| `organizationId` | string | ✅ | Organization ID |
| `plate` | string | ❌ | Plate number (snapshot) |
| `vehicleId` | string | ❌ | Reference to vehicle |
| `sessionId` | string | ❌ | Reference to parking session |
| `type` | string | ✅ | suspicious, violation, emergency, note, warning, flag |
| `severity` | string | ✅ | low, medium, high, critical |
| `message` | string | ✅ | Incident description |
| `officer` | string | ✅ | UID of reporting officer |
| `status` | string | ✅ | OPEN, RESOLVED, CLOSED |
| `resolvedAt` | timestamp | ❌ | Resolution timestamp |
| `resolvedBy` | string | ❌ | UID of resolver |
| `resolutionNotes` | string | ❌ | Resolution notes |
| `correlationId` | string | ✅ | Correlation ID |
| `createdAt` | timestamp | ✅ | Creation timestamp |

## Shifts

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Auto-generated ID |
| `guardId` | string | ✅ | UID of the guard |
| `locationId` | string | ✅ | Location ID |
| `organizationId` | string | ✅ | Organization ID |
| `startTime` | timestamp | ✅ | Shift start time |
| `endTime` | timestamp | ✅ | Shift end time |
| `type` | string | ✅ | Day, Night, Weekend |
| `status` | string | ✅ | SCHEDULED, ACTIVE, COMPLETED, CANCELLED |
| `correlationId` | string | ✅ | Correlation ID |

## Relationships


## Key Indexes

| Collection | Index Fields | Purpose |
|------------|--------------|---------|
| `parking_sessions` | organizationId + status + entryTime | Active sessions by location |
| `parking_sessions` | organizationId + exitTime | Today's exits |
| `parking_sessions` | locationId + status + entryTime | Location occupancy |
| `audit_logs` | organizationId + timestamp | Audit trail by date |
| `incidents` | organizationId + status + createdAt | Open incidents |
| `shifts` | organizationId + startTime + status | Active shifts |

---

*Parking Yetu - Data Model*
*Version 3.1.0*
