import { el, mount } from "../dom.js";
import { MODULES, totalLessonCount } from "../content/index.js";
import { loadProgress, resetProgress } from "../state.js";
import { loadPortfolio, STARTKAPITAL } from "../state.js";
import { portfolioValue } from "../portfolio.js";
import { formatCurrency, formatPercent } from "../util.js";
import { loadGamification, levelProgress, weekActivity, weekdayLabel, dailyGoalStatus, isStreakAtRisk } from "../gamification.js";
import { ACHIEVEMENTS, loadUnlockedAchievements, resetAchievements } from "../achievements.js";
import { dueCardCount, resetLeitner } from "../spacedrepetition.js";
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
    const weekDays = weekActivity(gamification);
    const weekRow = el("div", { class: "streak-week", "aria-label": "Lernaktivität der letzten 7 Tage" }, weekDays.map((day) => el("div", { class: `streak-day${day.active ? " active" : ""}${day.isToday ? " today" : ""}` }, [
        el("span", { class: "streak-day-label" }, [weekdayLabel(day.date)]),
        el("span", { class: "streak-day-dot" }, [day.active ? "🔥" : ""]),
    ])));
    const streakAtRisk = isStreakAtRisk(gamification);
    const streakWarning = streakAtRisk
        ? el("p", { class: "streak-warning" }, [
            `⚠️ Deine ${gamification.streak}-Tage-Streak läuft heute noch aus – schließe eine Lektion oder ein Quiz ab, um sie zu retten!`,
        ])
        : null;
    const goal = dailyGoalStatus(gamification);
    const goalRow = el("div", { class: `daily-goal${goal.goalMet ? " met" : ""}` }, [
        el("span", {}, [goal.goalMet ? "✅ Tagesziel erreicht" : `🎯 Tagesziel: ${goal.count} / ${goal.goal} Aktionen heute`]),
        el("div", { class: "progress-bar daily-goal-bar" }, [
            el("span", { style: `width:${Math.min(100, Math.round((goal.count / goal.goal) * 100))}%` }, []),
        ]),
    ]);
    const dueCount = dueCardCount();
    const reviewRow = dueCount > 0
        ? el("a", { class: "achievements-row review-row", href: "#/wiederholung" }, [
            el("span", {}, [`🔁 ${dueCount} Frage${dueCount === 1 ? "" : "n"} zur Wiederholung fällig →`]),
        ])
        : el("p", { class: "muted review-row" }, ["🔁 Keine Wiederholungen fällig – beantworte weitere Quizzes, damit hier Karteikarten entstehen."]);
    const unlockedIds = new Set(loadUnlockedAchievements());
    const achievementIcons = ACHIEVEMENTS.map((a) => el("span", { class: `achievement-icon${unlockedIds.has(a.id) ? " unlocked" : ""}`, title: unlockedIds.has(a.id) ? `${a.title}: ${a.description}` : "Noch nicht freigeschaltet" }, [a.icon]));
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
    const recordsCard = gamification.longestStreak > 0 || gamification.bestDayXp > 0
        ? el("div", { class: "card stat-row records-card" }, [
            el("div", { class: "stat" }, [
                el("div", { class: "label" }, ["Längste Streak"]),
                el("div", { class: "value" }, [`🔥 ${gamification.longestStreak} Tag${gamification.longestStreak === 1 ? "" : "e"}`]),
            ]),
            el("div", { class: "stat" }, [
                el("div", { class: "label" }, ["Meiste XP an einem Tag"]),
                el("div", { class: "value" }, [`⚡ ${gamification.bestDayXp} XP`]),
            ]),
        ])
        : null;
    const resetProgressBtn = el("button", { class: "btn secondary" }, ["Lernfortschritt zurücksetzen"]);
    resetProgressBtn.addEventListener("click", () => {
        if (confirm("Gesamten Lernfortschritt zurücksetzen? Alle als gelesen markierten Lektionen und Quiz-Ergebnisse gehen verloren.")) {
            resetProgress();
            resetAchievements();
            resetLeitner();
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
            weekRow,
            streakWarning,
            goalRow,
            reviewRow,
            el("a", { class: "achievements-row", href: "#/erfolge" }, [
                el("span", { class: "muted" }, [`Erfolge: ${unlockedIds.size} / ${ACHIEVEMENTS.length} →`]),
                el("div", { class: "achievement-icons" }, achievementIcons),
            ]),
            el("div", { class: "label" }, [`Dein Lernfortschritt: ${completedLessons} von ${totalLessons} Lektionen (${overallPct} %)`]),
            el("div", { class: "progress-bar" }, [el("span", { style: `width:${overallPct}%` }, [])]),
            completedLessons > 0 ? resetProgressBtn : null,
        ]),
        recordsCard ? el("h2", {}, ["Deine Rekorde"]) : null,
        recordsCard,
        el("div", { class: "grid" }, moduleCards),
        el("h2", {}, ["Übungswerkzeuge"]),
        el("div", { class: "grid" }, [
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
            el("a", { class: "card module-card", href: "#/chart-analyse" }, [
                el("div", { class: "icon" }, ["📊"]),
                el("h3", {}, ["Chart-Analyzer"]),
                el("p", { class: "muted" }, [
                    "Kursverläufe Kerze für Kerze abspielen, Linien einzeichnen, SMA/RSI beobachten und an Entscheidungspunkten deine Einschätzung testen.",
                ]),
            ]),
            el("a", { class: "card module-card", href: "#/news-simulator" }, [
                el("div", { class: "icon" }, ["📰"]),
                el("h3", {}, ["Event-Trading-Simulator"]),
                el("p", { class: "muted" }, [
                    "Simulierte Eilmeldungen, 30 Sekunden Reaktionszeit: Kaufen, Verkaufen oder Halten – und verstehen, warum der Markt so reagiert.",
                ]),
            ]),
        ]),
    ]);
}
