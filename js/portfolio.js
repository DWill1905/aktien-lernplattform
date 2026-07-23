import { stockById, currentPrice } from "./market.js";
import { loadPortfolio, savePortfolio } from "./state.js";
export function portfolioValue(state) {
    let value = state.cash;
    for (const [stockId, position] of Object.entries(state.positions)) {
        const stock = stockById(stockId);
        if (!stock)
            continue;
        value += position.shares * currentPrice(stock, state.day);
    }
    return value;
}
export function buy(stockId, shares) {
    if (!Number.isInteger(shares) || shares <= 0) {
        return { ok: false, message: "Bitte eine gültige Stückzahl (ganze Zahl > 0) eingeben." };
    }
    const stock = stockById(stockId);
    if (!stock)
        return { ok: false, message: "Aktie nicht gefunden." };
    const state = loadPortfolio();
    const price = currentPrice(stock, state.day);
    const cost = price * shares;
    if (cost > state.cash) {
        return { ok: false, message: `Nicht genug Guthaben. Kosten: ${cost.toFixed(2)} €, verfügbar: ${state.cash.toFixed(2)} €.` };
    }
    const position = state.positions[stockId] ?? { shares: 0, avgPrice: 0 };
    const totalShares = position.shares + shares;
    position.avgPrice = (position.avgPrice * position.shares + cost) / totalShares;
    position.shares = totalShares;
    state.positions[stockId] = position;
    state.cash -= cost;
    state.transactions.unshift({ day: state.day, stockId, type: "buy", shares, price });
    savePortfolio(state);
    return { ok: true, message: `${shares} Aktie(n) von ${stock.name} für ${cost.toFixed(2)} € gekauft.` };
}
export function sell(stockId, shares) {
    if (!Number.isInteger(shares) || shares <= 0) {
        return { ok: false, message: "Bitte eine gültige Stückzahl (ganze Zahl > 0) eingeben." };
    }
    const stock = stockById(stockId);
    if (!stock)
        return { ok: false, message: "Aktie nicht gefunden." };
    const state = loadPortfolio();
    const position = state.positions[stockId];
    if (!position || position.shares < shares) {
        return { ok: false, message: "Nicht genug Aktien im Depot." };
    }
    const price = currentPrice(stock, state.day);
    const proceeds = price * shares;
    position.shares -= shares;
    state.cash += proceeds;
    if (position.shares === 0)
        delete state.positions[stockId];
    else
        state.positions[stockId] = position;
    state.transactions.unshift({ day: state.day, stockId, type: "sell", shares, price });
    savePortfolio(state);
    return { ok: true, message: `${shares} Aktie(n) von ${stock.name} für ${proceeds.toFixed(2)} € verkauft.` };
}
export function advanceDay(days = 1) {
    const state = loadPortfolio();
    state.day += days;
    savePortfolio(state);
    return state;
}
