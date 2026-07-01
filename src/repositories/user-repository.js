// ============================================
// User Repository - Data Access Layer
// ============================================

import { getDb } from '../services/firebase.js';
import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { UserMapper } from '../mappers/user-mapper.js';
import { User } from '../models/User.js';

const COLLECTION = 'users';

export class UserRepository {
    constructor(db) {
        this.db = db || getDb();
    }

    async create(user) {
        const id = user.id || doc(collection(this.db, COLLECTION)).id;
        user.id = id;
        const data = UserMapper.toFirestore(user);
        await setDoc(doc(this.db, COLLECTION, id), data);
        return user;
    }

    async getById(id) {
        const docRef = doc(this.db, COLLECTION, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return UserMapper.fromFirestore(snapshot);
    }

    async getByEmail(email) {
        const q = query(collection(this.db, COLLECTION), where('email', '==', email));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return UserMapper.fromFirestore(snapshot.docs[0]);
    }

    async getByOrganization(organizationId) {
        const q = query(collection(this.db, COLLECTION), where('organizationId', '==', organizationId));
        const snapshot = await getDocs(q);
        const users = [];
        snapshot.forEach(doc => users.push(UserMapper.fromFirestore(doc)));
        return users;
    }

    async update(user) {
        const data = UserMapper.toFirestoreUpdate(user);
        await updateDoc(doc(this.db, COLLECTION, user.id), data);
        return user;
    }

    async delete(id) {
        await deleteDoc(doc(this.db, COLLECTION, id));
        return true;
    }

    async createFromAuth(authUser, role = 'driver') {
        const user = new User({
            id: authUser.uid,
            email: authUser.email,
            name: authUser.displayName || 'User',
            role: role,
            organizationId: 'org_church_a',
            locationId: 'church_a',
            active: true,
            permissions: User.getDefaultPermissions(role)
        });
        return await this.create(user);
    }
}

// Singleton instance
let instance = null;
export function getUserRepository() {
    if (!instance) {
        instance = new UserRepository(getDb());
    }
    return instance;
}
