import { el } from "../dom.js";
import { STOCKS, currentPrice } from "../market.js";
import { loadPortfolio } from "../state.js";
import { formatCurrency, formatPercent } from "../util.js";
import { symbol } from "../shell.js";
import { deriveMetrics, assessKgv, assessPeg, assessKbv, assessRoe, assessMargin, assessGrowth, assessDebt, assessPayout, moatLabel, } from "../fundamentals.js";
const COLUMNS = [
    { key: "price", label: "Kurs", sortValue: (r) => r.price, render: (r) => formatCurrency(r.price) },
    { key: "kgv", label: "KGV", sortValue: (r) => r.metrics.kgv, render: (r) => (r.metrics.kgv !== null ? r.metrics.kgv.toFixed(1) : "–") },
    { key: "peg", label: "PEG", sortValue: (r) => r.metrics.peg, render: (r) => (r.metrics.peg !== null ? r.metrics.peg.toFixed(2) : "–") },
    { key: "kbv", label: "KBV", sortValue: (r) => r.metrics.kbv, render: (r) => r.metrics.kbv.toFixed(2) },
    {
        key: "div",
        label: "Div.-Rendite",
        sortValue: (r) => r.metrics.dividendYield,
        render: (r) => (r.metrics.dividendYield > 0 ? formatPercent(r.metrics.dividendYield).replace("+", "") : "–"),
    },
    { key: "roe", label: "ROE", sortValue: (r) => r.metrics.roe, render: (r) => formatPercent(r.metrics.roe).replace("+", "") },
    {
        key: "growth",
        label: "Wachstum",
        sortValue: (r) => r.stock.fundamentals.revenueGrowthPct,
        render: (r) => `${r.stock.fundamentals.revenueGrowthPct.toLocaleString("de-DE")} %`,
    },
    {
        key: "margin",
        label: "Marge",
        sortValue: (r) => r.stock.fundamentals.netMarginPct,
        render: (r) => `${r.stock.fundamentals.netMarginPct.toLocaleString("de-DE")} %`,
    },
    {
        key: "debt",
        label: "Schulden/EBITDA",
        sortValue: (r) => r.stock.fundamentals.netDebtToEbitda,
        render: (r) => r.stock.fundamentals.netDebtToEbitda.toFixed(1),
    },
];
const FILTERS = [
    { label: "KGV unter 18", test: (r) => r.metrics.kgv !== null && r.metrics.kgv < 18 },
    { label: "Dividende über 3 %", test: (r) => r.metrics.dividendYield > 0.03 },
    { label: "Wachstum über 10 %", test: (r) => r.stock.fundamentals.revenueGrowthPct > 10 },
    { label: "Breiter Burggraben", test: (r) => r.stock.fundamentals.moat === "breit" },
];
function ratingChip(label, value, assessment) {
    return el("div", { class: `rating-item rating-${assessment.rating}` }, [
        el("div", { class: "rating-head" }, [el("span", { class: "rating-label" }, [label]), el("span", { class: "rating-value num" }, [value])]),
        el("p", { class: "rating-hint" }, [assessment.hint]),
    ]);
}
export function renderScreener() {
    const day = loadPortfolio().day;
    let sortKey = "kgv";
    let sortAsc = true;
    const activeFilters = new Set();
    let selectedId = null;
    const rows = STOCKS.map((stock) => {
        const price = currentPrice(stock, day);
        return { stock, price, metrics: deriveMetrics(stock, price) };
    });
    const container = el("div", {});
    function build() {
        const visible = rows.filter((row) => [...activeFilters].every((i) => FILTERS[i].test(row)));
        const column = COLUMNS.find((c) => c.key === sortKey);
        if (column) {
            visible.sort((a, b) => {
                const va = column.sortValue(a);
                const vb = column.sortValue(b);
                if (va === null && vb === null)
                    return 0;
                if (va === null)
                    return 1; // nicht berechenbare Werte immer ans Ende
                if (vb === null)
                    return -1;
                return sortAsc ? va - vb : vb - va;
            });
        }
        const filterChips = FILTERS.map((filter, i) => {
            const active = activeFilters.has(i);
            const chip = el("button", { class: `filter-chip${active ? " active" : ""}`, "aria-pressed": String(active) }, [
                active ? symbol("check") : null,
                filter.label,
            ]);
            chip.addEventListener("click", () => {
                if (active)
                    activeFilters.delete(i);
                else
                    activeFilters.add(i);
                container.replaceChildren(build());
            });
            return chip;
        });
        const headCells = [
            el("th", {}, ["Unternehmen"]),
            ...COLUMNS.map((c) => {
                const active = sortKey === c.key;
                const th = el("th", { class: `num sortable${active ? " sorted" : ""}`, role: "button", tabindex: "0", "aria-sort": active ? (sortAsc ? "ascending" : "descending") : undefined }, [
                    c.label,
                    active ? symbol(sortAsc ? "arrow_upward" : "arrow_downward") : null,
                ]);
                const toggle = () => {
                    if (sortKey === c.key)
                        sortAsc = !sortAsc;
                    else {
                        sortKey = c.key;
                        sortAsc = true;
                    }
                    container.replaceChildren(build());
                };
                th.addEventListener("click", toggle);
                th.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggle();
                    }
                });
                return th;
            }),
            el("th", {}, ["Burggraben"]),
        ];
        const bodyRows = visible.map((row) => {
            const tr = el("tr", { class: `screener-row${row.stock.id === selectedId ? " selected-row" : ""}` }, [
                el("td", {}, [el("a", { href: "#" }, [`${row.stock.name} (${row.stock.ticker})`]), el("div", { class: "muted row-sub" }, [row.stock.sector])]),
                ...COLUMNS.map((c) => el("td", { class: "num" }, [c.render(row)])),
                el("td", {}, [moatLabel(row.stock.fundamentals.moat)]),
            ]);
            tr.querySelector("a").addEventListener("click", (e) => {
                e.preventDefault();
                selectedId = selectedId === row.stock.id ? null : row.stock.id;
                container.replaceChildren(build());
            });
            return tr;
        });
        const tableCard = el("div", { class: "card" }, [
            el("h1", { class: "page-title" }, [symbol("filter_alt"), "Aktien-Screener"]),
            el("p", { class: "muted" }, [
                "Alle Kennzahlen aus dem Fundamentalanalyse-Modul, live berechnet aus fiktiven Geschäftszahlen und dem aktuellen Kurs (Handelstag ",
                String(day),
                "). Sortiere per Klick auf die Spalten, filtere nach deiner Strategie und öffne ein Unternehmen für die Detail-Einordnung.",
            ]),
            el("div", { class: "filter-row" }, filterChips),
            visible.length === 0
                ? el("p", { class: "empty-state" }, ["Keine Aktie erfüllt alle gewählten Filter – ein realistisches Screening-Ergebnis: gute Gelegenheiten sind selten."])
                : el("table", { class: "screener-table" }, [el("thead", {}, [el("tr", {}, headCells)]), el("tbody", {}, bodyRows)]),
        ]);
        // --- Detail-Karte mit Ampel-Einordnung je Kennzahl ---
        let detailCard = null;
        const selected = rows.find((r) => r.stock.id === selectedId);
        if (selected) {
            const f = selected.stock.fundamentals;
            const m = selected.metrics;
            detailCard = el("div", { class: "card card-outlined" }, [
                el("h2", { class: "page-title" }, [symbol("account_balance"), `${selected.stock.name} – Fundamentaldaten`]),
                el("div", { class: "stat-row" }, [
                    el("div", { class: "stat" }, [el("div", { class: "label" }, ["Marktkapitalisierung"]), el("div", { class: "value" }, [`${m.marketCapMio.toLocaleString("de-DE", { maximumFractionDigits: 0 })} Mio. €`])]),
                    el("div", { class: "stat" }, [el("div", { class: "label" }, ["Umsatz"]), el("div", { class: "value" }, [`${f.revenueMio.toLocaleString("de-DE")} Mio. €`])]),
                    el("div", { class: "stat" }, [el("div", { class: "label" }, ["Gewinn je Aktie"]), el("div", { class: "value" }, [formatCurrency(m.eps)])]),
                    el("div", { class: "stat" }, [el("div", { class: "label" }, ["Buchwert je Aktie"]), el("div", { class: "value" }, [formatCurrency(f.equityPerShare)])]),
                    el("div", { class: "stat" }, [el("div", { class: "label" }, ["Dividende je Aktie"]), el("div", { class: "value" }, [f.dividendPerShare > 0 ? formatCurrency(f.dividendPerShare) : "keine"])]),
                    el("div", { class: "stat" }, [el("div", { class: "label" }, ["Burggraben"]), el("div", { class: "value" }, [moatLabel(f.moat)])]),
                ]),
                el("div", { class: "rating-grid" }, [
                    ratingChip("KGV", m.kgv !== null ? m.kgv.toFixed(1) : "–", assessKgv(m.kgv)),
                    ratingChip("PEG", m.peg !== null ? m.peg.toFixed(2) : "–", assessPeg(m.peg)),
                    ratingChip("KBV", m.kbv.toFixed(2), assessKbv(m.kbv)),
                    ratingChip("ROE", formatPercent(m.roe).replace("+", ""), assessRoe(m.roe)),
                    ratingChip("Nettomarge", `${f.netMarginPct.toLocaleString("de-DE")} %`, assessMargin(f.netMarginPct)),
                    ratingChip("Umsatzwachstum", `${f.revenueGrowthPct.toLocaleString("de-DE")} % p.a.`, assessGrowth(f.revenueGrowthPct)),
                    ratingChip("Nettoschulden/EBITDA", f.netDebtToEbitda.toFixed(1), assessDebt(f.netDebtToEbitda)),
                    ratingChip("Ausschüttungsquote", m.payoutRatio !== null && m.payoutRatio > 0 ? formatPercent(m.payoutRatio).replace("+", "") : "–", assessPayout(m.payoutRatio)),
                ]),
                el("p", { class: "muted" }, [
                    "Die Einordnungen nutzen die Faustregeln aus den Lektionen – sie sind Startpunkte für die eigene Analyse, keine Kauf- oder Verkaufssignale. Im ",
                    el("a", { href: "#/portfolio" }, ["Portfolio-Simulator"]),
                    " kannst du deine Einschätzung direkt umsetzen.",
                ]),
            ]);
        }
        return el("div", {}, [tableCard, detailCard]);
    }
    container.append(build());
    return container;
}
