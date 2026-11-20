export default function GameControls({ game, onFullscreen }) {
  const { phase, scored, challenge } = game;
  const busy = phase === 'transition' || phase === 'reveal';
  return (
    <div className="controls">
      <div className="result" aria-live="polite">
        {phase === 'answer' && challenge && (
          <span className="result-line">✦ THE COLOUR WAS <b className="hue" style={{ color: challenge.hex }}>{challenge.color}</b>! ✦</span>
        )}
      </div>
      <div className="btn-row">
        {phase === 'idle' && <button className="btn big" onClick={game.begin} aria-keyshortcuts="Space">START GAME</button>}
        {busy && <button className="btn big" disabled>WATCH…</button>}
        {phase === 'covered' && <button className="btn big" onClick={game.showResult} aria-keyshortcuts="Enter">RESULT</button>}
        {phase === 'answer' && (<>
          <button className="btn good" disabled={scored} onClick={() => game.score(true)} aria-keyshortcuts="C">+1 CORRECT</button>
          <button className="btn bad" disabled={scored} onClick={() => game.score(false)} aria-keyshortcuts="X">MISS</button>
          <button className="btn big" onClick={game.begin} aria-keyshortcuts="Space">NEXT ROUND</button>
        </>)}
      </div>
      <div className="btn-row small">
        <button className="btn mini" onClick={game.restart} aria-keyshortcuts="R">RESTART</button>
        <button className="btn mini" onClick={onFullscreen}>FULLSCREEN</button>
      </div>
      <p className="keys">SPACE start · ENTER result · C correct · X miss · R restart</p>
    </div>
  );
}
