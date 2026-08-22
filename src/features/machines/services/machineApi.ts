import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Machine, MachineStatus } from '../types/machine';
import { SEED_MACHINES } from '../data/seedMachines';

const COLLECTION_NAME = 'machines';

// In-memory fallback cache for fast responses and offline/sandbox resilience
let localMachineCache: Machine[] = [...SEED_MACHINES];

/**
 * Fetch all machines from Firestore.
 * Falls back to local seed data if Firestore query errors or returns empty.
 */
export async function getMachines(): Promise<Machine[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    if (!querySnapshot.empty) {
      const machines: Machine[] = [];
      querySnapshot.forEach((docSnap) => {
        machines.push({ id: docSnap.id, ...docSnap.data() } as Machine);
      });
      localMachineCache = machines;
      return machines;
    }
    // If collection is empty, return seed data
    return localMachineCache;
  } catch (error) {
    console.warn('[MachineAPI] Firestore getMachines fallback to local cache:', error);
    return localMachineCache;
  }
}

/**
 * Fetch a single machine by ID from Firestore.
 */
export async function getMachineById(id: string): Promise<Machine | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Machine;
    }
    // Fallback to cache
    const cached = localMachineCache.find((m) => m.id === id);
    return cached || null;
  } catch (error) {
    console.warn(`[MachineAPI] Firestore getMachineById(${id}) fallback:`, error);
    return localMachineCache.find((m) => m.id === id) || null;
  }
}

/**
 * Subscribe to real-time updates for all machines in Firestore.
 */
export function subscribeToMachines(
  onUpdate: (machines: Machine[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const machines: Machine[] = [];
          snapshot.forEach((docSnap) => {
            machines.push({ id: docSnap.id, ...docSnap.data() } as Machine);
          });
          localMachineCache = machines;
          onUpdate(machines);
        } else {
          // If Firestore is empty initially, deliver cached seed data
          onUpdate(localMachineCache);
        }
      },
      (error) => {
        console.warn('[MachineAPI] onSnapshot error, using local machine stream:', error);
        onUpdate(localMachineCache);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('[MachineAPI] Failed to attach listener:', err);
    onUpdate(localMachineCache);
    return () => {};
  }
}

/**
 * Subscribe to real-time updates for a single machine in Firestore.
 */
export function subscribeToMachine(
  id: string,
  onUpdate: (machine: Machine | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const machine = { id: docSnap.id, ...docSnap.data() } as Machine;
          // update cache
          const index = localMachineCache.findIndex((m) => m.id === id);
          if (index !== -1) localMachineCache[index] = machine;
          onUpdate(machine);
        } else {
          const cached = localMachineCache.find((m) => m.id === id) || null;
          onUpdate(cached);
        }
      },
      (error) => {
        console.warn(`[MachineAPI] onSnapshot error for machine ${id}:`, error);
        const cached = localMachineCache.find((m) => m.id === id) || null;
        onUpdate(cached);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn(`[MachineAPI] Single machine listener error:`, err);
    const cached = localMachineCache.find((m) => m.id === id) || null;
    onUpdate(cached);
    return () => {};
  }
}

/**
 * Update machine operational status in Firestore.
 */
export async function updateMachineStatus(id: string, status: MachineStatus): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { 
      status,
      lastTelemetryTimestamp: new Date().toISOString()
    });
  } catch (err) {
    console.warn(`[MachineAPI] updateMachineStatus fallback for ${id}:`, err);
    const m = localMachineCache.find((item) => item.id === id);
    if (m) {
      m.status = status;
      m.lastTelemetryTimestamp = new Date().toISOString();
    }
  }
}

/**
 * Seed Firestore with initial demo machines.
 */
export async function seedFirestoreMachines(): Promise<{ count: number; success: boolean }> {
  try {
    for (const machine of SEED_MACHINES) {
      const docRef = doc(db, COLLECTION_NAME, machine.id);
      await setDoc(docRef, machine, { merge: true });
    }
    return { count: SEED_MACHINES.length, success: true };
  } catch (error) {
    console.error('[MachineAPI] Failed to seed Firestore:', error);
    return { count: 0, success: false };
  }
}
