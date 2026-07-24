import { PortfolioState, ProgressState } from "./types.js";

const PROGRESS_KEY = "boersenschule:progress";
const PORTFOLIO_KEY = "boersenschule:portfolio";
const WATCHLIST_KEY = "boersenschule:watchlist";
export const STARTKAPITAL = 10_000;

export function loadProgress(): ProgressState {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) return { lessons: {} };
  try {
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { lessons: {} };
  }
}

function saveProgress(state: ProgressState): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
}

export function markLessonRead(lessonId: string): void {
  const state = loadProgress();
  const entry = state.lessons[lessonId] ?? { completed: false, quizScore: null, quizTotal: null };
  entry.completed = true;
  state.lessons[lessonId] = entry;
  saveProgress(state);
}

export function resetProgress(): ProgressState {
  const state: ProgressState = { lessons: {} };
  saveProgress(state);
  return state;
}

export function recordQuizResult(lessonId: string, score: number, total: number): void {
  const state = loadProgress();
  const entry = state.lessons[lessonId] ?? { completed: true, quizScore: null, quizTotal: null };
  entry.completed = true;
  entry.quizScore = score;
  entry.quizTotal = total;
  state.lessons[lessonId] = entry;
  saveProgress(state);
}

export function loadPortfolio(): PortfolioState {
  const raw = localStorage.getItem(PORTFOLIO_KEY);
  if (!raw) return { cash: STARTKAPITAL, day: 0, positions: {}, transactions: [] };
  try {
    return JSON.parse(raw) as PortfolioState;
  } catch {
    return { cash: STARTKAPITAL, day: 0, positions: {}, transactions: [] };
  }
}

export function savePortfolio(state: PortfolioState): void {
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(state));
}

/** Beobachtungsliste: IDs der gemerkten Aktien (rein lokal, unabhängig vom Depot). */
export function loadWatchlist(): string[] {
  const raw = localStorage.getItem(WATCHLIST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function isWatched(stockId: string): boolean {
  return loadWatchlist().includes(stockId);
}

/** Schaltet eine Aktie in der Merkliste um und liefert den neuen Zustand. */
export function toggleWatchlist(stockId: string): boolean {
  const list = loadWatchlist();
  const next = list.includes(stockId) ? list.filter((id) => id !== stockId) : [...list, stockId];
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
  return next.includes(stockId);
}

export function resetPortfolio(): PortfolioState {
  const state: PortfolioState = { cash: STARTKAPITAL, day: 0, positions: {}, transactions: [] };
  savePortfolio(state);
  return state;
}
