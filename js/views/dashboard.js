import { el, mount } from "../dom.js";
import { MODULES, totalLessonCount } from "../content/index.js";
import { loadProgress, resetProgress } from "../state.js";
import { loadPortfolio, STARTKAPITAL } from "../state.js";
import { portfolioValue } from "../portfolio.js";
import { formatCurrency, formatPercent } from "../util.js";
import { loadGamification, levelProgress } from "../gamification.js";
export function renderDashboard() {
    const progress = loadProgress();
    const portfolio = loadPortfolio();
    const value = portfolioValue(portfolio);
    const totalReturn = (value - STARTKAPITAL) / STARTKAPITAL;
    const gamification = loadGamification();
    const levelInfo = levelProgress(gamification.xp);
    const levelSubtitle = levelInfo.maxLevel
        ? "Maximallevel erreicht"
        : `${levelInfo.xpIntoLevel} / ${levelInfo.xpForLevel} XP · noch ${(levelInfo.xpForLevel ?? 0) - levelInfo.xpIntoLevel} XP bis Level ${levelInfo.level + 1}`;
    const totalLessons = totalLessonCount();
    const completedLessons = MODULES.reduce((sum, m) => sum + m.lessons.filter((l) => progress.lessons[l.id]?.completed).length, 0);
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
    const resetProgressBtn = el("button", { class: "btn secondary" }, ["Lernfortschritt zurücksetzen"]);
    resetProgressBtn.addEventListener("click", () => {
        if (confirm("Gesamten Lernfortschritt zurücksetzen? Alle als gelesen markierten Lektionen und Quiz-Ergebnisse gehen verloren.")) {
            resetProgress();
            const appRoot = document.getElementById("app");
            if (appRoot)
                mount(appRoot, renderDashboard());
        }
    });
    return el("div", {}, [
        el("h1", {}, ["Willkommen in der Börsenschule"]),
        el("p", { class: "muted" }, [
            "Lerne die Grundlagen des Aktien-Investments, Fundamentalanalyse und technische Analyse — und probiere dein Wissen risikofrei im Portfolio-Simulator aus.",
        ]),
        el("div", { class: "card overall-progress" }, [
            el("div", { class: "level-row" }, [
                el("span", { class: "level-chip" }, [`Level ${levelInfo.level} · ${levelInfo.title}`]),
                gamification.streak > 0
                    ? el("span", { class: "streak-chip" }, [`🔥 ${gamification.streak} Tag${gamification.streak === 1 ? "" : "e"} Streak`])
                    : null,
                el("span", { class: "muted" }, [`${gamification.xp} XP gesamt`]),
            ]),
            el("div", { class: "progress-bar level-progress" }, [el("span", { style: `width:${levelInfo.pct}%` }, [])]),
            el("p", { class: "muted level-subtitle" }, [levelSubtitle]),
            el("div", { class: "label" }, [`Dein Lernfortschritt: ${completedLessons} von ${totalLessons} Lektionen (${overallPct} %)`]),
            el("div", { class: "progress-bar" }, [el("span", { style: `width:${overallPct}%` }, [])]),
            completedLessons > 0 ? resetProgressBtn : null,
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
