import { Stock } from "./types.js";

/**
 * Aus den statischen Fundamentaldaten und dem aktuellen Kurs abgeleitete Kennzahlen –
 * exakt die Größen aus dem Fundamentalanalyse-Modul, live auf die fiktiven AGs angewendet.
 */
export interface DerivedMetrics {
  /** Marktkapitalisierung in Mio. €. */
  marketCapMio: number;
  /** Gewinn je Aktie in € (Umsatz × Marge ÷ Aktienzahl). */
  eps: number;
  /** Kurs-Gewinn-Verhältnis; null bei Verlust. */
  kgv: number | null;
  /** Kurs-Umsatz-Verhältnis (Marktkapitalisierung ÷ Umsatz). */
  kuv: number;
  /** Kurs-Buchwert-Verhältnis. */
  kbv: number;
  /** PEG: KGV ÷ Wachstum – setzt die Bewertung ins Verhältnis zum Wachstum; null ohne Wachstum/Gewinn. */
  peg: number | null;
  /** Dividendenrendite auf den aktuellen Kurs (0–1). */
  dividendYield: number;
  /** Ausschüttungsquote: Dividende ÷ Gewinn je Aktie (0–1); null bei Verlust. */
  payoutRatio: number | null;
  /** Eigenkapitalrendite: Gewinn je Aktie ÷ Buchwert je Aktie (0–1). */
  roe: number;
}

export function deriveMetrics(stock: Stock, price: number): DerivedMetrics {
  const f = stock.fundamentals;
  const profitMio = f.revenueMio * (f.netMarginPct / 100);
  const eps = profitMio / f.sharesMio;
  const marketCapMio = price * f.sharesMio;
  const kgv = eps > 0 ? price / eps : null;
  const peg = kgv !== null && f.revenueGrowthPct > 0 ? kgv / f.revenueGrowthPct : null;
  return {
    marketCapMio,
    eps,
    kgv,
    kuv: marketCapMio / f.revenueMio,
    kbv: price / f.equityPerShare,
    peg,
    dividendYield: f.dividendPerShare / price,
    payoutRatio: eps > 0 ? f.dividendPerShare / eps : null,
    roe: eps / f.equityPerShare,
  };
}

export type Rating = "good" | "ok" | "bad" | "none";

/** Didaktische Ampel-Einordnung einzelner Kennzahlen – Schwellen wie in den Lektionen gelehrt. */
export interface MetricAssessment {
  rating: Rating;
  hint: string;
}

export function assessKgv(kgv: number | null): MetricAssessment {
  if (kgv === null) return { rating: "none", hint: "Kein Gewinn – KGV nicht berechenbar." };
  if (kgv < 15) return { rating: "good", hint: "Moderat bewertet – prüfe, ob das Wachstum trotzdem stimmt." };
  if (kgv <= 25) return { rating: "ok", hint: "Faire Bewertung für solide wachsende Unternehmen." };
  return { rating: "bad", hint: "Hohe Bewertung – nur bei starkem Wachstum gerechtfertigt (siehe PEG)." };
}

export function assessPeg(peg: number | null): MetricAssessment {
  if (peg === null) return { rating: "none", hint: "Ohne Gewinn oder Wachstum nicht berechenbar." };
  if (peg < 1) return { rating: "good", hint: "Bewertung liegt unter dem Wachstum – potenziell günstig." };
  if (peg <= 2) return { rating: "ok", hint: "Bewertung und Wachstum halten sich die Waage." };
  return { rating: "bad", hint: "Du bezahlst deutlich mehr, als das Wachstum hergibt." };
}

export function assessKbv(kbv: number): MetricAssessment {
  if (kbv < 1.5) return { rating: "good", hint: "Nahe am Buchwert – klassischer Value-Bereich." };
  if (kbv <= 3) return { rating: "ok", hint: "Übliche Spanne für profitable Unternehmen." };
  return { rating: "bad", hint: "Hoher Aufschlag auf den Buchwert – braucht hohe Kapitalrenditen." };
}

export function assessRoe(roe: number): MetricAssessment {
  if (roe >= 0.15) return { rating: "good", hint: "Starke Eigenkapitalrendite – das Unternehmen verzinst Kapital hervorragend." };
  if (roe >= 0.08) return { rating: "ok", hint: "Solide Kapitalverzinsung." };
  return { rating: "bad", hint: "Schwache Kapitalverzinsung – Kapital arbeitet hier wenig effizient." };
}

export function assessMargin(marginPct: number): MetricAssessment {
  if (marginPct >= 15) return { rating: "good", hint: "Hohe Marge – oft ein Zeichen für Preissetzungsmacht." };
  if (marginPct >= 5) return { rating: "ok", hint: "Durchschnittliche Marge." };
  return { rating: "bad", hint: "Dünne Marge – anfällig für Kostensteigerungen und Preisdruck." };
}

export function assessGrowth(growthPct: number): MetricAssessment {
  if (growthPct >= 10) return { rating: "good", hint: "Deutliches Wachstum – rechtfertigt höhere Bewertungen." };
  if (growthPct >= 3) return { rating: "ok", hint: "Moderates Wachstum, etwa auf Höhe der Gesamtwirtschaft." };
  return { rating: "bad", hint: "Kaum Wachstum – die Rendite muss aus Dividende und Bewertung kommen." };
}

export function assessDebt(netDebtToEbitda: number): MetricAssessment {
  if (netDebtToEbitda < 1) return { rating: "good", hint: "Sehr solide Bilanz mit wenig Nettoschulden." };
  if (netDebtToEbitda <= 3) return { rating: "ok", hint: "Übliche Verschuldung – im Abschwung im Blick behalten." };
  return { rating: "bad", hint: "Hohe Verschuldung – steigende Zinsen treffen dieses Unternehmen stärker." };
}

export function assessPayout(payoutRatio: number | null): MetricAssessment {
  if (payoutRatio === null || payoutRatio === 0) return { rating: "none", hint: "Keine Dividende – Gewinne werden reinvestiert." };
  if (payoutRatio <= 0.6) return { rating: "good", hint: "Gesunde Ausschüttungsquote mit Puffer für schlechte Jahre." };
  if (payoutRatio <= 0.8) return { rating: "ok", hint: "Hohe Quote – wenig Spielraum für Dividendensteigerungen." };
  return { rating: "bad", hint: "Fast der ganze Gewinn wird ausgeschüttet – Kürzungsgefahr im Abschwung." };
}

export function moatLabel(moat: Stock["fundamentals"]["moat"]): string {
  return moat === "breit" ? "Breiter Burggraben" : moat === "schmal" ? "Schmaler Burggraben" : "Kein Burggraben";
}
