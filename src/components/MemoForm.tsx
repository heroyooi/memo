'use client';

import { useState } from 'react';

type Props = {
  onAdd: (text: string) => void;
};

export default function MemoForm({ onAdd }: Props) {
  const [text, setText] = useState('');

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    onAdd(value);
    setText('');
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <section className='card memo-form'>
      <textarea
        className='input memo-form__textarea'
        placeholder='기억하고 싶은 내용을 자유롭게 적어보세요'
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={3}
      />
      <div className='memo-form__footer'>
        <span className='memo-form__hint'>Ctrl / Cmd + Enter 로 빠르게 추가</span>
        <button className='button' type='button' onClick={submit}>
          <span className='button__icon' aria-hidden>
            ＋
          </span>
          메모 추가
        </button>
      </div>
    </section>
  );
}
