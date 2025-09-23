'use client';

import { useEffect, useState } from 'react';
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
    return (
      <p className='empty-message'>
        첫 메모를 작성해 보세요. 아이디어, 할 일, 영감까지 모두 환영해요!
      </p>
    );

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
  const [value, setValue] = useState(m.text);

  useEffect(() => {
    setValue(m.text);
  }, [m.text]);

  const commit = () => {
    if (value === m.text) return;
    const trimmed = value.trim();
    if (!trimmed) {
      onDelete(m.id);
      return;
    }
    onUpdate(m.id, trimmed);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      commit();
      e.currentTarget.blur();
    }
  };

  const fmt = (ms: number) => {
    const d = new Date(ms);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <article className='item'>
      <div className='item-left'>
        <button
          type='button'
          className={`iconbtn ${m.pinned ? 'is-active' : ''}`}
          onClick={() => onTogglePin(m.id, !m.pinned)}
          title={m.pinned ? '고정 해제' : '핀 고정'}
        >
          <span aria-hidden>📌</span>
        </button>
      </div>
      <div className='item-content'>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          placeholder='내용을 입력하세요'
        />
        <div className='item-meta'>
          <span className='meta'>작성 {fmt(m.createdAt)}</span>
          {m.updatedAt !== m.createdAt && (
            <span className='meta'>수정 {fmt(m.updatedAt)}</span>
          )}
        </div>
      </div>
      <div className='item-right'>
        <button
          type='button'
          className='iconbtn iconbtn--danger'
          onClick={() => onDelete(m.id)}
          title='삭제'
        >
          🗑️
        </button>
      </div>
    </article>
  );
}
