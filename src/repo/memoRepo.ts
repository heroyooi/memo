'use client';

import { db } from '@/firebaseClient';
import type { Memo } from '@/types/memo';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

const col = (userId: string) => collection(db, 'memos');

const tsToMs = (ts: Timestamp | null | undefined) =>
  ts ? ts.toMillis() : Date.now();

export function subscribeMemos(userId: string, cb: (memos: Memo[]) => void) {
  // 내 문서만 + 핀 우선 + 최신 수정순
  const q = query(
    col(userId),
    where('userId', '==', userId),
    orderBy('pinned', 'desc'),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const rows: Memo[] = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        userId: data.userId,
        text: data.text ?? '',
        pinned: !!data.pinned,
        createdAt:
          typeof data.createdAt === 'number'
            ? data.createdAt
            : tsToMs(data.createdAt),
        updatedAt:
          typeof data.updatedAt === 'number'
            ? data.updatedAt
            : tsToMs(data.updatedAt),
      };
    });
    cb(rows);
  });
}

export async function addMemo(userId: string, text: string) {
  const now = Date.now();
  await addDoc(col(userId), {
    userId,
    text,
    pinned: false,
    createdAt: now, // 함께 숫자 보관
    updatedAt: now,
    createdAtTS: serverTimestamp(), // (선택) 서버시간 필드도 보조로 저장
    updatedAtTS: serverTimestamp(),
  });
}

export async function updateMemo(id: string, text: string) {
  await updateDoc(doc(db, 'memos', id), {
    text,
    updatedAt: Date.now(),
    updatedAtTS: serverTimestamp(),
  });
}

export async function togglePin(id: string, value: boolean) {
  await updateDoc(doc(db, 'memos', id), {
    pinned: value,
    updatedAt: Date.now(),
    updatedAtTS: serverTimestamp(),
  });
}

export async function deleteMemo(id: string) {
  await deleteDoc(doc(db, 'memos', id));
}
