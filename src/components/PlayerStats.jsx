export default function PlayerStats({ round, stats, signedIn }) {
  const total = stats.correct + stats.misses;
  const acc = total ? Math.round((stats.correct / total) * 100) : 0;
  const items = [['ROUND', round], ['CORRECT', stats.correct], ['MISSES', stats.misses], ['POINTS', stats.points], ['ACCURACY', acc + '%']];
  return (
    <section aria-label="Player statistics">
      <ul className="stats">{items.map(([k, v]) => <li key={k}><span>{k}</span><b>{v}</b></li>)}</ul>
      {!signedIn && <p className="hint">Log in to save your score.</p>}
    </section>
  );
}
