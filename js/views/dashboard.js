import { el, mount } from "../dom.js";
import { MODULES, totalLessonCount } from "../content/index.js";
import { loadProgress, resetProgress } from "../state.js";
import { loadPortfolio, STARTKAPITAL } from "../state.js";
import { portfolioValue } from "../portfolio.js";
import { formatCurrency, formatPercent } from "../util.js";
import { loadGamification, levelProgress, weekActivity, weekdayLabel, dailyGoalStatus, isStreakAtRisk } from "../gamification.js";
import { ACHIEVEMENTS, loadUnlockedAchievements, resetAchievements } from "../achievements.js";
import { dueCardCount, resetLeitner } from "../spacedrepetition.js";
import { symbol } from "../shell.js";
import { confirmDestructiveAction } from "../modal.js";
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
        el("span", { class: "streak-day-dot" }, [day.active ? symbol("local_fire_department", true) : ""]),
    ])));
    const streakAtRisk = isStreakAtRisk(gamification);
    const streakWarning = streakAtRisk
        ? el("p", { class: "streak-warning" }, [
            symbol("warning", true),
            `Deine ${gamification.streak}-Tage-Streak läuft heute noch aus – schließe eine Lektion oder ein Quiz ab, um sie zu retten!`,
        ])
        : null;
    const goal = dailyGoalStatus(gamification);
    const goalRow = el("div", { class: `daily-goal${goal.goalMet ? " met" : ""}` }, [
        el("span", { class: "with-icon" }, [
            symbol(goal.goalMet ? "check_circle" : "flag", true),
            goal.goalMet ? "Tagesziel erreicht" : `Tagesziel: ${goal.count} / ${goal.goal} Aktionen heute`,
        ]),
        el("div", { class: "progress-bar daily-goal-bar" }, [
            el("span", { style: `width:${Math.min(100, Math.round((goal.count / goal.goal) * 100))}%` }, []),
        ]),
    ]);
    const dueCount = dueCardCount();
    let nextLesson = null;
    for (const mod of MODULES) {
        const lesson = mod.lessons.find((l) => !progress.lessons[l.id]?.completed);
        if (lesson) {
            nextLesson = { moduleId: mod.id, lessonId: lesson.id };
            break;
        }
    }
    const reviewRow = dueCount > 0
        ? el("a", { class: "achievements-row review-row", href: "#/wiederholung" }, [
            el("span", { class: "with-icon" }, [symbol("history"), `${dueCount} Frage${dueCount === 1 ? "" : "n"} zur Wiederholung fällig →`]),
        ])
        : el("div", { class: "review-row review-empty" }, [
            el("p", { class: "muted with-icon" }, [symbol("history"), "Keine Wiederholungen fällig – beantworte weitere Quizzes, damit hier Karteikarten entstehen."]),
            nextLesson
                ? el("a", { class: "btn secondary btn-inline", href: `#/quiz/${nextLesson.moduleId}/${nextLesson.lessonId}` }, ["Nächstes Quiz starten →"])
                : null,
        ]);
    const unlockedIds = new Set(loadUnlockedAchievements());
    const achievementIcons = ACHIEVEMENTS.map((a) => el("span", { class: `achievement-icon${unlockedIds.has(a.id) ? " unlocked" : ""}`, title: unlockedIds.has(a.id) ? `${a.title}: ${a.description}` : "Noch nicht freigeschaltet" }, [symbol(a.icon, unlockedIds.has(a.id))]));
    const totalLessons = totalLessonCount();
    const completedLessons = MODULES.reduce((sum, m) => sum + m.lessons.filter((l) => progress.lessons[l.id]?.completed).length, 0);
    const overallPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const moduleCards = MODULES.map((mod) => {
        const done = mod.lessons.filter((l) => progress.lessons[l.id]?.completed).length;
        const pct = mod.lessons.length ? Math.round((done / mod.lessons.length) * 100) : 0;
        const ctaLabel = done === 0 ? "Jetzt starten →" : done < mod.lessons.length ? "Fortsetzen →" : "Abgeschlossen · Wiederholen";
        return el("a", { class: "module-card", href: `#/modul/${mod.id}` }, [
            el("div", { class: "icon" }, [symbol(mod.icon)]),
            el("h3", {}, [mod.title]),
            el("p", { class: "muted" }, [mod.description]),
            el("div", { class: "progress-bar" }, [el("span", { style: `width:${pct}%` }, [])]),
            el("p", { class: "muted" }, [`${done} / ${mod.lessons.length} Lektionen abgeschlossen`]),
            el("span", { class: `module-cta${done === mod.lessons.length ? " done" : ""}` }, [ctaLabel]),
        ]);
    });
    const recordsCard = gamification.longestStreak > 0 || gamification.bestDayXp > 0
        ? el("div", { class: "card stat-row records-card" }, [
            el("div", { class: "stat" }, [
                el("div", { class: "label" }, ["Längste Streak"]),
                el("div", { class: "value with-icon" }, [symbol("local_fire_department", true), `${gamification.longestStreak} Tag${gamification.longestStreak === 1 ? "" : "e"}`]),
            ]),
            el("div", { class: "stat" }, [
                el("div", { class: "label" }, ["Meiste XP an einem Tag"]),
                el("div", { class: "value with-icon" }, [symbol("bolt", true), `${gamification.bestDayXp} XP`]),
            ]),
        ])
        : null;
    const resetProgressBtn = el("button", { class: "btn-ghost-danger" }, ["Lernfortschritt zurücksetzen"]);
    resetProgressBtn.addEventListener("click", () => {
        confirmDestructiveAction({
            title: "Lernfortschritt zurücksetzen?",
            message: "Alle als gelesen markierten Lektionen, Quiz-Ergebnisse, Erfolge und Wiederholungs-Karteikarten gehen unwiderruflich verloren.",
            confirmWord: "ZURÜCKSETZEN",
            confirmLabel: "Endgültig zurücksetzen",
            onConfirm: () => {
                resetProgress();
                resetAchievements();
                resetLeitner();
                const appRoot = document.getElementById("app");
                if (appRoot)
                    mount(appRoot, renderDashboard());
            },
        });
    });
    return el("div", {}, [
        el("h1", {}, ["Willkommen in der Börsenschule"]),
        el("p", { class: "muted" }, [
            "Lerne die Grundlagen des Aktien-Investments, Fundamentalanalyse und technische Analyse — und probiere dein Wissen risikofrei im Portfolio-Simulator aus.",
        ]),
        el("div", { class: "card overall-progress" }, [
            el("div", { class: "label primary-label" }, [`Dein Lernfortschritt: ${completedLessons} von ${totalLessons} Lektionen (${overallPct} %)`]),
            el("div", { class: "progress-bar primary-progress" }, [el("span", { style: `width:${overallPct}%` }, [])]),
            streakWarning,
            el("div", { class: "gamification-panel" }, [
                el("div", { class: "level-row" }, [
                    el("span", { class: "level-chip" }, [`Level ${levelInfo.level} · ${levelInfo.title}`]),
                    gamification.streak > 0
                        ? el("span", { class: "streak-chip with-icon" }, [symbol("local_fire_department", true), `${gamification.streak} Tag${gamification.streak === 1 ? "" : "e"} Streak`])
                        : null,
                    el("span", { class: "muted" }, [`${gamification.xp} XP gesamt`]),
                ]),
                el("div", { class: "progress-bar level-progress" }, [el("span", { style: `width:${levelInfo.pct}%` }, [])]),
                el("p", { class: "muted level-subtitle" }, [levelSubtitle]),
                weekRow,
                goalRow,
                reviewRow,
                el("a", { class: "achievements-row", href: "#/erfolge" }, [
                    el("span", { class: "muted" }, [`Erfolge: ${unlockedIds.size} / ${ACHIEVEMENTS.length} →`]),
                    el("div", { class: "achievement-icons" }, achievementIcons),
                ]),
            ]),
        ]),
        recordsCard ? el("h2", {}, ["Deine Rekorde"]) : null,
        recordsCard,
        el("div", { class: "grid" }, moduleCards),
        el("h2", {}, ["Übungswerkzeuge"]),
        el("div", { class: "grid" }, [
            el("a", { class: "card module-card", href: "#/portfolio" }, [
                el("div", { class: "icon" }, [symbol("account_balance_wallet")]),
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
                el("div", { class: "icon" }, [symbol("candlestick_chart")]),
                el("h3", {}, ["Chart-Analyzer"]),
                el("p", { class: "muted" }, [
                    "Kursverläufe Kerze für Kerze abspielen, Linien einzeichnen, SMA/RSI beobachten und an Entscheidungspunkten deine Einschätzung testen.",
                ]),
            ]),
            el("a", { class: "card module-card", href: "#/news-simulator" }, [
                el("div", { class: "icon" }, [symbol("bolt")]),
                el("h3", {}, ["Event-Trading-Simulator"]),
                el("p", { class: "muted" }, [
                    "Simulierte Eilmeldungen, 30 Sekunden Reaktionszeit: Kaufen, Verkaufen oder Halten – und verstehen, warum der Markt so reagiert.",
                ]),
            ]),
            el("a", { class: "card module-card", href: "#/checkliste" }, [
                el("div", { class: "icon" }, [symbol("checklist")]),
                el("h3", {}, ["Profi-Checkliste"]),
                el("p", { class: "muted" }, [
                    "13 Punkte zu Setup, Risiko und Journal, die du vor jedem Trade abhakst – Disziplin statt Bauchgefühl.",
                ]),
            ]),
        ]),
        completedLessons > 0 ? el("div", { class: "danger-zone" }, [resetProgressBtn]) : null,
    ]);
}
