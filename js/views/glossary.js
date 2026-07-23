import { el } from "../dom.js";
import { GLOSSAR } from "../content/glossar.js";
export function renderGlossary() {
    const sorted = [...GLOSSAR].sort((a, b) => a.term.localeCompare(b.term, "de"));
    const dl = el("dl", { class: "glossar" }, sorted.flatMap((entry) => [el("dt", {}, [entry.term]), el("dd", {}, [entry.definition])]));
    const count = el("p", { class: "muted glossar-count" }, []);
    const setCount = (n) => {
        count.textContent = `${n} von ${sorted.length} Begriffen`;
    };
    setCount(sorted.length);
    const search = el("input", {
        type: "search",
        class: "glossar-search",
        placeholder: "Begriff suchen …",
        "aria-label": "Glossar durchsuchen",
    });
    search.addEventListener("input", () => {
        const query = search.value.trim().toLowerCase();
        const nodes = Array.from(dl.children);
        let visible = 0;
        for (let i = 0; i < nodes.length; i += 2) {
            const dt = nodes[i];
            const dd = nodes[i + 1];
            const match = query === "" || `${dt.textContent} ${dd.textContent}`.toLowerCase().includes(query);
            dt.style.display = match ? "" : "none";
            dd.style.display = match ? "" : "none";
            if (match)
                visible++;
        }
        setCount(visible);
    });
    return el("div", {}, [
        el("div", { class: "breadcrumb" }, [el("a", { href: "#/" }, ["Übersicht"]), " / ", "Glossar"]),
        el("h1", {}, ["📖 Glossar"]),
        el("p", { class: "muted" }, ["Die wichtigsten Begriffe rund um Aktien, Analyse und Börse – kompakt erklärt."]),
        el("div", { class: "card" }, [search, count, dl]),
    ]);
}
