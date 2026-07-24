export type ModuleId =
  | "grundlagen"
  | "fundamentalanalyse"
  | "technische-analyse"
  | "risikomanagement"
  | "fortgeschrittene-analyse";

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleId: ModuleId;
  title: string;
  summary: string;
  content: string[];
  quiz: QuizQuestion[];
}

export interface LearningModule {
  id: ModuleId;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

export interface Stock {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  basePrice: number;
  drift: number;
  volatility: number;
  seed: number;
  /** Dividendenrendite p.a. auf den aktuellen Kurs (0 = zahlt keine Dividende). */
  dividendYield: number;
}

export interface Position {
  shares: number;
  avgPrice: number;
}

export interface Transaction {
  day: number;
  stockId: string;
  /** "dividend": Ausschüttung – shares = gehaltene Stücke, price = Dividende je Aktie. */
  type: "buy" | "sell" | "dividend";
  shares: number;
  price: number;
  fee?: number;
}

export interface PendingOrder {
  id: string;
  stockId: string;
  side: "buy" | "sell";
  kind: "limit" | "stop" | "trailing";
  shares: number;
  /** Bei Limit/Stop: fester Auslösekurs. Bei Trailing wird er aus Hochmarke und Abstand abgeleitet. */
  triggerPrice: number;
  createdDay: number;
  /** Trailing-Stop: Abstand zur Hochmarke in Prozent (z. B. 8 = 8 %). */
  trailPct?: number;
  /** Trailing-Stop: höchster seit Orderaufgabe gesehener Kurs (wird beim Vorspulen nachgezogen). */
  highWatermark?: number;
}

export interface PortfolioState {
  cash: number;
  day: number;
  positions: Record<string, Position>;
  transactions: Transaction[];
  pendingOrders?: PendingOrder[];
  /** Kumulierter realisierter Gewinn/Verlust aus abgeschlossenen Verkäufen (inkl. Gebühren). */
  realizedPnl?: number;
  /** Summe aller erhaltenen Dividenden (Brutto, fließen dem Barguthaben zu). */
  dividendsReceived?: number;
}

export interface ProgressEntry {
  completed: boolean;
  quizScore: number | null;
  quizTotal: number | null;
}

export interface ProgressState {
  lessons: Record<string, ProgressEntry>;
}
