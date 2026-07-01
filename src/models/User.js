// ============================================
// Domain Model: User
// ============================================

export class User {
    constructor({ id, email, name, role, organizationId, locationId, isActive, permissions }) {
        this.id = id;
        this.email = email || '';
        this.name = name || '';
        this.role = role || 'driver';
        this.organizationId = organizationId || 'org_church_a';
        this.locationId = locationId || 'church_a';
        this.isActive = isActive !== false;
        this.permissions = permissions || {};
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Check if user has a specific permission
    hasPermission(permission) {
        if (this.role === 'admin') return true;
        return this.permissions[permission] || false;
    }

    // Check if user is admin
    isAdmin() {
        return this.role === 'admin';
    }

    // Check if user is active
    isActive() {
        return this.isActive;
    }

    // Convert to Firestore document
    toFirestore() {
        return {
            uid: this.id,
            email: this.email,
            name: this.name,
            role: this.role,
            organizationId: this.organizationId,
            locationId: this.locationId,
            isActive: this.isActive,
            permissions: this.permissions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Create from Firestore document
    static fromFirestore(data) {
        return new User({
            id: data.uid || data.id,
            email: data.email,
            name: data.name,
            role: data.role || 'driver',
            organizationId: data.organizationId,
            locationId: data.locationId,
            isActive: data.isActive !== false,
            permissions: data.permissions || {}
        });
    }

    // Default permissions by role
    static getDefaultPermissions(role) {
        const defaults = {
            admin: {
                canCreateUsers: true,
                canDeleteUsers: true,
                canReleaseVehicle: true,
                canViewReports: true,
                canManageRoster: true,
                canAssignGuards: true,
                canViewAuditLogs: true
            },
            security_manager: {
                canReleaseVehicle: true,
                canViewReports: true,
                canManageRoster: true,
                canAssignGuards: true
            },
            guard: {
                canReleaseVehicle: true
            },
            receptionist: {
                canViewReports: true
            },
            driver: {}
        };
        return defaults[role] || {};
    }
}
