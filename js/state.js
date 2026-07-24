const PROGRESS_KEY = "boersenschule:progress";
const PORTFOLIO_KEY = "boersenschule:portfolio";
const WATCHLIST_KEY = "boersenschule:watchlist";
export const STARTKAPITAL = 10000;
export function loadProgress() {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw)
        return { lessons: {} };
    try {
        return JSON.parse(raw);
    }
    catch {
        return { lessons: {} };
    }
}
function saveProgress(state) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
}
export function markLessonRead(lessonId) {
    const state = loadProgress();
    const entry = state.lessons[lessonId] ?? { completed: false, quizScore: null, quizTotal: null };
    entry.completed = true;
    state.lessons[lessonId] = entry;
    saveProgress(state);
}
export function resetProgress() {
    const state = { lessons: {} };
    saveProgress(state);
    return state;
}
export function recordQuizResult(lessonId, score, total) {
    const state = loadProgress();
    const entry = state.lessons[lessonId] ?? { completed: true, quizScore: null, quizTotal: null };
    entry.completed = true;
    entry.quizScore = score;
    entry.quizTotal = total;
    state.lessons[lessonId] = entry;
    saveProgress(state);
}
export function loadPortfolio() {
    const raw = localStorage.getItem(PORTFOLIO_KEY);
    if (!raw)
        return { cash: STARTKAPITAL, day: 0, positions: {}, transactions: [] };
    try {
        return JSON.parse(raw);
    }
    catch {
        return { cash: STARTKAPITAL, day: 0, positions: {}, transactions: [] };
    }
}
export function savePortfolio(state) {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(state));
}
/** Beobachtungsliste: IDs der gemerkten Aktien (rein lokal, unabhängig vom Depot). */
export function loadWatchlist() {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw)
        return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
    }
    catch {
        return [];
    }
}
export function isWatched(stockId) {
    return loadWatchlist().includes(stockId);
}
/** Schaltet eine Aktie in der Merkliste um und liefert den neuen Zustand. */
export function toggleWatchlist(stockId) {
    const list = loadWatchlist();
    const next = list.includes(stockId) ? list.filter((id) => id !== stockId) : [...list, stockId];
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
    return next.includes(stockId);
}
export function resetPortfolio() {
    const state = { cash: STARTKAPITAL, day: 0, positions: {}, transactions: [] };
    savePortfolio(state);
    return state;
}
