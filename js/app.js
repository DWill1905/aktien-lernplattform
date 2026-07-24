import { route, notFound, startRouter } from "./router.js";
import { mount } from "./dom.js";
import { renderDashboard } from "./views/dashboard.js";
import { renderModule } from "./views/module.js";
import { renderLesson } from "./views/lesson.js";
import { renderQuiz } from "./views/quiz.js";
import { renderPortfolio } from "./views/portfolio.js";
import { renderGlossary } from "./views/glossary.js";
import { renderAchievements } from "./views/achievements.js";
import { renderChecklist } from "./views/checklist.js";
import { renderAnalyzer } from "./views/analyzer.js";
import { renderNewsSimulator } from "./views/newssim.js";
import { renderDailyReview } from "./views/dailyreview.js";
import { initShell, updateShell } from "./shell.js";
const app = document.getElementById("app");
route("/", () => mount(app, renderDashboard()));
route("/modul/:moduleId", (params) => mount(app, renderModule(params.moduleId)));
route("/lektion/:moduleId/:lessonId", (params) => mount(app, renderLesson(params.moduleId, params.lessonId)));
route("/quiz/:moduleId/:lessonId", (params) => mount(app, renderQuiz(params.moduleId, params.lessonId)));
route("/portfolio", () => mount(app, renderPortfolio()));
route("/chart-analyse", () => mount(app, renderAnalyzer()));
route("/news-simulator", () => mount(app, renderNewsSimulator()));
route("/wiederholung", () => mount(app, renderDailyReview()));
route("/glossar", () => mount(app, renderGlossary()));
route("/erfolge", () => mount(app, renderAchievements()));
route("/checkliste", () => mount(app, renderChecklist()));
notFound(() => mount(app, renderDashboard()));
// Navigation-Rail, Bottom-Navigation und App-Bar (M3-Redesign)
initShell();
window.addEventListener("gamification:changed", updateShell);
// Skip-Link fokussiert den Inhalt, ohne den Hash zu ändern (sonst würde der Router feuern).
document.querySelector(".skip-link")?.addEventListener("click", (e) => {
    e.preventDefault();
    app.focus();
    app.scrollIntoView();
});
startRouter();
