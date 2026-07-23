import { PortfolioState } from "./types.js";
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

export function buy(stockId: string, shares: number): TradeResult {
  if (!Number.isInteger(shares) || shares <= 0) {
    return { ok: false, message: "Bitte eine gültige Stückzahl (ganze Zahl > 0) eingeben." };
  }
  const stock = stockById(stockId);
  if (!stock) return { ok: false, message: "Aktie nicht gefunden." };

  const state = loadPortfolio();
  const price = currentPrice(stock, state.day);
  const cost = price * shares;
  const fee = orderFee(cost);
  const total = cost + fee;
  if (total > state.cash) {
    return { ok: false, message: `Nicht genug Guthaben. Kosten inkl. Gebühr: ${total.toFixed(2)} €, verfügbar: ${state.cash.toFixed(2)} €.` };
  }

  const position = state.positions[stockId] ?? { shares: 0, avgPrice: 0 };
  const totalShares = position.shares + shares;
  // Gebühr fließt in den Einstandspreis ein, damit G/V die Handelskosten ehrlich abbildet.
  position.avgPrice = (position.avgPrice * position.shares + total) / totalShares;
  position.shares = totalShares;
  state.positions[stockId] = position;
  state.cash -= total;
  state.transactions.unshift({ day: state.day, stockId, type: "buy", shares, price, fee });
  savePortfolio(state);
  return { ok: true, message: `${shares} Aktie(n) von ${stock.name} für ${cost.toFixed(2)} € + ${fee.toFixed(2)} € Gebühr gekauft.` };
}

export function sell(stockId: string, shares: number): TradeResult {
  if (!Number.isInteger(shares) || shares <= 0) {
    return { ok: false, message: "Bitte eine gültige Stückzahl (ganze Zahl > 0) eingeben." };
  }
  const stock = stockById(stockId);
  if (!stock) return { ok: false, message: "Aktie nicht gefunden." };

  const state = loadPortfolio();
  const position = state.positions[stockId];
  if (!position || position.shares < shares) {
    return { ok: false, message: "Nicht genug Aktien im Depot." };
  }

  const price = currentPrice(stock, state.day);
  const proceeds = price * shares;
  const fee = orderFee(proceeds);
  const net = proceeds - fee;
  position.shares -= shares;
  state.cash += net;
  if (position.shares === 0) delete state.positions[stockId];
  else state.positions[stockId] = position;
  state.transactions.unshift({ day: state.day, stockId, type: "sell", shares, price, fee });
  savePortfolio(state);
  return { ok: true, message: `${shares} Aktie(n) von ${stock.name} für ${proceeds.toFixed(2)} € − ${fee.toFixed(2)} € Gebühr verkauft.` };
}

export function advanceDay(days = 1): PortfolioState {
  const state = loadPortfolio();
  state.day += days;
  savePortfolio(state);
  return state;
}
