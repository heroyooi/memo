'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Memo } from '@/types/memo';

type Props = {
  memos: Memo[];
  onTogglePin: (id: string, next: boolean) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

const fmt = (ms: number) => {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

export default function MemoList({
  memos,
  onTogglePin,
  onUpdate,
  onDelete,
}: Props) {
  const [previewId, setPreviewId] = useState<string | null>(null);

  const previewMemo =
    previewId !== null ? memos.find((memo) => memo.id === previewId) ?? null : null;

  useEffect(() => {
    if (previewId !== null && !previewMemo) {
      setPreviewId(null);
    }
  }, [previewId, previewMemo]);

  if (!memos.length)
    return (
      <p className='empty-message'>
        첫 메모를 작성해 보세요. 아이디어, 할 일, 영감까지 모두 환영해요!
      </p>
    );

  return (
    <>
      <div className='list'>
        {memos.map((m) => (
          <Item
            key={m.id}
            m={m}
            onTogglePin={onTogglePin}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onOpenPreview={() => setPreviewId(m.id)}
          />
        ))}
      </div>
      {previewMemo && (
        <PreviewModal memo={previewMemo} onClose={() => setPreviewId(null)} />
      )}
    </>
  );
}

function Item({
  m,
  onTogglePin,
  onUpdate,
  onDelete,
  onOpenPreview,
}: {
  m: Memo;
  onTogglePin: (id: string, next: boolean) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onOpenPreview: (id: string) => void;
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
          <button
            type='button'
            className='text-link-button'
            onClick={() => onOpenPreview(m.id)}
          >
            크게 보기
          </button>
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

function PreviewModal({ memo, onClose }: { memo: Memo; onClose: () => void }) {
  const [mounted, setMounted] = useState(() => typeof window !== 'undefined');

  useEffect(() => {
    if (mounted) return;
    setMounted(true);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className='modal-backdrop' role='presentation' onClick={onClose}>
      <div
        className='modal'
        role='dialog'
        aria-modal='true'
        aria-labelledby={`memo-modal-title-${memo.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className='modal-header'>
          <h2 className='modal-title' id={`memo-modal-title-${memo.id}`}>
            메모 전체 보기
          </h2>
          <button
            type='button'
            className='modal-close'
            onClick={onClose}
            aria-label='닫기'
          >
            ✕
          </button>
        </header>
        <div className='modal-meta'>
          <span>작성 {fmt(memo.createdAt)}</span>
          {memo.updatedAt !== memo.createdAt && (
            <span>수정 {fmt(memo.updatedAt)}</span>
          )}
        </div>
        <div className='modal-body'>
          <p className='modal-text'>{memo.text}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
