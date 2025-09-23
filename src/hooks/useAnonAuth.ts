'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebaseClient';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';

export default function useAnonAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        await signInAnonymously(auth);
      } else {
        setUser(u);
        setReady(true);
      }
    });
    return () => unsub();
  }, []);

  return { user, ready };
}
