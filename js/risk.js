import { STOCKS, stockById, currentPrice, priceHistory } from "./market.js";
import { equityCurve } from "./portfolio.js";
const TRADING_DAYS_PER_YEAR = 252;
const RISK_FREE_ANNUAL = 0.02; // Platzhalter, z. B. Rendite kurzlaufender Staatsanleihen
export const MIN_HISTORY_DAYS = 5;
const CLUMP_WARNING_THRESHOLD = 0.5; // 50 % in einem Sektor
const CASH_WARNING_THRESHOLD = 0.8; // 80 % unverzinstes Barguthaben
function mean(values) {
    return values.reduce((sum, v) => sum + v, 0) / values.length;
}
function stdDev(values) {
    const m = mean(values);
    const variance = mean(values.map((v) => (v - m) ** 2));
    return Math.sqrt(variance);
}
function covariance(a, b) {
    const ma = mean(a);
    const mb = mean(b);
    let sum = 0;
    for (let i = 0; i < a.length; i++)
        sum += (a[i] - ma) * (b[i] - mb);
    return sum / a.length;
}
function dailyReturns(values) {
    const returns = [];
    for (let i = 1; i < values.length; i++) {
        if (values[i - 1] > 0)
            returns.push((values[i] - values[i - 1]) / values[i - 1]);
    }
    return returns;
}
function maxDrawdown(values) {
    let peak = values[0];
    let worst = 0;
    for (const v of values) {
        peak = Math.max(peak, v);
        if (peak > 0)
            worst = Math.max(worst, (peak - v) / peak);
    }
    return worst;
}
/** Herfindahl-Hirschman-Index (0 = perfekt gestreut, 10.000 = alles in einem Sektor). */
function herfindahlIndex(weights) {
    return weights.reduce((sum, w) => sum + (w * 100) ** 2, 0);
}
function diversificationLabel(hhi) {
    if (hhi < 1500)
        return "gut diversifiziert";
    if (hhi < 2500)
        return "mäßig konzentriert";
    return "stark konzentriert";
}
/** Downside Deviation: Standardabweichung nur der Renditen unterhalb der Zielrendite. */
function downsideDeviation(returns, target) {
    const shortfalls = returns.map((r) => Math.min(0, r - target));
    return Math.sqrt(mean(shortfalls.map((s) => s ** 2)));
}
/** Erster Handelstag mit Transaktion – davor liegt das Kapital nur als Cash herum. */
function firstTradeDay(state) {
    if (state.transactions.length === 0)
        return null;
    return Math.min(...state.transactions.map((tx) => tx.day));
}
/** Gleichgewichteter Vergleichsindex aller 8 Aktien, normiert auf 1 am Tag 0. */
export function marketIndexSeries(days) {
    const histories = STOCKS.map((s) => ({ basePrice: s.basePrice, history: priceHistory(s, days) }));
    const series = [];
    for (let d = 0; d <= days; d++) {
        const avgReturn = mean(histories.map(({ basePrice, history }) => history[d] / basePrice));
        series.push(avgReturn);
    }
    return series;
}
export function computeHealthCheck(state) {
    const holdings = Object.entries(state.positions).filter(([, pos]) => pos.shares > 0);
    const positionValues = holdings.map(([stockId, pos]) => {
        const stock = stockById(stockId);
        return { sector: stock.sector, value: pos.shares * currentPrice(stock, state.day) };
    });
    const investedTotal = positionValues.reduce((sum, p) => sum + p.value, 0);
    const totalValue = investedTotal + state.cash;
    const bySector = new Map();
    for (const p of positionValues)
        bySector.set(p.sector, (bySector.get(p.sector) ?? 0) + p.value);
    const sectorWeights = [...bySector.entries()]
        .map(([sector, value]) => ({ sector, value, weight: totalValue > 0 ? value / totalValue : 0 }))
        .sort((a, b) => b.value - a.value);
    const hhi = totalValue > 0 ? herfindahlIndex(sectorWeights.map((s) => s.weight)) : 0;
    const diversificationScore = Math.max(0, Math.round(100 - hhi / 100));
    const warnings = [];
    const topSector = sectorWeights[0];
    if (topSector && topSector.weight >= CLUMP_WARNING_THRESHOLD) {
        warnings.push(`Klumpenrisiko: ${Math.round(topSector.weight * 100)} % deines Depots stecken im Sektor „${topSector.sector}".`);
    }
    if (totalValue > 0 && state.cash / totalValue >= CASH_WARNING_THRESHOLD && investedTotal > 0) {
        warnings.push(`${Math.round((state.cash / totalValue) * 100)} % deines Kapitals liegen unverzinst als Barguthaben statt investiert zu sein.`);
    }
    if (holdings.length === 1) {
        warnings.push("Nur eine einzige Position im Depot – keine Streuung über mehrere Aktien.");
    }
    // Kennzahlen auf Basis der ECHTEN Depot-Historie (Transaktions-Replay), gerechnet
    // ab dem ersten Handelstag – die reine Cash-Phase davor würde Volatilität und
    // Sharpe künstlich verwässern.
    const tradeStart = firstTradeDay(state);
    let sharpeRatio = null;
    let sortinoRatio = null;
    let beta = null;
    let maxDrawdownPct = null;
    let annualReturn = null;
    let annualVolatility = null;
    if (tradeStart !== null && state.day - tradeStart >= MIN_HISTORY_DAYS) {
        const values = equityCurve(state).slice(tradeStart);
        const returns = dailyReturns(values);
        const indexValues = marketIndexSeries(state.day).slice(tradeStart);
        const indexReturns = dailyReturns(indexValues);
        if (returns.length >= MIN_HISTORY_DAYS) {
            const meanDaily = mean(returns);
            annualReturn = (1 + meanDaily) ** TRADING_DAYS_PER_YEAR - 1;
            annualVolatility = stdDev(returns) * Math.sqrt(TRADING_DAYS_PER_YEAR);
            sharpeRatio = annualVolatility > 0 ? (meanDaily * TRADING_DAYS_PER_YEAR - RISK_FREE_ANNUAL) / annualVolatility : null;
            const riskFreeDaily = RISK_FREE_ANNUAL / TRADING_DAYS_PER_YEAR;
            const downside = downsideDeviation(returns, riskFreeDaily) * Math.sqrt(TRADING_DAYS_PER_YEAR);
            sortinoRatio = downside > 0 ? (meanDaily * TRADING_DAYS_PER_YEAR - RISK_FREE_ANNUAL) / downside : null;
            const indexVariance = mean(indexReturns.map((r) => (r - mean(indexReturns)) ** 2));
            beta = indexVariance > 0 ? covariance(returns, indexReturns) / indexVariance : null;
            maxDrawdownPct = maxDrawdown(values);
        }
    }
    return {
        hhi: Math.round(hhi),
        diversificationScore,
        diversificationLabel: diversificationLabel(hhi),
        sectorWeights,
        warnings,
        hasHistory: sharpeRatio !== null,
        sharpeRatio,
        sortinoRatio,
        beta,
        maxDrawdownPct,
        annualReturn,
        annualVolatility,
    };
}
