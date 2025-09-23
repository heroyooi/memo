'use client';

import { useEffect, useState } from 'react';
import useAnonAuth from '@/hooks/useAnonAuth';
import MemoForm from '@/components/MemoForm';
import MemoList from '@/components/MemoList';
import type { Memo } from '@/types/memo';
import {
  addMemo,
  deleteMemo,
  subscribeMemos,
  togglePin,
  updateMemo,
} from '@/repo/memoRepo';

export default function Page() {
  const { user, ready } = useAnonAuth();
  const [memos, setMemos] = useState<Memo[]>([]);

  // 실시간 구독
  useEffect(() => {
    if (!ready || !user) return;
    const unsub = subscribeMemos(user.uid, setMemos);
    return () => unsub();
  }, [ready, user]);

  const onAdd = async (text: string) => {
    if (!user) return;
    await addMemo(user.uid, text);
  };
  const onUpdate = async (id: string, text: string) => {
    await updateMemo(id, text);
  };
  const onTogglePin = async (id: string, next: boolean) => {
    await togglePin(id, next);
  };
  const onDelete = async (id: string) => {
    await deleteMemo(id);
  };

  return (
    <main className='container'>
      <h1>메모앱 (Firebase)</h1>
      {!ready && <p>로그인 준비중…</p>}
      {ready && (
        <>
          <MemoForm onAdd={onAdd} />
          <div className='card'>
            <MemoList
              memos={memos}
              onTogglePin={onTogglePin}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </div>
        </>
      )}
    </main>
  );
}
