'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { auth } from '@/firebaseClient';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';

const configuredAdminEmails = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL1,
  process.env.NEXT_PUBLIC_ADMIN_EMAIL2,
  process.env.ADMIN_EMAIL1,
  process.env.ADMIN_EMAIL2,
]
  .filter((value): value is string => Boolean(value))
  .map((value) => value.toLowerCase());

const ADMIN_EMAILS = new Set(configuredAdminEmails.length ? configuredAdminEmails : [
  'heroyooi1018@gmail.com',
  'bomiguma@gmail.com',
]);

export default function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isAdmin = useMemo(() => {
    const email = user?.email?.toLowerCase();
    return Boolean(email && ADMIN_EMAILS.has(email));
  }, [user?.email]);

  const signIn = useCallback(async () => {
    setBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Failed to sign in with Google', error);
    } finally {
      setBusy(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setBusy(true);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Failed to sign out', error);
    } finally {
      setBusy(false);
    }
  }, []);

  return {
    user,
    loading,
    busy,
    isAdmin,
    signIn,
    signOut,
  };
}
