import { el } from "../dom.js";
import { stockById } from "../market.js";
import { NEWS_EVENTS, NewsDecision, NewsEvent, pickRandomEvent, resolveNews } from "../news.js";
import { formatPercent } from "../util.js";
import { symbol } from "../shell.js";

const ROUND_SECONDS = 30;

export function renderNewsSimulator(): HTMLElement {
  const container = el("div", {});

  let currentEvent: NewsEvent | null = null;
  let decision: NewsDecision | null = null;
  let outcomePct: number | null = null;
  let outcomeCorrect: boolean | null = null;
  let timeLeft = ROUND_SECONDS;
  let timerId: number | undefined;
  let stats = { calls: 0, correct: 0 };

  function refresh(): void {
    container.replaceChildren(build());
  }

  function stopTimer(): void {
    if (timerId !== undefined) {
      clearInterval(timerId);
      timerId = undefined;
    }
  }

  function startRound(): void {
    stopTimer();
    currentEvent = pickRandomEvent(currentEvent?.id);
    decision = null;
    outcomePct = null;
    outcomeCorrect = null;
    timeLeft = ROUND_SECONDS;
    timerId = window.setInterval(() => {
      if (!container.isConnected) {
        stopTimer();
        return;
      }
      timeLeft -= 1;
      if (timeLeft <= 0) {
        stopTimer();
        respond("hold");
        return;
      }
      updateTimerLabel();
    }, 1000);
    refresh();
  }

  function respond(side: NewsDecision): void {
    if (!currentEvent || decision) return;
    stopTimer();
    decision = side;
    const outcome = resolveNews(currentEvent, side);
    outcomePct = outcome.impactPct;
    outcomeCorrect = outcome.correct;
    if (outcome.correct !== null) {
      stats.calls++;
      if (outcome.correct) stats.correct++;
    }
    refresh();
  }

  let timerLabel: HTMLElement | null = null;
  function updateTimerLabel(): void {
    if (!timerLabel) return;
    timerLabel.textContent = `⏱ ${timeLeft}s`;
    timerLabel.classList.toggle("urgent", timeLeft <= 10);
  }

  function makeButton(label: string, variant: string, onClick: () => void): HTMLButtonElement {
    const btn = el("button", { class: `btn ${variant}`.trim() }, [label]) as HTMLButtonElement;
    btn.addEventListener("click", onClick);
    return btn;
  }

  function build(): HTMLElement {
    const roundActive = currentEvent !== null && decision === null;
    const resolved = currentEvent !== null && decision !== null;

    const headerCard = el("div", { class: "card" }, [
      el("h1", { class: "page-title" }, [symbol("bolt"), "Event-Trading-Simulator"]),
      el("p", { class: "muted" }, [
        "Eine simulierte Eilmeldung erscheint – du hast 30 Sekunden Zeit, um zu entscheiden: Kaufen, Verkaufen oder Halten. Danach zeigt dir der Markt, wie er reagiert hat, und erklärt warum.",
      ]),
    ]);

    if (!currentEvent) {
      return el("div", {}, [
        headerCard,
        el("div", { class: "card" }, [
          el("p", { class: "muted" }, [`${NEWS_EVENTS.length} mögliche Eilmeldungen im Pool – jede Runde ist zufällig.`]),
          makeButton("Erste Meldung starten", "", startRound),
        ]),
      ]);
    }

    timerLabel = el("span", { class: `news-timer${timeLeft <= 10 ? " urgent" : ""}` }, [`⏱ ${timeLeft}s`]);

    const newsCard = el("div", { class: "card news-card" }, [
      el("div", { class: "news-head" }, [
        el("span", { class: "badge" }, [currentEvent.category]),
        roundActive ? timerLabel : null,
      ]),
      el("h2", {}, [`"${currentEvent.headline}"`]),
      el("p", { class: "muted" }, [`Betroffene Aktie: ${stockById(currentEvent.stockId)?.name ?? currentEvent.stockId}`]),
      roundActive
        ? el("div", { class: "actions" }, [
            makeButton("Kaufen (steigt)", "", () => respond("buy")),
            makeButton("Verkaufen (fällt)", "secondary", () => respond("sell")),
            makeButton("Halten", "secondary", () => respond("hold")),
          ])
        : null,
    ]);

    let outcomeCard: HTMLElement | null = null;
    if (resolved && outcomePct !== null) {
      const verdict =
        outcomeCorrect === null
          ? `Gehalten – der Kurs bewegte sich um ${formatPercent(outcomePct)}.`
          : outcomeCorrect
          ? `Richtig eingeschätzt! Kurs bewegte sich um ${formatPercent(outcomePct)}.`
          : `Leider daneben: Kurs bewegte sich um ${formatPercent(outcomePct)} – Gegenteil deiner Erwartung.`;
      outcomeCard = el("div", { class: "card news-outcome" }, [
        el("p", { class: "analyzer-feedback" }, [verdict]),
        el("p", { class: "muted" }, [currentEvent.explanation]),
        stats.calls > 0
          ? el("p", { class: "muted" }, [
              `Trefferquote: ${stats.correct} / ${stats.calls} richtige Einschätzungen (${Math.round((stats.correct / stats.calls) * 100)} %)`,
            ])
          : null,
        makeButton("Nächste Meldung", "", startRound),
      ]);
    }

    queueMicrotask(updateTimerLabel);
    return el("div", {}, [headerCard, newsCard, outcomeCard]);
  }

  container.append(build());
  return container;
}
