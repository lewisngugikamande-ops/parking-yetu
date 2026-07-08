import { AccessPoint, Credential, Session, AccessRequest, Event, EventTypes } from './src/domain/index.js';

// Test Access Point
const gate = new AccessPoint({
    organizationId: 'org_church_a',
    locationId: 'loc_church_a_main',
    name: 'Main Vehicle Gate',
    type: 'gate',
    direction: 'entry'
});
console.log('✅ Access Point created:', gate.name);
console.log('   QR:', gate.qrCode);

// Test Credential
const credential = new Credential({
    name: 'Lewis Kimani',
    phone: '+254712345678',
    vehiclePlate: 'KDG 832A',
    vehicleMake: 'Toyota',
    vehicleModel: 'Hilux',
    vehicleColor: 'White',
    organizationId: 'org_church_a'
});
console.log('✅ Credential created:', credential.getDisplayName());
console.log('   Vehicle:', credential.getVehicleDisplay());

// Test Access Request
const request = new AccessRequest({
    organizationId: 'org_church_a',
    locationId: 'loc_church_a_main',
    accessPointId: gate.id,
    direction: 'entry',
    credentialId: credential.id
});
console.log('✅ Access Request created:', request.id);

// Test Session
const session = new Session({
    credentialId: credential.id,
    organizationId: 'org_church_a',
    locationId: 'loc_church_a_main',
    accessPointId: gate.id,
    createdBy: credential.id
});
console.log('✅ Session created:', session.id);
console.log('   Token:', session.sessionToken);

// Test Event
const event = new Event({
    type: EventTypes.SESSION_STARTED,
    aggregateId: session.id,
    aggregateType: 'Session',
    data: {
        credentialId: credential.id,
        accessPointId: gate.id,
        vehicle: credential.vehiclePlate
    }
});
console.log('✅ Event created:', event.type);
console.log('   Correlation ID:', event.correlationId);

console.log('🎉 All domain models working!');
