// ============================================
// Domain Model: Organization
// ============================================

export class Organization {
    constructor({ id, name, type, settings, sites }) {
        this.id = id;
        this.name = name || 'My Organization';
        this.type = type || 'church'; // church, business, school, estate, event
        this.settings = {
            timeLimit: settings?.timeLimit || 180,
            alertThreshold: settings?.alertThreshold || 120,
            sessionTimeout: settings?.sessionTimeout || 480,
            defaultGate: settings?.defaultGate || 'Gate A',
            defaultLocation: settings?.defaultLocation || 'church_a',
            maxCapacity: settings?.maxCapacity || 100,
            allowOvernight: settings?.allowOvernight || false,
            currency: settings?.currency || 'KES',
            authMode: settings?.authMode || 'email', // email, pin, kiosk, hybrid
            ...settings
        };
        this.sites = sites || [];
        this.branding = {};
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    toPlain() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            settings: this.settings,
            sites: this.sites,
            branding: this.branding,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromPlain(data) {
        return new Organization({
            id: data.id,
            name: data.name,
            type: data.type,
            settings: data.settings,
            sites: data.sites || []
        });
    }
}
