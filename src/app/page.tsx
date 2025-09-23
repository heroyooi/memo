'use client';

import MemoForm from '@/components/MemoForm';
import MemoList from '@/components/MemoList';
import useMemoStore from '@/hooks/useMemoStore';

export default function Page() {
  const { ready, memos, addMemo, updateMemo, togglePin, deleteMemo } =
    useMemoStore();

  return (
    <main className='container'>
      <section className='hero'>
        <h1>나만의 메모 보드</h1>
        <p>
          로그인 없이 빠르게 메모를 작성하고, 중요한 메모는 고정해서 한눈에
          확인해보세요.
        </p>
      </section>

      {!ready ? (
        <section className='card status-card'>
          <p>메모를 불러오는 중입니다…</p>
        </section>
      ) : (
        <>
          <MemoForm onAdd={addMemo} />
          <section className='card memo-list-card'>
            <MemoList
              memos={memos}
              onTogglePin={togglePin}
              onUpdate={updateMemo}
              onDelete={deleteMemo}
            />
          </section>
        </>
      )}
    </main>
  );
}
