export type NewsDecision = "buy" | "sell" | "hold";

export interface NewsEvent {
  id: string;
  headline: string;
  category: string;
  stockId: string;
  impactPct: number;
  explanation: string;
}

// Fiktive Eilmeldungen zu den bestehenden Aktien aus market.ts – impactPct ist der
// deterministische Kurseffekt, den der Markt laut Szenario einpreist.
export const NEWS_EVENTS: NewsEvent[] = [
  {
    id: "zinserhoehung",
    headline: "EZB erhöht Leitzins überraschend um 50 Basispunkte",
    category: "Zinsen",
    stockId: "bsr",
    impactPct: -0.06,
    explanation:
      "Höhere Zinsen verteuern Kredite und senken den Barwert künftiger Gewinne – wachstumsstarke, noch nicht durchgehend profitable Technologiewerte reagieren besonders empfindlich.",
  },
  {
    id: "umsatzverfehlung",
    headline: "BlauSee Robotics AG verfehlt Umsatzprognose deutlich",
    category: "Unternehmenszahlen",
    stockId: "bsr",
    impactPct: -0.09,
    explanation: "Verfehlte Prognosen enttäuschen Analysten und Anleger gleichermaßen – der Kurs preist die schwächeren Zukunftsaussichten sofort ein.",
  },
  {
    id: "grossauftrag",
    headline: "NordWind Energie AG meldet Rekord-Auftrag für Offshore-Windpark",
    category: "Unternehmensnachrichten",
    stockId: "nwe",
    impactPct: 0.07,
    explanation: "Ein großer neuer Auftrag verbessert die Umsatzaussichten mehrerer Jahre auf einen Schlag – der Markt honoriert das mit einem Kursanstieg.",
  },
  {
    id: "medikamenten-zulassung",
    headline: "Alpin Pharma AG erhält überraschend schnelle Zulassung für neues Medikament",
    category: "Regulierung",
    stockId: "alp",
    impactPct: 0.1,
    explanation: "Eine Zulassung eröffnet neue Umsatzquellen und senkt regulatorische Unsicherheit – solche Nachrichten lösen oft spontane Kursaufschläge aus.",
  },
  {
    id: "cyberangriff",
    headline: "Großangelegter Cyberangriff auf europäische Behörden aufgedeckt",
    category: "Geopolitik",
    stockId: "css",
    impactPct: 0.05,
    explanation: "Sicherheitsvorfälle erhöhen kurzfristig die Nachfrage nach Cybersicherheitslösungen – Anbieter der Branche profitieren vom steigenden Investitionsbedarf.",
  },
  {
    id: "lieferkettenproblem",
    headline: "SolidBau Baustoffe AG warnt vor Lieferengpässen bei Rohstoffen",
    category: "Lieferketten",
    stockId: "sbb",
    impactPct: -0.05,
    explanation: "Lieferengpässe drohen Produktion und Margen zu belasten – der Markt reagiert vorsichtig auf die Gewinnwarnung.",
  },
  {
    id: "konsumflaute",
    headline: "Konsumklima-Index fällt überraschend deutlich",
    category: "Makroökonomie",
    stockId: "fkh",
    impactPct: -0.04,
    explanation: "Schwächere Konsumlaune lässt Analysten niedrigere Umsätze im Einzelhandel erwarten – entsprechend sensibel reagieren Handelsaktien auf solche Frühindikatoren.",
  },
  {
    id: "erntebericht",
    headline: "GrünFeld Agrar AG profitiert von Rekordernte",
    category: "Rohstoffe",
    stockId: "gfa",
    impactPct: 0.06,
    explanation: "Eine Rekordernte senkt Produktionskosten und steigert die Absatzmenge – beides wirkt sich unmittelbar positiv auf die Gewinnerwartung aus.",
  },
  {
    id: "regulierung-telekom",
    headline: "Regulierungsbehörde kündigt strengere Preisvorgaben für Netzbetreiber an",
    category: "Regulierung",
    stockId: "mnt",
    impactPct: -0.04,
    explanation: "Regulatorische Eingriffe in die Preisgestaltung schmälern künftige Margen – der Markt nimmt das vorweg.",
  },
  {
    id: "insolvenz-konkurrent",
    headline: "Wichtiger Konkurrent von FrischKauf Handels AG meldet Insolvenz an",
    category: "Wettbewerb",
    stockId: "fkh",
    impactPct: 0.05,
    explanation: "Fällt ein Wettbewerber aus, profitieren verbleibende Anbieter oft von zusätzlichen Marktanteilen – der Markt preist diesen Vorteil zügig ein.",
  },
  {
    id: "energiepreise",
    headline: "Energiepreise schießen wegen Lieferengpässen in die Höhe",
    category: "Rohstoffe",
    stockId: "nwe",
    impactPct: 0.08,
    explanation: "Steigende fossile Energiepreise verbessern die relative Wettbewerbsposition erneuerbarer Energieerzeuger – Investoren wetten auf mehr Nachfrage nach Alternativen.",
  },
  {
    id: "datenschutzskandal",
    headline: "MobilNetz Telekom AG gerät wegen Datenschutzskandal in die Kritik",
    category: "Reputation",
    stockId: "mnt",
    impactPct: -0.07,
    explanation: "Datenschutzverstöße bedrohen Kundenvertrauen und ziehen oft Bußgelder nach sich – der Markt reagiert mit Kursabschlägen auf das Reputationsrisiko.",
  },
];

export interface NewsOutcome {
  correct: boolean | null;
  impactPct: number;
}

export function pickRandomEvent(excludeId?: string): NewsEvent {
  const pool = excludeId ? NEWS_EVENTS.filter((e) => e.id !== excludeId) : NEWS_EVENTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** null = gehalten/neutral (kein richtig/falsch), sonst wurde Kauf-/Verkaufsrichtung getroffen oder verfehlt. */
export function resolveNews(event: NewsEvent, decision: NewsDecision): NewsOutcome {
  if (decision === "hold") return { correct: null, impactPct: event.impactPct };
  const correct = (decision === "buy" && event.impactPct > 0) || (decision === "sell" && event.impactPct < 0);
  return { correct, impactPct: event.impactPct };
}
