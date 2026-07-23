import { LearningModule, Lesson, ModuleId } from "../types.js";
import { grundlagen } from "./grundlagen.js";
import { fundamentalanalyse } from "./fundamentalanalyse.js";
import { technischeAnalyse } from "./technische-analyse.js";

export const MODULES: LearningModule[] = [grundlagen, fundamentalanalyse, technischeAnalyse];

export function moduleById(id: string): LearningModule | undefined {
  return MODULES.find((m) => m.id === (id as ModuleId));
}

export function lessonById(moduleId: string, lessonId: string): Lesson | undefined {
  const mod = moduleById(moduleId);
  return mod?.lessons.find((l) => l.id === lessonId);
}

export function totalLessonCount(): number {
  return MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
}
