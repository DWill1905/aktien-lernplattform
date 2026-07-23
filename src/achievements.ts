import { LearningModule, ProgressState } from "./types.js";

export interface AchievementContext {
  progress: ProgressState;
  modules: LearningModule[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (ctx: AchievementContext) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
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
    check: (ctx) =>
      Object.values(ctx.progress.lessons).some(
        (entry) => entry.quizScore !== null && entry.quizTotal !== null && entry.quizScore === entry.quizTotal
      ),
  },
  {
    id: "modul-komplett",
    title: "Modul gemeistert",
    description: "Ein komplettes Lernmodul abgeschlossen.",
    icon: "🏅",
    check: (ctx) =>
      ctx.modules.some((mod) => mod.lessons.length > 0 && mod.lessons.every((lesson) => ctx.progress.lessons[lesson.id]?.completed)),
  },
];

const KEY = "boersenschule:achievements";

export function loadUnlockedAchievements(): string[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUnlockedAchievements(ids: string[]): void {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export function resetAchievements(): void {
  saveUnlockedAchievements([]);
}

/** Prüft alle Achievements gegen den aktuellen Fortschritt und schaltet neue frei. Gibt die neu freigeschalteten zurück. */
export function evaluateAchievements(ctx: AchievementContext): Achievement[] {
  const unlocked = new Set(loadUnlockedAchievements());
  const newlyUnlocked: Achievement[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (unlocked.has(achievement.id)) continue;
    if (achievement.check(ctx)) {
      unlocked.add(achievement.id);
      newlyUnlocked.push(achievement);
    }
  }
  if (newlyUnlocked.length > 0) saveUnlockedAchievements([...unlocked]);
  return newlyUnlocked;
}
