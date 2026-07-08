// ==========================================
// P.C.E.A LANG'ATA - Organization Data
// ==========================================

export const pceaLangata = {
    id: 'org_pcea_langata',
    name: "P.C.E.A Lang'ata",
    type: 'church',
    description: 'Presbyterian Church of East Africa - Lang\'ata',
    address: 'Lang\'ata Road, Nairobi, Kenya',
    contact: {
        phone: '+254 700 123 456',
        email: 'info@pcealangata.org',
        website: 'https://pcealangata.org'
    },
    locations: [
        {
            id: 'loc_langata_main',
            name: "Lang'ata Main",
            address: 'Lang\'ata Road, Nairobi',
            accessPoints: [
                {
                    id: 'ap_gate_1',
                    name: 'Gate 1 - Parking',
                    type: 'gate',
                    direction: 'entry',
                    capacity: 20,
                    qrCode: 'QR-PCEA-LANGATA-GATE1',
                    description: 'Parking entrance for members and visitors'
                },
                {
                    id: 'ap_gate_2',
                    name: 'Gate 2 - Main Entrance',
                    type: 'gate',
                    direction: 'entry',
                    capacity: 200,
                    qrCode: 'QR-PCEA-LANGATA-GATE2',
                    description: 'Main church entrance for services'
                }
            ]
        }
    ],
    policies: [
        {
            id: 'policy_members',
            name: 'Members Access',
            description: 'Full access for registered members',
            roles: ['member', 'staff', 'admin'],
            actions: ['enter', 'exit'],
            resources: ['*'],
            effect: 'allow'
        },
        {
            id: 'policy_visitors',
            name: 'Visitors Access',
            description: 'Limited access for visitors',
            roles: ['visitor'],
            actions: ['enter', 'exit'],
            resources: ['gate_1', 'gate_2'],
            effect: 'allow',
            conditions: {
                maxDuration: 4 // hours
            }
        }
    ],
    roles: [
        { id: 'member', name: 'Member', description: 'Regular church member' },
        { id: 'visitor', name: 'Visitor', description: 'First-time or occasional visitor' },
        { id: 'staff', name: 'Staff', description: 'Church staff and administration' },
        { id: 'admin', name: 'Admin', description: 'System administrator' }
    ]
};

// Generate QR code data for an access point
export function generateGateQR(accessPoint) {
    return {
        organizationId: 'org_pcea_langata',
        locationId: accessPoint.locationId || 'loc_langata_main',
        accessPointId: accessPoint.id,
        name: accessPoint.name,
        capacity: accessPoint.capacity || 0,
        direction: accessPoint.direction || 'entry'
    };
}

export default pceaLangata;
