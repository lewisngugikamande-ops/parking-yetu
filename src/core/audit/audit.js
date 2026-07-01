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
