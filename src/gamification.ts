export interface GamificationState {
  xp: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  perfectQuizStreak: number;
  dailyGoalDate: string | null;
  dailyGoalCount: number;
  xpTodayDate: string | null;
  xpToday: number;
  bestDayXp: number;
}

const KEY = "boersenschule:gamification";

/** Sterne-Bewertung (1-3) für ein Quiz-Ergebnis, analog zu Lern-Apps. */
export function quizStars(score: number, total: number): number {
  if (total <= 0) return 0;
  const pct = score / total;
  if (pct >= 1) return 3;
  if (pct >= 0.66) return 2;
  if (pct > 0) return 1;
  return 0;
}

export function starLabel(stars: number, max = 3): string {
  return "★".repeat(stars) + "☆".repeat(Math.max(0, max - stars));
}

export const XP_LESSON = 10;
export const XP_QUIZ_CORRECT = 5;
export const XP_QUIZ_PERFECT_BONUS = 10;
export const XP_PERFECT_STREAK_BONUS = 25;
export const PERFECT_STREAK_MILESTONE = 3;
export const XP_DAILY_GOAL_BONUS = 15;
export const DAILY_GOAL = 3;
export const XP_REVIEW_CORRECT = 3;

/** Heutiges Kalenderdatum in der lokalen Zeitzone des Nutzers (nicht UTC – sonst verschieben
 * sich Streak/Tagesziel für Nutzer abseits von UTC um die Stunden bis zur lokalen Mitternacht). */
function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return Math.round((db - da) / 86_400_000);
}

function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function emptyState(): GamificationState {
  return {
    xp: 0,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    perfectQuizStreak: 0,
    dailyGoalDate: null,
    dailyGoalCount: 0,
    xpTodayDate: null,
    xpToday: 0,
    bestDayXp: 0,
  };
}

export function loadGamification(): GamificationState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return emptyState();
  try {
    const parsed = JSON.parse(raw) as Partial<GamificationState>;
    return {
      xp: parsed.xp ?? 0,
      streak: parsed.streak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
      lastActiveDate: parsed.lastActiveDate ?? null,
      perfectQuizStreak: parsed.perfectQuizStreak ?? 0,
      dailyGoalDate: parsed.dailyGoalDate ?? null,
      dailyGoalCount: parsed.dailyGoalCount ?? 0,
      xpTodayDate: parsed.xpTodayDate ?? null,
      xpToday: parsed.xpToday ?? 0,
      bestDayXp: parsed.bestDayXp ?? 0,
    };
  } catch {
    return emptyState();
  }
}

function saveGamification(state: GamificationState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("gamification:changed"));
}

export function resetGamification(): GamificationState {
  const state = emptyState();
  saveGamification(state);
  return state;
}

export interface QuizStreakResult {
  streak: number;
  bonusXp: number;
}

/** Aktualisiert die Serie perfekter Quizzes in Folge; ab jedem 3. Meilenstein gibt es Bonus-XP. */
export function registerQuizAttempt(perfect: boolean): QuizStreakResult {
  const state = loadGamification();
  state.perfectQuizStreak = perfect ? state.perfectQuizStreak + 1 : 0;
  saveGamification(state);
  const bonusXp = perfect && state.perfectQuizStreak % PERFECT_STREAK_MILESTONE === 0 ? XP_PERFECT_STREAK_BONUS : 0;
  return { streak: state.perfectQuizStreak, bonusXp };
}

export interface DailyGoalStatus {
  count: number;
  goal: number;
  goalMet: boolean;
}

/** Fortschritt zum Tagesziel für die aktuelle Anzeige (ohne Änderung des Zählers). */
export function dailyGoalStatus(state: GamificationState): DailyGoalStatus {
  const count = state.dailyGoalDate === todayStr() ? state.dailyGoalCount : 0;
  return { count, goal: DAILY_GOAL, goalMet: count >= DAILY_GOAL };
}

export interface DailyGoalResult extends DailyGoalStatus {
  justCompleted: boolean;
}

/** Zählt eine abgeschlossene Lern-Aktion für das Tagesziel; meldet, ob das Ziel gerade erstmals erreicht wurde. */
export function registerDailyGoalProgress(): DailyGoalResult {
  const state = loadGamification();
  const today = todayStr();
  if (state.dailyGoalDate !== today) {
    state.dailyGoalDate = today;
    state.dailyGoalCount = 0;
  }
  const wasMet = state.dailyGoalCount >= DAILY_GOAL;
  state.dailyGoalCount += 1;
  saveGamification(state);
  const goalMet = state.dailyGoalCount >= DAILY_GOAL;
  return { count: state.dailyGoalCount, goal: DAILY_GOAL, goalMet, justCompleted: goalMet && !wasMet };
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
  const today = todayStr();
  if (state.xpTodayDate !== today) {
    state.xpTodayDate = today;
    state.xpToday = 0;
  }
  state.xpToday += amount;
  state.bestDayXp = Math.max(state.bestDayXp, state.xpToday);
  saveGamification(state);
  return { state, gained: amount, leveledUp: levelForXp(state.xp).level > previousLevel, previousLevel };
}

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
}

// Kurve so gestuft, dass Level 20 bei vollständigem, perfektem Durchlauf aller
// Lektionen/Quizzes samt Serien-/Tagesziel-Boni (~1845 XP) erreichbar ist.
const LEVELS: { title: string; xpRequired: number }[] = [
  { title: "Anfänger", xpRequired: 0 },
  { title: "Sparfuchs", xpRequired: 20 },
  { title: "Marktbeobachter", xpRequired: 50 },
  { title: "Analyst", xpRequired: 90 },
  { title: "Strategie-Kenner", xpRequired: 150 },
  { title: "Chart-Leser", xpRequired: 210 },
  { title: "Trader", xpRequired: 290 },
  { title: "Risikomanager", xpRequired: 360 },
  { title: "Portfolio-Profi", xpRequired: 450 },
  { title: "Value-Investor", xpRequired: 550 },
  { title: "Fundamental-Experte", xpRequired: 650 },
  { title: "Technik-Experte", xpRequired: 750 },
  { title: "Markt-Kenner", xpRequired: 860 },
  { title: "Vollprofi", xpRequired: 980 },
  { title: "Börsen-Meister", xpRequired: 1100 },
  { title: "Investment-Guru", xpRequired: 1230 },
  { title: "Kapitalmarkt-Experte", xpRequired: 1370 },
  { title: "Wall-Street-Niveau", xpRequired: 1510 },
  { title: "Börsenlegende", xpRequired: 1650 },
  { title: "Aktien-Champion", xpRequired: 1800 },
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

export interface LevelProgress {
  level: number;
  title: string;
  xpIntoLevel: number;
  xpForLevel: number | null;
  pct: number;
  maxLevel: boolean;
}

/** Fortschritt innerhalb des aktuellen Levels, für Anzeige als Balken. */
export function levelProgress(xp: number): LevelProgress {
  const current = levelForXp(xp);
  const next = nextLevelXp(xp);
  if (next === null) {
    return { level: current.level, title: current.title, xpIntoLevel: xp - current.xpRequired, xpForLevel: null, pct: 100, maxLevel: true };
  }
  const xpIntoLevel = xp - current.xpRequired;
  const xpForLevel = next - current.xpRequired;
  return { level: current.level, title: current.title, xpIntoLevel, xpForLevel, pct: Math.round((xpIntoLevel / xpForLevel) * 100), maxLevel: false };
}

/** True, wenn eine laufende Streak heute noch nicht fortgesetzt wurde und daher zu verfallen droht. */
export function isStreakAtRisk(state: GamificationState): boolean {
  return state.streak > 0 && state.lastActiveDate !== todayStr();
}

export interface DayActivity {
  date: string;
  active: boolean;
  isToday: boolean;
}

const WEEKDAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export function weekdayLabel(date: string): string {
  return WEEKDAY_LABELS[new Date(`${date}T00:00:00Z`).getUTCDay()];
}

/** Letzte `days` Kalendertage (älteste zuerst) mit Markierung, ob sie Teil der aktuellen Streak sind. */
export function weekActivity(state: GamificationState, days = 7): DayActivity[] {
  const today = todayStr();
  const result: DayActivity[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(today, -i);
    const active =
      state.lastActiveDate != null && state.streak > 0 && daysBetween(date, state.lastActiveDate) >= 0 && daysBetween(date, state.lastActiveDate) < state.streak;
    result.push({ date, active, isToday: date === today });
  }
  return result;
}
