// ==========================================
// ORGANIZATION SERVICE - Manage organizations
// ==========================================

export class OrganizationService {
    constructor() {
        this.organizations = [
            {
                id: 'org_pcea_langata',
                name: "P.C.E.A Lang'ata",
                type: 'church',
                locations: [
                    {
                        id: 'loc_langata_main',
                        name: "Lang'ata Main",
                        accessPoints: [
                            {
                                id: 'ap_gate_1',
                                name: 'Gate 1 - Parking',
                                capacity: 20,
                                direction: 'entry'
                            },
                            {
                                id: 'ap_gate_2',
                                name: 'Gate 2 - Main Entrance',
                                capacity: 200,
                                direction: 'entry'
                            }
                        ]
                    }
                ]
            }
        ];
    }

    async findById(id) {
        return this.organizations.find(o => o.id === id) || null;
    }

    async findAll() {
        return [...this.organizations];
    }

    async findAccessPoint(organizationId, accessPointId) {
        const org = await this.findById(organizationId);
        if (!org) return null;
        for (const location of org.locations || []) {
            const ap = location.accessPoints?.find(a => a.id === accessPointId);
            if (ap) {
                return {
                    ...ap,
                    location: location,
                    organization: org
                };
            }
        }
        return null;
    }

    async create(data) {
        const org = {
            id: 'org_' + Date.now(),
            ...data,
            createdAt: new Date().toISOString()
        };
        this.organizations.push(org);
        return org;
    }

    async addLocation(organizationId, location) {
        const org = await this.findById(organizationId);
        if (!org) return null;
        if (!org.locations) org.locations = [];
        const newLocation = {
            id: 'loc_' + Date.now(),
            ...location,
            createdAt: new Date().toISOString()
        };
        org.locations.push(newLocation);
        return newLocation;
    }

    async addAccessPoint(organizationId, locationId, accessPoint) {
        const org = await this.findById(organizationId);
        if (!org) return null;
        const location = org.locations?.find(l => l.id === locationId);
        if (!location) return null;
        if (!location.accessPoints) location.accessPoints = [];
        const newAccessPoint = {
            id: 'ap_' + Date.now(),
            ...accessPoint,
            createdAt: new Date().toISOString()
        };
        location.accessPoints.push(newAccessPoint);
        return newAccessPoint;
    }
}

export default new OrganizationService();
