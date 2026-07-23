import { el } from "../dom.js";
import { MODULES, lessonById, moduleById } from "../content/index.js";
import { loadProgress, recordQuizResult } from "../state.js";
import { awardXp, XP_QUIZ_CORRECT, XP_QUIZ_PERFECT_BONUS, levelForXp, loadGamification, registerQuizAttempt } from "../gamification.js";
import { evaluateAchievements } from "../achievements.js";
import { showToast } from "../toast.js";

export function renderQuiz(moduleId: string, lessonId: string): HTMLElement {
  const mod = moduleById(moduleId);
  const lesson = lessonById(moduleId, lessonId);
  if (!mod || !lesson) {
    return el("div", { class: "empty-state" }, ["Quiz nicht gefunden.", el("p", {}, [el("a", { href: "#/" }, ["Zurück zur Übersicht"])])]);
  }

  const selected: (number | null)[] = lesson.quiz.map(() => null);
  const optionRefs: HTMLButtonElement[][] = [];
  let evaluated = false;

  const container = el("div", {});
  const resultBox = el("div", {});

  const questionBlocks = lesson.quiz.map((q, qi) => {
    const optionEls: HTMLButtonElement[] = [];
    const explanation = el("div", { class: "quiz-explanation" }, [q.explanation]);

    const options = q.options.map((opt, oi) => {
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

    return el("div", { class: "quiz-question", role: "group", "aria-label": q.question }, [
      el("div", { class: "question-text" }, [`${qi + 1}. ${q.question}`]),
      ...options,
      explanation,
    ]);
  });

  const hint = el("div", { class: "quiz-hint" }, []);
  const evaluateBtn = el("button", { class: "btn" }, ["Auswerten"]);

  function reset(): void {
    evaluated = false;
    selected.fill(null);
    optionRefs.forEach((nodes) =>
      nodes.forEach((node) => {
        node.style.borderColor = "";
        node.classList.remove("selected", "correct", "incorrect");
        node.setAttribute("aria-pressed", "false");
        node.removeAttribute("aria-disabled");
      })
    );
    questionBlocks.forEach((block) => block.querySelector(".quiz-explanation")?.classList.remove("show"));
    hint.textContent = "";
    resultBox.replaceChildren();
    evaluateBtn.removeAttribute("disabled");
    questionBlocks[0]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  evaluateBtn.addEventListener("click", () => {
    if (evaluated) return;

    const firstUnanswered = selected.findIndex((s) => s === null);
    if (firstUnanswered !== -1) {
      hint.textContent = `Bitte beantworte zuerst alle Fragen (noch offen: Frage ${firstUnanswered + 1}).`;
      questionBlocks[firstUnanswered]?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    hint.textContent = "";

    const firstAttempt = loadProgress().lessons[lesson.id]?.quizTotal == null;

    evaluated = true;
    let score = 0;
    lesson.quiz.forEach((q, qi) => {
      const correctIndex = q.options.findIndex((o) => o.correct);
      const chosenIndex = selected[qi];
      if (chosenIndex === correctIndex) score++;
      optionRefs[qi].forEach((node, oi) => {
        node.style.borderColor = "";
        node.setAttribute("aria-disabled", "true");
        if (oi === correctIndex) node.classList.add("correct");
        else if (oi === chosenIndex) node.classList.add("incorrect");
      });
      const explanationEl = questionBlocks[qi].querySelector(".quiz-explanation");
      explanationEl?.classList.add("show");
    });
    recordQuizResult(lesson.id, score, lesson.quiz.length);
    if (firstAttempt) {
      const perfect = score === lesson.quiz.length;
      const result = awardXp(score * XP_QUIZ_CORRECT + (perfect ? XP_QUIZ_PERFECT_BONUS : 0));
      if (result.leveledUp) {
        const info = levelForXp(result.state.xp);
        showToast(`🎉 Level ${info.level} erreicht: ${info.title}!`, "level");
      }
      const streakResult = registerQuizAttempt(perfect);
      if (streakResult.bonusXp > 0) {
        const bonusResult = awardXp(streakResult.bonusXp);
        showToast(`🔥 ${streakResult.streak} perfekte Quizzes in Folge! +${streakResult.bonusXp} Bonus-XP`, "level");
        if (bonusResult.leveledUp) {
          const info = levelForXp(bonusResult.state.xp);
          showToast(`🎉 Level ${info.level} erreicht: ${info.title}!`, "level");
        }
      }
    }
    evaluateAchievements({ progress: loadProgress(), modules: MODULES, gamification: loadGamification() }).forEach((a) =>
      showToast(`🏆 Erfolg freigeschaltet: ${a.icon} ${a.title}`, "achievement")
    );
    evaluateBtn.setAttribute("disabled", "true");

    const index = mod.lessons.findIndex((l) => l.id === lesson.id);
    const next = mod.lessons[index + 1];
    const retryBtn = el("button", { class: "btn secondary" }, ["Erneut versuchen"]) as HTMLButtonElement;
    retryBtn.addEventListener("click", reset);
    resultBox.replaceChildren(
      el("p", { class: "quiz-score" }, [`Ergebnis: ${score} von ${lesson.quiz.length} richtig`]),
      el("div", { class: "actions" }, [
        next ? el("a", { class: "btn", href: `#/lektion/${mod.id}/${next.id}` }, ["Nächste Lektion →"]) : null,
        el("a", { class: "btn secondary", href: `#/modul/${mod.id}` }, ["Zurück zur Modulübersicht"]),
        retryBtn,
      ])
    );
  });

  container.append(
    el("div", { class: "breadcrumb" }, [
      el("a", { href: "#/" }, ["Übersicht"]),
      " / ",
      el("a", { href: `#/modul/${mod.id}` }, [mod.title]),
      " / ",
      el("a", { href: `#/lektion/${mod.id}/${lesson.id}` }, [lesson.title]),
    ]),
    el("h1", {}, [`Quiz: ${lesson.title}`]),
    el("div", { class: "card" }, [...questionBlocks, evaluateBtn, hint]),
    resultBox
  );

  return container;
}
