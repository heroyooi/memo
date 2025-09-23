'use client';

import type { Memo } from '@/types/memo';

type Props = {
  memos: Memo[];
  onTogglePin: (id: string, next: boolean) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

export default function MemoList({
  memos,
  onTogglePin,
  onUpdate,
  onDelete,
}: Props) {
  if (!memos.length)
    return <p style={{ opacity: 0.6, padding: '12px' }}>메모가 없습니다.</p>;
  return (
    <div className='list'>
      {memos.map((m) => (
        <Item
          key={m.id}
          m={m}
          onTogglePin={onTogglePin}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function Item({
  m,
  onTogglePin,
  onUpdate,
  onDelete,
}: {
  m: Memo;
  onTogglePin: (id: string, next: boolean) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}) {
  const fmt = (ms: number) => {
    const d = new Date(ms);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  return (
    <div className='item'>
      <button
        className='iconbtn'
        onClick={() => onTogglePin(m.id, !m.pinned)}
        title='핀 고정'
      >
        <span className={m.pinned ? 'pin' : ''}>📌</span>
      </button>
      <textarea
        value={m.text}
        onChange={(e) => onUpdate(m.id, e.target.value)}
      />
      <button className='iconbtn' onClick={() => onDelete(m.id)} title='삭제'>
        🗑️
      </button>
      <div style={{ width: 110, textAlign: 'right' }}>
        <div className='meta'>작성 {fmt(m.createdAt)}</div>
        {m.updatedAt !== m.createdAt && (
          <div className='meta'>수정 {fmt(m.updatedAt)}</div>
        )}
      </div>
    </div>
  );
}
