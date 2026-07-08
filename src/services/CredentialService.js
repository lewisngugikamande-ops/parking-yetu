// ==========================================
// CREDENTIAL SERVICE - Manage credentials
// ==========================================

export class CredentialService {
    constructor() {
        this.store = [];
        this._load();
    }

    _load() {
        try {
            const data = localStorage.getItem('credential_store');
            if (data) {
                this.store = JSON.parse(data);
                console.log(`📋 Loaded ${this.store.length} credentials`);
            }
        } catch (e) {
            console.warn('Failed to load credentials:', e);
        }
    }

    _save() {
        try {
            localStorage.setItem('credential_store', JSON.stringify(this.store));
        } catch (e) {
            console.warn('Failed to save credentials:', e);
        }
    }

    async findByPlate(plate) {
        const normalized = plate.toUpperCase().trim();
        return this.store.find(c => c.vehiclePlate === normalized) || null;
    }

    async findById(id) {
        return this.store.find(c => c.id === id) || null;
    }

    async findAll() {
        return [...this.store];
    }

    async create(data) {
        const credential = {
            id: 'cred_' + Date.now(),
            ...data,
            vehiclePlate: data.vehiclePlate.toUpperCase().trim(),
            visitCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.store.push(credential);
        this._save();
        console.log(`📝 Credential created: ${credential.id}`);
        return credential;
    }

    async update(id, data) {
        const index = this.store.findIndex(c => c.id === id);
        if (index === -1) return null;
        this.store[index] = {
            ...this.store[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        this._save();
        return this.store[index];
    }

    async recordVisit(id) {
        const credential = await this.findById(id);
        if (!credential) return null;
        credential.visitCount = (credential.visitCount || 0) + 1;
        credential.lastVisit = new Date().toISOString();
        credential.updatedAt = new Date().toISOString();
        this._save();
        return credential;
    }

    async delete(id) {
        const index = this.store.findIndex(c => c.id === id);
        if (index === -1) return false;
        this.store.splice(index, 1);
        this._save();
        return true;
    }
}

export default new CredentialService();
