import { LearningModule, PortfolioState, ProgressState } from "./types.js";
import { GamificationState, PERFECT_STREAK_MILESTONE } from "./gamification.js";
import { sectorsHeld, realizedProfitTotal } from "./portfolio.js";
import { MODULES } from "./content/index.js";

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

const moduleMasteryAchievements: Achievement[] = MODULES.flatMap((mod) => [
  {
    id: `modul-${mod.id}-abgeschlossen`,
    title: `${mod.title}: Abgeschlossen`,
    description: `Alle Lektionen im Modul „${mod.title}" abgeschlossen.`,
    icon: mod.icon,
    check: (ctx: AchievementContext) => mod.lessons.length > 0 && mod.lessons.every((lesson) => ctx.progress.lessons[lesson.id]?.completed),
  },
  {
    id: `modul-${mod.id}-perfekt`,
    title: `${mod.title}: Perfekt`,
    description: `Alle Quizzes im Modul „${mod.title}" mit 100 % abgeschlossen.`,
    icon: "diamond",
    check: (ctx: AchievementContext) =>
      mod.lessons.length > 0 &&
      mod.lessons.every((lesson) => {
        const entry = ctx.progress.lessons[lesson.id];
        // entry kann undefined sein (Lektion nie geöffnet) – `undefined?.x !== null` ist dann
        // fälschlich true, daher zuerst explizit auf Vorhandensein prüfen.
        return entry != null && entry.quizScore !== null && entry.quizTotal !== null && entry.quizScore === entry.quizTotal;
      }),
  },
]);

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "erste-lektion",
    title: "Erste Schritte",
    description: "Deine erste Lektion abgeschlossen.",
    icon: "menu_book",
    check: (ctx) => Object.values(ctx.progress.lessons).some((entry) => entry.completed),
  },
  {
    id: "perfektes-quiz",
    title: "Volltreffer",
    description: "Ein Quiz mit 100 % richtigen Antworten abgeschlossen.",
    icon: "verified",
    check: (ctx) =>
      Object.values(ctx.progress.lessons).some(
        (entry) => entry.quizScore !== null && entry.quizTotal !== null && entry.quizScore === entry.quizTotal
      ),
  },
  {
    id: "modul-komplett",
    title: "Modul gemeistert",
    description: "Ein komplettes Lernmodul abgeschlossen.",
    icon: "workspace_premium",
    check: (ctx) =>
      ctx.modules.some((mod) => mod.lessons.length > 0 && mod.lessons.every((lesson) => ctx.progress.lessons[lesson.id]?.completed)),
  },
  {
    id: "perfekte-serie",
    title: "Auf Serie",
    description: `${PERFECT_STREAK_MILESTONE} perfekte Quizzes in Folge.`,
    icon: "local_fire_department",
    check: (ctx) => (ctx.gamification?.perfectQuizStreak ?? 0) >= PERFECT_STREAK_MILESTONE,
  },
  {
    id: "fruehaufsteher",
    title: "Frühaufsteher",
    description: "Vor 7 Uhr morgens gelernt.",
    icon: "wb_twilight",
    check: () => new Date().getHours() < 7,
  },
  {
    id: "nachteule",
    title: "Nachteule",
    description: "Nach 23 Uhr noch gelernt.",
    icon: "bedtime",
    check: () => new Date().getHours() >= 23,
  },
  {
    id: "comeback",
    title: "Comeback",
    description: "Nach einer Pause die Lernserie neu gestartet.",
    icon: "restart_alt",
    check: (ctx) =>
      !!ctx.gamification && ctx.gamification.streak >= 2 && ctx.gamification.longestStreak > ctx.gamification.streak,
  },
  {
    id: "wissensdurst",
    title: "Wissensdurst",
    description: "5 Lektionen oder Quizzes an einem einzigen Tag abgeschlossen.",
    icon: "local_library",
    check: (ctx) => (ctx.gamification?.dailyGoalCount ?? 0) >= 5,
  },
  {
    id: "erster-trade",
    title: "Erster Trade",
    description: "Deine erste Order im Portfolio-Simulator ausgeführt.",
    icon: "swap_horiz",
    check: (ctx) => (ctx.portfolio?.transactions.length ?? 0) > 0,
  },
  {
    id: "diversifiziert",
    title: "Gut diversifiziert",
    description: "Positionen in mindestens 3 verschiedenen Branchen gehalten.",
    icon: "pie_chart",
    check: (ctx) => ctx.portfolio != null && sectorsHeld(ctx.portfolio) >= 3,
  },
  {
    id: "erster-gewinn",
    title: "Erster Gewinn",
    description: "Einen Trade mit realisiertem Gewinn abgeschlossen.",
    icon: "trending_up",
    check: (ctx) => ctx.portfolio != null && realizedProfitTotal(ctx.portfolio) > 0,
  },
  ...moduleMasteryAchievements,
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
