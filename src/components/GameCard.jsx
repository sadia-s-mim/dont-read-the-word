import { BigOrange, OrangeSlice } from './OrangeArt.jsx';

const SLICES = [[5, 5], [44, 3], [80, 6], [3, 20], [86, 20], [5, 70], [84, 70], [44, 86], [24, 88]]; // 9 slices, clear of the centre

export default function GameCard({ flipped, challenge }) {
  return (
    <div className={'card' + (flipped ? ' flipped' : '')} role="img"
      aria-label={flipped && challenge ? 'Card showing a colour word' : 'Card cover with an orange'}>
      <div className="card-inner">
        <div className="face front"><BigOrange /></div>
        <div className="face back">
          {SLICES.map(([l, t], i) => <OrangeSlice key={i} style={{ left: l + '%', top: t + '%' }} />)}
          {challenge && <span className="word" style={{ color: challenge.hex, fontFamily: challenge.font }}>{challenge.word}</span>}
        </div>
      </div>
    </div>
  );
}
