import { el } from "../dom.js";
import { moduleById } from "../content/index.js";
import { loadProgress } from "../state.js";
import { quizStars, starLabel } from "../gamification.js";
export function renderModule(moduleId) {
    const mod = moduleById(moduleId);
    if (!mod) {
        return el("div", { class: "empty-state" }, ["Modul nicht gefunden.", el("p", {}, [el("a", { href: "#/" }, ["Zurück zur Übersicht"])])]);
    }
    const progress = loadProgress();
    const items = mod.lessons.map((lesson) => {
        const entry = progress.lessons[lesson.id];
        let badge;
        if (entry?.completed && entry.quizScore !== null && entry.quizTotal !== null) {
            const stars = quizStars(entry.quizScore, entry.quizTotal);
            badge = el("span", { class: "badge done quiz-stars", title: `Quiz: ${entry.quizScore}/${entry.quizTotal} richtig` }, [starLabel(stars)]);
        }
        else if (entry?.completed) {
            badge = el("span", { class: "badge done" }, ["✓ gelesen"]);
        }
        else {
            badge = el("span", { class: "badge" }, ["offen"]);
        }
        return el("li", {}, [
            el("a", { href: `#/lektion/${mod.id}/${lesson.id}` }, [lesson.title]),
            badge,
        ]);
    });
    const analyzerCallout = mod.id === "technische-analyse"
        ? el("a", { class: "card module-card analyzer-callout", href: "#/chart-analyse" }, [
            el("div", { class: "icon" }, ["📊"]),
            el("h3", {}, ["Im Chart-Analyzer üben"]),
            el("p", { class: "muted" }, [
                "Kursverläufe Kerze für Kerze abspielen, Linien einzeichnen, SMA/RSI beobachten und deine Einschätzung testen.",
            ]),
        ])
        : null;
    return el("div", {}, [
        el("div", { class: "breadcrumb" }, [el("a", { href: "#/" }, ["Übersicht"]), " / ", mod.title]),
        el("h1", {}, [`${mod.icon} ${mod.title}`]),
        el("p", { class: "muted" }, [mod.description]),
        analyzerCallout,
        el("ul", { class: "lesson-list" }, items),
    ]);
}
