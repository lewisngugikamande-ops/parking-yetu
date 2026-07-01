// ============================================
// User Service - Business Logic Layer
// ============================================

import { getUserRepository } from '../repositories/user-repository.js';
import { Audit } from '../core/audit.js';
import { emit } from '../core/events.js';
import { User } from '../models/User.js';

export class UserService {
    constructor() {
        this.userRepo = getUserRepository();
    }

    async createUser(email, name, password, role) {
        // This would typically create auth user first
        // For now, we'll just create the Firestore document
        const user = new User({
            email,
            name,
            role,
            active: true,
            permissions: User.getDefaultPermissions(role)
        });
        
        const saved = await this.userRepo.create(user);
        
        await Audit.userCreated(saved);
        await emit('user:created', { user: saved });
        
        return saved;
    }

    async getUser(id) {
        return await this.userRepo.getById(id);
    }

    async getUsers(organizationId) {
        return await this.userRepo.getByOrganization(organizationId);
    }

    async updateUser(user) {
        const updated = await this.userRepo.update(user);
        await emit('user:updated', { user: updated });
        return updated;
    }

    async deleteUser(id) {
        await this.userRepo.delete(id);
        await emit('user:deleted', { userId: id });
        return true;
    }

    async assignRole(userId, role) {
        const user = await this.userRepo.getById(userId);
        if (!user) throw new Error('User not found');
        user.role = role;
        user.permissions = User.getDefaultPermissions(role);
        const updated = await this.userRepo.update(user);
        await emit('user:role-changed', { user: updated });
        return updated;
    }
}

// Singleton instance
let instance = null;
export function getUserService() {
    if (!instance) {
        instance = new UserService();
    }
    return instance;
}
