// ==========================================
// SESSION SERVICE - Manage sessions
// ==========================================

export class SessionService {
    constructor() {
        this.store = [];
        this._load();
    }

    _load() {
        try {
            const data = localStorage.getItem('session_store');
            if (data) {
                this.store = JSON.parse(data);
                console.log(`📋 Loaded ${this.store.length} sessions`);
            }
        } catch (e) {
            console.warn('Failed to load sessions:', e);
        }
    }

    _save() {
        try {
            localStorage.setItem('session_store', JSON.stringify(this.store));
        } catch (e) {
            console.warn('Failed to save sessions:', e);
        }
    }

    async findById(id) {
        return this.store.find(s => s.id === id) || null;
    }

    async findByCredential(credentialId) {
        return this.store.filter(s => s.credentialId === credentialId);
    }

    async findActiveByCredential(credentialId) {
        return this.store.find(s => s.credentialId === credentialId && s.status === 'active') || null;
    }

    async findAll() {
        return [...this.store];
    }

    async create(data) {
        const session = {
            id: 'sess_' + Date.now(),
            ...data,
            status: 'active',
            entryTime: new Date().toISOString(),
            exitTime: null,
            token: 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8),
            createdAt: new Date().toISOString()
        };
        this.store.push(session);
        this._save();
        console.log(`📋 Session created: ${session.id}`);
        return session;
    }

    async close(id) {
        const session = await this.findById(id);
        if (!session) return null;
        session.status = 'completed';
        session.exitTime = new Date().toISOString();
        session.duration = this._calculateDuration(session);
        this._save();
        console.log(`📋 Session closed: ${session.id}`);
        return session;
    }

    async findByToken(token) {
        return this.store.find(s => s.token === token) || null;
    }

    _calculateDuration(session) {
        if (!session.exitTime) return null;
        const entry = new Date(session.entryTime);
        const exit = new Date(session.exitTime);
        return Math.floor((exit - entry) / 1000);
    }
}

export default new SessionService();
