'use client';

import MemoForm from '@/components/MemoForm';
import MemoList from '@/components/MemoList';
import useAdminAuth from '@/hooks/useAdminAuth';
import useMemoStore from '@/hooks/useMemoStore';

export default function Page() {
  const { user, loading: authLoading, busy, isAdmin, signIn, signOut } =
    useAdminAuth();
  const userId = isAdmin && user ? user.uid : undefined;
  const { ready, memos, addMemo, updateMemo, togglePin, deleteMemo } =
    useMemoStore(userId);

  const renderAuthGate = () => {
    if (authLoading) {
      return (
        <section className='card status-card'>
          <p>로그인 상태를 확인하고 있습니다…</p>
        </section>
      );
    }

    if (!user) {
      return (
        <section className='card status-card auth-card'>
          <p>관리자만 접근 가능한 서비스입니다. Google 계정으로 로그인해주세요.</p>
          <div className='auth-card__actions'>
            <button className='button' onClick={signIn} disabled={busy}>
              {busy ? '로그인 중…' : 'Google 계정으로 로그인'}
            </button>
          </div>
        </section>
      );
    }

    if (!isAdmin) {
      return (
        <section className='card status-card auth-card'>
          <p>접근 권한이 없는 계정입니다. 다른 계정으로 다시 로그인해주세요.</p>
          <div className='auth-card__actions'>
            <button
              className='button button--secondary'
              onClick={signOut}
              disabled={busy}
            >
              {busy ? '로그아웃 중…' : '로그아웃'}
            </button>
          </div>
        </section>
      );
    }

    return null;
  };

  const authGate = renderAuthGate();

  return (
    <main className='container'>
      <section className='hero'>
        <h1>나만의 메모 보드</h1>
        <p>
          Google 관리자 로그인을 통해 안전하게 메모를 작성하고, 중요한 메모는
          고정해서 한눈에 확인해보세요.
        </p>
      </section>

      {authGate ?? (
        <>
          <section className='card status-card auth-card'>
            <p>
              {user?.displayName
                ? `${user.displayName}님, 환영합니다!`
                : `${user?.email ?? '관리자'}로 로그인되었습니다.`}
            </p>
            <div className='auth-card__actions'>
              <button
                className='button button--secondary'
                onClick={signOut}
                disabled={busy}
              >
                {busy ? '로그아웃 중…' : '로그아웃'}
              </button>
            </div>
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
        </>
      )}
    </main>
  );
}
