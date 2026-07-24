import { PortfolioState } from "./types.js";
import { stockById, currentPrice } from "./market.js";

export interface CrashScenario {
  id: string;
  name: string;
  period: string;
  description: string;
  declinePct: number;
  sectorFactor: Record<string, number>;
  recoveryPct: number;
  recoveryLabel: string;
}

// Grobe, didaktisch vereinfachte Kennzahlen realer historischer Krisen (kein Backtest echter
// Kurse) – die Branchenfaktoren skalieren den Basisrückgang je nach typischer Betroffenheit.
export const CRASH_SCENARIOS: CrashScenario[] = [
  {
    id: "dotcom-2000",
    name: "Dotcom-Bubble",
    period: "2000–2002",
    description:
      "Platzen der Internet-Blase: Technologieaktien verloren binnen zwei Jahren einen Großteil ihres Wertes, viele frühe Internet-Firmen verschwanden ganz vom Markt.",
    declinePct: 0.49,
    sectorFactor: { Technologie: 1.6, Cybersicherheit: 1.5, Telekommunikation: 1.3 },
    recoveryPct: 0.15,
    recoveryLabel: "2 Jahre später",
  },
  {
    id: "gfc-2008",
    name: "Globale Finanzkrise",
    period: "2007–2009",
    description:
      "Ausgelöst durch die US-Immobilienkrise und den Zusammenbruch von Lehman Brothers: Aktienmärkte weltweit brachen massiv ein, zyklische Branchen traf es am härtesten.",
    declinePct: 0.57,
    sectorFactor: { Industrie: 1.3, Einzelhandel: 1.2, "Erneuerbare Energien": 1.2, Pharma: 0.7, Landwirtschaft: 0.8 },
    recoveryPct: 0.25,
    recoveryLabel: "1 Jahr später",
  },
  {
    id: "corona-2020",
    name: "Corona-Shock",
    period: "Februar–März 2020",
    description:
      "Weltweite Lockdowns wegen der COVID-19-Pandemie lösten den schnellsten Börsencrash der Geschichte aus – gefolgt von einer ebenso schnellen Erholung dank massiver Notenbank-Stützung.",
    declinePct: 0.34,
    sectorFactor: { Einzelhandel: 1.3, Industrie: 1.2, Pharma: 0.6, Technologie: 0.7, Cybersicherheit: 0.7 },
    recoveryPct: 0.85,
    recoveryLabel: "6 Monate später",
  },
  {
    id: "zinswende-2022",
    name: "Zins- & Inflationswende",
    period: "2022",
    description:
      "Notenbanken erhöhten die Leitzinsen so schnell wie seit Jahrzehnten nicht mehr, um die hohe Inflation zu bekämpfen – besonders wachstums- und zinssensitive Aktien litten überdurchschnittlich.",
    declinePct: 0.25,
    sectorFactor: { Technologie: 1.4, Cybersicherheit: 1.3, "Erneuerbare Energien": 1.2, Pharma: 0.7, Landwirtschaft: 0.7 },
    recoveryPct: 0.35,
    recoveryLabel: "1 Jahr später",
  },
];

export interface PositionImpact {
  stockId: string;
  name: string;
  sector: string;
  valueBefore: number;
  valueAtTrough: number;
  lossAmount: number;
  lossPct: number;
}

export interface CrashResult {
  scenario: CrashScenario;
  valueBefore: number;
  valueAtTrough: number;
  troughLossAmount: number;
  troughLossPct: number;
  valueAfterRecovery: number;
  recoveryLossAmount: number;
  recoveryLossPct: number;
  positionImpacts: PositionImpact[];
  recommendations: string[];
}

function buildRecommendations(
  cash: number,
  valueBefore: number,
  impacts: PositionImpact[],
  troughLossPct: number
): string[] {
  if (impacts.length === 0) {
    return ["Noch keine Positionen im Depot – ohne Aktien gibt es in diesem Szenario keinen Kursverlust, aber auch keine Rendite-Chance."];
  }

  const recs: string[] = [];
  const cashShare = valueBefore > 0 ? cash / valueBefore : 1;
  if (cashShare < 0.1) {
    recs.push("Eine höhere Cash-Quote hätte den Verlust in Euro gedämpft – Barguthaben wirkt in Krisen wie ein Puffer.");
  }

  const totalInvested = impacts.reduce((sum, p) => sum + p.valueBefore, 0);
  const bySector = new Map<string, number>();
  for (const p of impacts) bySector.set(p.sector, (bySector.get(p.sector) ?? 0) + p.valueBefore);
  const topSector = [...bySector.entries()].sort((a, b) => b[1] - a[1])[0];
  if (topSector && totalInvested > 0 && topSector[1] / totalInvested >= 0.5) {
    recs.push(
      `Dein hoher Anteil im Sektor „${topSector[0]}" hat den Verlust in diesem Szenario verstärkt – breitere Streuung über Branchen hätte ihn abgefedert.`
    );
  }

  if (troughLossPct >= 0.3) {
    recs.push("Bei so tiefen Einbrüchen hätten vorab gesetzte Stop-Loss-Marken den Buchverlust begrenzt, statt ihn voll mitzutragen.");
  }
  recs.push("Regelmäßiges Rebalancing (Gewinner anteilig verkaufen, Verlierer nachkaufen) bringt das Depot nach einem Crash wieder in die Ziel-Allokation.");
  return recs;
}

/**
 * Reine Simulation auf Basis des AKTUELLEN Depots – verändert den echten Portfolio-State nicht.
 * Der Basisrückgang der Krise wird je Position mit einem Branchenfaktor skaliert (>1 = stärker
 * betroffen, <1 = defensiver), das Barguthaben bleibt nominal unverändert.
 */
export function simulateCrash(state: PortfolioState, scenario: CrashScenario): CrashResult {
  const holdings = Object.entries(state.positions).filter(([, pos]) => pos.shares > 0);

  const positionImpacts: PositionImpact[] = holdings.map(([stockId, pos]) => {
    const stock = stockById(stockId)!;
    const price = currentPrice(stock, state.day);
    const valueBefore = pos.shares * price;
    const factor = scenario.sectorFactor[stock.sector] ?? 1;
    const lossPct = Math.min(0.95, scenario.declinePct * factor);
    const valueAtTrough = valueBefore * (1 - lossPct);
    return {
      stockId,
      name: stock.name,
      sector: stock.sector,
      valueBefore,
      valueAtTrough,
      lossAmount: valueBefore - valueAtTrough,
      lossPct,
    };
  });
  positionImpacts.sort((a, b) => b.lossAmount - a.lossAmount);

  const investedBefore = positionImpacts.reduce((sum, p) => sum + p.valueBefore, 0);
  const investedAtTrough = positionImpacts.reduce((sum, p) => sum + p.valueAtTrough, 0);
  const valueBefore = investedBefore + state.cash;
  const valueAtTrough = investedAtTrough + state.cash;

  const troughLossAmount = valueBefore - valueAtTrough;
  const troughLossPct = valueBefore > 0 ? troughLossAmount / valueBefore : 0;

  const recoveredAmount = (investedBefore - investedAtTrough) * scenario.recoveryPct;
  const valueAfterRecovery = valueAtTrough + recoveredAmount;
  const recoveryLossAmount = valueBefore - valueAfterRecovery;
  const recoveryLossPct = valueBefore > 0 ? recoveryLossAmount / valueBefore : 0;

  return {
    scenario,
    valueBefore,
    valueAtTrough,
    troughLossAmount,
    troughLossPct,
    valueAfterRecovery,
    recoveryLossAmount,
    recoveryLossPct,
    positionImpacts,
    recommendations: buildRecommendations(state.cash, valueBefore, positionImpacts, troughLossPct),
  };
}
