const PROGRESS_KEY = "boersenschule:progress";
const PORTFOLIO_KEY = "boersenschule:portfolio";
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
export function resetPortfolio() {
    const state = { cash: STARTKAPITAL, day: 0, positions: {}, transactions: [] };
    savePortfolio(state);
    return state;
}
