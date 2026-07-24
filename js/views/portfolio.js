import { el } from "../dom.js";
import { STOCKS, currentPrice, priceHistory, stockById } from "../market.js";
import { loadPortfolio, loadProgress, resetPortfolio, STARTKAPITAL, loadWatchlist, toggleWatchlist } from "../state.js";
import { advanceDay, buy, sell, portfolioValue, placeOrder, cancelPendingOrder, pendingOrders } from "../portfolio.js";
import { formatCurrency, formatPercent } from "../util.js";
import { MODULES } from "../content/index.js";
import { loadGamification } from "../gamification.js";
import { evaluateAchievements } from "../achievements.js";
import { showToast } from "../toast.js";
import { computeHealthCheck, MIN_HISTORY_DAYS } from "../risk.js";
import { CRASH_SCENARIOS, simulateCrash } from "../crashtest.js";
function checkAchievements(portfolioState) {
    evaluateAchievements({
        progress: loadProgress(),
        modules: MODULES,
        gamification: loadGamification(),
        portfolio: portfolioState,
    }).forEach((a) => showToast(`🏆 Erfolg freigeschaltet: ${a.icon} ${a.title}`, "achievement"));
}
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
    let crashResult = null;
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
                el("div", { class: "stat" }, [
                    el("div", { class: "label" }, ["Realisierter G/V"]),
                    el("div", { class: `value ${realizedPnl >= 0 ? "pos" : "neg"}` }, [formatCurrency(realizedPnl)]),
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
            }, [watched ? "★" : "☆"]);
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
            el("h2", {}, ["★ Merkliste"]),
            watchedStocks.length === 0
                ? el("p", { class: "muted" }, [
                    "Noch keine Aktie gemerkt. Markiere in der Marktübersicht Kandidaten mit ☆, um sie hier im Blick zu behalten – so beobachtest du Titel, bevor du handelst.",
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
        ]);
        const triggerInput = el("input", { type: "number", min: "0", step: "0.01", placeholder: "z. B. 45,00", id: "trade-trigger" });
        const triggerLabel = el("label", { class: "trigger-field" }, ["Auslösekurs (€)", triggerInput]);
        const syncTrigger = () => {
            triggerLabel.style.display = orderKindSelect.value === "market" ? "none" : "";
        };
        orderKindSelect.addEventListener("change", syncTrigger);
        syncTrigger();
        // valueAsNumber liefert bei leerer oder nicht-numerischer Eingabe NaN und bei
        // Dezimalzahlen den echten Wert – so lehnen die Prüfungen in buy()/sell()/placeOrder()
        // ungültige Eingaben ab, statt sie stillschweigend abzuschneiden (parseInt-Fallstrick).
        const submit = (side) => {
            const shares = sharesInput.valueAsNumber;
            const kind = orderKindSelect.value;
            const result = kind === "market"
                ? side === "buy"
                    ? buy(stockSelect.value, shares)
                    : sell(stockSelect.value, shares)
                : placeOrder(stockSelect.value, side, kind, shares, triggerInput.valueAsNumber);
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
                el("label", {}, ["Stückzahl", sharesInput]),
                el("label", {}, ["Orderart", orderKindSelect]),
                triggerLabel,
                buyBtn,
                sellBtn,
            ]),
            message,
        ]);
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
                    "Diese Orders werden beim Vorspulen der Zeit ausgeführt, sobald der Auslösekurs erreicht wird.",
                ]),
                el("table", {}, [
                    el("thead", {}, [
                        el("tr", {}, [
                            el("th", {}, ["Aktie"]),
                            el("th", {}, ["Art"]),
                            el("th", {}, ["Seite"]),
                            el("th", { class: "num" }, ["Stück"]),
                            el("th", { class: "num" }, ["Auslösekurs"]),
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
                        return el("tr", {}, [
                            el("td", {}, [stock ? `${stock.name} (${stock.ticker})` : o.stockId]),
                            el("td", {}, [o.kind === "limit" ? "Limit" : "Stop"]),
                            el("td", {}, [o.side === "buy" ? "Kauf" : "Verkauf"]),
                            el("td", { class: "num" }, [String(o.shares)]),
                            el("td", { class: "num" }, [formatCurrency(o.triggerPrice)]),
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
        // --- Portfolio Health Check (Diversifikation & Risikokennzahlen) ---
        const health = computeHealthCheck(state);
        const healthCard = holdingEntries.length === 0
            ? null
            : el("div", { class: "card card-outlined health-card" }, [
                el("h2", {}, ["🩺 Portfolio Health Check"]),
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
                ...health.warnings.map((w) => el("p", { class: "streak-warning health-warning" }, [`⚠️ ${w}`])),
                el("div", { class: "stat-row" }, [
                    el("div", { class: "stat" }, [
                        el("div", { class: "label" }, ["Sharpe Ratio"]),
                        el("div", { class: "value" }, [health.sharpeRatio !== null ? health.sharpeRatio.toFixed(2) : "–"]),
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
                        ? "Kennzahlen basieren auf deiner aktuellen Depot-Zusammensetzung, angewendet auf den bisherigen Kursverlauf (didaktische Näherung; annualisiert auf 252 Handelstage, risikofreier Zins 2 % p.a., Vergleichsindex = Durchschnitt aller 8 Aktien)."
                        : `Noch nicht genug Handelstage für Sharpe Ratio, Beta und Max Drawdown (mindestens ${MIN_HISTORY_DAYS} Handelstage Historie nötig – nutze „+Tage vorspulen").`,
                ]),
            ]);
        // --- Börsen-Stresstest & Crash-Simulator ---
        const scenarioButtons = CRASH_SCENARIOS.map((scenario) => makeButton(`📉 ${scenario.name} (${scenario.period})`, "secondary", () => {
            crashResult = simulateCrash(state, scenario);
            refresh();
        }));
        const crashReport = crashResult
            ? el("div", { class: "card crash-report" }, [
                el("div", { class: "actions crash-report-head" }, [
                    el("h3", {}, [`📉 ${crashResult.scenario.name} (${crashResult.scenario.period})`]),
                    makeButton("✕ Schließen", "secondary", () => {
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
            el("h2", {}, ["🧨 Börsen-Stresstest"]),
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
            healthCard,
            crashCard,
            crashReport,
            txCard,
        ]);
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
