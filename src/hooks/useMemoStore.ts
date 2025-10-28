'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addMemo as addMemoToRepo,
  deleteMemo as deleteMemoFromRepo,
  subscribeMemos,
  togglePin as togglePinInRepo,
  updateMemo as updateMemoInRepo,
} from '@/repo/memoRepo';
import type { Memo } from '@/types/memo';

type UseMemoStore = {
  ready: boolean;
  memos: Memo[];
  addMemo: (text: string) => void;
  updateMemo: (id: string, text: string) => void;
  togglePin: (id: string, next: boolean) => void;
  deleteMemo: (id: string) => void;
};

export default function useMemoStore(userId?: string): UseMemoStore {
  const [ready, setReady] = useState(false);
  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    setReady(false);
    setMemos([]);

    if (!userId) {
      setReady(true);
      return undefined;
    }

    let active = true;
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = subscribeMemos(userId, (items) => {
        if (!active) return;
        setMemos(items);
        setReady(true);
      });
    } catch (error) {
      console.error('Failed to subscribe memos from Firestore', error);
      setReady(true);
    }

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [userId]);

  const addMemo = useCallback(
    (text: string) => {
      if (!userId) return;
      const trimmed = text.trim();
      if (!trimmed) return;
      addMemoToRepo(userId, trimmed).catch((error) => {
        console.error('Failed to add memo', error);
      });
    },
    [userId]
  );

  const updateMemo = useCallback(
    (id: string, text: string) => {
      if (!userId) return;
      const trimmed = text.trim();
      if (!trimmed) return;
      const current = memos.find((memo) => memo.id === id);
      if (current && current.text === trimmed) return;
      updateMemoInRepo(id, trimmed).catch((error) => {
        console.error('Failed to update memo', error);
      });
    },
    [memos, userId]
  );

  const togglePin = useCallback(
    (id: string, next: boolean) => {
      if (!userId) return;
      togglePinInRepo(id, next).catch((error) => {
        console.error('Failed to toggle memo pin', error);
      });
    },
    [userId]
  );

  const deleteMemo = useCallback(
    (id: string) => {
      if (!userId) return;
      deleteMemoFromRepo(id).catch((error) => {
        console.error('Failed to delete memo', error);
      });
    },
    [userId]
  );

  return useMemo(
    () => ({
      ready,
      memos,
      addMemo,
      updateMemo,
      togglePin,
      deleteMemo,
    }),
    [addMemo, deleteMemo, memos, ready, togglePin, updateMemo]
  );
}
