import { el, html } from "../dom.js";
import { MODULES, lessonById, moduleById } from "../content/index.js";
import { loadProgress, markLessonRead } from "../state.js";
import { awardXp, XP_LESSON, levelForXp, loadGamification, registerDailyGoalProgress, XP_DAILY_GOAL_BONUS } from "../gamification.js";
import { evaluateAchievements } from "../achievements.js";
import { showToast } from "../toast.js";
import { burstConfetti } from "../confetti.js";

export function renderLesson(moduleId: string, lessonId: string): HTMLElement {
  const mod = moduleById(moduleId);
  const lesson = lessonById(moduleId, lessonId);
  if (!mod || !lesson) {
    return el("div", { class: "empty-state" }, ["Lektion nicht gefunden.", el("p", {}, [el("a", { href: "#/" }, ["Zurück zur Übersicht"])])]);
  }

  const alreadyCompleted = loadProgress().lessons[lesson.id]?.completed ?? false;
  markLessonRead(lesson.id);
  if (!alreadyCompleted) {
    const result = awardXp(XP_LESSON);
    if (result.leveledUp) {
      const info = levelForXp(result.state.xp);
      showToast(`Level ${info.level} erreicht: ${info.title}!`, "level", "celebration");
      burstConfetti();
    }
    const goal = registerDailyGoalProgress();
    if (goal.justCompleted) {
      const bonusResult = awardXp(XP_DAILY_GOAL_BONUS);
      showToast(`Tagesziel erreicht! +${XP_DAILY_GOAL_BONUS} Bonus-XP`, "level", "check_circle");
      if (bonusResult.leveledUp) {
        const info = levelForXp(bonusResult.state.xp);
        showToast(`Level ${info.level} erreicht: ${info.title}!`, "level", "celebration");
        burstConfetti();
      }
    }
  }
  evaluateAchievements({ progress: loadProgress(), modules: MODULES, gamification: loadGamification() }).forEach((a) =>
    showToast(`Erfolg freigeschaltet: ${a.title}`, "achievement", a.icon)
  );

  const paragraphs = lesson.content.map((p) => html(`<p>${p}</p>`));
  const index = mod.lessons.findIndex((l) => l.id === lesson.id);
  const next = mod.lessons[index + 1];

  return el("div", {}, [
    el("div", { class: "breadcrumb" }, [
      el("a", { href: "#/" }, ["Übersicht"]),
      " / ",
      el("a", { href: `#/modul/${mod.id}` }, [mod.title]),
    ]),
    el("h1", {}, [lesson.title]),
    el("p", { class: "muted" }, [lesson.summary]),
    el("div", { class: "card lesson-content" }, paragraphs),
    el("div", { class: "actions" }, [
      el("a", { class: "btn", href: `#/quiz/${mod.id}/${lesson.id}` }, ["Zum Quiz →"]),
      next ? el("a", { class: "btn secondary", href: `#/lektion/${mod.id}/${next.id}` }, ["Nächste Lektion"]) : null,
      el("a", { class: "btn secondary", href: `#/modul/${mod.id}` }, ["Zurück zur Modulübersicht"]),
    ]),
  ]);
}
