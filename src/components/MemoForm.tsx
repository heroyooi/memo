'use client';
import { useState } from 'react';

export default function MemoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState('');

  const submit = () => {
    const v = text.trim();
    if (!v) return;
    onAdd(v);
    setText('');
  };
  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className='card'>
      <div className='row'>
        <textarea
          className='input'
          placeholder='메모 입력 (Ctrl/Cmd + Enter)'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={3}
        />
        <button className='button' onClick={submit}>
          추가
        </button>
      </div>
    </div>
  );
}
