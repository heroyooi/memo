'use client';

import { useEffect, useState } from 'react';
import type { Memo } from '@/types/memo';

const STORAGE_KEY = 'memo-app.memos';

const sortMemos = (items: Memo[]) =>
  [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return b.updatedAt - a.updatedAt;
  });

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `memo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createMemo = (text: string): Memo => {
  const now = Date.now();
  return {
    id: createId(),
    userId: 'local',
    text,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
};

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
    if (typeof window === 'undefined') return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Memo[];
        setMemos(sortMemos(parsed));
      }
    } catch (error) {
      console.error('Failed to load memos from storage', error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
    } catch (error) {
      console.error('Failed to persist memos to storage', error);
    }
  }, [memos, ready]);

  const addMemo = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMemos((prev) => sortMemos([...prev, createMemo(trimmed)]));
  };

  const updateMemo = (id: string, text: string) => {
    setMemos((prev) =>
      sortMemos(
        prev.map((memo) => {
          if (memo.id !== id) return memo;
          if (memo.text === text) return memo;
          return {
            ...memo,
            text,
            updatedAt: Date.now(),
          };
        })
      )
    );
  };

  const togglePin = (id: string, next: boolean) => {
    setMemos((prev) =>
      sortMemos(
        prev.map((memo) =>
          memo.id === id
            ? {
                ...memo,
                pinned: next,
                updatedAt: Date.now(),
              }
            : memo
        )
      )
    );
  };

  const deleteMemo = (id: string) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
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
