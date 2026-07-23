const KEY = "boersenschule:gamification";
export const XP_LESSON = 10;
export const XP_QUIZ_CORRECT = 5;
export const XP_QUIZ_PERFECT_BONUS = 10;
function todayStr() {
    return new Date().toISOString().slice(0, 10);
}
function daysBetween(a, b) {
    const da = new Date(`${a}T00:00:00Z`).getTime();
    const db = new Date(`${b}T00:00:00Z`).getTime();
    return Math.round((db - da) / 86400000);
}
function addDays(date, delta) {
    const d = new Date(`${date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + delta);
    return d.toISOString().slice(0, 10);
}
export function loadGamification() {
    const raw = localStorage.getItem(KEY);
    if (!raw)
        return { xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null };
    try {
        const parsed = JSON.parse(raw);
        return {
            xp: parsed.xp ?? 0,
            streak: parsed.streak ?? 0,
            longestStreak: parsed.longestStreak ?? 0,
            lastActiveDate: parsed.lastActiveDate ?? null,
        };
    }
    catch {
        return { xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null };
    }
}
function saveGamification(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
}
export function resetGamification() {
    const state = { xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null };
    saveGamification(state);
    return state;
}
/** Aktualisiert die Tagesserie anhand des heutigen Datums (Lücke von genau 1 Tag verlängert die Serie). */
function touchStreak(state) {
    const today = todayStr();
    if (state.lastActiveDate === today)
        return;
    if (state.lastActiveDate) {
        state.streak = daysBetween(state.lastActiveDate, today) === 1 ? state.streak + 1 : 1;
    }
    else {
        state.streak = 1;
    }
    state.lastActiveDate = today;
    state.longestStreak = Math.max(state.longestStreak, state.streak);
}
export function awardXp(amount) {
    const state = loadGamification();
    const previousLevel = levelForXp(state.xp).level;
    touchStreak(state);
    state.xp += amount;
    saveGamification(state);
    return { state, gained: amount, leveledUp: levelForXp(state.xp).level > previousLevel, previousLevel };
}
const LEVELS = [
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
export function levelForXp(xp) {
    let idx = 0;
    for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].xpRequired)
            idx = i;
        else
            break;
    }
    return { level: idx + 1, title: LEVELS[idx].title, xpRequired: LEVELS[idx].xpRequired };
}
/** XP-Schwelle des nächsten Levels, oder null wenn das Maximallevel erreicht ist. */
export function nextLevelXp(xp) {
    const current = levelForXp(xp);
    const next = LEVELS[current.level];
    return next ? next.xpRequired : null;
}
/** Fortschritt innerhalb des aktuellen Levels, für Anzeige als Balken. */
export function levelProgress(xp) {
    const current = levelForXp(xp);
    const next = nextLevelXp(xp);
    if (next === null) {
        return { level: current.level, title: current.title, xpIntoLevel: xp - current.xpRequired, xpForLevel: null, pct: 100, maxLevel: true };
    }
    const xpIntoLevel = xp - current.xpRequired;
    const xpForLevel = next - current.xpRequired;
    return { level: current.level, title: current.title, xpIntoLevel, xpForLevel, pct: Math.round((xpIntoLevel / xpForLevel) * 100), maxLevel: false };
}
const WEEKDAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
export function weekdayLabel(date) {
    return WEEKDAY_LABELS[new Date(`${date}T00:00:00Z`).getUTCDay()];
}
/** Letzte `days` Kalendertage (älteste zuerst) mit Markierung, ob sie Teil der aktuellen Streak sind. */
export function weekActivity(state, days = 7) {
    const today = todayStr();
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = addDays(today, -i);
        const active = state.lastActiveDate != null && state.streak > 0 && daysBetween(date, state.lastActiveDate) >= 0 && daysBetween(date, state.lastActiveDate) < state.streak;
        result.push({ date, active, isToday: date === today });
    }
    return result;
}
