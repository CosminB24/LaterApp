import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserData {
  isPremium: boolean;
  premiumSince?: string;
  email?: string;
  name?: string;
}

export const userService = {
  async createUser(userId: string, userData: Partial<UserData>) {
    try {
      console.log('Încercare de creare/actualizare utilizator:', userId, userData);
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('Utilizator creat/actualizat cu succes');
    } catch (error) {
      console.error('Eroare la crearea utilizatorului:', error);
      throw error;
    }
  },

  async getUserPremiumStatus(userId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? userDoc.data()?.isPremium || false : false;
    } catch (error) {
      console.error('Eroare la obținerea statusului premium:', error);
      return false;
    }
  }
}; 