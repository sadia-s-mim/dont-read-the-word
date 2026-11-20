import { useEffect, useRef, useState } from 'react';
import { createGuest, registerAccount } from '../utils/storage.js';

export default function LoginModal({ player, onLogin, onLogout, onClose }) {
  const [tab, setTab] = useState('account');
  const [f, setF] = useState({ username: '', email: '', guest: '' });
  const [error, setError] = useState('');
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [onClose, tab]);
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setError(''); };
  const submit = (e) => {
    e.preventDefault();
    const res = tab === 'account' ? registerAccount(f.username, f.email) : createGuest(f.guest);
    res.error ? setError(res.error) : onLogin(res.profile);
  };
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mt">
        {player ? (<>
          <h2 id="mt">PLAYER {player.name}</h2>
          <p className="hint">{player.guest ? 'Guest profile' : player.email}</p>
          <p>Correct {player.correct} · Misses {player.misses} · Points {player.points}</p>
          <div className="btn-row"><button ref={ref} className="btn bad" onClick={onLogout}>LOG OUT</button><button className="btn mini" onClick={onClose}>CLOSE</button></div>
        </>) : (<>
          <h2 id="mt">INSERT PLAYER</h2>
          <div className="tabs" role="tablist">
            {[['account', 'ACCOUNT'], ['guest', 'GUEST']].map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={'tab' + (tab === k ? ' on' : '')} onClick={() => { setTab(k); setError(''); }}>{l}</button>
            ))}
          </div>
          <form onSubmit={submit} noValidate>
            {tab === 'account' ? (<>
              <label>Username<input ref={ref} value={f.username} onChange={set('username')} autoComplete="username" maxLength={16} /></label>
              <label>Email<input type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
              <p className="hint">New here? We create your profile. Returning? Use the same pair. No password needed.</p>
            </>) : (
              <label>Display name<input ref={ref} value={f.guest} onChange={set('guest')} maxLength={16} /></label>
            )}
            <p className="error" role="alert">{error}</p>
            <div className="btn-row"><button className="btn big" type="submit">{tab === 'account' ? 'LOG IN / REGISTER' : 'PLAY AS GUEST'}</button><button type="button" className="btn mini" onClick={onClose}>CANCEL</button></div>
          </form>
        </>)}
      </div>
    </div>
  );
}
