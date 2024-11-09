import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile, Location } from '../../core/entities/UserProfile';
import { UserProfileRepository } from '../../core/repositories/UserProfileRepository';

export class FirebaseUserProfileRepository implements UserProfileRepository {
  private readonly collectionName = 'userProfiles';

  async createProfile(profile: UserProfile): Promise<UserProfile> {
    const profileRef = doc(db, this.collectionName, profile.id);
    
    await setDoc(profileRef, {
      userId: profile.userId,
      username: profile.username,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      location: profile.location,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return profile;
  }

  async getProfileByUserId(userId: string): Promise<UserProfile | null> {
    const profilesRef = collection(db, this.collectionName);
    const q = query(profilesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return new UserProfile(
      doc.id,
      data.userId,
      data.username,
      data.email,
      data.phoneNumber,
      data.location,
      data.createdAt?.toDate(),
      data.updatedAt?.toDate()
    );
  }

  async updateProfile(id: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const profileRef = doc(db, this.collectionName, id);
    const profileDoc = await getDoc(profileRef);

    if (!profileDoc.exists()) {
      throw new Error('Profile not found');
    }

    const currentData = profileDoc.data();
    const updatedData = {
      ...currentData,
      ...data,
      updatedAt: serverTimestamp(),
    };

    await setDoc(profileRef, updatedData, { merge: true });

    return new UserProfile(
      id,
      currentData.userId,
      updatedData.username,
      updatedData.email,
      updatedData.phoneNumber,
      updatedData.location,
      currentData.createdAt.toDate(),
      new Date()
    );
  }

  async deleteProfile(id: string): Promise<void> {
    const profileRef = doc(db, this.collectionName, id);
    await deleteDoc(profileRef);
  }
}