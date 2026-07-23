import { LearningModule, PortfolioState, ProgressState } from "./types.js";
import { GamificationState, PERFECT_STREAK_MILESTONE } from "./gamification.js";
import { sectorsHeld, realizedProfitTotal } from "./portfolio.js";

export interface AchievementContext {
  progress: ProgressState;
  modules: LearningModule[];
  gamification?: GamificationState;
  portfolio?: PortfolioState;
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
  {
    id: "perfekte-serie",
    title: "Auf Serie",
    description: `${PERFECT_STREAK_MILESTONE} perfekte Quizzes in Folge.`,
    icon: "🔥",
    check: (ctx) => (ctx.gamification?.perfectQuizStreak ?? 0) >= PERFECT_STREAK_MILESTONE,
  },
  {
    id: "erster-trade",
    title: "Erster Trade",
    description: "Deine erste Order im Portfolio-Simulator ausgeführt.",
    icon: "💱",
    check: (ctx) => (ctx.portfolio?.transactions.length ?? 0) > 0,
  },
  {
    id: "diversifiziert",
    title: "Gut diversifiziert",
    description: "Positionen in mindestens 3 verschiedenen Branchen gehalten.",
    icon: "🧺",
    check: (ctx) => ctx.portfolio != null && sectorsHeld(ctx.portfolio) >= 3,
  },
  {
    id: "erster-gewinn",
    title: "Erster Gewinn",
    description: "Einen Trade mit realisiertem Gewinn abgeschlossen.",
    icon: "💰",
    check: (ctx) => ctx.portfolio != null && realizedProfitTotal(ctx.portfolio) > 0,
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
