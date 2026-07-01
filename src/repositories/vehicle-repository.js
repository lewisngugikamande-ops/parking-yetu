// ============================================
// Vehicle Repository - Data Access Layer
// ============================================

import { getDb } from '../services/firebase.js';
import { collection, doc, getDoc, getDocs, query, where, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { VehicleMapper } from '../mappers/vehicle-mapper.js';
import { Vehicle } from '../models/Vehicle.js';

const COLLECTION = 'vehicles';

export class VehicleRepository {
    constructor(db) {
        this.db = db || getDb();
    }

    async create(vehicle) {
        const id = vehicle.id || doc(collection(this.db, COLLECTION)).id;
        vehicle.id = id;
        const data = VehicleMapper.toFirestore(vehicle);
        await setDoc(doc(this.db, COLLECTION, id), data);
        return vehicle;
    }

    async getById(id) {
        const docRef = doc(this.db, COLLECTION, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return VehicleMapper.fromFirestore(snapshot);
    }

    async findByPlate(licensePlate, organizationId) {
        const q = query(
            collection(this.db, COLLECTION),
            where('licensePlate', '==', licensePlate.toUpperCase()),
            where('organizationId', '==', organizationId || 'org_church_a')
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return VehicleMapper.fromFirestore(snapshot.docs[0]);
    }

    async getByOrganization(organizationId) {
        const q = query(collection(this.db, COLLECTION), where('organizationId', '==', organizationId));
        const snapshot = await getDocs(q);
        const vehicles = [];
        snapshot.forEach(doc => vehicles.push(VehicleMapper.fromFirestore(doc)));
        return vehicles;
    }

    async update(vehicle) {
        const data = VehicleMapper.toFirestoreUpdate(vehicle);
        await updateDoc(doc(this.db, COLLECTION, vehicle.id), data);
        return vehicle;
    }
}

// Singleton instance
let instance = null;
export function getVehicleRepository() {
    if (!instance) {
        instance = new VehicleRepository(getDb());
    }
    return instance;
}
