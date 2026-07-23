import { grundlagen } from "./grundlagen.js";
import { fundamentalanalyse } from "./fundamentalanalyse.js";
import { technischeAnalyse } from "./technische-analyse.js";
export const MODULES = [grundlagen, fundamentalanalyse, technischeAnalyse];
export function moduleById(id) {
    return MODULES.find((m) => m.id === id);
}
export function lessonById(moduleId, lessonId) {
    const mod = moduleById(moduleId);
    return mod?.lessons.find((l) => l.id === lessonId);
}
export function totalLessonCount() {
    return MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
}
