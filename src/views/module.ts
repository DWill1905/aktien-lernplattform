import { el } from "../dom.js";
import { moduleById } from "../content/index.js";
import { loadProgress } from "../state.js";

export function renderModule(moduleId: string): HTMLElement {
  const mod = moduleById(moduleId);
  if (!mod) {
    return el("div", { class: "empty-state" }, ["Modul nicht gefunden.", el("p", {}, [el("a", { href: "#/" }, ["Zurück zur Übersicht"])])]);
  }
  const progress = loadProgress();

  const items = mod.lessons.map((lesson) => {
    const entry = progress.lessons[lesson.id];
    const badge = entry?.completed
      ? el("span", { class: "badge done" }, [
          entry.quizScore !== null && entry.quizTotal !== null ? `✓ Quiz ${entry.quizScore}/${entry.quizTotal}` : "✓ gelesen",
        ])
      : el("span", { class: "badge" }, ["offen"]);
    return el("li", {}, [
      el("a", { href: `#/lektion/${mod.id}/${lesson.id}` }, [lesson.title]),
      badge,
    ]);
  });

  return el("div", {}, [
    el("div", { class: "breadcrumb" }, [el("a", { href: "#/" }, ["Übersicht"]), " / ", mod.title]),
    el("h1", {}, [`${mod.icon} ${mod.title}`]),
    el("p", { class: "muted" }, [mod.description]),
    el("ul", { class: "lesson-list" }, items),
  ]);
}
