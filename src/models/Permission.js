// ============================================
// Domain Model: Permission
// ============================================

export const PERMISSIONS = {
    canCreateUsers: 'canCreateUsers',
    canDeleteUsers: 'canDeleteUsers',
    canReleaseVehicle: 'canReleaseVehicle',
    canViewReports: 'canViewReports',
    canManageRoster: 'canManageRoster',
    canAssignGuards: 'canAssignGuards',
    canViewAuditLogs: 'canViewAuditLogs',
    canManageSettings: 'canManageSettings',
    canViewAnalytics: 'canViewAnalytics'
};

export const ROLE_PERMISSIONS = {
    admin: [
        PERMISSIONS.canCreateUsers,
        PERMISSIONS.canDeleteUsers,
        PERMISSIONS.canReleaseVehicle,
        PERMISSIONS.canViewReports,
        PERMISSIONS.canManageRoster,
        PERMISSIONS.canAssignGuards,
        PERMISSIONS.canViewAuditLogs,
        PERMISSIONS.canManageSettings,
        PERMISSIONS.canViewAnalytics
    ],
    security_manager: [
        PERMISSIONS.canReleaseVehicle,
        PERMISSIONS.canViewReports,
        PERMISSIONS.canManageRoster,
        PERMISSIONS.canAssignGuards,
        PERMISSIONS.canViewAuditLogs
    ],
    guard: [
        PERMISSIONS.canReleaseVehicle
    ],
    receptionist: [
        PERMISSIONS.canViewReports
    ],
    driver: []
};

export class Permission {
    static getDefaultPermissions(role) {
        const defaults = {};
        const permissions = ROLE_PERMISSIONS[role] || [];
        permissions.forEach(p => {
            defaults[p] = true;
        });
        return defaults;
    }

    static getRolePermissions(role) {
        return ROLE_PERMISSIONS[role] || [];
    }

    static hasPermission(role, permission, customPermissions = {}) {
        if (role === 'admin') return true;
        if (customPermissions[permission]) return true;
        return (ROLE_PERMISSIONS[role] || []).includes(permission);
    }

    static getAllRoles() {
        return Object.keys(ROLE_PERMISSIONS);
    }

    static getRolesWithPermission(permission) {
        const roles = [];
        Object.keys(ROLE_PERMISSIONS).forEach(role => {
            if (ROLE_PERMISSIONS[role].includes(permission)) {
                roles.push(role);
            }
        });
        return roles;
    }
}
