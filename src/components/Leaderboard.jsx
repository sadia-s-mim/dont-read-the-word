import { rankPlayers } from '../utils/storage.js';

export default function Leaderboard({ players, activeId }) {
  const medal = ['gold', 'silver', 'bronze'];
  return (
    <div className="table-wrap">
      <table className="board">
        <thead><tr><th>RANK</th><th>PLAYER</th><th>CORRECT</th><th>POINTS</th><th>MISSES</th></tr></thead>
        <tbody>
          {rankPlayers(players).map((p, i) => (
            <tr key={p.id} className={(i < 3 ? 'top ' + medal[i] : '') + (p.id === activeId ? ' me' : '')}>
              <td><span className={'rank ' + (medal[i] || '')}>{i + 1}</span></td>
              <td>{p.name}{p.id === activeId ? ' (YOU)' : ''}</td>
              <td>{p.correct}</td><td>{p.points}</td><td>{p.misses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
