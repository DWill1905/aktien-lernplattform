const KEY = "boersenschule:leitner";
const MAX_BOX = 5;
// Leitner-Intervalle in Tagen je Box (Index = Box-Nummer 1..5); Box 1 = sofort wieder fällig.
const BOX_INTERVAL_DAYS = [0, 0, 2, 4, 8, 16];

export interface CardState {
  box: number;
  dueDate: string;
}

export interface LeitnerState {
  cards: Record<string, CardState>;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date: string, delta: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function cardId(moduleId: string, lessonId: string, questionIndex: number): string {
  return `${moduleId}:${lessonId}:${questionIndex}`;
}

export function loadLeitner(): LeitnerState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return { cards: {} };
  try {
    const parsed = JSON.parse(raw) as Partial<LeitnerState>;
    return { cards: parsed.cards ?? {} };
  } catch {
    return { cards: {} };
  }
}

function saveLeitner(state: LeitnerState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetLeitner(): void {
  saveLeitner({ cards: {} });
}

/** Trägt das Ergebnis einer beantworteten Quizfrage ein: richtig → eine Box weiter (längeres Intervall), falsch → zurück auf Box 1. */
export function recordCardResult(id: string, correct: boolean): void {
  const state = loadLeitner();
  const prevBox = state.cards[id]?.box ?? 0;
  const box = correct ? Math.min(MAX_BOX, prevBox + 1) : 1;
  state.cards[id] = { box, dueDate: addDays(todayStr(), BOX_INTERVAL_DAYS[box]) };
  saveLeitner(state);
}

export interface DueCard {
  id: string;
  moduleId: string;
  lessonId: string;
  questionIndex: number;
  box: number;
}

function parseCardId(id: string): { moduleId: string; lessonId: string; questionIndex: number } {
  const [moduleId, lessonId, questionIndex] = id.split(":");
  return { moduleId, lessonId, questionIndex: Number(questionIndex) };
}

/** Fällige Karten, dringlichste (niedrigste Box) zuerst; auf `limit` begrenzt für die tägliche Challenge. */
export function dueCards(limit = 3): DueCard[] {
  const state = loadLeitner();
  const today = todayStr();
  return Object.entries(state.cards)
    .filter(([, c]) => c.dueDate <= today)
    .map(([id, c]) => ({ id, ...parseCardId(id), box: c.box }))
    .sort((a, b) => a.box - b.box)
    .slice(0, limit);
}

export function dueCardCount(): number {
  const state = loadLeitner();
  const today = todayStr();
  return Object.values(state.cards).filter((c) => c.dueDate <= today).length;
}
