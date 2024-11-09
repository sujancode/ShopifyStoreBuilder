import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser as firebaseDeleteUser,
  sendEmailVerification as firebaseSendEmailVerification,
  applyActionCode,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AuthRepository } from '../../core/repositories/AuthRepository';
import { AuthUser, UserLocation } from '../../core/entities/AuthUser';

export class FirebaseAuthRepository implements AuthRepository {
  private async saveUserToFirestore(user: AuthUser): Promise<void> {
    const userRef = doc(db, 'users', user.id);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      let location: UserLocation = {};
      
      try {
        if ('geolocation' in navigator) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // You could add reverse geocoding here to get the address
          // For now, we'll just store coordinates
        }
      } catch (error) {
        console.log('Location permission denied or error occurred');
      }

      const userData = {
        email: user.email,
        username: user.email.split('@')[0], // Default username from email
        roles: ['user'],
        emailVerified: user.emailVerified,
        location,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(userRef, userData);
    }
  }

  async register(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      const authUser = new AuthUser(
        user.uid,
        user.email || '',
        ['user'],
        new Date(user.metadata.creationTime || Date.now()),
        user.emailVerified,
        user.email?.split('@')[0] // Default username from email
      );

      await this.saveUserToFirestore(authUser);
      await firebaseSendEmailVerification(user);

      return authUser;
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      return new AuthUser(
        user.uid,
        user.email || '',
        userData?.roles || ['user'],
        new Date(user.metadata.creationTime || Date.now()),
        user.emailVerified,
        userData?.username,
        userData?.location,
        userData?.updatedAt?.toDate() || new Date()
      );
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const user = auth.currentUser;
    if (!user) return null;

    // Get additional user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    return new AuthUser(
      user.uid,
      user.email || '',
      userData?.roles || ['user'],
      new Date(user.metadata.creationTime || Date.now()),
      user.emailVerified,
      userData?.username,
      userData?.location,
      userData?.updatedAt?.toDate() || new Date()
    );
  }

  async updateUserProfile(
    userId: string,
    data: Partial<AuthUser>
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || user.uid !== userId) {
        throw new Error('User not authenticated');
      }

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: data.username || user.email?.split('@')[0],
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...(data.username && { username: data.username }),
        ...(data.location && { location: data.location }),
        updatedAt: serverTimestamp()
      }, { merge: true });

    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || user.uid !== userId) {
        throw new Error('User not authenticated');
      }

      // Delete user document from Firestore
      await setDoc(doc(db, 'users', userId), {
        deleted: true,
        deletedAt: serverTimestamp()
      }, { merge: true });

      // Delete Firebase Auth user
      await firebaseDeleteUser(user);
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  async sendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      await firebaseSendEmailVerification(user);
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  async verifyEmail(code: string): Promise<void> {
    try {
      await applyActionCode(auth, code);
      
      // Update emailVerified status in Firestore
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          emailVerified: true,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
    try {
      await firebaseConfirmPasswordReset(auth, code, newPassword);
    } catch (error: any) {
      throw this.handleFirebaseError(error);
    }
  }

  private handleFirebaseError(error: any): Error {
    const errorCode = error.code || 'unknown';
    let message = 'An unknown error occurred';
    
    switch (errorCode) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operation not allowed';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        message = 'User not found';
        break;
      case 'auth/wrong-password':
        message = 'Invalid password';
        break;
      case 'auth/invalid-action-code':
        message = 'Invalid verification code';
        break;
      case 'auth/expired-action-code':
        message = 'Verification code has expired';
        break;
      case 'auth/invalid-credential':
        message = 'Invalid Email or Password';
        break;
      default:
        message = error.message || message;
    }

    return new Error(message);
  }
}