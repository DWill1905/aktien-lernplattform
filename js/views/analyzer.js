import { el } from "../dom.js";
import { STOCKS, stockById } from "../market.js";
import { generateCandles, sma, rsi } from "../indicators.js";
import { formatCurrency, formatPercent } from "../util.js";
import { symbol } from "../shell.js";
const TOTAL_DAYS = 180;
const INITIAL_WINDOW = 40;
const EVALUATION_WINDOW = 20;
const SMA_PERIOD = 20;
const RSI_PERIOD = 14;
const PLAY_INTERVAL_MS = 220;
const FLAT_TOLERANCE = 0.002;
function drawCandles(canvas, candles, smaValues, lines) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 260;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    const styles = getComputedStyle(document.documentElement);
    const up = styles.getPropertyValue("--md-success").trim() || "#2c6e3f";
    const down = styles.getPropertyValue("--md-error").trim() || "#ba1a1a";
    const accent = styles.getPropertyValue("--accent").trim() || "#146356";
    const lineColor = styles.getPropertyValue("--md-tertiary").trim() || "#3f6375";
    const allValues = candles.flatMap((c) => [c.high, c.low]);
    const min = Math.min(...allValues, ...lines);
    const max = Math.max(...allValues, ...lines);
    const range = max - min || 1;
    const padX = 6;
    const padTop = 10;
    const padBottom = 12;
    const plotH = height - padTop - padBottom;
    const slot = (width - padX * 2) / candles.length;
    const bodyWidth = Math.max(2, slot * 0.6);
    const xAt = (i) => padX + slot * i + slot / 2;
    const yAt = (p) => padTop + (1 - (p - min) / range) * plotH;
    // Nutzer-Linien (Unterstützung/Widerstand), gestrichelt
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    lines.forEach((price) => {
        const y = yAt(price);
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(width - padX, y);
        ctx.stroke();
    });
    ctx.setLineDash([]);
    // Kerzen
    candles.forEach((c, i) => {
        const x = xAt(i);
        const bullish = c.close >= c.open;
        ctx.strokeStyle = bullish ? up : down;
        ctx.fillStyle = bullish ? up : down;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, yAt(c.high));
        ctx.lineTo(x, yAt(c.low));
        ctx.stroke();
        const bodyTop = yAt(Math.max(c.open, c.close));
        const bodyBottom = yAt(Math.min(c.open, c.close));
        ctx.fillRect(x - bodyWidth / 2, bodyTop, bodyWidth, Math.max(1, bodyBottom - bodyTop));
    });
    // SMA-Overlay
    if (smaValues) {
        ctx.beginPath();
        let started = false;
        smaValues.forEach((v, i) => {
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
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    return { min, max, padTop, plotH };
}
function drawRsi(canvas, values) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 90;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--md-tertiary").trim() || "#3f6375";
    const muted = styles.getPropertyValue("--md-on-surface-variant").trim() || "#5a5a5a";
    const padX = 6;
    const padY = 8;
    const plotH = height - padY * 2;
    const slot = (width - padX * 2) / values.length;
    const xAt = (i) => padX + slot * i + slot / 2;
    const yAt = (v) => padY + (1 - v / 100) * plotH;
    ctx.strokeStyle = muted;
    ctx.globalAlpha = 0.4;
    ctx.setLineDash([3, 3]);
    [30, 70].forEach((level) => {
        ctx.beginPath();
        ctx.moveTo(padX, yAt(level));
        ctx.lineTo(width - padX, yAt(level));
        ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    let started = false;
    values.forEach((v, i) => {
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
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = muted;
    ctx.font = "10px system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText("RSI 70", padX, yAt(70) - 6);
    ctx.fillText("RSI 30", padX, yAt(30) + 6);
}
function resultCardChildren(...nodes) {
    const present = nodes.filter((n) => n !== null);
    return present.length ? present : [el("p", { class: "muted" }, ["Noch keine Einschätzung abgegeben."])];
}
export function renderAnalyzer() {
    const container = el("div", {});
    let selectedStockId = STOCKS[0].id;
    let fullCandles = [];
    let revealCount = INITIAL_WINDOW;
    let lines = [];
    let showSma = true;
    let showRsi = true;
    let lineDrawMode = false;
    let playing = false;
    let playTimer;
    let openDecision = null;
    let activeCall = null;
    let feedback = null;
    let stats = { calls: 0, correct: 0 };
    let viewport = null;
    let mainCanvas;
    let rsiCanvas;
    let progressLabel;
    function resetStock() {
        stopPlaying();
        fullCandles = generateCandles(stockById(selectedStockId), TOTAL_DAYS);
        revealCount = INITIAL_WINDOW;
        lines = [];
        activeCall = null;
        feedback = null;
        stats = { calls: 0, correct: 0 };
        openDecision = { entryIndex: revealCount - 1, entryPrice: fullCandles[revealCount - 1].close };
    }
    function stopPlaying() {
        playing = false;
        if (playTimer !== undefined) {
            clearInterval(playTimer);
            playTimer = undefined;
        }
    }
    function evaluateCall() {
        const call = activeCall;
        const evalCandle = fullCandles[revealCount - 1];
        const change = (evalCandle.close - call.entryPrice) / call.entryPrice;
        const pct = formatPercent(change);
        if (call.side === "hold") {
            feedback = `Gehalten – der Kurs bewegte sich in der Zeit um ${pct}.`;
        }
        else {
            const wentUp = change > FLAT_TOLERANCE;
            const wentDown = change < -FLAT_TOLERANCE;
            const correct = (call.side === "buy" && wentUp) || (call.side === "sell" && wentDown);
            const wrong = (call.side === "buy" && wentDown) || (call.side === "sell" && wentUp);
            if (correct || wrong)
                stats.calls++;
            if (correct) {
                stats.correct++;
                feedback = `Richtig eingeschätzt! Kurs ${pct} in die erwartete Richtung bewegt.`;
            }
            else if (wrong) {
                feedback = `Leider daneben: Kurs hat sich um ${pct} bewegt – Gegenteil der Erwartung.`;
            }
            else {
                feedback = `Kurs blieb nahezu unverändert (${pct}) – kein klarer Ausgang.`;
            }
        }
        activeCall = null;
        // Nur eine neue Entscheidung öffnen, wenn für die Auswertung noch genug Tage übrig sind –
        // sonst bliebe die letzte Entscheidung eines Durchlaufs für immer unausgewertet hängen.
        if (revealCount + EVALUATION_WINDOW <= fullCandles.length) {
            openDecision = { entryIndex: revealCount - 1, entryPrice: fullCandles[revealCount - 1].close };
        }
    }
    function advance() {
        if (openDecision || revealCount >= fullCandles.length)
            return;
        revealCount++;
        if (activeCall && revealCount - activeCall.entryIndex >= EVALUATION_WINDOW) {
            evaluateCall();
        }
    }
    function afterTick() {
        if (openDecision || revealCount >= fullCandles.length) {
            stopPlaying();
            refresh();
        }
        else {
            renderCanvas();
            updateProgressLabel();
        }
    }
    function togglePlay() {
        if (playing) {
            stopPlaying();
            refresh();
            return;
        }
        if (openDecision || revealCount >= fullCandles.length)
            return;
        playing = true;
        playTimer = window.setInterval(() => {
            if (!container.isConnected) {
                stopPlaying();
                return;
            }
            advance();
            afterTick();
        }, PLAY_INTERVAL_MS);
        refresh();
    }
    function chooseSide(side) {
        if (!openDecision)
            return;
        activeCall = { ...openDecision, side };
        openDecision = null;
        refresh();
    }
    function renderCanvas() {
        const visible = fullCandles.slice(0, revealCount);
        const closes = visible.map((c) => c.close);
        const smaValues = showSma ? sma(closes, SMA_PERIOD) : null;
        viewport = drawCandles(mainCanvas, visible, smaValues, lines);
        if (showRsi)
            drawRsi(rsiCanvas, rsi(closes, RSI_PERIOD));
    }
    function updateProgressLabel() {
        progressLabel.textContent = `Tag ${revealCount} / ${fullCandles.length}`;
    }
    function refresh() {
        container.replaceChildren(build());
    }
    function makeButton(label, variant, onClick) {
        const btn = el("button", { class: `btn ${variant}`.trim() }, [label]);
        btn.addEventListener("click", onClick);
        return btn;
    }
    function build() {
        const finished = revealCount >= fullCandles.length && !openDecision && !activeCall;
        mainCanvas = el("canvas", { class: "chart analyzer-chart" });
        mainCanvas.addEventListener("click", (e) => {
            if (!lineDrawMode || !viewport)
                return;
            const rect = mainCanvas.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const { min, max, padTop, plotH } = viewport;
            const price = min + (1 - (y - padTop) / plotH) * (max - min);
            lines.push(Math.round(price * 100) / 100);
            renderCanvas();
        });
        rsiCanvas = el("canvas", { class: "chart analyzer-rsi", style: showRsi ? "" : "display:none" });
        const stockSelect = el("select", {}, STOCKS.map((s) => el("option", { value: s.id, selected: s.id === selectedStockId }, [`${s.name} (${s.ticker})`])));
        stockSelect.addEventListener("change", () => {
            selectedStockId = stockSelect.value;
            resetStock();
            refresh();
        });
        const smaCheckbox = el("input", { type: "checkbox", checked: showSma });
        smaCheckbox.addEventListener("change", () => {
            showSma = smaCheckbox.checked;
            renderCanvas();
        });
        const rsiCheckbox = el("input", { type: "checkbox", checked: showRsi });
        rsiCheckbox.addEventListener("change", () => {
            showRsi = rsiCheckbox.checked;
            rsiCanvas.style.display = showRsi ? "" : "none";
            renderCanvas();
        });
        const lineModeBtn = el("button", { class: `btn secondary${lineDrawMode ? " active" : ""}`, "aria-pressed": String(lineDrawMode) }, ["Linie zeichnen"]);
        lineModeBtn.addEventListener("click", () => {
            lineDrawMode = !lineDrawMode;
            refresh();
        });
        const clearLinesBtn = makeButton("Linien löschen", "secondary", () => {
            lines = [];
            renderCanvas();
        });
        const toolbar = el("div", { class: "analyzer-toolbar" }, [
            el("label", { class: "analyzer-check" }, [smaCheckbox, `SMA ${SMA_PERIOD}`]),
            el("label", { class: "analyzer-check" }, [rsiCheckbox, `RSI (${RSI_PERIOD})`]),
            lineModeBtn,
            clearLinesBtn,
        ]);
        const playBtn = el("button", { class: "btn" }, [playing ? "⏸ Pause" : "▶ Abspielen"]);
        if (openDecision || finished)
            playBtn.setAttribute("disabled", "true");
        playBtn.addEventListener("click", togglePlay);
        const stepBtn = el("button", { class: "btn secondary" }, ["⏭ Einzelschritt"]);
        if (openDecision || finished || playing)
            stepBtn.setAttribute("disabled", "true");
        stepBtn.addEventListener("click", () => {
            advance();
            afterTick();
        });
        const restartBtn = makeButton("⏮ Neu starten", "secondary", () => {
            resetStock();
            refresh();
        });
        progressLabel = el("span", { class: "muted analyzer-progress" }, [""]);
        const playbackRow = el("div", { class: "actions" }, [playBtn, stepBtn, restartBtn, progressLabel]);
        const decisionPanel = openDecision
            ? el("div", { class: "card decision-panel" }, [
                el("h3", {}, ["Wie schätzt du den weiteren Verlauf ein?"]),
                el("p", { class: "muted" }, [
                    `Aktueller Kurs: ${formatCurrency(openDecision.entryPrice)} an Tag ${openDecision.entryIndex + 1}. Was passiert in den nächsten ${EVALUATION_WINDOW} Handelstagen?`,
                ]),
                el("div", { class: "actions" }, [
                    makeButton("Steigt (Kaufen)", "", () => chooseSide("buy")),
                    makeButton("Fällt (Verkaufen)", "secondary", () => chooseSide("sell")),
                    makeButton("Seitwärts (Halten)", "secondary", () => chooseSide("hold")),
                ]),
            ])
            : null;
        const feedbackEl = feedback ? el("p", { class: "analyzer-feedback" }, [feedback]) : null;
        const statsEl = stats.calls > 0
            ? el("p", { class: "muted" }, [
                `Trefferquote: ${stats.correct} / ${stats.calls} richtige Einschätzungen (${Math.round((stats.correct / stats.calls) * 100)} %)`,
            ])
            : null;
        const finishedEl = finished
            ? el("p", { class: "analyzer-feedback done" }, [
                "Replay beendet! Starte neu, um es erneut zu versuchen oder eine andere Aktie zu analysieren.",
            ])
            : null;
        const wrapper = el("div", {}, [
            el("div", { class: "card" }, [
                el("h1", { class: "page-title" }, [symbol("candlestick_chart"), "Chart-Analyzer"]),
                el("p", { class: "muted" }, [
                    "Ein historischer Kursverlauf wird Kerze für Kerze abgespielt. Zeichne Unterstützungs-/Widerstandslinien ein, beobachte SMA und RSI – und triff an jedem Entscheidungspunkt eine Einschätzung: Steigt der Kurs, fällt er, oder bewegt er sich seitwärts?",
                ]),
                el("label", {}, ["Aktie: ", stockSelect]),
            ]),
            el("div", { class: "card" }, [toolbar, mainCanvas, rsiCanvas, playbackRow]),
            decisionPanel,
            el("div", { class: "card analyzer-result" }, resultCardChildren(feedbackEl, statsEl, finishedEl)),
        ]);
        queueMicrotask(() => {
            renderCanvas();
            updateProgressLabel();
        });
        return wrapper;
    }
    resetStock();
    container.append(build());
    return container;
}
