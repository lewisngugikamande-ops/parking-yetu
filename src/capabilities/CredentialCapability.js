// ==========================================
// CREDENTIAL CAPABILITY - Manage credentials
// ==========================================

import { Capability } from '../core/capability/Capability.js';

class CredentialCapability extends Capability {
    constructor() {
        super({
            id: 'credentials',
            name: 'Credential Service',
            version: '1.0.0'
        });
        this._store = [];
    }

    async onInitialize() {
        // Load existing credentials from localStorage
        try {
            const stored = localStorage.getItem('credential_store');
            if (stored) {
                this._store = JSON.parse(stored);
                console.log(`📋 Loaded ${this._store.length} credentials`);
            }
        } catch (e) {
            console.warn('Failed to load credentials:', e);
        }
    }

    async onShutdown() {
        // Save credentials to localStorage
        try {
            localStorage.setItem('credential_store', JSON.stringify(this._store));
            console.log(`💾 Saved ${this._store.length} credentials`);
        } catch (e) {
            console.warn('Failed to save credentials:', e);
        }
    }

    findByPlate(plate) {
        return this._store.find(c => c.vehiclePlate === plate) || null;
    }

    findById(id) {
        return this._store.find(c => c.id === id) || null;
    }

    findAll() {
        return [...this._store];
    }

    create(data) {
        const credential = {
            id: 'cred_' + Date.now(),
            ...data,
            visitCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this._store.push(credential);
        this.emit('credential:created', credential);
        return credential;
    }

    update(id, data) {
        const index = this._store.findIndex(c => c.id === id);
        if (index === -1) return null;
        this._store[index] = {
            ...this._store[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        this.emit('credential:updated', this._store[index]);
        return this._store[index];
    }

    recordVisit(id) {
        const credential = this.findById(id);
        if (!credential) return null;
        credential.visitCount = (credential.visitCount || 0) + 1;
        credential.lastVisit = new Date().toISOString();
        credential.updatedAt = new Date().toISOString();
        this.emit('credential:visited', credential);
        return credential;
    }

    delete(id) {
        const index = this._store.findIndex(c => c.id === id);
        if (index === -1) return false;
        this._store.splice(index, 1);
        this.emit('credential:deleted', { id });
        return true;
    }
}

export default new CredentialCapability();
