'use client';

import { useEffect, useState } from 'react';
import {
  addMemo as addMemoToRepo,
  deleteMemo as deleteMemoFromRepo,
  subscribeMemos,
  togglePin as togglePinInRepo,
  updateMemo as updateMemoInRepo,
} from '@/repo/memoRepo';
import type { Memo } from '@/types/memo';

const USER_ID = 'local';

type UseMemoStore = {
  ready: boolean;
  memos: Memo[];
  addMemo: (text: string) => void;
  updateMemo: (id: string, text: string) => void;
  togglePin: (id: string, next: boolean) => void;
  deleteMemo: (id: string) => void;
};

export default function useMemoStore(): UseMemoStore {
  const [ready, setReady] = useState(false);
  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    setReady(false);
    let active = true;
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = subscribeMemos(USER_ID, (items) => {
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
  }, []);

  const addMemo = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMemoToRepo(USER_ID, trimmed).catch((error) => {
      console.error('Failed to add memo', error);
    });
  };

  const updateMemo = (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = memos.find((memo) => memo.id === id);
    if (current && current.text === trimmed) return;
    updateMemoInRepo(id, trimmed).catch((error) => {
      console.error('Failed to update memo', error);
    });
  };

  const togglePin = (id: string, next: boolean) => {
    togglePinInRepo(id, next).catch((error) => {
      console.error('Failed to toggle memo pin', error);
    });
  };

  const deleteMemo = (id: string) => {
    deleteMemoFromRepo(id).catch((error) => {
      console.error('Failed to delete memo', error);
    });
  };

  return {
    ready,
    memos,
    addMemo,
    updateMemo,
    togglePin,
    deleteMemo,
  };
}
