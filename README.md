# 🚗 Parking Yetu

**Enterprise Parking Operations Platform**

Parking Yetu is an enterprise parking operations platform designed for organizations that require secure, accountable, and efficient vehicle access management.

It replaces manual parking registers with a digital system capable of managing vehicles, personnel, security operations, reporting, and organizational policies across multiple locations.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| QR Code Entry | ✅ |
| QR Code Exit | ✅ |
| Security Dashboard | ✅ |
| Admin Dashboard | ✅ |
| Multi-location Support | ✅ |
| Audit Logs | ✅ |
| Real-time Updates | ✅ |
| Role-Based Access Control | ✅ |
| VIP & Staff Management | ✅ |
| Gate Control | ✅ |
| Broadcast Messaging | ✅ |
| Reporting & Analytics | 🚧 |
| M-Pesa Integration | 📋 |
| ANPR Integration | 📋 |
| Native Mobile App | 📋 |

---

## 🏗️ Architecture


**Technology Stack:**

| Component | Technology |
|-----------|------------|
| Frontend | Vanilla JavaScript + Vite |
| Backend | Firebase (Serverless) |
| Database | Cloud Firestore |
| Authentication | Firebase Auth |
| Hosting | Firebase Hosting |

---

## 📚 Documentation

Documentation is the source of truth for Parking Yetu.


---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/parking-yetu
cd parking-yetu

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy

---

## Now the 5 Critical Documents

### `05-user-roles.md`

```bash
cat > docs/05-user-roles.md << 'EOF'
# Parking Yetu - User Roles

## Role Overview

Parking Yetu implements role-based access control (RBAC) to ensure that users have appropriate access to system features based on their responsibilities.

| Role | Description | Access Level |
|------|-------------|--------------|
| **Administrator** | Full system access and configuration | Complete |
| **Security Manager** | Security operations oversight | High |
| **Security Guard** | Day-to-day security operations | Medium |
| **Receptionist** | Vehicle entry and guest management | Limited |
| **Driver** | Self-service vehicle check-in | Basic |

---

## Administrator

### Responsibilities
- Manage user accounts and permissions
- Configure system settings
- Monitor operational activity
- Review audit logs
- Manage VIP vehicles
- Control gate operations
- Send broadcast messages
- Generate reports

### Permissions

| Permission | Access |
|------------|--------|
| View Dashboard | ✅ |
| View Entry Page | ✅ |
| View Security Page | ✅ |
| View Admin Page | ✅ |
| Create Users | ✅ |
| Delete Users | ✅ |
| Assign Roles | ✅ |
| Assign Locations | ✅ |
| Assign Gates | ✅ |
| Assign Shifts | ✅ |
| View All Vehicles | ✅ |
| Release Vehicles | ✅ |
| Admin Override | ✅ |
| View Reports | ✅ |
| Manage Roster | ✅ |
| View Audit Logs | ✅ |
| Manage VIP | ✅ |
| Control Gates | ✅ |
| Send Broadcasts | ✅ |
| Configure Settings | ✅ |
| Backup/Restore | ✅ |

---

## Security Manager

### Responsibilities
- Oversee security operations
- Manage security personnel
- Review incidents
- Monitor gates
- Generate security reports

### Permissions

| Permission | Access |
|------------|--------|
| View Dashboard | ✅ |
| View Entry Page | ✅ |
| View Security Page | ✅ |
| View Admin Page | ✅ (Limited) |
| Create Users | ❌ |
| Delete Users | ❌ |
| Assign Roles | ❌ |
| Assign Locations | ✅ |
| Assign Gates | ✅ |
| Assign Shifts | ✅ |
| View All Vehicles | ✅ |
| Release Vehicles | ✅ |
| Admin Override | ❌ |
| View Reports | ✅ |
| Manage Roster | ✅ |
| View Audit Logs | ❌ |
| Manage VIP | ✅ |
| Control Gates | ✅ |
| Send Broadcasts | ✅ |
| Configure Settings | ❌ |
| Backup/Restore | ❌ |

---

## Security Guard

### Responsibilities
- Monitor active parking sessions
- Process vehicle exits
- Verify QR codes
- Report incidents
- Gate operations

### Permissions

| Permission | Access |
|------------|--------|
| View Dashboard | ✅ |
| View Entry Page | ✅ |
| View Security Page | ✅ |
| View Admin Page | ❌ |
| Create Users | ❌ |
| Delete Users | ❌ |
| Assign Roles | ❌ |
| Assign Locations | ❌ |
| Assign Gates | ❌ |
| Assign Shifts | ❌ |
| View All Vehicles | ✅ |
| Release Vehicles | ✅ |
| Admin Override | ❌ |
| View Reports | ❌ |
| Manage Roster | ❌ |
| View Audit Logs | ❌ |
| Manage VIP | ❌ |
| Control Gates | ✅ |
| Send Broadcasts | ❌ |
| Configure Settings | ❌ |
| Backup/Restore | ❌ |

---

## Receptionist

### Responsibilities
- Vehicle check-in
- Guest vehicle management
- Basic reporting

### Permissions

| Permission | Access |
|------------|--------|
| View Dashboard | ✅ |
| View Entry Page | ✅ |
| View Security Page | ❌ |
| View Admin Page | ❌ |
| Create Users | ❌ |
| Delete Users | ❌ |
| Assign Roles | ❌ |
| Assign Locations | ❌ |
| Assign Gates | ❌ |
| Assign Shifts | ❌ |
| View All Vehicles | ✅ |
| Release Vehicles | ❌ |
| Admin Override | ❌ |
| View Reports | ✅ (Limited) |
| Manage Roster | ❌ |
| View Audit Logs | ❌ |
| Manage VIP | ❌ |
| Control Gates | ❌ |
| Send Broadcasts | ❌ |
| Configure Settings | ❌ |
| Backup/Restore | ❌ |

---

## Driver

### Responsibilities
- Self-service vehicle check-in
- View own parking history

### Permissions

| Permission | Access |
|------------|--------|
| View Dashboard | ❌ |
| View Entry Page | ✅ |
| View Security Page | ❌ |
| View Admin Page | ❌ |
| Create Users | ❌ |
| Delete Users | ❌ |
| Assign Roles | ❌ |
| Assign Locations | ❌ |
| Assign Gates | ❌ |
| Assign Shifts | ❌ |
| View All Vehicles | ❌ |
| Release Vehicles | ❌ |
| Admin Override | ❌ |
| View Reports | ❌ |
| Manage Roster | ❌ |
| View Audit Logs | ❌ |
| Manage VIP | ❌ |
| Control Gates | ❌ |
| Send Broadcasts | ❌ |
| Configure Settings | ❌ |
| Backup/Restore | ❌ |

---

## Permission Matrix Summary

| Permission | Admin | Sec Mgr | Guard | Receptionist | Driver |
|------------|-------|---------|-------|--------------|--------|
| **View Dashboard** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **View Entry** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Security** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **View Admin** | ✅ | ✅ (Limited) | ❌ | ❌ | ❌ |
| **Create Users** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Delete Users** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Assign Roles** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Assign Locations** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Assign Gates** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Assign Shifts** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **View All Vehicles** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Release Vehicles** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Admin Override** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Reports** | ✅ | ✅ | ❌ | ✅ (Limited) | ❌ |
| **Manage Roster** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **View Audit Logs** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Manage VIP** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Control Gates** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Send Broadcasts** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Configure Settings** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Backup/Restore** | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Role Assignment

### How Roles Are Assigned

1. **Administrator** creates a user account
2. **Administrator** selects a role from the dropdown
3. **Permissions** are automatically applied based on role
4. **User** receives appropriate access

### Where Roles Are Stored

```javascript
// In Firestore: users/{uid}
{
  uid: "user123",
  email: "john@example.com",
  name: "John Otieno",
  role: "security_guard"  // Determines permissions
}

---

### `06-user-flows.md`

```bash
cat > docs/06-user-flows.md << 'EOF'
# Parking Yetu - User Flows

## Overview

This document defines the primary user flows in Parking Yetu. Each flow represents a complete user journey from start to finish.

---

## Flow 1: Vehicle Entry (Self Check-in)

### Actor
**Driver** (or Receptionist on behalf of driver)

### Flow


### Acceptance Criteria

- [ ] Plate is required and validated
- [ ] Driver name is required
- [ ] Phone is required and validated
- [ ] Entry time is automatically recorded
- [ ] Entry gate is recorded
- [ ] QR code is generated
- [ ] Audit log is created
- [ ] Success message is displayed

---

## Flow 2: Vehicle Exit (Security)

### Actor
**Security Guard** (or Security Manager)

### Flow


### Acceptance Criteria

- [ ] Security can log in with name and shift
- [ ] QR codes are scannable
- [ ] Manual plate entry works
- [ ] Vehicle details are displayed correctly
- [ ] Overstay is flagged
- [ ] All actions are available
- [ ] Audit log is created
- [ ] Session status changes to EXITED

---

## Flow 3: User Creation (Admin)

### Actor
**Administrator**

### Flow


### Acceptance Criteria

- [ ] Email is required and validated
- [ ] Password is required and minimum length
- [ ] Name is required
- [ ] Role selection is required
- [ ] Location selection is optional
- [ ] User appears in list after creation
- [ ] Audit log is created

---

## Flow 4: VIP Management (Admin)

### Actor
**Administrator** or **Security Manager**

### Flow


### Acceptance Criteria

- [ ] Plate is required and validated
- [ ] Duplicate VIPs are rejected
- [ ] VIP appears in list after addition
- [ ] VIP vehicles are flagged during entry
- [ ] VIP vehicles are flagged during exit
- [ ] Audit log is created

---

## Flow 5: Broadcast Message (Admin)

### Actor
**Administrator** or **Security Manager**

### Flow


### Acceptance Criteria

- [ ] Message text is required
- [ ] Sender is recorded
- [ ] Timestamp is recorded
- [ ] Message appears in log
- [ ] Audit log is created

---

## Flow 6: Gate Control

### Actor
**Security** (Guard, Manager, or Admin)

### Flow


### Acceptance Criteria

- [ ] Gate status is displayed
- [ ] Last action is displayed
- [ ] Open and Close actions work
- [ ] Gate status updates after action
- [ ] Audit log is created

---

## Flow 7: Report Generation

### Actor
**Administrator** or **Security Manager**

### Flow


### Acceptance Criteria

- [ ] Report types are available
- [ ] Date range selection works
- [ ] Location filtering works
- [ ] Data is displayed correctly
- [ ] CSV export works

---

## Flow 8: Security Login

### Actor
**Security Guard** or **Security Manager**

### Flow


### Acceptance Criteria

- [ ] Name is required
- [ ] Shift selection is required
- [ ] Login time is recorded
- [ ] Security tools are displayed after login

---

## Flow 9: Security Logout

### Actor
**Security Guard** or **Security Manager**

### Flow


### Acceptance Criteria

- [ ] Logout button is visible
- [ ] Shift end time is recorded
- [ ] Login form reappears after logout

---

## Flow 10: Admin Override

### Actor
**Administrator** (only)

### Flow


### Acceptance Criteria

- [ ] Override button is visible only to admins
- [ ] Reason is required
- [ ] Override is logged in audit
- [ ] Incident is created
- [ ] Vehicle is released

---

## Summary

| Flow | Primary Actor | Critical |
|------|---------------|----------|
| Vehicle Entry | Driver | ✅ |
| Vehicle Exit | Security | ✅ |
| User Creation | Admin | ✅ |
| VIP Management | Admin | ✅ |
| Broadcast | Admin | 🟡 |
| Gate Control | Security | 🟡 |
| Reports | Admin | 🟡 |
| Security Login | Guard | ✅ |
| Security Logout | Guard | ✅ |
| Admin Override | Admin | ✅ |

---

*Parking Yetu - User Flows*
*Version 1.0.0*

## 🛑 Visual Freeze

Until the Workstation Home is complete:

- ❌ No gradient changes
- ❌ No animation changes
- ❌ No spacing changes
- ❌ No color changes
- ✅ Only bug fixes

**Reference:** `docs/design-reference/` for visual baseline.
