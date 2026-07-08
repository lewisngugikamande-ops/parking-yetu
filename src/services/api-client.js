// ==========================================
// API CLIENT - Uses existing services
// ==========================================

import credentialService from './CredentialService.js';
import sessionService from './SessionService.js';
import policyService from './PolicyService.js';
import organizationService from './OrganizationService.js';

console.log('📡 API Client initializing with existing services...');

class ApiClient {
    constructor() {
        this.currentUser = null;
        this.services = {
            credential: credentialService,
            session: sessionService,
            policy: policyService,
            organization: organizationService
        };
        console.log('✅ API Client ready with services');
    }

    // Auth methods
    async login(email, password) {
        // For demo, create a mock user
        const user = {
            id: 'user_' + Date.now(),
            email: email,
            name: email.split('@')[0],
            roles: ['user'],
            organizationId: 'org_pcea_langata'
        };
        this.currentUser = user;
        localStorage.setItem('auth_user', JSON.stringify(user));
        return { success: true, data: { user, token: 'mock_token_' + Date.now() } };
    }

    async logout() {
        this.currentUser = null;
        localStorage.removeItem('auth_user');
        return { success: true };
    }

    getCurrentUser() {
        if (this.currentUser) return this.currentUser;
        const saved = localStorage.getItem('auth_user');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            return this.currentUser;
        }
        return null;
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }

    // Dashboard methods using existing services
    async getDashboard() {
        try {
            const sessions = await sessionService.findAll();
            const credentials = await credentialService.findAll();
            
            const activeSessions = sessions.filter(s => s.status === 'active');
            
            return {
                success: true,
                data: {
                    active: activeSessions.length,
                    today: sessions.length,
                    exits: sessions.filter(s => s.status === 'completed').length,
                    activities: sessions.slice(-5).map(s => ({
                        time: new Date(s.entryTime).toLocaleTimeString(),
                        event: s.status === 'active' ? 'Vehicle entered' : 'Vehicle exited',
                        vehicle: s.vehicle || 'N/A'
                    })),
                    alerts: []
                }
            };
        } catch (error) {
            console.warn('Dashboard data error:', error);
            return {
                success: false,
                data: { active: 0, today: 0, exits: 0, activities: [], alerts: [] }
            };
        }
    }

    getCurrentVisit() {
        try {
            const sessions = sessionService.store || [];
            const active = sessions.find(s => s.status === 'active');
            if (active) {
                return {
                    id: active.id,
                    vehicle: active.vehicle || 'N/A',
                    entryTime: active.entryTime,
                    status: active.status
                };
            }
            return null;
        } catch (error) {
            console.warn('Current visit error:', error);
            return null;
        }
    }

    async getMemberHistory(memberId) {
        try {
            const credentials = await credentialService.findAll();
            const member = credentials.find(c => c.id === memberId);
            if (!member) return { success: true, data: [] };
            
            const sessions = await sessionService.findByCredential(memberId);
            return {
                success: true,
                data: sessions.map(s => ({
                    date: new Date(s.entryTime).toLocaleDateString(),
                    vehicle: member.vehiclePlate || 'N/A',
                    action: s.status === 'active' ? 'entry' : 'exit',
                    time: new Date(s.entryTime).toLocaleTimeString()
                }))
            };
        } catch (error) {
            console.warn('Member history error:', error);
            return { success: true, data: [] };
        }
    }

    async getMemberVehicles(memberId) {
        try {
            const credential = await credentialService.findById(memberId);
            if (!credential) return { success: true, data: [] };
            return {
                success: true,
                data: [{
                    plate: credential.vehiclePlate,
                    make: 'Unknown',
                    model: 'Unknown',
                    color: 'Unknown'
                }]
            };
        } catch (error) {
            console.warn('Member vehicles error:', error);
            return { success: true, data: [] };
        }
    }

    async endVisit(visitId) {
        try {
            const closed = await sessionService.close(visitId);
            return { success: true, data: closed };
        } catch (error) {
            console.warn('End visit error:', error);
            return { success: false, error: error.message };
        }
    }

    async getVehicleHistory(plate) {
        try {
            const credential = await credentialService.findByPlate(plate);
            if (!credential) return { success: true, data: [] };
            
            const sessions = await sessionService.findByCredential(credential.id);
            return {
                success: true,
                data: sessions.map(s => ({
                    date: new Date(s.entryTime).toLocaleDateString(),
                    action: s.status === 'active' ? 'entry' : 'exit',
                    time: new Date(s.entryTime).toLocaleTimeString()
                }))
            };
        } catch (error) {
            console.warn('Vehicle history error:', error);
            return { success: true, data: [] };
        }
    }

    async getActiveSessions() {
        try {
            const sessions = await sessionService.findAll();
            return {
                success: true,
                data: sessions.filter(s => s.status === 'active')
            };
        } catch (error) {
            console.warn('Active sessions error:', error);
            return { success: true, data: [] };
        }
    }
}

// Create and export singleton
const apiClient = new ApiClient();

// Export individual functions for compatibility
export const getCurrentUser = () => apiClient.getCurrentUser();
export const login = (email, password) => apiClient.login(email, password);
export const logout = () => apiClient.logout();
export const isAuthenticated = () => apiClient.isAuthenticated();
export const getDashboard = () => apiClient.getDashboard();
export const getCurrentVisit = () => apiClient.getCurrentVisit();
export const getMemberHistory = (memberId) => apiClient.getMemberHistory(memberId);
export const getMemberVehicles = (memberId) => apiClient.getMemberVehicles(memberId);
export const endVisit = (visitId) => apiClient.endVisit(visitId);
export const getVehicleHistory = (plate) => apiClient.getVehicleHistory(plate);
export const getActiveSessions = () => apiClient.getActiveSessions();

export default apiClient;
