// All persistence lives here. Swap these functions for API calls to move to a shared database.
const K = 'drtw:profiles', C = 'drtw:current';
const seed = [['PIXELPETE', 14, 3], ['LEMONLIA', 12, 5], ['ZESTYZED', 10, 2], ['MANDARINMO', 8, 6], ['CITRUSCAT', 5, 4], ['PIPPIN', 3, 7]]
  .map(([name, correct, misses], i) => ({ id: 'demo-' + i, name, email: '', guest: false, demo: true, correct, misses, points: correct * 10 }));
const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const blank = (o) => ({ correct: 0, misses: 0, points: 0, ...o });
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

export const getProfiles = () => { let p = read(K, null); if (!Array.isArray(p)) { p = seed; write(K, p); } return p; };
export const saveProfiles = (p) => write(K, p);
export const getCurrentId = () => read(C, null);
export const setCurrentId = (id) => { try { id ? write(C, id) : localStorage.removeItem(C); } catch { /* ignore */ } };

export function registerAccount(username, email) {
  const name = username.trim(), mail = email.trim().toLowerCase();
  if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) return { error: 'Username: 3-16 letters, numbers or _.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return { error: 'Enter a valid email address.' };
  const ps = getProfiles();
  const ex = ps.find((p) => !p.guest && p.name.toLowerCase() === name.toLowerCase());
  if (ex) return ex.email === mail ? { profile: ex } : { error: 'Username taken. Sign in with the email it was made with.' };
  const profile = blank({ id: uid('u-'), name, email: mail, guest: false });
  saveProfiles([...ps, profile]);
  return { profile };
}

export function createGuest(displayName) {
  const name = displayName.trim();
  if (name.length < 2 || name.length > 16) return { error: 'Display name: 2-16 characters.' };
  const ps = getProfiles(), low = name.toLowerCase();
  if (ps.some((p) => !p.guest && p.name.toLowerCase() === low)) return { error: 'That name belongs to an account. Pick another.' };
  const ex = ps.find((p) => p.guest && p.name.toLowerCase() === low);
  if (ex) return { profile: ex };
  const profile = blank({ id: uid('g-'), name, email: '', guest: true });
  saveProfiles([...ps, profile]);
  return { profile };
}

export function addResult(id, correct) {
  const ps = getProfiles().map((p) => p.id !== id ? p : {
    ...p, correct: p.correct + (correct ? 1 : 0), misses: p.misses + (correct ? 0 : 1), points: p.points + (correct ? 10 : 0),
  });
  saveProfiles(ps);
  return ps;
}

export const rankPlayers = (ps) => [...ps].sort((a, b) => b.points - a.points || b.correct - a.correct || a.misses - b.misses);
