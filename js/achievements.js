import { PERFECT_STREAK_MILESTONE } from "./gamification.js";
export const ACHIEVEMENTS = [
    {
        id: "erste-lektion",
        title: "Erste Schritte",
        description: "Deine erste Lektion abgeschlossen.",
        icon: "📘",
        check: (ctx) => Object.values(ctx.progress.lessons).some((entry) => entry.completed),
    },
    {
        id: "perfektes-quiz",
        title: "Volltreffer",
        description: "Ein Quiz mit 100 % richtigen Antworten abgeschlossen.",
        icon: "🎯",
        check: (ctx) => Object.values(ctx.progress.lessons).some((entry) => entry.quizScore !== null && entry.quizTotal !== null && entry.quizScore === entry.quizTotal),
    },
    {
        id: "modul-komplett",
        title: "Modul gemeistert",
        description: "Ein komplettes Lernmodul abgeschlossen.",
        icon: "🏅",
        check: (ctx) => ctx.modules.some((mod) => mod.lessons.length > 0 && mod.lessons.every((lesson) => ctx.progress.lessons[lesson.id]?.completed)),
    },
    {
        id: "perfekte-serie",
        title: "Auf Serie",
        description: `${PERFECT_STREAK_MILESTONE} perfekte Quizzes in Folge.`,
        icon: "🔥",
        check: (ctx) => (ctx.gamification?.perfectQuizStreak ?? 0) >= PERFECT_STREAK_MILESTONE,
    },
];
const KEY = "boersenschule:achievements";
export function loadUnlockedAchievements() {
    const raw = localStorage.getItem(KEY);
    if (!raw)
        return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}
function saveUnlockedAchievements(ids) {
    localStorage.setItem(KEY, JSON.stringify(ids));
}
export function resetAchievements() {
    saveUnlockedAchievements([]);
}
/** Prüft alle Achievements gegen den aktuellen Fortschritt und schaltet neue frei. Gibt die neu freigeschalteten zurück. */
export function evaluateAchievements(ctx) {
    const unlocked = new Set(loadUnlockedAchievements());
    const newlyUnlocked = [];
    for (const achievement of ACHIEVEMENTS) {
        if (unlocked.has(achievement.id))
            continue;
        if (achievement.check(ctx)) {
            unlocked.add(achievement.id);
            newlyUnlocked.push(achievement);
        }
    }
    if (newlyUnlocked.length > 0)
        saveUnlockedAchievements([...unlocked]);
    return newlyUnlocked;
}
