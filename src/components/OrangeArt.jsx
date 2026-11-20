const PAL = { o: '#ff8a1f', d: '#d9650b', D: '#b34f06', h: '#ffc27a', g: '#2f8f3a', G: '#1f6b2b', s: '#6b4423', w: '#ffe3b0' };

function Pixels({ rows, className }) {
  const r = [];
  rows.forEach((row, y) => [...row].forEach((c, x) => PAL[c] && r.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" fill={PAL[c]} />)));
  return <svg className={className} viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">{r}</svg>;
}

const top = ['.......ss.......', '....gg.ss.gg....', '..gggggssggggg..', '.gGGGGgssgGGGGg.'];
const body = Array.from({ length: 14 }, (_, y) => Array.from({ length: 16 }, (_, x) => {
  const d = Math.hypot(x - 7.5, (y - 6.5) * 1.07);
  if (d > 7.4) return '.';
  if (d > 6.3) return 'd';
  if (y === 3 && (x === 4 || x === 11)) return 'h';
  if (y === 9 && (x === 5 || x === 10)) return 'D';
  if (y === 7 && (x === 7 || x === 8)) return 'D';
  return 'o';
}).join(''));
const slice = Array.from({ length: 9 }, (_, y) => Array.from({ length: 9 }, (_, x) => {
  const d = Math.hypot(x - 4, y - 4);
  if (d > 4.3) return '.';
  if (d > 3.3) return 'd';
  return x === 4 || y === 4 || x === y || x + y === 8 ? 'w' : 'o';
}).join(''));

export const BigOrange = () => <Pixels rows={[...top, ...body]} className="big-orange" />;
export const OrangeSlice = ({ style }) => <span className="slice" style={style}><Pixels rows={slice} /></span>;
