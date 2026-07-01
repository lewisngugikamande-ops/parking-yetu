// ============================================
// Domain Model: Operator
// ============================================

export class Operator {
    constructor({ id, displayName, email, role, authMethod, organizationId, siteId, pin, isActive }) {
        this.id = id;
        this.displayName = displayName || 'Operator';
        this.email = email || '';
        this.role = role || 'security'; // admin, security_manager, security, volunteer
        this.authMethod = authMethod || 'email'; // email, pin, kiosk
        this.organizationId = organizationId;
        this.siteId = siteId || null;
        this.pin = pin || null; // Only stored if authMethod === 'pin'
        this.isActive = isActive !== false;
        this.lastActive = null;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    isAdmin() {
        return this.role === 'admin';
    }

    isSecurity() {
        return this.role === 'security' || this.role === 'security_manager';
    }

    isVolunteer() {
        return this.role === 'volunteer';
    }

    can(permission) {
        if (this.isAdmin()) return true;
        
        const rolePermissions = {
            security_manager: ['entry', 'exit', 'view_vehicles', 'view_reports'],
            security: ['entry', 'exit', 'view_vehicles'],
            volunteer: ['entry'],
            driver: []
        };
        
        return rolePermissions[this.role]?.includes(permission) || false;
    }

    toPlain() {
        return {
            id: this.id,
            displayName: this.displayName,
            email: this.email,
            role: this.role,
            authMethod: this.authMethod,
            organizationId: this.organizationId,
            siteId: this.siteId,
            pin: this.pin,
            isActive: this.isActive,
            lastActive: this.lastActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromPlain(data) {
        const op = new Operator({
            id: data.id,
            displayName: data.displayName,
            email: data.email,
            role: data.role,
            authMethod: data.authMethod || 'email',
            organizationId: data.organizationId,
            siteId: data.siteId,
            pin: data.pin,
            isActive: data.isActive !== false
        });
        op.lastActive = data.lastActive || null;
        op.createdAt = data.createdAt || new Date();
        op.updatedAt = data.updatedAt || new Date();
        return op;
    }
}
