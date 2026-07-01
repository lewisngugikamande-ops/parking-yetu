#!/bin/bash

cd ~/projects/parking-yetu

# helpers.js
cat > src/core/utils/helpers.js << 'HELPERS'
export function formatTime(timestamp) {
  if (!timestamp) return 'N/A';
  if (timestamp.toDate) return timestamp.toDate().toLocaleTimeString();
  if (timestamp instanceof Date) return timestamp.toLocaleTimeString();
  if (typeof timestamp === 'string') return new Date(timestamp).toLocaleTimeString();
  return 'N/A';
}

export function formatDuration(minutes) {
  if (!minutes || minutes < 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return hours + 'h ' + mins + 'm';
  return mins + 'm';
}

export function calculateDuration(timestamp) {
  if (!timestamp) return { text: 'N/A', minutes: 0 };
  const now = new Date();
  const entry = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = now - entry;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;
  let text = '';
  if (diffHours > 0) {
    text = diffHours + 'h ' + remainingMins + 'm';
  } else {
    text = diffMins + 'm';
  }
  return { text: text, minutes: diffMins, hours: diffHours, mins: remainingMins };
}
HELPERS

echo "✅ helpers.js created"

# validation.js
cat > src/core/utils/validation.js << 'VALIDATION'
export function validatePlate(plate) {
  if (!plate) return { valid: false, error: 'Plate number is required' };
  const cleaned = plate.toUpperCase().replace(/\s/g, '');
  const regex = /^[A-Z]{3}\d{3}[A-Z]?$/;
  if (!regex.test(cleaned)) {
    return { valid: false, error: 'Invalid plate format. Use: KDG832A' };
  }
  return { valid: true, value: cleaned };
}

export function validatePhone(phone) {
  if (!phone) return { valid: false, error: 'Phone number is required' };
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.length < 10 || cleaned.length > 15) {
    return { valid: false, error: 'Phone must be 10-15 digits' };
  }
  return { valid: true, value: cleaned };
}

export function validateName(name) {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Name is required' };
  }
  return { valid: true, value: name.trim() };
}
VALIDATION

echo "✅ validation.js created"

# correlation.js
cat > src/core/utils/correlation.js << 'CORRELATION'
export function generateCorrelationId() {
  return 'corr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
}
CORRELATION

echo "✅ correlation.js created"

# audit.js
mkdir -p src/core/audit
cat > src/core/audit/audit.js << 'AUDIT'
import { db, auth } from '../firebase/config.js';
import { collection, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateCorrelationId } from '../utils/correlation.js';

export async function createAuditLog({ action, targetId, targetType, details = {} }) {
  const user = auth.currentUser;
  if (!user) {
    console.warn('No user for audit log');
    return null;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data() || {};
    
    const ref = await addDoc(collection(db, 'audit_logs'), {
      action,
      userId: user.uid,
      userRole: userData.role || 'unknown',
      organizationId: userData.organizationId || 'unknown',
      locationId: userData.locationId || 'unknown',
      targetId,
      targetType,
      details,
      correlationId: generateCorrelationId(),
      userAgent: navigator.userAgent || 'unknown',
      timestamp: serverTimestamp()
    });
    
    return ref.id;
  } catch (error) {
    console.error('Audit log error:', error);
    return null;
  }
}
AUDIT

echo "✅ audit.js created"

# repository.js
mkdir -p src/modules/parking
cat > src/modules/parking/repository.js << 'REPOSITORY'
import { db } from '../../core/firebase/config.js';
import { 
  collection, doc, getDoc, getDocs, query, where, 
  orderBy, limit, writeBatch, serverTimestamp, onSnapshot,
  updateDoc, deleteDoc
} from 'firebase/firestore';

export class ParkingRepository {
  constructor(organizationId) {
    this.db = db;
    this.organizationId = organizationId;
    this.collection = 'parking_sessions';
  }

  async save(session, auditLog = null) {
    const data = session.toFirestore();
    const ref = doc(collection(this.db, this.collection));
    
    const batch = writeBatch(this.db);
    batch.set(ref, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    if (auditLog) {
      const auditRef = doc(collection(this.db, 'audit_logs'));
      batch.set(auditRef, {
        ...auditLog,
        targetId: ref.id,
        targetType: 'parking_session',
        timestamp: serverTimestamp()
      });
    }
    
    await batch.commit();
    return ref.id;
  }

  async findById(id) {
    const ref = doc(this.db, this.collection, id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  }

  async findActiveSessions(limitCount = 50) {
    const q = query(
      collection(this.db, this.collection),
      where('organizationId', '==', this.organizationId),
      where('status', '==', 'PARKED'),
      orderBy('entryTime', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const results = [];
    snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
    return results;
  }

  async findTodayExits(limitCount = 100) {
    const q = query(
      collection(this.db, this.collection),
      where('organizationId', '==', this.organizationId),
      where('status', '==', 'EXITED'),
      orderBy('exitTime', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const results = [];
    const today = new Date().toDateString();
    snapshot.forEach(doc => {
      const data = doc.data();
      const exitTime = data.exitTime?.toDate?.() || data.exitTime;
      if (exitTime?.toDateString() === today) {
        results.push({ id: doc.id, ...data });
      }
    });
    return results;
  }

  async update(id, data) {
    const ref = doc(this.db, this.collection, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }

  async getStats() {
    const q = query(
      collection(this.db, this.collection),
      where('organizationId', '==', this.organizationId)
    );
    const snapshot = await getDocs(q);
    const sessions = [];
    snapshot.forEach(doc => sessions.push({ id: doc.id, ...doc.data() }));
    
    const total = sessions.length;
    const active = sessions.filter(s => s.status === 'PARKED').length;
    const vip = sessions.filter(s => s.isVIP && s.status === 'PARKED').length;
    const staff = sessions.filter(s => s.isStaff && s.status === 'PARKED').length;
    
    const exited = sessions.filter(s => s.status === 'EXITED' && s.duration);
    let avgMinutes = 0;
    if (exited.length > 0) {
      const sum = exited.reduce((s, c) => s + (c.duration || 0), 0);
      avgMinutes = Math.round(sum / exited.length);
    }
    
    const timeLimit = 180;
    const overstay = sessions.filter(s => s.status === 'PARKED' && s.duration && s.duration >= timeLimit).length;
    
    return { total, active, vip, staff, overstay, avgMinutes };
  }

  subscribeToActive(callback) {
    const q = query(
      collection(this.db, this.collection),
      where('organizationId', '==', this.organizationId),
      where('status', '==', 'PARKED'),
      orderBy('entryTime', 'desc'),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const results = [];
      snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
      callback(results);
    });
  }
}
REPOSITORY

echo "✅ repository.js created"

# service.js
cat > src/modules/parking/service.js << 'SERVICE'
import { db } from '../../core/firebase/config.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ParkingSession } from '../../domain/ParkingSession.js';
import { Vehicle } from '../../domain/Vehicle.js';
import { ParkingRepository } from './repository.js';
import { validatePlate, validatePhone, validateName } from '../../core/utils/validation.js';
import { createAuditLog } from '../../core/audit/audit.js';

export class ParkingService {
  constructor(organizationId, locationId) {
    this.organizationId = organizationId;
    this.locationId = locationId;
    this.repository = new ParkingRepository(organizationId);
  }

  async enterVehicle(vehicleData, driverData, entryGate, userId) {
    const plateValidation = validatePlate(vehicleData.licensePlate);
    if (!plateValidation.valid) throw new Error(plateValidation.error);
    
    const phoneValidation = validatePhone(driverData.phone);
    if (!phoneValidation.valid) throw new Error(phoneValidation.error);
    
    const nameValidation = validateName(driverData.name);
    if (!nameValidation.valid) throw new Error(nameValidation.error);

    const vehicle = new Vehicle({
      licensePlate: plateValidation.value,
      make: vehicleData.make || '',
      model: vehicleData.model || '',
      type: vehicleData.type || 'Sedan',
      organizationId: this.organizationId
    });
    vehicle.validate();

    const session = new ParkingSession({
      vehicleId: vehicle.id,
      vehicleSnapshot: vehicle.createSnapshot(),
      driverName: nameValidation.value,
      driverPhone: phoneValidation.value,
      driverId: driverData.id || '',
      locationId: this.locationId,
      organizationId: this.organizationId,
      entryGate: entryGate,
      isVIP: driverData.isVIP || false,
      isStaff: driverData.isStaff || false,
      checkedInBy: userId
    });

    const sessionId = await this.repository.save(session, {
      action: 'VEHICLE_ENTERED',
      userId: userId,
      organizationId: this.organizationId,
      locationId: this.locationId,
      details: {
        plate: vehicle.licensePlate,
        vehicleType: vehicle.type,
        driverName: driverData.name,
        isVIP: driverData.isVIP || false,
        isStaff: driverData.isStaff || false
      }
    });

    return { sessionId, session, correlationId: session.correlationId };
  }

  async findVehicleForExit(licensePlate) {
    const validation = validatePlate(licensePlate);
    if (!validation.valid) throw new Error(validation.error);
    
    const q = query(
      collection(db, 'parking_sessions'),
      where('organizationId', '==', this.organizationId),
      where('status', '==', 'PARKED')
    );
    const snapshot = await getDocs(q);
    
    let found = null;
    snapshot.forEach(doc => {
      const data = doc.data();
      const plate = data.vehicleSnapshot?.plate || data.plate || '';
      if (plate === validation.value) {
        found = { id: doc.id, ...data };
      }
    });
    
    return found;
  }

  async exitVehicle(sessionId, exitGate, userId, notes = '') {
    const data = await this.repository.findById(sessionId);
    if (!data) throw new Error('Session not found');
    
    const session = ParkingSession.fromFirestore(sessionId, data);
    if (session.status === 'EXITED') throw new Error('Vehicle already exited');
    
    const duration = session.calculateDuration();
    session.exit(exitGate, userId);
    
    await this.repository.update(sessionId, {
      status: session.status,
      exitTime: session.exitTime,
      exitGate: session.exitGate,
      duration: session.duration,
      exitedBy: session.exitedBy
    });

    await createAuditLog({
      action: 'VEHICLE_EXITED',
      targetId: sessionId,
      targetType: 'parking_session',
      details: {
        plate: session.vehicleSnapshot?.plate || 'Unknown',
        duration: session.duration,
        exitGate: exitGate,
        notes: notes
      }
    });

    return { session, correlationId: session.correlationId };
  }

  async getActiveSessions() {
    return this.repository.findActiveSessions();
  }

  async getTodayExits() {
    return this.repository.findTodayExits();
  }

  async getStats() {
    return this.repository.getStats();
  }

  subscribeToActive(callback) {
    return this.repository.subscribeToActive(callback);
  }
}
SERVICE

echo "✅ service.js created"

echo ""
echo "========================================="
echo "✅ All files created successfully!"
echo "========================================="
echo ""
echo "Files created:"
echo "  - src/core/utils/helpers.js"
echo "  - src/core/utils/validation.js"
echo "  - src/core/utils/correlation.js"
echo "  - src/core/audit/audit.js"
echo "  - src/modules/parking/repository.js"
echo "  - src/modules/parking/service.js"
echo ""
echo "Now run: npm run dev"
