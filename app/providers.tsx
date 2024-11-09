'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/modules/auth/infrastructure/store/useAuthStore';
import { AuthUser } from '@/modules/auth/core/entities/AuthUser';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = new AuthUser(
          firebaseUser.uid,
          firebaseUser.email || '',
          ['user'],
          new Date(firebaseUser.metadata.creationTime || Date.now())
        );
        useAuthStore.setState({ user, loading: false, initialized: true });
      } else {
        useAuthStore.setState({
          user: null,
          loading: false,
          initialized: true,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
