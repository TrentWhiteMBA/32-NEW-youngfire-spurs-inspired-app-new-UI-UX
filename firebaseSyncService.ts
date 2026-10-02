import { db } from '../config';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  arrayUnion, 
  increment,
  onSnapshot 
} from 'firebase/firestore';

export function initFirebaseRealtimeSync(): () => void {
  const unsubs: Array<() => void> = [];

  try {
    if (db) {
      // Real-time sync for prayers
      const prayersCol = collection(db, 'prayers');
      const unsubPrayers = onSnapshot(prayersCol, (snapshot) => {
        const prayers: any[] = [];
        snapshot.forEach((docSnap) => {
          prayers.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (prayers.length > 0) {
          window.dispatchEvent(new CustomEvent('yf_prayers_synced', { detail: prayers }));
        }
      }, (err) => {
        console.warn('[FirebaseSync] Prayers snapshot notice:', err.message);
      });
      unsubs.push(unsubPrayers);

      // Real-time sync for roster
      const rosterCol = collection(db, 'roster');
      const unsubRoster = onSnapshot(rosterCol, (snapshot) => {
        const members: any[] = [];
        snapshot.forEach((docSnap) => {
          members.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (members.length > 0) {
          window.dispatchEvent(new CustomEvent('yf_roster_synced', { detail: members }));
        }
      }, (err) => {
        console.warn('[FirebaseSync] Roster snapshot notice:', err.message);
      });
      unsubs.push(unsubRoster);
    }
  } catch (err) {
    console.warn('[FirebaseSync] Real-time sync initialization notice:', err);
  }

  return () => {
    unsubs.forEach(unsub => {
      try { unsub(); } catch {}
    });
  };
}

export async function saveRosterMemberToCloud(member: any): Promise<void> {
  const memberId = member.id || `member_${Date.now()}`;
  try {
    if (db) {
      const docRef = doc(db, 'roster', memberId);
      await setDoc(docRef, { ...member, id: memberId }, { merge: true });
    }
  } catch (err) {
    console.warn('[FirebaseSync] Firestore save roster notice:', err);
  }

  // Also sync to server API
  try {
    await fetch('/api/roster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...member, id: memberId })
    });
  } catch {}
}

export async function deleteRosterMemberFromCloud(memberId: string): Promise<void> {
  try {
    if (db) {
      const docRef = doc(db, 'roster', memberId);
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.warn('[FirebaseSync] Firestore delete roster notice:', err);
  }

  try {
    await fetch(`/api/roster/${memberId}`, {
      method: 'DELETE'
    });
  } catch {}
}

export async function savePrayerToCloud(prayer: any): Promise<void> {
  const prayerId = prayer.id || `prayer_${Date.now()}`;
  try {
    if (db) {
      const docRef = doc(db, 'prayers', prayerId);
      await setDoc(docRef, { ...prayer, id: prayerId }, { merge: true });
    }
  } catch (err) {
    console.warn('[FirebaseSync] Firestore save prayer notice:', err);
  }

  try {
    await fetch('/api/prayers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...prayer, id: prayerId })
    });
  } catch {}
}

export async function deletePrayerFromCloud(prayerId: string): Promise<void> {
  try {
    if (db) {
      const docRef = doc(db, 'prayers', prayerId);
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.warn('[FirebaseSync] Firestore delete prayer notice:', err);
  }

  try {
    await fetch(`/api/prayers/${prayerId}`, {
      method: 'DELETE'
    });
  } catch {}
}

export async function recordPrayerIntercession(prayerId: string, user: any): Promise<void> {
  try {
    if (db) {
      const docRef = doc(db, 'prayers', prayerId);
      await updateDoc(docRef, {
        intercessors: arrayUnion(user?.id || user?.name || 'anonymous_disciple'),
        prayedCount: increment(1)
      });
    }
  } catch (err) {
    console.warn('[FirebaseSync] Firestore prayer intercession notice:', err);
  }

  try {
    await fetch(`/api/prayers/${prayerId}/pray`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id, userName: user?.name })
    });
  } catch {}
}

export async function saveSanctuaryEventToCloud(event: any): Promise<void> {
  const eventId = event.id || `event_${Date.now()}`;
  try {
    if (db) {
      const docRef = doc(db, 'events', eventId);
      await setDoc(docRef, { ...event, id: eventId }, { merge: true });
    }
  } catch (err) {
    console.warn('[FirebaseSync] Firestore event notice:', err);
  }

  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...event, id: eventId })
    });
  } catch {}
}
