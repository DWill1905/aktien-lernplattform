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
}

export interface Position {
  shares: number;
  avgPrice: number;
}

export interface Transaction {
  day: number;
  stockId: string;
  type: "buy" | "sell";
  shares: number;
  price: number;
  fee?: number;
}

export interface PendingOrder {
  id: string;
  stockId: string;
  side: "buy" | "sell";
  kind: "limit" | "stop";
  shares: number;
  triggerPrice: number;
  createdDay: number;
}

export interface PortfolioState {
  cash: number;
  day: number;
  positions: Record<string, Position>;
  transactions: Transaction[];
  pendingOrders?: PendingOrder[];
}

export interface ProgressEntry {
  completed: boolean;
  quizScore: number | null;
  quizTotal: number | null;
}

export interface ProgressState {
  lessons: Record<string, ProgressEntry>;
}
