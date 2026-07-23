import { el } from "../dom.js";
import { MODULES, totalLessonCount } from "../content/index.js";
import { loadProgress } from "../state.js";
import { loadPortfolio, STARTKAPITAL } from "../state.js";
import { portfolioValue } from "../portfolio.js";
import { formatCurrency, formatPercent } from "../util.js";

export function renderDashboard(): HTMLElement {
  const progress = loadProgress();
  const portfolio = loadPortfolio();
  const value = portfolioValue(portfolio);
  const totalReturn = (value - STARTKAPITAL) / STARTKAPITAL;

  const totalLessons = totalLessonCount();
  const completedLessons = MODULES.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress.lessons[l.id]?.completed).length,
    0
  );
  const overallPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const moduleCards = MODULES.map((mod) => {
    const done = mod.lessons.filter((l) => progress.lessons[l.id]?.completed).length;
    const pct = mod.lessons.length ? Math.round((done / mod.lessons.length) * 100) : 0;
    return el("a", { class: "module-card", href: `#/modul/${mod.id}` }, [
      el("div", { class: "icon" }, [mod.icon]),
      el("h3", {}, [mod.title]),
      el("p", { class: "muted" }, [mod.description]),
      el("div", { class: "progress-bar" }, [el("span", { style: `width:${pct}%` }, [])]),
      el("p", { class: "muted" }, [`${done} / ${mod.lessons.length} Lektionen abgeschlossen`]),
    ]);
  });

  return el("div", {}, [
    el("h1", {}, ["Willkommen in der Börsenschule"]),
    el("p", { class: "muted" }, [
      "Lerne die Grundlagen des Aktien-Investments, Fundamentalanalyse und technische Analyse — und probiere dein Wissen risikofrei im Portfolio-Simulator aus.",
    ]),
    el("div", { class: "card overall-progress" }, [
      el("div", { class: "label" }, [`Dein Lernfortschritt: ${completedLessons} von ${totalLessons} Lektionen (${overallPct} %)`]),
      el("div", { class: "progress-bar" }, [el("span", { style: `width:${overallPct}%` }, [])]),
    ]),
    el("div", { class: "grid" }, moduleCards),
    el("h2", {}, ["Portfolio-Simulator"]),
    el("a", { class: "card module-card", href: "#/portfolio" }, [
      el("div", { class: "icon" }, ["💼"]),
      el("h3", {}, ["Dein virtuelles Depot"]),
      el("div", { class: "stat-row" }, [
        el("div", { class: "stat" }, [
          el("div", { class: "label" }, ["Depotwert"]),
          el("div", { class: "value" }, [formatCurrency(value)]),
        ]),
        el("div", { class: "stat" }, [
          el("div", { class: "label" }, ["Gesamtrendite"]),
          el("div", { class: `value ${totalReturn >= 0 ? "pos" : "neg"}` }, [formatPercent(totalReturn)]),
        ]),
        el("div", { class: "stat" }, [
          el("div", { class: "label" }, ["Handelstag"]),
          el("div", { class: "value" }, [String(portfolio.day)]),
        ]),
      ]),
    ]),
  ]);
}
