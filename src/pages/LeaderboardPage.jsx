import Leaderboard from '../components/Leaderboard.jsx';

export default function LeaderboardPage({ players, activeId, onPlay }) {
  return (
    <main className="arena wide">
      <h1>HIGH SCORES</h1>
      <p className="sub">Scores are saved in this browser only.</p>
      <Leaderboard players={players} activeId={activeId} />
      <button className="btn big" onClick={onPlay}>PLAY</button>
    </main>
  );
}
