// Stammdaten sind branchentypisch gewählt: Wachstumswerte (Technologie, Cybersicherheit)
// zahlen keine Dividende, sind aber teuer bewertet und marktsensibel (hohes Beta);
// defensive Sektoren (Telekom, Einzelhandel) schütten mehr aus und schwanken weniger.
// Die Fundamentaldaten sind in sich konsistent: Gewinn = Umsatz × Marge, EPS = Gewinn ÷ Aktien,
// ROE = EPS ÷ Buchwert je Aktie – die Kennzahlen im Screener werden daraus live berechnet.
export const STOCKS = [
    {
        id: "nwe", name: "NordWind Energie AG", ticker: "NWE", sector: "Erneuerbare Energien",
        basePrice: 42, drift: 0.0004, volatility: 0.019, seed: 1001, marketBeta: 1.1,
        fundamentals: { sharesMio: 120, revenueMio: 3800, revenueGrowthPct: 9, netMarginPct: 7, equityPerShare: 18, netDebtToEbitda: 2.8, dividendPerShare: 1.05, moat: "schmal" },
    },
    {
        id: "bsr", name: "BlauSee Robotics AG", ticker: "BSR", sector: "Technologie",
        basePrice: 88, drift: 0.0007, volatility: 0.025, seed: 2002, marketBeta: 1.4,
        fundamentals: { sharesMio: 80, revenueMio: 2100, revenueGrowthPct: 18, netMarginPct: 12, equityPerShare: 14, netDebtToEbitda: 0.3, dividendPerShare: 0, moat: "breit" },
    },
    {
        id: "alp", name: "Alpin Pharma AG", ticker: "ALP", sector: "Pharma",
        basePrice: 63, drift: 0.0003, volatility: 0.013, seed: 3003, marketBeta: 0.7,
        fundamentals: { sharesMio: 220, revenueMio: 5200, revenueGrowthPct: 5, netMarginPct: 18, equityPerShare: 21, netDebtToEbitda: 1.2, dividendPerShare: 1.76, moat: "breit" },
    },
    {
        id: "fkh", name: "FrischKauf Handels AG", ticker: "FKH", sector: "Einzelhandel",
        basePrice: 24, drift: 0.0002, volatility: 0.011, seed: 4004, marketBeta: 0.8,
        fundamentals: { sharesMio: 140, revenueMio: 8900, revenueGrowthPct: 2, netMarginPct: 2.5, equityPerShare: 9, netDebtToEbitda: 1.8, dividendPerShare: 0.91, moat: "keiner" },
    },
    {
        id: "sbb", name: "SolidBau Baustoffe AG", ticker: "SBB", sector: "Industrie",
        basePrice: 51, drift: 0.0002, volatility: 0.015, seed: 5005, marketBeta: 1.2,
        fundamentals: { sharesMio: 90, revenueMio: 4100, revenueGrowthPct: 4, netMarginPct: 8, equityPerShare: 26, netDebtToEbitda: 2.2, dividendPerShare: 1.63, moat: "schmal" },
    },
    {
        id: "mnt", name: "MobilNetz Telekom AG", ticker: "MNT", sector: "Telekommunikation",
        basePrice: 33, drift: 0.0002, volatility: 0.009, seed: 6006, marketBeta: 0.5,
        fundamentals: { sharesMio: 300, revenueMio: 9800, revenueGrowthPct: 1, netMarginPct: 9, equityPerShare: 26, netDebtToEbitda: 3.4, dividendPerShare: 1.49, moat: "schmal" },
    },
    {
        id: "gfa", name: "GrünFeld Agrar AG", ticker: "GFA", sector: "Landwirtschaft",
        basePrice: 19, drift: 0.0002, volatility: 0.014, seed: 7007, marketBeta: 0.9,
        fundamentals: { sharesMio: 70, revenueMio: 1600, revenueGrowthPct: 6, netMarginPct: 5, equityPerShare: 8, netDebtToEbitda: 1.9, dividendPerShare: 0.57, moat: "keiner" },
    },
    {
        id: "css", name: "CyberSchild Systeme AG", ticker: "CSS", sector: "Cybersicherheit",
        basePrice: 76, drift: 0.0006, volatility: 0.022, seed: 8008, marketBeta: 1.3,
        fundamentals: { sharesMio: 60, revenueMio: 950, revenueGrowthPct: 24, netMarginPct: 10, equityPerShare: 7, netDebtToEbitda: 0.1, dividendPerShare: 0, moat: "breit" },
    },
];
function mulberry32(seed) {
    let a = seed;
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function gaussian(rng) {
    const u1 = Math.max(rng(), 1e-9);
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
// --- Ein-Faktor-Marktmodell -------------------------------------------------
// Alle Aktien hängen an einem gemeinsamen Marktfaktor (Tagesrendite des "Gesamtmarkts"):
// Rendite der Aktie = eigener Drift + Beta × Marktrendite + idiosynkratischer Zufall.
// Dadurch sind die Kurse realistisch korreliert – Diversifikation reduziert nur noch das
// unternehmensspezifische Risiko, das Marktrisiko bleibt (wie an echten Börsen), und das
// Portfolio-Beta im Health Check bekommt eine echte Bedeutung.
// Der Markt selbst durchläuft Bullen- und Bärenphasen (Regime) mit unterschiedlichem Drift.
const MARKET_SEED = 424242;
const MARKET_VOLATILITY = 0.011;
const BULL_DRIFT = 0.0009;
const BEAR_DRIFT = -0.0011;
// Inkrementell erweiterter, deterministischer Verlauf der Markt-Tagesrenditen.
// Der Zustand (rng, Regime) lebt auf Modulebene weiter, sodass jede Verlängerung
// exakt dort fortsetzt, wo die letzte aufgehört hat – unabhängig vom Aufrufmuster.
const marketReturnsCache = [];
const marketRng = mulberry32(MARKET_SEED);
let regimeDaysLeft = 0;
let regimeDrift = 0;
function marketReturns(days) {
    while (marketReturnsCache.length < days) {
        if (regimeDaysLeft <= 0) {
            // Bullenphasen sind häufiger und länger als Bärenphasen (empirisches Börsenmuster).
            const bull = marketRng() < 0.65;
            regimeDrift = bull ? BULL_DRIFT : BEAR_DRIFT;
            regimeDaysLeft = Math.round(bull ? 60 + marketRng() * 120 : 25 + marketRng() * 65);
        }
        regimeDaysLeft--;
        marketReturnsCache.push(regimeDrift + MARKET_VOLATILITY * gaussian(marketRng));
    }
    return marketReturnsCache;
}
// Kursverläufe sind deterministisch (seed + Tag), daher gefahrlos cachebar.
// Der Cache spart wiederholte O(Tage)-Berechnungen pro Render (Marktübersicht,
// Positionen, Depotwert, Chart greifen alle auf dieselben Verläufe zu).
// Rückgabe nicht mutieren – die Aufrufer lesen die Kurse nur.
const historyCache = new Map();
export function priceHistory(stock, days) {
    const key = `${stock.seed}:${days}`;
    const cached = historyCache.get(key);
    if (cached)
        return cached;
    const market = marketReturns(days);
    const rng = mulberry32(stock.seed);
    const prices = [stock.basePrice];
    let price = stock.basePrice;
    for (let i = 0; i < days; i++) {
        const shock = stock.drift + stock.marketBeta * market[i] + stock.volatility * gaussian(rng);
        price = Math.max(0.5, price * (1 + shock));
        prices.push(Math.round(price * 100) / 100);
    }
    historyCache.set(key, prices);
    return prices;
}
export function currentPrice(stock, day) {
    const history = priceHistory(stock, day);
    return history[history.length - 1];
}
export function stockById(id) {
    return STOCKS.find((s) => s.id === id);
}
