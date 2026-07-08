// ==========================================
// QR SCANNER - Gate QR & Visitor Flow
// ==========================================

import { AccessPoint, AccessRequest, Credential, Session, Event, EventTypes } from '../../domain/index.js';

// State
let currentState = {
    accessPoint: null,
    credential: null,
    session: null,
    request: null
};

// ==========================================
// SCAN GATE QR
// ==========================================

export function scanGateQR(qrData) {
    console.log('📷 Scanning Gate QR:', qrData);
    
    try {
        // Parse QR data
        let data;
        if (typeof qrData === 'string') {
            data = JSON.parse(qrData);
        } else {
            data = qrData;
        }
        
        // Create AccessPoint from QR
        const accessPoint = new AccessPoint({
            id: data.accessPointId || 'ap_' + Date.now(),
            organizationId: data.organizationId,
            locationId: data.locationId,
            name: data.name || 'Gate',
            type: data.type || 'gate',
            direction: data.direction || 'entry',
            qrCode: JSON.stringify(data)
        });
        
        currentState.accessPoint = accessPoint;
        
        // Create AccessRequest
        const request = new AccessRequest({
            organizationId: accessPoint.organizationId,
            locationId: accessPoint.locationId,
            accessPointId: accessPoint.id,
            direction: accessPoint.direction
        });
        currentState.request = request;
        
        // Emit event
        const event = new Event({
            type: EventTypes.ACCESS_REQUESTED,
            aggregateId: request.id,
            aggregateType: 'AccessRequest',
            data: {
                accessPointId: accessPoint.id,
                organizationId: accessPoint.organizationId,
                locationId: accessPoint.locationId,
                direction: accessPoint.direction
            }
        });
        console.log('📡 Event:', event.type, event.id);
        
        return {
            accessPoint,
            request,
            message: 'Access point identified. Please identify yourself.'
        };
        
    } catch (error) {
        console.error('❌ QR scan error:', error);
        return {
            error: 'Invalid QR code',
            message: error.message
        };
    }
}

// ==========================================
// IDENTIFY VISITOR
// ==========================================

export function identifyVisitor(identifier) {
    // Check if visitor exists by plate or phone
    const existingCredential = findCredential(identifier);
    
    if (existingCredential) {
        currentState.credential = existingCredential;
        // Emit event
        const event = new Event({
            type: EventTypes.CREDENTIAL_RECOGNIZED,
            aggregateId: existingCredential.id,
            aggregateType: 'Credential',
            data: {
                name: existingCredential.name,
                vehiclePlate: existingCredential.vehiclePlate,
                visitCount: existingCredential.visitCount
            }
        });
        console.log('📡 Event:', event.type, event.id);
        
        return {
            credential: existingCredential,
            isNew: false,
            message: `Welcome back, ${existingCredential.name || existingCredential.vehiclePlate}!`
        };
    }
    
    return {
        credential: null,
        isNew: true,
        message: 'New visitor. Please complete registration.'
    };
}

// ==========================================
// REGISTER VISITOR
// ==========================================

export function registerVisitor(data) {
    // Create new credential
    const credential = new Credential({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        vehiclePlate: data.vehiclePlate,
        vehicleMake: data.vehicleMake || null,
        vehicleModel: data.vehicleModel || null,
        vehicleColor: data.vehicleColor || null,
        vehicleType: data.vehicleType || null,
        vehicleEmoji: data.vehicleEmoji || '🚗',
        organizationId: currentState.accessPoint.organizationId,
        locationId: currentState.accessPoint.locationId,
        type: data.type || 'visitor'
    });
    
    currentState.credential = credential;
    
    // Emit event
    const event = new Event({
        type: EventTypes.CREDENTIAL_CREATED,
        aggregateId: credential.id,
        aggregateType: 'Credential',
        data: {
            name: credential.name,
            vehiclePlate: credential.vehiclePlate,
            phone: credential.phone
        }
    });
    console.log('📡 Event:', event.type, event.id);
    
    return {
        credential,
        message: `Welcome, ${credential.name}! You are now registered.`
    };
}

// ==========================================
// START SESSION
// ==========================================

export function startSession(credentialId = null) {
    const credential = credentialId 
        ? findCredential(credentialId) 
        : currentState.credential;
    
    if (!credential) {
        return { error: 'No credential found. Please identify yourself.' };
    }
    
    // Create session
    const session = new Session({
        credentialId: credential.id,
        organizationId: currentState.accessPoint.organizationId,
        locationId: currentState.accessPoint.locationId,
        accessPointId: currentState.accessPoint.id,
        direction: currentState.accessPoint.direction,
        createdBy: credential.id,
        entryMetadata: {
            accessPoint: currentState.accessPoint.name,
            device: navigator.userAgent || 'unknown'
        }
    });
    
    currentState.session = session;
    
    // Update credential visit count
    credential.recordVisit();
    
    // Update request with session
    currentState.request.sessionId = session.id;
    currentState.request.authorize('allow', 'Valid credential');
    
    // Emit event
    const event = new Event({
        type: EventTypes.SESSION_STARTED,
        aggregateId: session.id,
        aggregateType: 'Session',
        data: {
            credentialId: credential.id,
            accessPointId: currentState.accessPoint.id,
            vehiclePlate: credential.vehiclePlate,
            sessionToken: session.sessionToken
        }
    });
    console.log('📡 Event:', event.type, event.id);
    
    return {
        session,
        credential,
        accessPoint: currentState.accessPoint,
        message: '✅ Session started! Show your exit QR to the gate.',
        exitQR: session.sessionToken
    };
}

// ==========================================
// END SESSION
// ==========================================

export function endSession(sessionToken) {
    // Find session by token
    const session = findSessionByToken(sessionToken);
    
    if (!session) {
        return { error: 'Invalid session token' };
    }
    
    if (!session.isActive()) {
        return { error: 'Session is not active' };
    }
    
    // Complete session
    session.complete({
        closedBy: 'system',
        device: navigator.userAgent || 'unknown'
    });
    
    // Update request
    currentState.request.complete();
    
    // Emit event
    const event = new Event({
        type: EventTypes.SESSION_ENDED,
        aggregateId: session.id,
        aggregateType: 'Session',
        data: {
            credentialId: session.credentialId,
            duration: session.getDuration(),
            durationDisplay: session.getDurationDisplay()
        }
    });
    console.log('📡 Event:', event.type, event.id);
    
    return {
        session,
        message: `✅ Visit complete! Duration: ${session.getDurationDisplay()}`,
        duration: session.getDurationDisplay()
    };
}

// ==========================================
// HELPERS - In-memory storage (replace with real DB later)
// ==========================================

const credentialStore = [];
const sessionStore = [];

function findCredential(identifier) {
    // Search by plate or phone
    return credentialStore.find(c => 
        c.vehiclePlate === identifier || 
        c.phone === identifier ||
        c.id === identifier
    ) || null;
}

function findSessionByToken(token) {
    return sessionStore.find(s => s.sessionToken === token) || null;
}

export function saveCredential(credential) {
    const existing = findCredential(credential.id);
    if (existing) {
        const index = credentialStore.indexOf(existing);
        credentialStore[index] = credential;
    } else {
        credentialStore.push(credential);
    }
    return credential;
}

export function saveSession(session) {
    const existing = sessionStore.find(s => s.id === session.id);
    if (existing) {
        const index = sessionStore.indexOf(existing);
        sessionStore[index] = session;
    } else {
        sessionStore.push(session);
    }
    return session;
}

// ==========================================
// EXPOSE FOR DEBUGGING
// ==========================================

export function getState() {
    return {
        accessPoint: currentState.accessPoint,
        credential: currentState.credential,
        session: currentState.session,
        request: currentState.request
    };
}

export function getCredentials() {
    return credentialStore;
}

export function getSessions() {
    return sessionStore;
}

export function resetState() {
    currentState = {
        accessPoint: null,
        credential: null,
        session: null,
        request: null
    };
}
