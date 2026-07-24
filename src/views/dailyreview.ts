import { el } from "../dom.js";
import { MODULES, lessonById, moduleById } from "../content/index.js";
import { loadProgress } from "../state.js";
import { dueCards, recordCardResult } from "../spacedrepetition.js";
import {
  awardXp,
  XP_REVIEW_CORRECT,
  levelForXp,
  loadGamification,
  registerDailyGoalProgress,
  XP_DAILY_GOAL_BONUS,
} from "../gamification.js";
import { evaluateAchievements } from "../achievements.js";
import { showToast } from "../toast.js";
import { burstConfetti } from "../confetti.js";
import { ModuleId, QuizQuestion } from "../types.js";

interface ReviewItem {
  cardId: string;
  moduleId: ModuleId;
  lessonId: string;
  moduleTitle: string;
  lessonTitle: string;
  question: QuizQuestion;
}

export function renderDailyReview(): HTMLElement {
  const items: ReviewItem[] = dueCards(3)
    .map((card) => {
      const mod = moduleById(card.moduleId);
      const lesson = lessonById(card.moduleId, card.lessonId);
      const question = lesson?.quiz[card.questionIndex];
      if (!mod || !lesson || !question) return null;
      return { cardId: card.id, moduleId: mod.id, lessonId: lesson.id, moduleTitle: mod.title, lessonTitle: lesson.title, question };
    })
    .filter((item): item is ReviewItem => item !== null);

  const breadcrumb = el("div", { class: "breadcrumb" }, [el("a", { href: "#/" }, ["Übersicht"]), " / ", "Tägliche Wiederholung"]);

  if (items.length === 0) {
    return el("div", {}, [
      breadcrumb,
      el("h1", {}, ["🔁 Tägliche Wiederholung"]),
      el("div", { class: "empty-state" }, [
        "Aktuell sind keine Fragen zur Wiederholung fällig. Beantworte weitere Quizzes, damit hier Karteikarten entstehen.",
        el("p", {}, [el("a", { href: "#/" }, ["Zurück zur Übersicht"])]),
      ]),
    ]);
  }

  const selected: (number | null)[] = items.map(() => null);
  const optionRefs: HTMLButtonElement[][] = [];
  let evaluated = false;
  const resultBox = el("div", {});
  const hint = el("div", { class: "quiz-hint" }, []);

  const questionBlocks = items.map((item, qi) => {
    const optionEls: HTMLButtonElement[] = [];
    const explanation = el("div", { class: "quiz-explanation" }, [item.question.explanation]);
    const options = item.question.options.map((opt, oi) => {
      const optEl = el(
        "button",
        { type: "button", class: "quiz-option", "aria-pressed": "false" },
        [`${String.fromCharCode(65 + oi)}. ${opt.text}`]
      ) as HTMLButtonElement;
      optEl.addEventListener("click", () => {
        if (evaluated) return;
        selected[qi] = oi;
        optionRefs[qi].forEach((node, i) => {
          node.classList.toggle("selected", i === oi);
          node.setAttribute("aria-pressed", String(i === oi));
          node.style.borderColor = i === oi ? "var(--accent)" : "";
        });
      });
      optionEls.push(optEl);
      return optEl;
    });
    optionRefs.push(optionEls);

    return el("div", { class: "quiz-question", role: "group", "aria-label": item.question.question }, [
      el("div", { class: "muted" }, [`${item.moduleTitle} · ${item.lessonTitle}`]),
      el("div", { class: "question-text" }, [`${qi + 1}. ${item.question.question}`]),
      ...options,
      explanation,
    ]);
  });

  const evaluateBtn = el("button", { class: "btn" }, ["Auswerten"]);
  evaluateBtn.addEventListener("click", () => {
    if (evaluated) return;
    const firstUnanswered = selected.findIndex((s) => s === null);
    if (firstUnanswered !== -1) {
      hint.textContent = `Bitte beantworte zuerst alle Fragen (noch offen: Frage ${firstUnanswered + 1}).`;
      questionBlocks[firstUnanswered]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    hint.textContent = "";
    evaluated = true;

    let score = 0;
    items.forEach((item, qi) => {
      const correctIndex = item.question.options.findIndex((o) => o.correct);
      const chosenIndex = selected[qi];
      const correct = chosenIndex === correctIndex;
      if (correct) score++;
      recordCardResult(item.cardId, correct);
      optionRefs[qi].forEach((node, oi) => {
        node.style.borderColor = "";
        node.setAttribute("aria-disabled", "true");
        if (oi === correctIndex) node.classList.add("correct");
        else if (oi === chosenIndex) node.classList.add("incorrect");
      });
      questionBlocks[qi].querySelector(".quiz-explanation")?.classList.add("show");
    });

    if (score > 0) {
      const perfect = score === items.length;
      if (perfect) burstConfetti();
      const result = awardXp(score * XP_REVIEW_CORRECT);
      if (result.leveledUp) {
        const info = levelForXp(result.state.xp);
        showToast(`🎉 Level ${info.level} erreicht: ${info.title}!`, "level");
        burstConfetti();
      }
    }
    const goal = registerDailyGoalProgress();
    if (goal.justCompleted) {
      const bonusResult = awardXp(XP_DAILY_GOAL_BONUS);
      showToast(`✅ Tagesziel erreicht! +${XP_DAILY_GOAL_BONUS} Bonus-XP`, "level");
      if (bonusResult.leveledUp) {
        const info = levelForXp(bonusResult.state.xp);
        showToast(`🎉 Level ${info.level} erreicht: ${info.title}!`, "level");
        burstConfetti();
      }
    }
    evaluateAchievements({ progress: loadProgress(), modules: MODULES, gamification: loadGamification() }).forEach((a) =>
      showToast(`🏆 Erfolg freigeschaltet: ${a.icon} ${a.title}`, "achievement")
    );

    evaluateBtn.setAttribute("disabled", "true");
    resultBox.replaceChildren(
      el("p", { class: "quiz-score" }, [`Ergebnis: ${score} von ${items.length} richtig`]),
      el("div", { class: "actions" }, [el("a", { class: "btn", href: "#/" }, ["Zurück zur Übersicht"])])
    );
  });

  return el("div", {}, [
    breadcrumb,
    el("h1", {}, ["🔁 Tägliche Wiederholung"]),
    el("p", { class: "muted" }, [
      "Diese Fragen sind laut Karteikastensystem fällig – richtig beantwortete Karten wandern in ein längeres Wiederholungsintervall, falsch beantwortete kommen sofort zurück auf die erste Stufe.",
    ]),
    el("div", { class: "card" }, [...questionBlocks, evaluateBtn, hint]),
    resultBox,
  ]);
}
