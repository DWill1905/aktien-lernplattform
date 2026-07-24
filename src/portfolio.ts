import { PortfolioState, PendingOrder, Stock } from "./types.js";
import { stockById, currentPrice } from "./market.js";
import { loadPortfolio, savePortfolio } from "./state.js";

export interface TradeResult {
  ok: boolean;
  message: string;
}

/** Ordergebühr: 0,25 % des Ordervolumens, mindestens 1,00 €. */
export const ORDER_FEE_RATE = 0.0025;
export const ORDER_FEE_MIN = 1.0;

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

/** Summe des bereits realisierten Gewinns/Verlusts über alle Verkäufe (Wiederaufbau des Einstandspreises aus der Historie). */
export function realizedProfitTotal(state: PortfolioState): number {
  const chronological = [...state.transactions].reverse();
  const cost: Record<string, { shares: number; avgPrice: number }> = {};
  let realized = 0;
  for (const tx of chronological) {
    const pos = cost[tx.stockId] ?? { shares: 0, avgPrice: 0 };
    if (tx.type === "buy") {
      const total = tx.price * tx.shares + (tx.fee ?? 0);
      const totalShares = pos.shares + tx.shares;
      pos.avgPrice = totalShares > 0 ? (pos.avgPrice * pos.shares + total) / totalShares : 0;
      pos.shares = totalShares;
    } else {
      const proceeds = tx.price * tx.shares - (tx.fee ?? 0);
      realized += proceeds - pos.avgPrice * tx.shares;
      pos.shares -= tx.shares;
    }
    cost[tx.stockId] = pos;
  }
  return realized;
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
  // Verkauf – Limit-Verkauf: bei oder über dem Limit; Stop-Loss-Verkauf: bei oder unter der Stop-Marke.
  return order.kind === "limit" ? price >= order.triggerPrice : price <= order.triggerPrice;
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

export function cancelPendingOrder(id: string): void {
  const state = loadPortfolio();
  state.pendingOrders = pendingOrders(state).filter((o) => o.id !== id);
  savePortfolio(state);
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
  }
  savePortfolio(state);
  return state;
}
