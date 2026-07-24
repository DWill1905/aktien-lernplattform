import { el } from "../dom.js";
import { ACHIEVEMENTS, loadUnlockedAchievements } from "../achievements.js";
import { symbol } from "../shell.js";
export function renderAchievements() {
    const unlocked = new Set(loadUnlockedAchievements());
    const items = ACHIEVEMENTS.map((a) => {
        const done = unlocked.has(a.id);
        return el("li", { class: `achievement-card${done ? " unlocked" : ""}` }, [
            el("div", { class: "achievement-card-icon" }, [symbol(a.icon, done)]),
            el("div", { class: "achievement-card-text" }, [
                el("h3", {}, [a.title]),
                el("p", { class: "muted" }, [a.description]),
            ]),
            el("span", { class: "achievement-status", title: done ? "Freigeschaltet" : "Noch gesperrt" }, [
                symbol(done ? "check_circle" : "lock", done),
            ]),
        ]);
    });
    const pct = ACHIEVEMENTS.length ? Math.round((unlocked.size / ACHIEVEMENTS.length) * 100) : 0;
    return el("div", {}, [
        el("div", { class: "breadcrumb" }, [el("a", { href: "#/" }, ["Übersicht"]), " / ", "Erfolge"]),
        el("h1", { class: "page-title" }, [symbol("emoji_events"), "Deine Erfolge"]),
        el("div", { class: "card overall-progress achievements-progress" }, [
            el("div", { class: "label" }, [`${unlocked.size} von ${ACHIEVEMENTS.length} Erfolgen freigeschaltet (${pct} %)`]),
            el("div", { class: "progress-bar" }, [el("span", { style: `width:${pct}%` }, [])]),
        ]),
        el("ul", { class: "achievement-list" }, items),
    ]);
}
