# Parking Yetu - Business Requirements

## BR-001 Vehicle Registration

**Requirement:** The platform shall allow an authorized user to register a vehicle entering the premises.

**Acceptance Criteria:**
- License plate is required
- Driver name is required
- Driver phone is required
- Entry timestamp is automatically recorded
- Entry gate is recorded
- Location is recorded
- QR code is generated
- Audit log is created

**Business Value:** Enables vehicle tracking and verification.

**Priority:** Critical

---

## BR-002 Vehicle Exit

**Requirement:** The platform shall allow security personnel to process vehicle exits.

**Acceptance Criteria:**
- Exit can be processed via QR code scan
- Exit can be processed via manual plate entry
- Exit time is automatically recorded
- Exit gate is recorded
- Duration is calculated
- Session status changes to 'EXITED'
- Audit log is created

**Business Value:** Ensures controlled vehicle departure.

**Priority:** Critical

---

## BR-003 QR Code Generation

**Requirement:** The platform shall generate unique QR codes for each entry.

**Acceptance Criteria:**
- QR code contains vehicle plate and entry details
- QR code can be displayed on screen
- QR code can be downloaded as image
- QR code can be shared via WhatsApp
- QR code is scannable by security personnel

**Business Value:** Enables quick and secure exit verification.

**Priority:** High

---

## BR-004 Security Login

**Requirement:** Security personnel shall log in to the security module.

**Acceptance Criteria:**
- Guard name is selected or entered
- Shift is selected (Day, Night, Weekend)
- Login time is recorded
- Active session is displayed

**Business Value:** Ensures accountability for security operations.

**Priority:** High

---

## BR-005 Shift Logging

**Requirement:** The platform shall log security guard shifts.

**Acceptance Criteria:**
- Shift start time is recorded
- Shift end time is recorded
- Shift type is recorded
- Activities are recorded during shift

**Business Value:** Tracks security personnel activity.

**Priority:** Medium

---

## BR-006 Real-time Dashboard

**Requirement:** The platform shall provide a real-time dashboard.

**Acceptance Criteria:**
- Current occupancy is displayed
- Active vehicles are listed
- Security alerts are shown
- Statistics update in real-time
- Dashboard loads in <2 seconds

**Business Value:** Enables operational monitoring.

**Priority:** High

---

## BR-007 User Management

**Requirement:** Administrators shall manage system users.

**Acceptance Criteria:**
- Create user accounts
- Assign roles
- Assign locations
- Assign gates
- Assign shifts
- Disable accounts
- Audit log for all user actions

**Business Value:** Controls access to the system.

**Priority:** High

---

## BR-008 Role-Based Access Control

**Requirement:** The platform shall enforce role-based access.

**Acceptance Criteria:**
- Admin has full access
- Security Manager has security + limited admin
- Guard has security operations only
- Receptionist has entry + basic reporting
- Driver has self-service only

**Business Value:** Ensures least-privilege access.

**Priority:** High

---

## BR-009 Audit Logging

**Requirement:** The platform shall log all critical actions.

**Acceptance Criteria:**
- User ID is recorded
- Action is recorded
- Timestamp is recorded
- Location is recorded
- Correlation ID is generated
- Target resource is recorded

**Business Value:** Enables investigations and compliance.

**Priority:** Critical

---

## BR-010 VIP Management

**Requirement:** The platform shall support VIP vehicle identification.

**Acceptance Criteria:**
- VIP vehicles can be added to registry
- VIP vehicles can be removed from registry
- VIP vehicles are flagged during entry
- VIP vehicles are flagged during exit
- VIP list is visible to security

**Business Value:** Enables priority handling for important vehicles.

**Priority:** Medium

---

## BR-011 Staff Vehicle Management

**Requirement:** The platform shall support staff vehicle identification.

**Acceptance Criteria:**
- Staff vehicles can be identified during entry
- Staff vehicles are flagged during exit
- Staff parking can be tracked separately

**Business Value:** Enables staff parking management.

**Priority:** Medium

---

## BR-012 Gate Control

**Requirement:** The platform shall support gate operations.

**Acceptance Criteria:**
- Gate status is displayed
- Gate can be opened (simulated)
- Gate can be closed (simulated)
- Gate actions are logged

**Business Value:** Enables gate monitoring and control.

**Priority:** Medium

---

## BR-013 Broadcast Messaging

**Requirement:** The platform shall support broadcast messaging.

**Acceptance Criteria:**
- Messages can be sent to security personnel
- Message content is recorded
- Sender is recorded
- Timestamp is recorded

**Business Value:** Enables operational communication.

**Priority:** Low

---

## BR-014 Reporting

**Requirement:** The platform shall support operational reporting.

**Acceptance Criteria:**
- Parking activity report
- Occupancy report
- Duration analysis
- Peak hours analysis
- CSV export
- Date-range filtering

**Business Value:** Enables data-driven decisions.

**Priority:** Medium

---

## BR-015 Data Backup

**Requirement:** The platform shall support data backup.

**Acceptance Criteria:**
- Backup can be initiated
- Backup can be restored
- Data integrity is maintained

**Business Value:** Prevents data loss.

**Priority:** Medium

---

## BR-016 Multi-location Support

**Requirement:** The platform shall support multiple locations.

**Acceptance Criteria:**
- Multiple locations can be configured
- Users can be assigned to locations
- Parking sessions are location-scoped
- Reports can be filtered by location

**Business Value:** Enables centralized management.

**Priority:** High

---

## BR-017 Overstay Detection

**Requirement:** The platform shall detect and flag overstays.

**Acceptance Criteria:**
- Time limit is configurable
- Alert threshold is configurable
- Overstays are flagged
- Security is notified

**Business Value:** Prevents unauthorized extended parking.

**Priority:** High

---

*Parking Yetu - Business Requirements*
*Version 3.1.0*
