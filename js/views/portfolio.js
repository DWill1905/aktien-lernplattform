import { el } from "../dom.js";
import { STOCKS, currentPrice, priceHistory, stockById } from "../market.js";
import { loadPortfolio, resetPortfolio, STARTKAPITAL } from "../state.js";
import { advanceDay, buy, sell, portfolioValue } from "../portfolio.js";
import { formatCurrency, formatPercent } from "../util.js";
function drawChart(canvas, prices) {
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 180;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    if (prices.length < 2)
        return;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const padX = 8;
    const padTop = 14;
    const padBottom = 16;
    const plotH = height - padTop - padBottom;
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#1c6e5c";
    const muted = styles.getPropertyValue("--md-on-surface-variant").trim() || "#5a5a5a";
    const xAt = (i) => padX + (i / (prices.length - 1)) * (width - padX * 2);
    const yAt = (p) => padTop + (1 - (p - min) / range) * plotH;
    // Fläche unter der Kurve (dezent gefüllt)
    ctx.beginPath();
    prices.forEach((price, i) => (i === 0 ? ctx.moveTo(xAt(i), yAt(price)) : ctx.lineTo(xAt(i), yAt(price))));
    ctx.lineTo(xAt(prices.length - 1), height - padBottom);
    ctx.lineTo(xAt(0), height - padBottom);
    ctx.closePath();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.globalAlpha = 1;
    // Kurslinie
    ctx.beginPath();
    prices.forEach((price, i) => (i === 0 ? ctx.moveTo(xAt(i), yAt(price)) : ctx.lineTo(xAt(i), yAt(price))));
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();
    // Punkt am aktuellen Kurs
    const lastX = xAt(prices.length - 1);
    const lastY = yAt(prices[prices.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = accent;
    ctx.fill();
    // Beschriftung: Höchst-, Tiefst- und aktueller Kurs
    ctx.fillStyle = muted;
    ctx.font = "11px system-ui, sans-serif";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(`Hoch ${max.toFixed(2)} €`, padX, 0);
    ctx.textBaseline = "bottom";
    ctx.fillText(`Tief ${min.toFixed(2)} €`, padX, height);
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(`${prices[prices.length - 1].toFixed(2)} €`, width - padX, 0);
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
    const container = el("div", {});
    function refresh() {
        state = loadPortfolio();
        container.replaceChildren(build());
    }
    function build() {
        const value = portfolioValue(state);
        const totalReturn = (value - STARTKAPITAL) / STARTKAPITAL;
        // --- Stat header ---
        const header = el("div", { class: "card" }, [
            el("h1", {}, ["💼 Portfolio-Simulator"]),
            el("p", { class: "muted" }, [
                "Virtuelles Startkapital von ",
                formatCurrency(STARTKAPITAL),
                " · Kurse sind fiktiv und lokal generiert, ohne echtes Marktrisiko · pro Order fällt eine Gebühr von 0,25 % (mind. 1 €) an.",
            ]),
            el("div", { class: "stat-row" }, [
                el("div", { class: "stat" }, [el("div", { class: "label" }, ["Barguthaben"]), el("div", { class: "value" }, [formatCurrency(state.cash)])]),
                el("div", { class: "stat" }, [el("div", { class: "label" }, ["Depotwert gesamt"]), el("div", { class: "value" }, [formatCurrency(value)])]),
                el("div", { class: "stat" }, [
                    el("div", { class: "label" }, ["Gesamtrendite"]),
                    el("div", { class: `value ${totalReturn >= 0 ? "pos" : "neg"}` }, [formatPercent(totalReturn)]),
                ]),
                el("div", { class: "stat" }, [el("div", { class: "label" }, ["Handelstag"]), el("div", { class: "value" }, [String(state.day)])]),
            ]),
            el("div", { class: "actions" }, [
                makeButton("+1 Tag", "secondary", () => {
                    advanceDay(1);
                    refresh();
                }),
                makeButton("+5 Tage", "secondary", () => {
                    advanceDay(5);
                    refresh();
                }),
                makeButton("+20 Tage", "secondary", () => {
                    advanceDay(20);
                    refresh();
                }),
                makeButton("Depot zurücksetzen", "danger", () => {
                    if (confirm("Depot wirklich auf Startkapital zurücksetzen? Alle Positionen und Transaktionen gehen verloren.")) {
                        resetPortfolio();
                        refresh();
                    }
                }),
            ]),
        ]);
        // --- Chart ---
        const history = priceHistory(stockById(selectedStockId), state.day);
        const firstPrice = history[0];
        const lastPrice = history[history.length - 1];
        const histChange = firstPrice ? (lastPrice - firstPrice) / firstPrice : 0;
        const canvas = el("canvas", {
            class: "chart",
            role: "img",
            "aria-label": `Kursverlauf ${stockById(selectedStockId).name}: von ${formatCurrency(firstPrice)} auf ${formatCurrency(lastPrice)} (${formatPercent(histChange)}) über ${history.length - 1} Handelstage.`,
        });
        const chartCard = el("div", { class: "card" }, [
            el("h2", {}, [`Kursverlauf: ${stockById(selectedStockId).name}`]),
            canvas,
        ]);
        // --- Market table ---
        const marketRows = STOCKS.map((stock) => {
            const hist = priceHistory(stock, state.day);
            const price = hist[hist.length - 1];
            const prevPrice = hist.length > 1 ? hist[hist.length - 2] : price;
            const change = prevPrice ? (price - prevPrice) / prevPrice : 0;
            const row = el("tr", { class: stock.id === selectedStockId ? "selected-row" : undefined }, [
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
                el("thead", {}, [el("tr", {}, [el("th", {}, ["Unternehmen"]), el("th", {}, ["Branche"]), el("th", { class: "num" }, ["Kurs"]), el("th", { class: "num" }, ["Tagesänd."])])]),
                el("tbody", {}, marketRows),
            ]),
        ]);
        // --- Trade form ---
        const stockSelect = el("select", { id: "trade-stock" }, STOCKS.map((s) => el("option", { value: s.id, selected: s.id === selectedStockId }, [`${s.name} (${s.ticker})`])));
        const sharesInput = el("input", { type: "number", min: "1", step: "1", value: "1", id: "trade-shares" });
        const message = el("div", { class: "trade-message" }, []);
        // valueAsNumber liefert bei leerer oder nicht-numerischer Eingabe NaN und bei
        // Dezimalzahlen den echten Wert – so lehnt die Ganzzahl-Prüfung in buy()/sell()
        // ungültige Eingaben ab, statt sie stillschweigend abzuschneiden (parseInt-Fallstrick).
        const buyBtn = makeButton("Kaufen", "", () => {
            const result = buy(stockSelect.value, sharesInput.valueAsNumber);
            message.textContent = result.message;
            message.className = `trade-message ${result.ok ? "ok" : "error"}`;
            if (result.ok)
                refresh();
        });
        const sellBtn = makeButton("Verkaufen", "secondary", () => {
            const result = sell(stockSelect.value, sharesInput.valueAsNumber);
            message.textContent = result.message;
            message.className = `trade-message ${result.ok ? "ok" : "error"}`;
            if (result.ok)
                refresh();
        });
        const tradeCard = el("div", { class: "card" }, [
            el("h2", {}, ["Handeln"]),
            el("div", { class: "trade-form" }, [
                el("label", {}, ["Aktie", stockSelect]),
                el("label", {}, ["Stückzahl", sharesInput]),
                buyBtn,
                sellBtn,
            ]),
            message,
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
                            el("th", { class: "num" }, ["Wert"]),
                            el("th", { class: "num" }, ["G/V"]),
                        ]),
                    ]),
                    el("tbody", {}, holdingEntries.map(([stockId, pos]) => {
                        const stock = stockById(stockId);
                        const price = currentPrice(stock, state.day);
                        const value = price * pos.shares;
                        const gain = (price - pos.avgPrice) * pos.shares;
                        const gainPct = pos.avgPrice ? (price - pos.avgPrice) / pos.avgPrice : 0;
                        return el("tr", {}, [
                            el("td", {}, [`${stock.name} (${stock.ticker})`]),
                            el("td", { class: "num" }, [String(pos.shares)]),
                            el("td", { class: "num" }, [formatCurrency(pos.avgPrice)]),
                            el("td", { class: "num" }, [formatCurrency(price)]),
                            el("td", { class: "num" }, [formatCurrency(value)]),
                            el("td", { class: `num ${gain >= 0 ? "pos" : "neg"}` }, [`${formatCurrency(gain)} (${formatPercent(gainPct)})`]),
                        ]);
                    })),
                ]),
        ]);
        // --- Transactions ---
        const txRows = state.transactions.slice(0, 15).map((tx) => {
            const stock = stockById(tx.stockId);
            return el("tr", {}, [
                el("td", {}, [`Tag ${tx.day}`]),
                el("td", {}, [tx.type === "buy" ? "Kauf" : "Verkauf"]),
                el("td", {}, [stock ? `${stock.name} (${stock.ticker})` : tx.stockId]),
                el("td", { class: "num" }, [String(tx.shares)]),
                el("td", { class: "num" }, [formatCurrency(tx.price)]),
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
        // --- Aufteilung nach Branchen (Diversifikation) ---
        const investedBySector = {};
        for (const [stockId, pos] of holdingEntries) {
            const stock = stockById(stockId);
            if (!stock)
                continue;
            investedBySector[stock.sector] = (investedBySector[stock.sector] ?? 0) + pos.shares * currentPrice(stock, state.day);
        }
        const allocationCard = holdingEntries.length === 0
            ? null
            : el("div", { class: "card" }, [
                el("h2", {}, ["Aufteilung nach Branchen"]),
                el("p", { class: "muted" }, [
                    "So ist dein Kapital gestreut – je breiter über Branchen und Barguthaben verteilt, desto geringer das Klumpenrisiko.",
                ]),
                el("div", { class: "allocation" }, [
                    ...Object.entries(investedBySector)
                        .sort((a, b) => b[1] - a[1])
                        .map(([sector, part]) => allocationRow(sector, part, value)),
                    allocationRow("Barguthaben", state.cash, value),
                ]),
            ]);
        const wrapper = el("div", {}, [header, chartCard, marketCard, tradeCard, holdingsCard, allocationCard, txCard]);
        queueMicrotask(() => drawChart(canvas, history));
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
