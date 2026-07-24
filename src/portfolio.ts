import { PortfolioState, PendingOrder, Stock, Transaction } from "./types.js";
import { stockById, currentPrice, priceHistory } from "./market.js";
import { loadPortfolio, savePortfolio, STARTKAPITAL } from "./state.js";

export interface TradeResult {
  ok: boolean;
  message: string;
}

/** Ordergebühr: 0,25 % des Ordervolumens, mindestens 1,00 €. */
export const ORDER_FEE_RATE = 0.0025;
export const ORDER_FEE_MIN = 1.0;

/** Abgeltungsteuer inkl. Solidaritätszuschlag (25 % × 1,055), ohne Kirchensteuer. */
export const CAPITAL_GAINS_TAX_RATE = 0.26375;
/** Sparerpauschbetrag pro Person und Jahr (didaktische Vereinfachung: einmalig angesetzt). */
export const SAVER_ALLOWANCE = 1000;

/** Dividenden werden quartalsweise ausgeschüttet (252 Handelstage / 4). */
export const DIVIDEND_INTERVAL_DAYS = 63;

export function orderFee(volume: number): number {
  return Math.round(Math.max(ORDER_FEE_MIN, volume * ORDER_FEE_RATE) * 100) / 100;
}

export function portfolioValue(state: PortfolioState): number {
  let value = state.cash;
  for (const [stockId, position] of Object.entries(state.positions)) {
    const stock = stockById(stockId);
    if (!stock) continue;
    value += position.shares * currentPrice(stock, state.day);
  }
  return value;
}

export function pendingOrders(state: PortfolioState): PendingOrder[] {
  return state.pendingOrders ?? [];
}

/** Anzahl verschiedener Branchen mit aktuell gehaltenen Positionen (Diversifikation). */
export function sectorsHeld(state: PortfolioState): number {
  const sectors = new Set<string>();
  for (const [stockId, position] of Object.entries(state.positions)) {
    if (position.shares <= 0) continue;
    const stock = stockById(stockId);
    if (stock) sectors.add(stock.sector);
  }
  return sectors.size;
}

/** Spielt die Transaktionshistorie chronologisch ab und ruft für jeden Verkauf den realisierten G/V auf. */
function replaySells(transactions: Transaction[], onSell: (realized: number) => void): void {
  const chronological = [...transactions].reverse();
  const cost: Record<string, { shares: number; avgPrice: number }> = {};
  for (const tx of chronological) {
    if (tx.type === "dividend") continue;
    const pos = cost[tx.stockId] ?? { shares: 0, avgPrice: 0 };
    if (tx.type === "buy") {
      const total = tx.price * tx.shares + (tx.fee ?? 0);
      const totalShares = pos.shares + tx.shares;
      pos.avgPrice = totalShares > 0 ? (pos.avgPrice * pos.shares + total) / totalShares : 0;
      pos.shares = totalShares;
    } else {
      const proceeds = tx.price * tx.shares - (tx.fee ?? 0);
      onSell(proceeds - pos.avgPrice * tx.shares);
      pos.shares -= tx.shares;
    }
    cost[tx.stockId] = pos;
  }
}

/** Summe des bereits realisierten Gewinns/Verlusts über alle Verkäufe (Wiederaufbau des Einstandspreises aus der Historie). */
export function realizedProfitTotal(state: PortfolioState): number {
  let realized = 0;
  replaySells(state.transactions, (r) => (realized += r));
  return realized;
}

/** Kennzahlen abgeschlossener Trades (jeder Verkauf gilt als abgeschlossener Trade). */
export interface TradeStats {
  closedTrades: number;
  wins: number;
  losses: number;
  /** Anteil der Gewinn-Trades (0–1); null ohne abgeschlossene Trades. */
  winRate: number | null;
  /** Bruttogewinne ÷ Bruttoverluste; null, wenn (noch) keine Verluste angefallen sind. */
  profitFactor: number | null;
  /** Ø Gewinn ÷ Ø Verlust (Chance-Risiko der Praxis); null ohne Gewinne oder Verluste. */
  payoffRatio: number | null;
  avgWin: number | null;
  avgLoss: number | null;
  best: number | null;
  worst: number | null;
}

export function computeTradeStats(state: PortfolioState): TradeStats {
  const results: number[] = [];
  replaySells(state.transactions, (r) => results.push(r));
  const wins = results.filter((r) => r > 0);
  const losses = results.filter((r) => r <= 0);
  const grossProfit = wins.reduce((s, r) => s + r, 0);
  const grossLoss = -losses.reduce((s, r) => s + r, 0);
  const avgWin = wins.length ? grossProfit / wins.length : null;
  const avgLoss = losses.length ? grossLoss / losses.length : null;
  return {
    closedTrades: results.length,
    wins: wins.length,
    losses: losses.length,
    winRate: results.length ? wins.length / results.length : null,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : null,
    payoffRatio: avgWin !== null && avgLoss !== null && avgLoss > 0 ? avgWin / avgLoss : null,
    avgWin,
    avgLoss,
    best: results.length ? Math.max(...results) : null,
    worst: results.length ? Math.min(...results) : null,
  };
}

/**
 * Echte Depotwert-Historie durch chronologisches Replay aller Transaktionen:
 * Barbestand und Stückzahlen werden Tag für Tag exakt rekonstruiert und mit den
 * (gecachten) Kursverläufen bewertet. Liefert einen Wert je Handelstag 0..state.day.
 */
export function equityCurve(state: PortfolioState): number[] {
  const days = state.day;
  const chronological = [...state.transactions].reverse();
  const histories = new Map<string, number[]>();
  const shares: Record<string, number> = {};
  let cash = STARTKAPITAL;
  let txIndex = 0;
  const series: number[] = [];
  for (let d = 0; d <= days; d++) {
    while (txIndex < chronological.length && chronological[txIndex].day <= d) {
      const tx = chronological[txIndex++];
      if (tx.type === "buy") {
        cash -= tx.price * tx.shares + (tx.fee ?? 0);
        shares[tx.stockId] = (shares[tx.stockId] ?? 0) + tx.shares;
      } else if (tx.type === "sell") {
        cash += tx.price * tx.shares - (tx.fee ?? 0);
        shares[tx.stockId] = (shares[tx.stockId] ?? 0) - tx.shares;
      } else {
        cash += tx.price * tx.shares; // Dividende
      }
    }
    let value = cash;
    for (const [stockId, count] of Object.entries(shares)) {
      if (count <= 0) continue;
      const stock = stockById(stockId);
      if (!stock) continue;
      let history = histories.get(stockId);
      if (!history) {
        history = priceHistory(stock, days);
        histories.set(stockId, history);
      }
      value += count * history[d];
    }
    series.push(value);
  }
  return series;
}

// --- Interne Ausführung (mutiert den State, ohne zu laden/speichern) ---

function applyBuy(state: PortfolioState, stock: Stock, shares: number, price: number): TradeResult {
  const cost = price * shares;
  const fee = orderFee(cost);
  const total = cost + fee;
  if (total > state.cash) {
    return { ok: false, message: `Nicht genug Guthaben. Kosten inkl. Gebühr: ${total.toFixed(2)} €, verfügbar: ${state.cash.toFixed(2)} €.` };
  }
  const position = state.positions[stock.id] ?? { shares: 0, avgPrice: 0 };
  const totalShares = position.shares + shares;
  // Gebühr fließt in den Einstandspreis ein, damit G/V die Handelskosten ehrlich abbildet.
  position.avgPrice = (position.avgPrice * position.shares + total) / totalShares;
  position.shares = totalShares;
  state.positions[stock.id] = position;
  state.cash -= total;
  state.transactions.unshift({ day: state.day, stockId: stock.id, type: "buy", shares, price, fee });
  return { ok: true, message: `${shares} Aktie(n) von ${stock.name} für ${cost.toFixed(2)} € + ${fee.toFixed(2)} € Gebühr gekauft.` };
}

function applySell(state: PortfolioState, stock: Stock, shares: number, price: number): TradeResult {
  const position = state.positions[stock.id];
  if (!position || position.shares < shares) {
    return { ok: false, message: "Nicht genug Aktien im Depot." };
  }
  const proceeds = price * shares;
  const fee = orderFee(proceeds);
  // Realisierter Gewinn/Verlust der verkauften Anteile: Nettoerlös minus Einstandswert.
  // Der Einstandskurs (avgPrice) enthält bereits die Kaufgebühr, der Nettoerlös ist um
  // die Verkaufsgebühr gemindert – der Wert bildet die Handelskosten also vollständig ab.
  state.realizedPnl = (state.realizedPnl ?? 0) + (proceeds - fee - position.avgPrice * shares);
  position.shares -= shares;
  state.cash += proceeds - fee;
  if (position.shares === 0) delete state.positions[stock.id];
  else state.positions[stock.id] = position;
  state.transactions.unshift({ day: state.day, stockId: stock.id, type: "sell", shares, price, fee });
  return { ok: true, message: `${shares} Aktie(n) von ${stock.name} für ${proceeds.toFixed(2)} € − ${fee.toFixed(2)} € Gebühr verkauft.` };
}

// --- Sofortige Market-Orders ---

export function buy(stockId: string, shares: number): TradeResult {
  if (!Number.isInteger(shares) || shares <= 0) {
    return { ok: false, message: "Bitte eine gültige Stückzahl (ganze Zahl > 0) eingeben." };
  }
  const stock = stockById(stockId);
  if (!stock) return { ok: false, message: "Aktie nicht gefunden." };

  const state = loadPortfolio();
  const result = applyBuy(state, stock, shares, currentPrice(stock, state.day));
  if (result.ok) savePortfolio(state);
  return result;
}

export function sell(stockId: string, shares: number): TradeResult {
  if (!Number.isInteger(shares) || shares <= 0) {
    return { ok: false, message: "Bitte eine gültige Stückzahl (ganze Zahl > 0) eingeben." };
  }
  const stock = stockById(stockId);
  if (!stock) return { ok: false, message: "Aktie nicht gefunden." };

  const state = loadPortfolio();
  const result = applySell(state, stock, shares, currentPrice(stock, state.day));
  if (result.ok) savePortfolio(state);
  return result;
}

// --- Limit- und Stop-Orders (Ausführung beim Zeit-Vorspulen) ---

function isTriggered(order: PendingOrder, price: number): boolean {
  if (order.side === "buy") {
    // Limit-Kauf: bei oder unter dem Limit; Stop-Kauf: bei oder über der Stop-Marke.
    return order.kind === "limit" ? price <= order.triggerPrice : price >= order.triggerPrice;
  }
  // Verkauf – Limit-Verkauf: bei oder über dem Limit; Stop-Loss/Trailing-Stop: bei oder unter der Stop-Marke.
  return order.kind === "limit" ? price >= order.triggerPrice : price <= order.triggerPrice;
}

/** Zieht die Stop-Marke eines Trailing-Stops nach, wenn der Kurs eine neue Hochmarke erreicht. */
function updateTrailingStop(order: PendingOrder, price: number): void {
  if (order.kind !== "trailing" || !order.trailPct) return;
  const high = Math.max(order.highWatermark ?? price, price);
  order.highWatermark = high;
  order.triggerPrice = Math.round(high * (1 - order.trailPct / 100) * 100) / 100;
}

export function placeOrder(
  stockId: string,
  side: "buy" | "sell",
  kind: "limit" | "stop",
  shares: number,
  triggerPrice: number
): TradeResult {
  if (!Number.isInteger(shares) || shares <= 0) {
    return { ok: false, message: "Bitte eine gültige Stückzahl (ganze Zahl > 0) eingeben." };
  }
  if (!(triggerPrice > 0)) {
    return { ok: false, message: "Bitte einen gültigen Auslösekurs (> 0) eingeben." };
  }
  const stock = stockById(stockId);
  if (!stock) return { ok: false, message: "Aktie nicht gefunden." };

  const state = loadPortfolio();
  const order: PendingOrder = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    stockId,
    side,
    kind,
    shares,
    triggerPrice,
    createdDay: state.day,
  };
  state.pendingOrders = [...pendingOrders(state), order];
  savePortfolio(state);
  const label = kind === "limit" ? "Limit" : "Stop";
  const sideLabel = side === "buy" ? "Kauf" : "Verkauf";
  return { ok: true, message: `${label}-${sideLabel} über ${shares} ${stock.ticker} bei ${triggerPrice.toFixed(2)} € vorgemerkt. Ausführung beim Vorspulen der Zeit.` };
}

/**
 * Trailing-Stop-Verkauf: Die Stop-Marke folgt dem Kurs im festen Prozentabstand
 * nach oben, fällt aber nie zurück – Gewinne werden abgesichert, ohne den Ausstieg
 * bei laufendem Trend zu erzwingen.
 */
export function placeTrailingStop(stockId: string, shares: number, trailPct: number): TradeResult {
  if (!Number.isInteger(shares) || shares <= 0) {
    return { ok: false, message: "Bitte eine gültige Stückzahl (ganze Zahl > 0) eingeben." };
  }
  if (!(trailPct > 0) || trailPct >= 100) {
    return { ok: false, message: "Bitte einen gültigen Abstand in Prozent (0–100) eingeben." };
  }
  const stock = stockById(stockId);
  if (!stock) return { ok: false, message: "Aktie nicht gefunden." };

  const state = loadPortfolio();
  const held = state.positions[stockId]?.shares ?? 0;
  if (held < shares) {
    return { ok: false, message: "Trailing-Stops sichern bestehende Positionen ab – nicht genug Aktien im Depot." };
  }
  const price = currentPrice(stock, state.day);
  const order: PendingOrder = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    stockId,
    side: "sell",
    kind: "trailing",
    shares,
    trailPct,
    highWatermark: price,
    triggerPrice: Math.round(price * (1 - trailPct / 100) * 100) / 100,
    createdDay: state.day,
  };
  state.pendingOrders = [...pendingOrders(state), order];
  savePortfolio(state);
  return {
    ok: true,
    message: `Trailing-Stop über ${shares} ${stock.ticker} mit ${trailPct} % Abstand gesetzt (aktuelle Stop-Marke: ${order.triggerPrice.toFixed(2)} €). Die Marke zieht beim Vorspulen automatisch nach.`,
  };
}

export function cancelPendingOrder(id: string): void {
  const state = loadPortfolio();
  state.pendingOrders = pendingOrders(state).filter((o) => o.id !== id);
  savePortfolio(state);
}

/** Schreibt an Quartalsstichtagen (alle 63 Handelstage) Dividenden für gehaltene Positionen gut. */
function applyDividends(state: PortfolioState): void {
  if (state.day <= 0 || state.day % DIVIDEND_INTERVAL_DAYS !== 0) return;
  for (const [stockId, position] of Object.entries(state.positions)) {
    if (position.shares <= 0) continue;
    const stock = stockById(stockId);
    if (!stock || stock.fundamentals.dividendPerShare <= 0) continue;
    // Quartalsdividende: ein Viertel der festen Jahresdividende je Aktie – wie bei echten
    // Unternehmen ist der Betrag fix, die Rendite ergibt sich aus dem aktuellen Kurs.
    const perShare = Math.round((stock.fundamentals.dividendPerShare / 4) * 100) / 100;
    if (perShare <= 0) continue;
    const amount = Math.round(perShare * position.shares * 100) / 100;
    state.cash += amount;
    state.dividendsReceived = (state.dividendsReceived ?? 0) + amount;
    state.transactions.unshift({ day: state.day, stockId, type: "dividend", shares: position.shares, price: perShare });
  }
}

export function advanceDay(days = 1): PortfolioState {
  const state = loadPortfolio();
  for (let step = 0; step < days; step++) {
    state.day += 1;
    const remaining: PendingOrder[] = [];
    for (const order of pendingOrders(state)) {
      const stock = stockById(order.stockId);
      if (!stock) continue; // unbekannte Aktie -> Order verwerfen
      const price = currentPrice(stock, state.day);
      updateTrailingStop(order, price);
      if (!isTriggered(order, price)) {
        remaining.push(order);
        continue;
      }
      // Ausgelöst: zum aktuellen Tageskurs ausführen. Scheitert die Ausführung
      // (z. B. zu wenig Guthaben/Bestand), verfällt die Order.
      if (order.side === "buy") applyBuy(state, stock, order.shares, price);
      else applySell(state, stock, order.shares, price);
    }
    state.pendingOrders = remaining;
    applyDividends(state);
  }
  savePortfolio(state);
  return state;
}
