// ============================================
// Permission System
// ============================================

import { getSession } from './session.js';
import { Permission, ROLE_PERMISSIONS } from '../models/Permission.js';

export function hasPermission(permission) {
    const user = getSession();
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.permissions && user.permissions[permission]) return true;
    return (ROLE_PERMISSIONS[user.role] || []).includes(permission);
}

export function hasAnyPermission(permissions) {
    if (!permissions || permissions.length === 0) return true;
    return permissions.some(p => hasPermission(p));
}

export function hasAllPermissions(permissions) {
    if (!permissions || permissions.length === 0) return true;
    return permissions.every(p => hasPermission(p));
}

export function getUserRole() {
    const user = getSession();
    return user?.role || 'driver';
}

export function getPermissions() {
    const user = getSession();
    if (!user) return [];
    if (user.role === 'admin') return ROLE_PERMISSIONS.admin;
    if (user.permissions) {
        return Object.keys(user.permissions).filter(key => user.permissions[key]);
    }
    return ROLE_PERMISSIONS[user.role] || [];
}

export function canCreateUsers() {
    return hasPermission('canCreateUsers');
}

export function canDeleteUsers() {
    return hasPermission('canDeleteUsers');
}

export function canReleaseVehicle() {
    return hasPermission('canReleaseVehicle');
}

export function canViewReports() {
    return hasPermission('canViewReports');
}

export function canManageRoster() {
    return hasPermission('canManageRoster');
}

export function canAssignGuards() {
    return hasPermission('canAssignGuards');
}

export function canViewAuditLogs() {
    return hasPermission('canViewAuditLogs');
}

export function canManageSettings() {
    return hasPermission('canManageSettings');
}
