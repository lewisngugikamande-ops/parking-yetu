// ============================================
// Audit Service
// ============================================

import { getSession } from './session.js';
import { getAuditRepository } from '../repositories/audit-repository.js';
import { emit } from './events.js';

const auditRepo = getAuditRepository();

export const Audit = {
    async log({ action, targetId, targetType, details = {}, correlationId = null }) {
        try {
            const user = getSession();
            
            const entry = {
                action,
                userId: user?.id || 'anonymous',
                userRole: user?.role || 'unknown',
                organizationId: user?.organizationId || 'unknown',
                locationId: user?.locationId || 'unknown',
                targetId: targetId || null,
                targetType: targetType || null,
                details: details,
                correlationId: correlationId || null
            };

            // Emit event for other listeners
            emit('audit:log', entry);
            
            // Save to Firestore
            const result = await auditRepo.log(entry);
            return result;
        } catch (error) {
            console.error('Audit log error:', error);
            return null;
        }
    },

    // Convenience methods
    async login(user) {
        return this.log({
            action: 'USER_LOGIN',
            targetId: user.id,
            targetType: 'user',
            details: { email: user.email }
        });
    },

    async logout(user) {
        return this.log({
            action: 'USER_LOGOUT',
            targetId: user.id,
            targetType: 'user'
        });
    },

    async vehicleEntry(session) {
        return this.log({
            action: 'VEHICLE_ENTERED',
            targetId: session.id,
            targetType: 'parking_session',
            details: {
                plate: session.vehiclePlate,
                driver: session.driverName,
                gate: session.gate
            },
            correlationId: session.correlationId
        });
    },

    async vehicleExit(session) {
        return this.log({
            action: 'VEHICLE_EXITED',
            targetId: session.id,
            targetType: 'parking_session',
            details: {
                plate: session.vehiclePlate,
                duration: session.duration,
                gate: session.exitGate
            },
            correlationId: session.correlationId
        });
    },

    async userCreated(user) {
        return this.log({
            action: 'USER_CREATED',
            targetId: user.id,
            targetType: 'user',
            details: { email: user.email, role: user.role }
        });
    }
};
