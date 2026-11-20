import { useEffect } from 'react';
import GameCard from '../components/GameCard.jsx';
import GameControls from '../components/GameControls.jsx';
import PlayerStats from '../components/PlayerStats.jsx';

export default function Home({ game, player, paused }) {
  const stats = player || { ...game.session, points: game.session.correct * 10 };
  const fullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };
  useEffect(() => {
    if (paused) return;
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      const k = e.key.toLowerCase(), onBtn = e.target.tagName === 'BUTTON';
      if (k === ' ' && !onBtn) { e.preventDefault(); game.begin(); }
      else if (k === 'enter' && !onBtn) game.showResult();
      else if (k === 'c') game.score(true);
      else if (k === 'x') game.score(false);
      else if (k === 'r') game.restart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paused, game]);
  return (
    <main className="arena">
      <h1>DON'T READ<br />THE WORD!</h1>
      <p className="sub">Say the FONT COLOUR, not the word.</p>
      <GameCard flipped={game.flipped} challenge={game.challenge} />
      <GameControls game={game} onFullscreen={fullscreen} />
      <PlayerStats round={game.round} stats={stats} signedIn={!!player} />
    </main>
  );
}
