const KEY = "boersenschule:leitner";
const MAX_BOX = 5;
// Leitner-Intervalle in Tagen je Box (Index = Box-Nummer 1..5); Box 1 = sofort wieder fällig.
const BOX_INTERVAL_DAYS = [0, 0, 2, 4, 8, 16];
/** Heutiges Kalenderdatum in der lokalen Zeitzone des Nutzers (nicht UTC). */
function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function addDays(date, delta) {
    const d = new Date(`${date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + delta);
    return d.toISOString().slice(0, 10);
}
export function cardId(moduleId, lessonId, questionIndex) {
    return `${moduleId}:${lessonId}:${questionIndex}`;
}
export function loadLeitner() {
    const raw = localStorage.getItem(KEY);
    if (!raw)
        return { cards: {} };
    try {
        const parsed = JSON.parse(raw);
        return { cards: parsed.cards ?? {} };
    }
    catch {
        return { cards: {} };
    }
}
function saveLeitner(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
}
export function resetLeitner() {
    saveLeitner({ cards: {} });
}
/** Trägt das Ergebnis einer beantworteten Quizfrage ein: richtig → eine Box weiter (längeres Intervall), falsch → zurück auf Box 1. */
export function recordCardResult(id, correct) {
    const state = loadLeitner();
    const prevBox = state.cards[id]?.box ?? 0;
    const box = correct ? Math.min(MAX_BOX, prevBox + 1) : 1;
    state.cards[id] = { box, dueDate: addDays(todayStr(), BOX_INTERVAL_DAYS[box]) };
    saveLeitner(state);
}
function parseCardId(id) {
    const [moduleId, lessonId, questionIndex] = id.split(":");
    return { moduleId, lessonId, questionIndex: Number(questionIndex) };
}
/** Fällige Karten, dringlichste (niedrigste Box) zuerst; auf `limit` begrenzt für die tägliche Challenge. */
export function dueCards(limit = 3) {
    const state = loadLeitner();
    const today = todayStr();
    return Object.entries(state.cards)
        .filter(([, c]) => c.dueDate <= today)
        .map(([id, c]) => ({ id, ...parseCardId(id), box: c.box }))
        .sort((a, b) => a.box - b.box)
        .slice(0, limit);
}
export function dueCardCount() {
    const state = loadLeitner();
    const today = todayStr();
    return Object.values(state.cards).filter((c) => c.dueDate <= today).length;
}
