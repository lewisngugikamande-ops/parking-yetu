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
