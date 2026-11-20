import { useCallback, useRef, useState } from 'react';
import Home from './pages/Home.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import LoginModal from './components/LoginModal.jsx';
import { useGame } from './hooks/useGame.js';
import { addResult, getCurrentId, getProfiles, setCurrentId } from './utils/storage.js';

export default function App() {
  const [players, setPlayers] = useState(getProfiles);
  const [id, setId] = useState(() => (getProfiles().some((p) => p.id === getCurrentId()) ? getCurrentId() : null));
  const [view, setView] = useState('home');
  const [modal, setModal] = useState(false);
  const idRef = useRef(id); idRef.current = id;
  const player = players.find((p) => p.id === id) || null;

  const onScore = useCallback((correct) => { if (idRef.current) setPlayers(addResult(idRef.current, correct)); }, []);
  const game = useGame(onScore);
  const login = (p) => { setPlayers(getProfiles()); setId(p.id); setCurrentId(p.id); setModal(false); };
  const logout = () => { setId(null); setCurrentId(null); setModal(false); };

  return (
    <div className="app">
      <header className="top">
        <span className="brand" aria-hidden="true">🍊</span>
        <nav aria-label="Main">
          <button className={'tab' + (view === 'home' ? ' on' : '')} onClick={() => setView('home')}>PLAY</button>
          <button className={'tab' + (view === 'board' ? ' on' : '')} onClick={() => { setPlayers(getProfiles()); setView('board'); }}>SCORES</button>
        </nav>
        <button className="btn mini login" onClick={() => setModal(true)}>{player ? player.name : 'LOGIN'}</button>
      </header>
      {view === 'home'
        ? <Home game={game} player={player} paused={modal} />
        : <LeaderboardPage players={players} activeId={id} onPlay={() => setView('home')} />}
      {modal && <LoginModal player={player} onLogin={login} onLogout={logout} onClose={() => setModal(false)} />}
    </div>
  );
}
