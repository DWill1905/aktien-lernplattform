import { Stock } from "./types.js";

// Dividendenrenditen p.a. sind branchentypisch gewählt: Wachstumswerte (Technologie,
// Cybersicherheit) schütten nichts aus, defensive Sektoren (Telekom, Einzelhandel) mehr.
export const STOCKS: Stock[] = [
  { id: "nwe", name: "NordWind Energie AG", ticker: "NWE", sector: "Erneuerbare Energien", basePrice: 42, drift: 0.0006, volatility: 0.022, seed: 1001, dividendYield: 0.025 },
  { id: "bsr", name: "BlauSee Robotics AG", ticker: "BSR", sector: "Technologie", basePrice: 88, drift: 0.0010, volatility: 0.030, seed: 2002, dividendYield: 0 },
  { id: "alp", name: "Alpin Pharma AG", ticker: "ALP", sector: "Pharma", basePrice: 63, drift: 0.0004, volatility: 0.015, seed: 3003, dividendYield: 0.028 },
  { id: "fkh", name: "FrischKauf Handels AG", ticker: "FKH", sector: "Einzelhandel", basePrice: 24, drift: 0.0002, volatility: 0.012, seed: 4004, dividendYield: 0.038 },
  { id: "sbb", name: "SolidBau Baustoffe AG", ticker: "SBB", sector: "Industrie", basePrice: 51, drift: 0.0003, volatility: 0.018, seed: 5005, dividendYield: 0.032 },
  { id: "mnt", name: "MobilNetz Telekom AG", ticker: "MNT", sector: "Telekommunikation", basePrice: 33, drift: 0.0002, volatility: 0.010, seed: 6006, dividendYield: 0.045 },
  { id: "gfa", name: "GrünFeld Agrar AG", ticker: "GFA", sector: "Landwirtschaft", basePrice: 19, drift: 0.0003, volatility: 0.016, seed: 7007, dividendYield: 0.03 },
  { id: "css", name: "CyberSchild Systeme AG", ticker: "CSS", sector: "Cybersicherheit", basePrice: 76, drift: 0.0009, volatility: 0.026, seed: 8008, dividendYield: 0 },
];

function mulberry32(seed: number): () => number {
  let a = seed;
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rng: () => number): number {
  const u1 = Math.max(rng(), 1e-9);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Kursverläufe sind deterministisch (seed + Tag), daher gefahrlos cachebar.
// Der Cache spart wiederholte O(Tage)-Berechnungen pro Render (Marktübersicht,
// Positionen, Depotwert, Chart greifen alle auf dieselben Verläufe zu).
// Rückgabe nicht mutieren – die Aufrufer lesen die Kurse nur.
const historyCache = new Map<string, number[]>();

export function priceHistory(stock: Stock, days: number): number[] {
  const key = `${stock.seed}:${days}`;
  const cached = historyCache.get(key);
  if (cached) return cached;

  const rng = mulberry32(stock.seed);
  const prices = [stock.basePrice];
  let price = stock.basePrice;
  for (let i = 0; i < days; i++) {
    const shock = stock.drift + stock.volatility * gaussian(rng);
    price = Math.max(0.5, price * (1 + shock));
    prices.push(Math.round(price * 100) / 100);
  }
  historyCache.set(key, prices);
  return prices;
}

export function currentPrice(stock: Stock, day: number): number {
  const history = priceHistory(stock, day);
  return history[history.length - 1];
}

export function stockById(id: string): Stock | undefined {
  return STOCKS.find((s) => s.id === id);
}
