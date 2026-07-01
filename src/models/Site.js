// ============================================
// Domain Model: Site
// ============================================

export class Site {
    constructor({ id, name, address, organizationId, gates, capacity }) {
        this.id = id;
        this.name = name || 'Main Site';
        this.address = address || '';
        this.organizationId = organizationId;
        this.gates = gates || [];
        this.capacity = capacity || 50;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    addGate(gate) {
        this.gates.push(gate);
        this.updatedAt = new Date();
        return this;
    }

    getDefaultGate() {
        return this.gates.length > 0 ? this.gates[0].name : 'Gate A';
    }

    toPlain() {
        return {
            id: this.id,
            name: this.name,
            address: this.address,
            organizationId: this.organizationId,
            gates: this.gates,
            capacity: this.capacity,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromPlain(data) {
        return new Site({
            id: data.id,
            name: data.name,
            address: data.address,
            organizationId: data.organizationId,
            gates: data.gates || [],
            capacity: data.capacity || 50
        });
    }
}
