import { Stock } from "./types.js";
import { priceHistory } from "./market.js";

export interface Candle {
  day: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * Erzeugt deterministische Tageskerzen aus den vorhandenen Schlusskursen.
 * Open = Vortagesschluss; High/Low ergeben sich aus einer festen, von der
 * Volatilität der Aktie abhängigen Spanne um Open/Close – keine zusätzliche
 * Zufallsquelle nötig, damit die Kerzen wie die Kurse reproduzierbar bleiben.
 */
export function generateCandles(stock: Stock, days: number): Candle[] {
  const closes = priceHistory(stock, days);
  const wick = Math.max(0.002, stock.volatility * 0.4);
  const candles: Candle[] = [];
  for (let i = 1; i < closes.length; i++) {
    const open = closes[i - 1];
    const close = closes[i];
    const bodyHigh = Math.max(open, close);
    const bodyLow = Math.min(open, close);
    candles.push({
      day: i,
      open,
      close,
      high: Math.round(bodyHigh * (1 + wick) * 100) / 100,
      low: Math.max(0.01, Math.round(bodyLow * (1 - wick) * 100) / 100),
    });
  }
  return candles;
}

/** Gleitender Durchschnitt (SMA) über `period` Schlusskurse; null solange nicht genug Werte vorliegen. */
export function sma(values: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    result.push(i >= period - 1 ? Math.round((sum / period) * 100) / 100 : null);
  }
  return result;
}

/** Relative Strength Index (Wilder-Glättung), Standardperiode 14; null solange nicht genug Werte vorliegen. */
export function rsi(values: number[], period = 14): (number | null)[] {
  const result: (number | null)[] = new Array(values.length).fill(null);
  if (values.length <= period) return result;

  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const change = values[i] - values[i - 1];
    if (change >= 0) avgGain += change;
    else avgLoss -= change;
  }
  avgGain /= period;
  avgLoss /= period;
  result[period] = avgLoss === 0 ? 100 : Math.round((100 - 100 / (1 + avgGain / avgLoss)) * 10) / 10;

  for (let i = period + 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = change >= 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result[i] = avgLoss === 0 ? 100 : Math.round((100 - 100 / (1 + avgGain / avgLoss)) * 10) / 10;
  }
  return result;
}
