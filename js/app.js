import { route, notFound, startRouter } from "./router.js";
import { mount } from "./dom.js";
import { renderDashboard } from "./views/dashboard.js";
import { renderModule } from "./views/module.js";
import { renderLesson } from "./views/lesson.js";
import { renderQuiz } from "./views/quiz.js";
import { renderPortfolio } from "./views/portfolio.js";
import { renderGlossary } from "./views/glossary.js";
const app = document.getElementById("app");
route("/", () => mount(app, renderDashboard()));
route("/modul/:moduleId", (params) => mount(app, renderModule(params.moduleId)));
route("/lektion/:moduleId/:lessonId", (params) => mount(app, renderLesson(params.moduleId, params.lessonId)));
route("/quiz/:moduleId/:lessonId", (params) => mount(app, renderQuiz(params.moduleId, params.lessonId)));
route("/portfolio", () => mount(app, renderPortfolio()));
route("/glossar", () => mount(app, renderGlossary()));
notFound(() => mount(app, renderDashboard()));
function updateActiveNav() {
    const hash = location.hash || "#/";
    document.querySelectorAll(".topnav a").forEach((a) => {
        const key = (a.getAttribute("href") ?? "").replace(/^#\//, "");
        let active;
        if (key.includes("/")) {
            const moduleId = key.split("/")[1] ?? "";
            active = new RegExp(`(?:modul|lektion|quiz)/${moduleId}(?:/|$)`).test(hash);
        }
        else {
            // Einzelsegment-Links wie #/portfolio oder #/glossar
            active = hash.startsWith(`#/${key}`);
        }
        a.classList.toggle("active", active);
        if (active)
            a.setAttribute("aria-current", "page");
        else
            a.removeAttribute("aria-current");
    });
}
window.addEventListener("hashchange", updateActiveNav);
updateActiveNav();
// Skip-Link fokussiert den Inhalt, ohne den Hash zu ändern (sonst würde der Router feuern).
document.querySelector(".skip-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    app.focus();
    app.scrollIntoView();
});
startRouter();
