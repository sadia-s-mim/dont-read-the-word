import { useCallback, useEffect, useRef, useState } from 'react';

export const WORDS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BLACK', 'BROWN', 'WHITE'];
export const COLORS = { RED: '#e63946', BLUE: '#2563eb', GREEN: '#16a34a', YELLOW: '#facc15', PURPLE: '#7e22ce', ORANGE: '#f97316', PINK: '#ec4899', BLACK: '#111111', BROWN: '#7c4a21', WHITE: '#ffffff' };
export const FONTS = ["'Press Start 2P', monospace", 'Georgia, serif', "'Courier New', monospace", 'Impact, sans-serif', "'Comic Sans MS', cursive", "'Trebuchet MS', sans-serif"];
export const REVEAL_MS = 1500;

const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const beep = (f, d = 0.08) => {
  try {
    const A = window.AudioContext || window.webkitAudioContext, c = new A();
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'square'; o.frequency.value = f; g.gain.value = 0.03;
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d); o.onended = () => c.close();
  } catch { /* audio unavailable */ }
};

// phases: idle -> transition -> reveal -> covered -> answer -> (transition ...)
export function useGame(onScore) {
  const init = { phase: 'idle', round: 0, challenge: null, flipped: false, scored: true };
  const st = useRef(init);
  const [s, setS] = useState(init);
  const [session, setSession] = useState({ correct: 0, misses: 0 });
  const timers = useRef([]);
  const up = (p) => { st.current = { ...st.current, ...p }; setS(st.current); };
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => clear, []);

  const begin = useCallback(() => {
    const { phase, flipped, round } = st.current;
    if (phase !== 'idle' && phase !== 'answer') return;
    clear();
    up({ phase: 'transition', challenge: null, flipped: false, scored: true }); // previous answer hidden at once
    later(() => {
      const color = pick(WORDS);
      up({ phase: 'reveal', round: round + 1, flipped: true, challenge: { word: pick(WORDS), color, hex: COLORS[color], font: pick(FONTS) } });
      beep(660);
      later(() => up({ phase: 'covered', flipped: false }), REVEAL_MS);
    }, flipped ? 600 : 60);
  }, []);

  const showResult = useCallback(() => {
    if (st.current.phase !== 'covered') return;
    up({ phase: 'answer', flipped: true, scored: false });
    beep(440);
  }, []);

  const score = useCallback((correct) => {
    if (st.current.phase !== 'answer' || st.current.scored) return; // no duplicate scoring
    up({ scored: true });
    setSession((x) => ({ correct: x.correct + (correct ? 1 : 0), misses: x.misses + (correct ? 0 : 1) }));
    onScore?.(correct);
    beep(correct ? 880 : 180, 0.12);
  }, [onScore]);

  const restart = useCallback(() => { clear(); up(init); setSession({ correct: 0, misses: 0 }); }, []);
  return { ...s, session, begin, showResult, score, restart };
}
