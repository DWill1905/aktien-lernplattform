export interface GamificationState {
  xp: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

const KEY = "boersenschule:gamification";

export const XP_LESSON = 10;
export const XP_QUIZ_CORRECT = 5;
export const XP_QUIZ_PERFECT_BONUS = 10;

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((db - da) / 86_400_000);
}

export function loadGamification(): GamificationState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return { xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null };
  try {
    const parsed = JSON.parse(raw) as Partial<GamificationState>;
    return {
      xp: parsed.xp ?? 0,
      streak: parsed.streak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      lastActiveDate: parsed.lastActiveDate ?? null,
    };
  } catch {
    return { xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null };
  }
}

function saveGamification(state: GamificationState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetGamification(): GamificationState {
  const state: GamificationState = { xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null };
  saveGamification(state);
  return state;
}

/** Aktualisiert die Tagesserie anhand des heutigen Datums (Lücke von genau 1 Tag verlängert die Serie). */
function touchStreak(state: GamificationState): void {
  const today = todayStr();
  if (state.lastActiveDate === today) return;
  if (state.lastActiveDate) {
    state.streak = daysBetween(state.lastActiveDate, today) === 1 ? state.streak + 1 : 1;
  } else {
    state.streak = 1;
  }
  state.lastActiveDate = today;
  state.longestStreak = Math.max(state.longestStreak, state.streak);
}

export interface XpResult {
  state: GamificationState;
  gained: number;
  leveledUp: boolean;
  previousLevel: number;
}

export function awardXp(amount: number): XpResult {
  const state = loadGamification();
  const previousLevel = levelForXp(state.xp).level;
  touchStreak(state);
  state.xp += amount;
  saveGamification(state);
  return { state, gained: amount, leveledUp: levelForXp(state.xp).level > previousLevel, previousLevel };
}

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
}

const LEVELS: { title: string; xpRequired: number }[] = [
  { title: "Anfänger", xpRequired: 0 },
  { title: "Sparfuchs", xpRequired: 50 },
  { title: "Marktbeobachter", xpRequired: 120 },
  { title: "Analyst", xpRequired: 220 },
  { title: "Strategie-Kenner", xpRequired: 350 },
  { title: "Chart-Leser", xpRequired: 520 },
  { title: "Trader", xpRequired: 720 },
  { title: "Risikomanager", xpRequired: 960 },
  { title: "Portfolio-Profi", xpRequired: 1250 },
  { title: "Value-Investor", xpRequired: 1600 },
  { title: "Fundamental-Experte", xpRequired: 2000 },
  { title: "Technik-Experte", xpRequired: 2450 },
  { title: "Markt-Kenner", xpRequired: 2950 },
  { title: "Vollprofi", xpRequired: 3500 },
  { title: "Börsen-Meister", xpRequired: 4100 },
  { title: "Investment-Guru", xpRequired: 4750 },
  { title: "Kapitalmarkt-Experte", xpRequired: 5450 },
  { title: "Wall-Street-Niveau", xpRequired: 6200 },
  { title: "Börsenlegende", xpRequired: 7000 },
  { title: "Aktien-Champion", xpRequired: 7850 },
];

export function levelForXp(xp: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) idx = i;
    else break;
  }
  return { level: idx + 1, title: LEVELS[idx].title, xpRequired: LEVELS[idx].xpRequired };
}

/** XP-Schwelle des nächsten Levels, oder null wenn das Maximallevel erreicht ist. */
export function nextLevelXp(xp: number): number | null {
  const current = levelForXp(xp);
  const next = LEVELS[current.level];
  return next ? next.xpRequired : null;
}
