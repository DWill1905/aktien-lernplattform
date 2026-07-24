import { el } from "../dom.js";
import { STOCKS, currentPrice, priceHistory, stockById, quote } from "../market.js";
import { loadPortfolio, loadProgress, resetPortfolio, STARTKAPITAL, loadWatchlist, toggleWatchlist } from "../state.js";
import { advanceDay, buy, sell, portfolioValue, placeOrder, placeTrailingStop, placeBracketOrder, cancelPendingOrder, pendingOrders, computeTradeStats, equityCurve, orderFee, ORDER_FEE_RATE, CAPITAL_GAINS_TAX_RATE, SAVER_ALLOWANCE, } from "../portfolio.js";
import { generateCandles, sma, rsi } from "../indicators.js";
import { formatCurrency, formatPercent } from "../util.js";
import { MODULES } from "../content/index.js";
import { loadGamification } from "../gamification.js";
import { evaluateAchievements } from "../achievements.js";
import { showToast } from "../toast.js";
import { computeHealthCheck, MIN_HISTORY_DAYS, marketIndexSeries } from "../risk.js";
import { CRASH_SCENARIOS, simulateCrash } from "../crashtest.js";
import { deriveMetrics } from "../fundamentals.js";
import { symbol } from "../shell.js";
function checkAchievements(portfolioState) {
    evaluateAchievements({
        progress: loadProgress(),
        modules: MODULES,
        gamification: loadGamification(),
        portfolio: portfolioState,
    }).forEach((a) => showToast(`Erfolg freigeschaltet: ${a.title}`, "achievement", a.icon));
}
function chartTheme() {
    const styles = getComputedStyle(document.documentElement);
    const token = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;
    return {
        up: token("--md-success", "#2e7d32"),
        down: token("--md-error", "#b3261e"),
        muted: token("--md-on-surface-variant", "#5a5a5a"),
        grid: token("--md-outline-variant", "#d5d5dd"),
        accent: token("--accent", "#3949ab"),
    };
}
function prepareCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return null;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 220;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    return { ctx, width, height };
}
/** Horizontale Preis-Gitterlinien samt Beschriftung am rechten Rand. */
function drawPriceGrid(ctx, theme, min, max, width, yAt) {
    ctx.strokeStyle = theme.grid;
    ctx.fillStyle = theme.muted;
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
        const price = min + ((max - min) * i) / 3;
        const y = yAt(price);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillText(`${price.toFixed(2)} €`, width - 4, y - 2);
    }
}
/** Candlestick-Chart mit optionalen SMA-Overlays – Standarddarstellung im Profi-Trading. */
function drawCandleChart(canvas, candles, overlays) {
    const prepared = prepareCanvas(canvas);
    if (!prepared || candles.length === 0)
        return;
    const { ctx, width, height } = prepared;
    const theme = chartTheme();
    const overlayValues = overlays.flatMap((o) => o.values.filter((v) => v !== null));
    const min = Math.min(...candles.map((c) => c.low), ...overlayValues);
    const max = Math.max(...candles.map((c) => c.high), ...overlayValues);
    const range = max - min || 1;
    const padTop = 8;
    const padBottom = 6;
    const plotH = height - padTop - padBottom;
    const slot = width / candles.length;
    const bodyW = Math.max(1.5, Math.min(9, slot * 0.62));
    const xAt = (i) => slot * i + slot / 2;
    const yAt = (p) => padTop + (1 - (p - min) / range) * plotH;
    drawPriceGrid(ctx, theme, min, max, width, yAt);
    for (let i = 0; i < candles.length; i++) {
        const c = candles[i];
        const color = c.close >= c.open ? theme.up : theme.down;
        const x = xAt(i);
        // Docht
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, yAt(c.high));
        ctx.lineTo(x, yAt(c.low));
        ctx.stroke();
        // Kerzenkörper (mind. 1px hoch, damit Doji-Kerzen sichtbar bleiben)
        const top = yAt(Math.max(c.open, c.close));
        const bottom = yAt(Math.min(c.open, c.close));
        ctx.fillStyle = color;
        ctx.fillRect(x - bodyW / 2, top, bodyW, Math.max(1, bottom - top));
    }
    for (const overlay of overlays) {
        ctx.strokeStyle = overlay.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        let started = false;
        overlay.values.forEach((v, i) => {
            if (v === null)
                return;
            const x = xAt(i);
            const y = yAt(v);
            if (!started) {
                ctx.moveTo(x, y);
                started = true;
            }
            else
                ctx.lineTo(x, y);
        });
        ctx.stroke();
    }
}
/** Linienchart für Depotwert vs. Vergleichsindex (beide in € auf gemeinsamer Skala). */
function drawEquityChart(canvas, series, benchmark) {
    const prepared = prepareCanvas(canvas);
    if (!prepared || series.length < 2)
        return;
    const { ctx, width, height } = prepared;
    const theme = chartTheme();
    const all = [...series, ...benchmark];
    const min = Math.min(...all);
    const max = Math.max(...all);
    const range = max - min || 1;
    const padTop = 8;
    const padBottom = 6;
    const plotH = height - padTop - padBottom;
    const xAt = (i, len) => (i / (len - 1)) * (width - 60);
    const yAt = (p) => padTop + (1 - (p - min) / range) * plotH;
    drawPriceGrid(ctx, theme, min, max, width, yAt);
    const drawLine = (values, color, lineWidth, dashed) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(dashed ? [5, 4] : []);
        ctx.beginPath();
        values.forEach((v, i) => (i === 0 ? ctx.moveTo(xAt(i, values.length), yAt(v)) : ctx.lineTo(xAt(i, values.length), yAt(v))));
        ctx.stroke();
        ctx.setLineDash([]);
    };
    drawLine(benchmark, theme.muted, 1.5, true);
    drawLine(series, theme.accent, 2, false);
    // Fläche unter der Depotkurve
    ctx.beginPath();
    series.forEach((v, i) => (i === 0 ? ctx.moveTo(xAt(i, series.length), yAt(v)) : ctx.lineTo(xAt(i, series.length), yAt(v))));
    ctx.lineTo(xAt(series.length - 1, series.length), height - padBottom);
    ctx.lineTo(0, height - padBottom);
    ctx.closePath();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = theme.accent;
    ctx.fill();
    ctx.globalAlpha = 1;
}
/** Standardabweichung der Tagesrenditen einer Kursreihe, annualisiert (√252). */
function annualizedVolatility(closes) {
    if (closes.length < 15)
        return null;
    const returns = [];
    for (let i = 1; i < closes.length; i++) {
        if (closes[i - 1] > 0)
            returns.push((closes[i] - closes[i - 1]) / closes[i - 1]);
    }
    const meanR = returns.reduce((s, r) => s + r, 0) / returns.length;
    const variance = returns.reduce((s, r) => s + (r - meanR) ** 2, 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(252);
}
function allocationRow(label, part, total) {
    const pct = total > 0 ? (part / total) * 100 : 0;
    return el("div", { class: "allocation-row" }, [
        el("div", { class: "allocation-head" }, [
            el("span", {}, [label]),
            el("span", { class: "num" }, [`${formatCurrency(part)} · ${pct.toLocaleString("de-DE", { maximumFractionDigits: 1 })} %`]),
        ]),
        el("div", { class: "progress-bar" }, [el("span", { style: `width:${pct}%` }, [])]),
    ]);
}
export function renderPortfolio() {
    let state = loadPortfolio();
    let selectedStockId = STOCKS[0].id;
    let crashResult = null;
    /** Sichtbares Zeitfenster des Kerzencharts in Handelstagen (0 = gesamte Historie). */
    let chartWindow = 90;
    let showSma20 = true;
    let showSma50 = true;
    const container = el("div", {});
    function refresh() {
        state = loadPortfolio();
        container.replaceChildren(build());
    }
    function build() {
        const value = portfolioValue(state);
        const totalReturn = (value - STARTKAPITAL) / STARTKAPITAL;
        const realizedPnl = state.realizedPnl ?? 0;
        // --- Stat header ---
        const header = el("div", { class: "card" }, [
            el("h1", { class: "page-title" }, [symbol("account_balance_wallet"), "Portfolio-Simulator"]),
            el("p", { class: "muted" }, [
                "Virtuelles Startkapital von ",
                formatCurrency(STARTKAPITAL),
                " · Kurse sind fiktiv und lokal generiert, ohne echtes Marktrisiko · pro Order fällt eine Gebühr von 0,25 % (mind. 1 €) an, dazu handeln Market- und Stop-Orders zur schlechteren Seite der Geld-Brief-Spanne.",
            ]),
            el("div", { class: "stat-row" }, [
                el("div", { class: "stat" }, [el("div", { class: "label" }, ["Barguthaben"]), el("div", { class: "value" }, [formatCurrency(state.cash)])]),
                el("div", { class: "stat" }, [el("div", { class: "label" }, ["Depotwert gesamt"]), el("div", { class: "value" }, [formatCurrency(value)])]),
                el("div", { class: "stat" }, [
                    el("div", { class: "label" }, ["Gesamtrendite"]),
                    el("div", { class: `value ${totalReturn >= 0 ? "pos" : "neg"}` }, [formatPercent(totalReturn)]),
                ]),
                el("div", { class: "stat" }, [
                    el("div", { class: "label" }, ["Realisierter G/V"]),
                    el("div", { class: `value ${realizedPnl >= 0 ? "pos" : "neg"}` }, [formatCurrency(realizedPnl)]),
                ]),
                el("div", { class: "stat" }, [
                    el("div", { class: "label" }, ["Dividenden"]),
                    el("div", { class: "value" }, [formatCurrency(state.dividendsReceived ?? 0)]),
                ]),
                el("div", { class: "stat" }, [el("div", { class: "label" }, ["Handelstag"]), el("div", { class: "value" }, [String(state.day)])]),
            ]),
            el("div", { class: "actions" }, [
                makeButton("+1 Tag", "secondary", () => {
                    checkAchievements(advanceDay(1));
                    crashResult = null;
                    refresh();
                }),
                makeButton("+5 Tage", "secondary", () => {
                    checkAchievements(advanceDay(5));
                    crashResult = null;
                    refresh();
                }),
                makeButton("+20 Tage", "secondary", () => {
                    checkAchievements(advanceDay(20));
                    crashResult = null;
                    refresh();
                }),
                makeButton("Depot zurücksetzen", "danger", () => {
                    if (confirm("Depot wirklich auf Startkapital zurücksetzen? Alle Positionen und Transaktionen gehen verloren.")) {
                        resetPortfolio();
                        crashResult = null;
                        refresh();
                    }
                }),
            ]),
        ]);
        // --- Candlestick-Chart mit Zeitfenster und SMA-Overlays ---
        const selectedStock = stockById(selectedStockId);
        const history = priceHistory(selectedStock, state.day);
        const firstPrice = history[0];
        const lastPrice = history[history.length - 1];
        const histChange = firstPrice ? (lastPrice - firstPrice) / firstPrice : 0;
        const allCandles = generateCandles(selectedStock, state.day);
        // SMAs auf der vollen Historie rechnen, damit sie am linken Fensterrand nicht abreißen.
        const sma20Full = sma(history, 20).slice(1);
        const sma50Full = sma(history, 50).slice(1);
        const windowSize = chartWindow > 0 ? Math.min(chartWindow, allCandles.length) : allCandles.length;
        const candles = allCandles.slice(-windowSize);
        const theme = chartTheme();
        const overlays = [];
        if (showSma20)
            overlays.push({ color: theme.accent, values: sma20Full.slice(-windowSize) });
        if (showSma50)
            overlays.push({ color: theme.down, values: sma50Full.slice(-windowSize) });
        const canvas = el("canvas", {
            class: "chart chart-tall",
            role: "img",
            "aria-label": `Kerzenchart ${selectedStock.name}: von ${formatCurrency(firstPrice)} auf ${formatCurrency(lastPrice)} (${formatPercent(histChange)}) über ${history.length - 1} Handelstage.`,
        });
        const windowButtons = [
            { label: "1M", days: 21 },
            { label: "3M", days: 63 },
            { label: "6M", days: 126 },
            { label: "Max", days: 0 },
        ].map(({ label, days }) => {
            const active = chartWindow === days;
            const btn = el("button", { class: `seg-btn${active ? " active" : ""}`, "aria-pressed": String(active) }, [label]);
            btn.addEventListener("click", () => {
                chartWindow = days;
                container.replaceChildren(build());
            });
            return btn;
        });
        const smaToggle = (label, colorClass, value, onChange) => {
            const input = el("input", { type: "checkbox", checked: value ? true : undefined });
            input.addEventListener("change", () => {
                onChange(input.checked);
                container.replaceChildren(build());
            });
            return el("label", { class: "sma-toggle" }, [input, el("span", { class: `legend-swatch ${colorClass}` }, []), label]);
        };
        // --- Kennzahlen zur ausgewählten Aktie (52-Tage-Fenster wie an der Börse üblich: 52 Wochen ≈ 250 Handelstage) ---
        const lookback = history.slice(-251);
        const high52 = Math.max(...lookback);
        const low52 = Math.min(...lookback);
        const distFromHigh = high52 > 0 ? (lastPrice - high52) / high52 : 0;
        const stockVola = annualizedVolatility(lookback);
        const rsiValues = rsi(history);
        const rsiNow = rsiValues[rsiValues.length - 1];
        const rsiLabel = rsiNow === null ? "" : rsiNow >= 70 ? " · überkauft" : rsiNow <= 30 ? " · überverkauft" : " · neutral";
        const fund = deriveMetrics(selectedStock, lastPrice);
        const sma20Now = sma20Full[sma20Full.length - 1];
        const sma50Now = sma50Full[sma50Full.length - 1];
        const trendLabel = sma20Now !== null && sma50Now !== null && sma20Now !== undefined && sma50Now !== undefined
            ? sma20Now >= sma50Now
                ? "Aufwärtstrend"
                : "Abwärtstrend"
            : "–";
        const metricStat = (label, value, cls = "") => el("div", { class: "stat" }, [el("div", { class: "label" }, [label]), el("div", { class: `value ${cls}`.trim() }, [value])]);
        const chartCard = el("div", { class: "card" }, [
            el("div", { class: "chart-head" }, [
                el("h2", {}, [`${selectedStock.name} (${selectedStock.ticker})`]),
                el("div", { class: "chart-price" }, [
                    el("span", { class: "num" }, [formatCurrency(lastPrice)]),
                    el("span", { class: `num ${histChange >= 0 ? "pos" : "neg"}` }, [`${formatPercent(histChange)} gesamt`]),
                ]),
            ]),
            el("div", { class: "chart-controls" }, [
                el("div", { class: "seg-group", role: "group", "aria-label": "Zeitraum" }, windowButtons),
                smaToggle("SMA 20", "swatch-accent", showSma20, (v) => (showSma20 = v)),
                smaToggle("SMA 50", "swatch-down", showSma50, (v) => (showSma50 = v)),
            ]),
            candles.length === 0
                ? el("p", { class: "muted" }, ["Noch keine Kerzen vorhanden – spule die Zeit vor, um Kursdaten zu erzeugen."])
                : canvas,
            el("div", { class: "stat-row metric-row" }, [
                metricStat("52-T-Hoch / -Tief", `${high52.toFixed(2)} / ${low52.toFixed(2)} €`),
                metricStat("Abstand vom Hoch", formatPercent(distFromHigh), distFromHigh >= -0.02 ? "pos" : distFromHigh <= -0.2 ? "neg" : ""),
                metricStat("Volatilität p.a.", stockVola !== null ? formatPercent(stockVola).replace("+", "") : "–"),
                metricStat("RSI (14)", rsiNow !== null ? `${rsiNow}${rsiLabel}` : "–", rsiNow !== null && (rsiNow >= 70 || rsiNow <= 30) ? "neg" : ""),
                metricStat("Trend (SMA 20/50)", trendLabel, trendLabel === "Aufwärtstrend" ? "pos" : trendLabel === "Abwärtstrend" ? "neg" : ""),
                metricStat("KGV", fund.kgv !== null ? fund.kgv.toFixed(1) : "–"),
                metricStat("Div.-Rendite", fund.dividendYield > 0 ? formatPercent(fund.dividendYield).replace("+", "") : "keine"),
            ]),
            el("p", { class: "muted" }, [
                "Alle Fundamentalkennzahlen und ihre Einordnung findest du im ",
                el("a", { href: "#/screener" }, ["Aktien-Screener"]),
                ".",
            ]),
        ]);
        // --- Market table ---
        const watchlist = loadWatchlist();
        const priceInfo = (stock) => {
            const hist = priceHistory(stock, state.day);
            const price = hist[hist.length - 1];
            const prevPrice = hist.length > 1 ? hist[hist.length - 2] : price;
            return { price, change: prevPrice ? (price - prevPrice) / prevPrice : 0 };
        };
        const starButton = (stockId, watched) => {
            const btn = el("button", {
                class: `btn-star${watched ? " watched" : ""}`,
                title: watched ? "Von der Merkliste entfernen" : "Zur Merkliste hinzufügen",
                "aria-label": watched ? "Von der Merkliste entfernen" : "Zur Merkliste hinzufügen",
                "aria-pressed": String(watched),
            }, [symbol("star", watched)]);
            btn.addEventListener("click", () => {
                toggleWatchlist(stockId);
                container.replaceChildren(build());
            });
            return btn;
        };
        const marketRows = STOCKS.map((stock) => {
            const { price, change } = priceInfo(stock);
            const row = el("tr", { class: stock.id === selectedStockId ? "selected-row" : undefined }, [
                el("td", {}, [starButton(stock.id, watchlist.includes(stock.id))]),
                el("td", {}, [el("a", { href: "#" }, [`${stock.name} (${stock.ticker})`])]),
                el("td", {}, [stock.sector]),
                el("td", { class: "num" }, [formatCurrency(price)]),
                el("td", { class: `num ${change >= 0 ? "pos" : "neg"}` }, [formatPercent(change)]),
            ]);
            const link = row.querySelector("a");
            link.addEventListener("click", (e) => {
                e.preventDefault();
                selectedStockId = stock.id;
                container.replaceChildren(build());
            });
            return row;
        });
        const marketCard = el("div", { class: "card" }, [
            el("h2", {}, ["Marktübersicht"]),
            el("table", {}, [
                el("thead", {}, [el("tr", {}, [el("th", {}, [""]), el("th", {}, ["Unternehmen"]), el("th", {}, ["Branche"]), el("th", { class: "num" }, ["Kurs"]), el("th", { class: "num" }, ["Tagesänd."])])]),
                el("tbody", {}, marketRows),
            ]),
        ]);
        // --- Merkliste (Watchlist) ---
        const watchedStocks = STOCKS.filter((s) => watchlist.includes(s.id));
        const watchCard = el("div", { class: "card" }, [
            el("h2", { class: "page-title" }, [symbol("star", true), "Merkliste"]),
            watchedStocks.length === 0
                ? el("p", { class: "muted" }, [
                    "Noch keine Aktie gemerkt. Markiere in der Marktübersicht Kandidaten mit dem Stern, um sie hier im Blick zu behalten – so beobachtest du Titel, bevor du handelst.",
                ])
                : el("table", {}, [
                    el("thead", {}, [
                        el("tr", {}, [
                            el("th", {}, [""]),
                            el("th", {}, ["Unternehmen"]),
                            el("th", { class: "num" }, ["Kurs"]),
                            el("th", { class: "num" }, ["Tagesänd."]),
                            el("th", {}, [""]),
                        ]),
                    ]),
                    el("tbody", {}, watchedStocks.map((stock) => {
                        const { price, change } = priceInfo(stock);
                        const selectBtn = el("button", { class: "btn secondary btn-inline" }, ["Auswählen"]);
                        selectBtn.addEventListener("click", () => {
                            selectedStockId = stock.id;
                            container.replaceChildren(build());
                        });
                        return el("tr", {}, [
                            el("td", {}, [starButton(stock.id, true)]),
                            el("td", {}, [`${stock.name} (${stock.ticker})`]),
                            el("td", { class: "num" }, [formatCurrency(price)]),
                            el("td", { class: `num ${change >= 0 ? "pos" : "neg"}` }, [formatPercent(change)]),
                            el("td", {}, [selectBtn]),
                        ]);
                    })),
                ]),
        ]);
        // --- Trade form ---
        const stockSelect = el("select", { id: "trade-stock" }, STOCKS.map((s) => el("option", { value: s.id, selected: s.id === selectedStockId }, [`${s.name} (${s.ticker})`])));
        const sharesInput = el("input", { type: "number", min: "1", step: "1", value: "1", id: "trade-shares" });
        const message = el("div", { class: "trade-message" }, []);
        const orderKindSelect = el("select", { id: "trade-kind" }, [
            el("option", { value: "market", selected: true }, ["Market (sofort)"]),
            el("option", { value: "limit" }, ["Limit"]),
            el("option", { value: "stop" }, ["Stop / Stop-Loss"]),
            el("option", { value: "trailing" }, ["Trailing-Stop (Verkauf)"]),
            el("option", { value: "bracket" }, ["OCO-Bracket: Stop + Ziel (Verkauf)"]),
        ]);
        const triggerInput = el("input", { type: "number", min: "0", step: "0.01", placeholder: "z. B. 45,00", id: "trade-trigger" });
        const triggerText = el("span", {}, ["Auslösekurs (€)"]);
        const triggerLabel = el("label", { class: "trigger-field" }, [triggerText, triggerInput]);
        const takeProfitInput = el("input", { type: "number", min: "0", step: "0.01", placeholder: "z. B. 55,00", id: "trade-takeprofit" });
        const takeProfitLabel = el("label", { class: "trigger-field" }, ["Ziel-Kurs / Take-Profit (€)", takeProfitInput]);
        const tifSelect = el("select", { id: "trade-tif" }, [
            el("option", { value: "gtc", selected: true }, ["Bis auf Widerruf (GTC)"]),
            el("option", { value: "day" }, ["Nur nächster Handelstag"]),
        ]);
        const tifLabel = el("label", {}, ["Gültigkeit", tifSelect]);
        const syncTrigger = () => {
            const kind = orderKindSelect.value;
            triggerLabel.style.display = kind === "market" ? "none" : "";
            takeProfitLabel.style.display = kind === "bracket" ? "" : "none";
            // Trailing-Stops bleiben bewusst GTC: eine nachziehende Absicherung nur für einen Tag ergäbe keinen Sinn.
            tifLabel.style.display = kind === "market" || kind === "trailing" ? "none" : "";
            triggerText.textContent = kind === "trailing" ? "Abstand zur Hochmarke (%)" : kind === "bracket" ? "Stop-Kurs (€)" : "Auslösekurs (€)";
            triggerInput.placeholder = kind === "trailing" ? "z. B. 8" : "z. B. 45,00";
        };
        orderKindSelect.addEventListener("change", syncTrigger);
        syncTrigger();
        // --- Live-Kostenvorschau: Ordervolumen, Gebühr und Kaufkraft vor dem Klick ---
        const preview = el("div", { class: "trade-preview" }, []);
        const maxBtn = makeButton("Max.", "secondary btn-inline", () => {
            const stock = stockById(stockSelect.value);
            if (!stock)
                return;
            // Käufe laufen zum Briefkurs (Ask) – der Max-Rechner muss dieselbe Seite nutzen.
            const price = quote(stock, state.day).ask;
            // Größte Stückzahl, deren Gesamtkosten (inkl. Gebühr) ins Barguthaben passen.
            let n = Math.floor(state.cash / (price * (1 + ORDER_FEE_RATE)));
            while (n > 0 && price * n + orderFee(price * n) > state.cash)
                n--;
            sharesInput.value = String(Math.max(0, n));
            updatePreview();
        });
        const updatePreview = () => {
            const stock = stockById(stockSelect.value);
            const shares = sharesInput.valueAsNumber;
            if (!stock || !(shares > 0)) {
                preview.textContent = "";
                return;
            }
            const q = quote(stock, state.day);
            const buyVolume = q.ask * shares;
            const fee = orderFee(buyVolume);
            const held = state.positions[stock.id]?.shares ?? 0;
            preview.replaceChildren(el("span", {}, [`Geld/Brief ${q.bid.toFixed(2)} / ${q.ask.toFixed(2)} €`]), el("span", {}, [`Kaufvolumen ${formatCurrency(buyVolume)}`]), el("span", {}, [`Gebühr ${formatCurrency(fee)}`]), el("span", { class: buyVolume + fee > state.cash ? "neg" : "" }, [`Kauf gesamt ${formatCurrency(buyVolume + fee)}`]), el("span", {}, [`Kaufkraft ${formatCurrency(state.cash)}`]), el("span", {}, [`Im Depot: ${held} Stk.`]));
        };
        stockSelect.addEventListener("change", updatePreview);
        sharesInput.addEventListener("input", updatePreview);
        // valueAsNumber liefert bei leerer oder nicht-numerischer Eingabe NaN und bei
        // Dezimalzahlen den echten Wert – so lehnen die Prüfungen in buy()/sell()/placeOrder()
        // ungültige Eingaben ab, statt sie stillschweigend abzuschneiden (parseInt-Fallstrick).
        const submit = (side) => {
            const shares = sharesInput.valueAsNumber;
            const kind = orderKindSelect.value;
            const tif = tifSelect.value;
            const result = kind === "market"
                ? side === "buy"
                    ? buy(stockSelect.value, shares)
                    : sell(stockSelect.value, shares)
                : kind === "trailing"
                    ? side === "sell"
                        ? placeTrailingStop(stockSelect.value, shares, triggerInput.valueAsNumber)
                        : { ok: false, message: "Trailing-Stops gibt es nur als Verkaufsorder – sie sichern eine bestehende Position ab." }
                    : kind === "bracket"
                        ? side === "sell"
                            ? placeBracketOrder(stockSelect.value, shares, triggerInput.valueAsNumber, takeProfitInput.valueAsNumber, tif)
                            : { ok: false, message: "Ein OCO-Bracket gibt es nur als Verkaufspaar – es sichert eine bestehende Position mit Stop-Loss und Take-Profit ab." }
                        : placeOrder(stockSelect.value, side, kind, shares, triggerInput.valueAsNumber, tif);
            message.textContent = result.message;
            message.className = `trade-message ${result.ok ? "ok" : "error"}`;
            if (result.ok) {
                checkAchievements(loadPortfolio());
                crashResult = null;
                refresh();
            }
        };
        const buyBtn = makeButton("Kaufen", "", () => submit("buy"));
        const sellBtn = makeButton("Verkaufen", "secondary", () => submit("sell"));
        const tradeCard = el("div", { class: "card" }, [
            el("h2", {}, ["Handeln"]),
            el("div", { class: "trade-form" }, [
                el("label", {}, ["Aktie", stockSelect]),
                el("label", { class: "shares-field" }, ["Stückzahl", el("div", { class: "shares-row" }, [sharesInput, maxBtn])]),
                el("label", {}, ["Orderart", orderKindSelect]),
                triggerLabel,
                takeProfitLabel,
                tifLabel,
                buyBtn,
                sellBtn,
            ]),
            preview,
            message,
        ]);
        queueMicrotask(updatePreview);
        // --- Risiko-/Positionsgrößen-Rechner (1-%-Regel) ---
        const calcCapital = portfolioValue(state);
        const riskPctInput = el("input", { type: "number", min: "0.1", step: "0.1", value: "1" });
        const entryInput = el("input", { type: "number", min: "0", step: "0.01", value: currentPrice(stockById(selectedStockId), state.day).toFixed(2) });
        const stopInput = el("input", { type: "number", min: "0", step: "0.01", placeholder: "Stop-Kurs" });
        const calcResult = el("div", { class: "trade-message" }, []);
        let suggestedShares = 0;
        const applyCalcBtn = makeButton("In Stückzahl übernehmen", "secondary", () => {
            if (suggestedShares > 0) {
                sharesInput.value = String(suggestedShares);
                stockSelect.value = selectedStockId;
            }
        });
        const recompute = () => {
            const risk = riskPctInput.valueAsNumber;
            const entry = entryInput.valueAsNumber;
            const stop = stopInput.valueAsNumber;
            if (!(risk > 0) || !(entry > 0) || !(stop > 0) || entry <= stop) {
                suggestedShares = 0;
                calcResult.textContent = "Bitte Risiko in %, Einstiegs- und Stop-Kurs angeben (Stop muss unter dem Einstieg liegen).";
                calcResult.className = "trade-message";
                applyCalcBtn.setAttribute("disabled", "true");
                return;
            }
            const riskAmount = (calcCapital * risk) / 100;
            suggestedShares = Math.floor(riskAmount / (entry - stop));
            calcResult.textContent = `Empfohlene Stückzahl: ${suggestedShares} · Risiko ${formatCurrency(riskAmount)} · Positionswert ${formatCurrency(suggestedShares * entry)}`;
            calcResult.className = "trade-message ok";
            if (suggestedShares > 0)
                applyCalcBtn.removeAttribute("disabled");
            else
                applyCalcBtn.setAttribute("disabled", "true");
        };
        [riskPctInput, entryInput, stopInput].forEach((i) => i.addEventListener("input", recompute));
        recompute();
        const calcCard = el("div", { class: "card" }, [
            el("h2", {}, ["Positionsgrößen-Rechner"]),
            el("p", { class: "muted" }, [
                `Nach der Profi-Regel: riskiere pro Trade nur einen kleinen Teil deines Kapitals (aktuell ${formatCurrency(calcCapital)}). Die Stückzahl ergibt sich aus Risiko und Stop-Abstand.`,
            ]),
            el("div", { class: "trade-form" }, [
                el("label", {}, ["Risiko (% vom Kapital)", riskPctInput]),
                el("label", {}, ["Einstiegskurs (€)", entryInput]),
                el("label", {}, ["Stop-Kurs (€)", stopInput]),
                applyCalcBtn,
            ]),
            calcResult,
        ]);
        // --- Offene (Limit-/Stop-) Orders ---
        const orders = pendingOrders(state);
        const ordersCard = orders.length === 0
            ? null
            : el("div", { class: "card" }, [
                el("h2", {}, ["Offene Orders"]),
                el("p", { class: "muted" }, [
                    "Diese Orders werden beim Vorspulen der Zeit ausgeführt, sobald der Auslösekurs erreicht wird. Stop- und Trailing-Orders handeln dann zur schlechteren Seite der Geld-Brief-Spanne (Slippage), Limit-Orders nicht. OCO-Paare werden gemeinsam storniert.",
                ]),
                el("table", {}, [
                    el("thead", {}, [
                        el("tr", {}, [
                            el("th", {}, ["Aktie"]),
                            el("th", {}, ["Art"]),
                            el("th", {}, ["Seite"]),
                            el("th", { class: "num" }, ["Stück"]),
                            el("th", { class: "num" }, ["Auslösekurs"]),
                            el("th", {}, ["Gültigkeit"]),
                            el("th", {}, [""]),
                        ]),
                    ]),
                    el("tbody", {}, orders.map((o) => {
                        const stock = stockById(o.stockId);
                        const cancelBtn = el("button", { class: "btn secondary btn-inline" }, ["Stornieren"]);
                        cancelBtn.addEventListener("click", () => {
                            cancelPendingOrder(o.id);
                            refresh();
                        });
                        const kindLabel = o.kind === "trailing"
                            ? `Trailing (${o.trailPct} %)`
                            : o.ocoGroup
                                ? o.kind === "stop"
                                    ? "Stop-Loss (OCO)"
                                    : "Take-Profit (OCO)"
                                : o.kind === "limit"
                                    ? "Limit"
                                    : "Stop";
                        return el("tr", {}, [
                            el("td", {}, [stock ? `${stock.name} (${stock.ticker})` : o.stockId]),
                            el("td", {}, [kindLabel]),
                            el("td", {}, [o.side === "buy" ? "Kauf" : "Verkauf"]),
                            el("td", { class: "num" }, [String(o.shares)]),
                            el("td", { class: "num" }, [formatCurrency(o.triggerPrice)]),
                            el("td", {}, [o.tif === "day" ? "Tagesorder" : "GTC"]),
                            el("td", {}, [cancelBtn]),
                        ]);
                    })),
                ]),
            ]);
        // --- Holdings ---
        const holdingEntries = Object.entries(state.positions);
        const holdingsCard = el("div", { class: "card" }, [
            el("h2", {}, ["Deine Positionen"]),
            holdingEntries.length === 0
                ? el("p", { class: "muted" }, ["Noch keine Position eröffnet."])
                : el("table", {}, [
                    el("thead", {}, [
                        el("tr", {}, [
                            el("th", {}, ["Aktie"]),
                            el("th", { class: "num" }, ["Stück"]),
                            el("th", { class: "num" }, ["Ø Kaufkurs"]),
                            el("th", { class: "num" }, ["Kurs"]),
                            el("th", { class: "num" }, ["Tagesänd."]),
                            el("th", { class: "num" }, ["Wert"]),
                            el("th", { class: "num" }, ["Gewicht"]),
                            el("th", { class: "num" }, ["G/V"]),
                        ]),
                    ]),
                    el("tbody", {}, holdingEntries.map(([stockId, pos]) => {
                        const stock = stockById(stockId);
                        const { price, change } = priceInfo(stock);
                        const posValue = price * pos.shares;
                        const gain = (price - pos.avgPrice) * pos.shares;
                        const gainPct = pos.avgPrice ? (price - pos.avgPrice) / pos.avgPrice : 0;
                        // Depotgewicht relativ zum Gesamtwert (inkl. Cash) – Basis für Klumpenrisiko-Betrachtung.
                        const weight = value > 0 ? posValue / value : 0;
                        return el("tr", {}, [
                            el("td", {}, [`${stock.name} (${stock.ticker})`]),
                            el("td", { class: "num" }, [String(pos.shares)]),
                            el("td", { class: "num" }, [formatCurrency(pos.avgPrice)]),
                            el("td", { class: "num" }, [formatCurrency(price)]),
                            el("td", { class: `num ${change >= 0 ? "pos" : "neg"}` }, [formatPercent(change)]),
                            el("td", { class: "num" }, [formatCurrency(posValue)]),
                            el("td", { class: "num" }, [`${(weight * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} %`]),
                            el("td", { class: `num ${gain >= 0 ? "pos" : "neg"}` }, [`${formatCurrency(gain)} (${formatPercent(gainPct)})`]),
                        ]);
                    })),
                ]),
        ]);
        // --- Transactions ---
        const txRows = state.transactions.slice(0, 15).map((tx) => {
            const stock = stockById(tx.stockId);
            const typeLabel = tx.type === "buy" ? "Kauf" : tx.type === "sell" ? "Verkauf" : "Dividende";
            return el("tr", {}, [
                el("td", {}, [`Tag ${tx.day}`]),
                el("td", {}, [tx.type === "dividend" ? el("span", { class: "pos" }, [typeLabel]) : typeLabel]),
                el("td", {}, [stock ? `${stock.name} (${stock.ticker})` : tx.stockId]),
                el("td", { class: "num" }, [String(tx.shares)]),
                el("td", { class: "num" }, [tx.type === "dividend" ? `${formatCurrency(tx.price)} je Aktie` : formatCurrency(tx.price)]),
                el("td", { class: "num" }, [tx.fee ? formatCurrency(tx.fee) : "–"]),
            ]);
        });
        const txCard = el("div", { class: "card" }, [
            el("h2", {}, ["Letzte Transaktionen"]),
            txRows.length === 0
                ? el("p", { class: "muted" }, ["Noch keine Transaktionen."])
                : el("table", {}, [
                    el("thead", {}, [el("tr", {}, [el("th", {}, ["Tag"]), el("th", {}, ["Typ"]), el("th", {}, ["Aktie"]), el("th", { class: "num" }, ["Stück"]), el("th", { class: "num" }, ["Kurs"]), el("th", { class: "num" }, ["Gebühr"])])]),
                    el("tbody", {}, txRows),
                ]),
        ]);
        // --- Equity-Kurve: echter Depotverlauf (Transaktions-Replay) vs. Vergleichsindex ---
        let equityCard = null;
        let equityCanvas = null;
        let equitySeries = [];
        let benchmarkSeries = [];
        if (state.day > 0 && state.transactions.length > 0) {
            equitySeries = equityCurve(state);
            benchmarkSeries = marketIndexSeries(state.day).map((v) => v * STARTKAPITAL);
            const outperformance = equitySeries[equitySeries.length - 1] / STARTKAPITAL - benchmarkSeries[benchmarkSeries.length - 1] / STARTKAPITAL;
            equityCanvas = el("canvas", {
                class: "chart",
                role: "img",
                "aria-label": `Depotwert-Verlauf über ${state.day} Handelstage im Vergleich zum Marktindex.`,
            });
            equityCard = el("div", { class: "card" }, [
                el("h2", { class: "page-title" }, [symbol("show_chart"), "Depotentwicklung vs. Markt"]),
                el("div", { class: "chart-legend" }, [
                    el("span", { class: "legend-item" }, [el("span", { class: "legend-swatch swatch-accent" }, []), "Dein Depot (exakt aus deinen Transaktionen)"]),
                    el("span", { class: "legend-item" }, [el("span", { class: "legend-swatch swatch-muted" }, []), "Vergleichsindex (alle 8 Aktien, gleichgewichtet)"]),
                    el("span", { class: `legend-item num ${outperformance >= 0 ? "pos" : "neg"}` }, [
                        `${outperformance >= 0 ? "Outperformance" : "Underperformance"}: ${formatPercent(outperformance)}`,
                    ]),
                ]),
                equityCanvas,
                el("p", { class: "muted" }, [
                    "Profis messen ihre Leistung nie absolut, sondern immer relativ zu einem Vergleichsindex (Benchmark) – so siehst du auf einen Blick, ob du den Markt schlägst.",
                ]),
            ]);
        }
        // --- Trade-Statistik (abgeschlossene Trades) & Steuer-Didaktik ---
        const stats = computeTradeStats(state);
        const dividends = state.dividendsReceived ?? 0;
        let statsCard = null;
        if (stats.closedTrades > 0 || dividends > 0) {
            const fmtRatio = (v, infinite) => (v !== null ? v.toFixed(2) : infinite ? "∞" : "–");
            const taxableGains = Math.max(0, realizedPnl) + dividends;
            const estimatedTax = Math.max(0, taxableGains - SAVER_ALLOWANCE) * CAPITAL_GAINS_TAX_RATE;
            statsCard = el("div", { class: "card" }, [
                el("h2", { class: "page-title" }, [symbol("query_stats"), "Trade-Statistik"]),
                el("p", { class: "muted" }, [
                    "Kennzahlen deiner abgeschlossenen Trades (jeder Verkauf zählt als abgeschlossener Trade). Profis bewerten ihr Trading nicht am einzelnen Gewinn, sondern an Win-Rate, Profit-Faktor und Payoff-Ratio über viele Trades.",
                ]),
                el("div", { class: "stat-row" }, [
                    el("div", { class: "stat" }, [el("div", { class: "label" }, ["Trades (Gewinner/Verlierer)"]), el("div", { class: "value" }, [`${stats.closedTrades} (${stats.wins}/${stats.losses})`])]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Win-Rate"]),
                        el("div", { class: "value" }, [stats.winRate !== null ? `${Math.round(stats.winRate * 100)} %` : "–"]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Profit-Faktor"]),
                        el("div", { class: "value" }, [fmtRatio(stats.profitFactor, stats.wins > 0 && stats.losses === 0)]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Payoff-Ratio (Ø Gewinn/Ø Verlust)"]),
                        el("div", { class: "value" }, [fmtRatio(stats.payoffRatio, stats.wins > 0 && stats.losses === 0)]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Bester Trade"]),
                        el("div", { class: `value ${stats.best !== null ? (stats.best >= 0 ? "pos" : "neg") : ""}` }, [stats.best !== null ? formatCurrency(stats.best) : "–"]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Schlechtester Trade"]),
                        el("div", { class: `value ${stats.worst !== null ? (stats.worst >= 0 ? "pos" : "neg") : ""}` }, [stats.worst !== null ? formatCurrency(stats.worst) : "–"]),
                    ]),
                ]),
                el("p", { class: "muted" }, [
                    `Steuer-Merker: Auf realisierte Gewinne und Dividenden von zusammen ${formatCurrency(taxableGains)} fielen in Deutschland real ca. ${formatCurrency(estimatedTax)} Abgeltungsteuer an (26,375 % inkl. Soli, nach Sparerpauschbetrag von ${formatCurrency(SAVER_ALLOWANCE)}). Der Simulator zieht keine Steuern ab – im echten Depot schmälern sie deine Rendite.`,
                ]),
            ]);
        }
        // --- Portfolio Health Check (Diversifikation & Risikokennzahlen) ---
        const health = computeHealthCheck(state);
        const healthCard = holdingEntries.length === 0
            ? null
            : el("div", { class: "card card-outlined health-card" }, [
                el("h2", { class: "page-title" }, [symbol("monitor_heart"), "Portfolio Health Check"]),
                el("div", { class: "level-row" }, [
                    el("span", { class: "level-chip" }, [`Diversifikations-Score: ${health.diversificationScore} / 100`]),
                    el("span", { class: "muted" }, [`${health.diversificationLabel} · HHI ${health.hhi}`]),
                ]),
                el("p", { class: "muted" }, [
                    "So ist dein Kapital gestreut – je breiter über Branchen und Barguthaben verteilt, desto geringer das Klumpenrisiko.",
                ]),
                el("div", { class: "allocation" }, [
                    ...health.sectorWeights.map((s) => allocationRow(s.sector, s.value, value)),
                    allocationRow("Barguthaben", state.cash, value),
                ]),
                ...health.warnings.map((w) => el("p", { class: "streak-warning health-warning with-icon" }, [symbol("warning", true), w])),
                el("div", { class: "stat-row" }, [
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Rendite p.a."]),
                        el("div", { class: `value ${health.annualReturn !== null && health.annualReturn < 0 ? "neg" : "pos"}` }, [
                            health.annualReturn !== null ? formatPercent(health.annualReturn) : "–",
                        ]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Volatilität p.a."]),
                        el("div", { class: "value" }, [health.annualVolatility !== null ? formatPercent(health.annualVolatility).replace("+", "") : "–"]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Sharpe Ratio"]),
                        el("div", { class: "value" }, [health.sharpeRatio !== null ? health.sharpeRatio.toFixed(2) : "–"]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Sortino Ratio"]),
                        el("div", { class: "value" }, [health.sortinoRatio !== null ? health.sortinoRatio.toFixed(2) : "–"]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Portfolio-Beta"]),
                        el("div", { class: "value" }, [health.beta !== null ? health.beta.toFixed(2) : "–"]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Max Drawdown"]),
                        el("div", { class: "value neg" }, [health.maxDrawdownPct !== null ? formatPercent(-health.maxDrawdownPct) : "–"]),
                    ]),
                ]),
                el("p", { class: "muted" }, [
                    health.hasHistory
                        ? "Kennzahlen basieren auf deinem echten Depotverlauf (Transaktions-Replay ab dem ersten Trade; annualisiert auf 252 Handelstage, risikofreier Zins 2 % p.a., Vergleichsindex = Durchschnitt aller 8 Aktien). Die Sortino Ratio bestraft im Gegensatz zur Sharpe Ratio nur Abwärtsschwankungen."
                        : `Noch nicht genug Handelstage für die Risikokennzahlen (mindestens ${MIN_HISTORY_DAYS} Handelstage seit deinem ersten Trade nötig – nutze „+Tage vorspulen").`,
                ]),
            ]);
        // --- Börsen-Stresstest & Crash-Simulator ---
        const scenarioButtons = CRASH_SCENARIOS.map((scenario) => makeButton(`${scenario.name} (${scenario.period})`, "secondary", () => {
            crashResult = simulateCrash(state, scenario);
            refresh();
        }));
        const crashReport = crashResult
            ? el("div", { class: "card crash-report" }, [
                el("div", { class: "actions crash-report-head" }, [
                    el("h3", { class: "page-title" }, [symbol("trending_down"), `${crashResult.scenario.name} (${crashResult.scenario.period})`]),
                    makeButton("Schließen", "secondary", () => {
                        crashResult = null;
                        refresh();
                    }),
                ]),
                el("p", { class: "muted" }, [crashResult.scenario.description]),
                el("div", { class: "stat-row" }, [
                    el("div", { class: "stat" }, [el("div", { class: "label" }, ["Depotwert vorher"]), el("div", { class: "value" }, [formatCurrency(crashResult.valueBefore)])]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Tiefstwert"]),
                        el("div", { class: "value neg" }, [formatCurrency(crashResult.valueAtTrough)]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Max. Buchverlust"]),
                        el("div", { class: "value neg" }, [`${formatCurrency(crashResult.troughLossAmount)} (${formatPercent(-crashResult.troughLossPct)})`]),
                    ]),
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, [`Wert ${crashResult.scenario.recoveryLabel}`]),
                        el("div", { class: `value ${crashResult.recoveryLossAmount <= 0 ? "pos" : "neg"}` }, [
                            `${formatCurrency(crashResult.valueAfterRecovery)} (${formatPercent(-crashResult.recoveryLossPct)})`,
                        ]),
                    ]),
                ]),
                crashResult.positionImpacts.length === 0
                    ? null
                    : el("table", {}, [
                        el("thead", {}, [
                            el("tr", {}, [
                                el("th", {}, ["Aktie"]),
                                el("th", {}, ["Branche"]),
                                el("th", { class: "num" }, ["Wert vorher"]),
                                el("th", { class: "num" }, ["Am Tiefpunkt"]),
                                el("th", { class: "num" }, ["Verlust"]),
                            ]),
                        ]),
                        el("tbody", {}, crashResult.positionImpacts.map((p) => el("tr", {}, [
                            el("td", {}, [p.name]),
                            el("td", {}, [p.sector]),
                            el("td", { class: "num" }, [formatCurrency(p.valueBefore)]),
                            el("td", { class: "num" }, [formatCurrency(p.valueAtTrough)]),
                            el("td", { class: "num neg" }, [`${formatCurrency(p.lossAmount)} (${formatPercent(-p.lossPct)})`]),
                        ]))),
                    ]),
                el("h4", {}, ["Empfehlungen"]),
                el("ul", { class: "crash-recommendations" }, crashResult.recommendations.map((r) => el("li", {}, [r]))),
            ])
            : null;
        const crashCard = el("div", { class: "card" }, [
            el("h2", { class: "page-title" }, [symbol("crisis_alert"), "Börsen-Stresstest"]),
            el("p", { class: "muted" }, [
                "Schicke dein aktuelles Depot durch eine historische Krise: reine Simulation auf Basis deiner jetzigen Positionen – dein echtes Depot bleibt unverändert.",
            ]),
            el("div", { class: "actions" }, scenarioButtons),
        ]);
        const wrapper = el("div", {}, [
            header,
            chartCard,
            marketCard,
            watchCard,
            tradeCard,
            calcCard,
            ordersCard,
            holdingsCard,
            equityCard,
            statsCard,
            healthCard,
            crashCard,
            crashReport,
            txCard,
        ]);
        queueMicrotask(() => {
            if (candles.length > 0)
                drawCandleChart(canvas, candles, overlays);
            if (equityCanvas)
                drawEquityChart(equityCanvas, equitySeries, benchmarkSeries);
        });
        return wrapper;
    }
    function makeButton(label, variant, onClick) {
        const btn = el("button", { class: `btn ${variant}`.trim() }, [label]);
        btn.addEventListener("click", onClick);
        return btn;
    }
    container.append(build());
    return container;
}
