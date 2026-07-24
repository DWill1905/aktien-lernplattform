import { el } from "../dom.js";
import { symbol } from "../shell.js";

interface ChecklistGroup {
  title: string;
  icon: string;
  items: string[];
}

/**
 * Pre-Trade-Checkliste: übersetzt die Regeln aus den Modulen „Risiko & Trading"
 * und „Profi-Analyse" in eine Abhakliste für den konkreten Trade.
 * Bewusst ohne Speicherung – jeder Trade beginnt mit einer frischen Liste.
 */
const GROUPS: ChecklistGroup[] = [
  {
    title: "Analyse & Setup",
    icon: "search",
    items: [
      "Der übergeordnete Trend im größeren Zeitrahmen ist mir klar (Multi-Timeframe).",
      "Mein Setup ist erfüllt – ich handle eine vorher definierte Regel, kein Bauchgefühl.",
      "Mehrere unabhängige Faktoren sprechen dafür (Konfluenz), nicht nur ein Einzelsignal.",
      "Ich kenne anstehende Termine (Quartalszahlen, Notenbank), die den Kurs bewegen können.",
    ],
  },
  {
    title: "Risiko & Positionsgröße",
    icon: "shield",
    items: [
      "Mein Stop-Loss steht fest, bevor ich einsteige – dort ist meine Trade-Idee widerlegt.",
      "Ich riskiere höchstens 1 % meines Gesamtkapitals in diesem Trade.",
      "Die Stückzahl ist berechnet (Risiko ÷ Stop-Abstand), nicht geschätzt.",
      "Das Chancen-Risiko-Verhältnis beträgt mindestens 2:1.",
      "Diese Position ist nicht stark korreliert mit meinen bestehenden Positionen.",
      "Ich habe die Ordergebühren in meine Rechnung einbezogen.",
    ],
  },
  {
    title: "Nach dem Einstieg",
    icon: "menu_book",
    items: [
      "Einstieg, Stop, Ziel und den Grund habe ich im Journal notiert.",
      "Ich akzeptiere den möglichen Verlust emotional – auch wenn er tatsächlich eintritt.",
      "Ich verschiebe meinen Stop nicht nach unten, um einen Verlust hinauszuzögern.",
    ],
  },
];

export function renderChecklist(): HTMLElement {
  const boxes: HTMLInputElement[] = [];
  const status = el("div", { class: "trade-message" }, []);

  const update = (): void => {
    const done = boxes.filter((b) => b.checked).length;
    const total = boxes.length;
    if (done === total) {
      status.textContent = `Alle ${total} Punkte abgehakt – dieser Trade folgt deinem Plan.`;
      status.className = "trade-message ok";
    } else {
      status.textContent = `${done} von ${total} Punkten abgehakt. Profis warten, bis alle Punkte erfüllt sind – oder lassen den Trade aus.`;
      status.className = "trade-message";
    }
  };

  const groupCards = GROUPS.map((group, gi) =>
    el("div", { class: "card" }, [
      el("h2", { class: "page-title" }, [symbol(group.icon), group.title]),
      el(
        "div",
        { class: "checklist" },
        group.items.map((text, ii) => {
          const box = el("input", { type: "checkbox", id: `check-${gi}-${ii}` }) as HTMLInputElement;
          box.addEventListener("change", update);
          boxes.push(box);
          return el("label", { class: "checklist-item", for: `check-${gi}-${ii}` }, [box, el("span", {}, [text])]);
        })
      ),
    ])
  );

  const resetBtn = el("button", { class: "btn secondary" }, ["Checkliste zurücksetzen"]) as HTMLButtonElement;
  resetBtn.addEventListener("click", () => {
    boxes.forEach((b) => (b.checked = false));
    update();
  });

  update();

  return el("div", {}, [
    el("div", { class: "breadcrumb" }, [el("a", { href: "#/" }, ["Übersicht"]), " / ", "Profi-Checkliste"]),
    el("h1", { class: "page-title" }, [symbol("checklist"), "Profi-Checkliste vor jedem Trade"]),
    el("p", { class: "muted" }, [
      "Der Unterschied zwischen Profi und Zocker ist selten die Analyse – es ist die Disziplin. Geh diese Liste vor jedem Trade durch. Die Liste startet bei jedem Aufruf neu.",
    ]),
    el("div", { class: "card" }, [status, el("div", { class: "actions" }, [resetBtn])]),
    ...groupCards,
    el("p", { class: "muted" }, [
      "Reine Übungs- und Bildungshilfe – keine Anlageberatung und keine Empfehlung für einzelne Wertpapiere.",
    ]),
  ]);
}
