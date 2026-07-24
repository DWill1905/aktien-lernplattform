# Börsenschule

Interaktive Lernplattform für Aktien-Investment – **keyfrei**, läuft als statische Seite auf
GitHub Pages. Fünf Lernmodule mit insgesamt 35 Lektionen samt Quizzes, ein risikofreier
Portfolio-Simulator mit fiktiven, lokal generierten Aktienkursen sowie ein Gamification-System
(XP, Level, Streaks, Erfolge), das beim Dranbleiben hilft.

**Live:** https://dwill1905.github.io/aktien-lernplattform/

## Inhalte

- **Grundlagen** – Was ist eine Aktie, wie funktioniert die Börse, Aktien vs. ETFs vs. Fonds,
  Ordertypen, Risiko & Diversifikation, Dividenden & Gesamtrendite, Kosten & Steuern,
  Sparplan & Cost-Average-Effekt, Anlegerpsychologie, Inflation & Realrendite
- **Fundamentalanalyse** – Bilanz und GuV lesen, Cashflow & Free Cashflow, KGV/KUV/KBV,
  Dividendenrendite & Ausschüttungsquote, Wettbewerbsvorteile (Burggraben)
- **Technische Analyse** – Charttypen, Trends, gleitende Durchschnitte, Unterstützung &
  Widerstand, RSI & MACD, Handelsvolumen & Liquidität
- **Risiko & Trading** – Positionsgröße, Chancen-Risiko-Verhältnis, Stop-Loss, Handelsplan,
  Drawdown & Risk of Ruin
- **Profi-Analyse** – DCF-Bewertung, Profi-Kennzahlen (ROE/ROIC/EV/EBITDA/PEG), Makro & Zinsen,
  Chartmuster, Divergenzen, Portfolio-Kennzahlen, Leerverkauf & Derivate, Anlagestrategien
- **Portfolio-Simulator** – virtuelles Startkapital von 10.000 €, 8 fiktive Aktien, deren
  Kurse über ein Ein-Faktor-Marktmodell realistisch korreliert sind (gemeinsamer Marktfaktor
  mit Bullen-/Bärenphasen plus unternehmensspezifischem Zufall, jede Aktie mit eigenem Beta)
  und die branchentypische feste Dividenden je Aktie quartalsweise ausschütten,
  Kaufen/Verkaufen mit realistischer Ordergebühr (0,25 %, mind. 1 €) und aktienspezifischer
  Geld-Brief-Spanne (Market- und Stop-Orders zahlen die schlechtere Seite – Slippage –,
  Limit-Orders nicht), Limit-/Stop-/Trailing-Stop-Orders sowie OCO-Brackets (Stop-Loss +
  Take-Profit, eine Ausführung storniert die andere), Order-Gültigkeit wählbar
  (GTC oder Tagesorder), Order-Ticket mit Live-Kostenvorschau (Geld-/Briefkurs) und Max-Stückzahl,
  Positionsgrößen-Rechner, Merkliste, Positionsübersicht mit Tagesänderung, Depotgewicht,
  realisiertem und unrealisiertem Gewinn/Verlust, Zeit-Vorspulen,
  Kerzenchart mit SMA(20/50) und Zeitfensterwahl samt Kennzahlen-Panel je Aktie
  (52-Tage-Hoch/Tief, Volatilität p.a., RSI, Trendsignal), echte Equity-Kurve per
  Transaktions-Replay im Vergleich zum Marktindex, Trade-Statistik (Win-Rate, Profit-Faktor,
  Payoff-Ratio) mit Abgeltungsteuer-Merker,
  Portfolio Health Check (Diversifikations-Score, Klumpenrisiko-Warnungen, Rendite und
  Volatilität p.a., Sharpe und Sortino Ratio, Portfolio-Beta, Max Drawdown),
  Börsen-Stresstest durch 4 historische Krisenszenarien
- **Aktien-Screener** – alle Kennzahlen des Fundamentalanalyse-Moduls live auf die 8 AGs
  angewendet: KGV, PEG, KBV, ROE, Dividendenrendite, Ausschüttungsquote, Marge, Wachstum,
  Verschuldung und Burggraben aus fiktiven, in sich konsistenten Geschäftszahlen; sortierbar,
  mit Strategie-Filtern (Value, Dividende, Wachstum, Qualität) und Ampel-Einordnung je
  Kennzahl nach den Faustregeln aus den Lektionen
- **Chart-Analyzer** – historischer Kursverlauf wird Kerze für Kerze abgespielt; Unterstützungs-/
  Widerstandslinien einzeichnen, SMA(20) und RSI(14) einblenden, an Entscheidungspunkten Kauf/
  Verkauf/Halten einschätzen und direktes Feedback samt Trefferquote erhalten
- **Event-Trading-Simulator** – simulierte Eilmeldungen zu den bestehenden Aktien, 30 Sekunden
  Reaktionszeit für Kaufen/Verkaufen/Halten, danach Auswertung mit Erklärung der Kursreaktion
- **Tägliche Wiederholung** – Leitner-Karteikastensystem für Quizfragen (richtig → längeres
  Intervall, falsch → zurück auf Stufe 1), bis zu 3 fällige Fragen pro Tag
- **Glossar** – durchsuchbare Sammlung von rund 90 Fachbegriffen, von den Grundlagen bis zum
  Profi-Vokabular (CRV, R-Multiple, Drawdown, DCF, ROIC, Sharpe, Beta, Konfluenz, Hebel …)

Jede Lektion enthält ein Quiz mit direktem Feedback. Fortschritt und Portfolio werden lokal
im Browser gespeichert (`localStorage`) – keine Anmeldung, kein Backend, keine echten
Marktdaten oder Anlageberatung.

## Gamification

- **XP & Level** – Lektionen und Quiz-Antworten geben XP; 20 Level von „Anfänger" bis
  „Aktien-Champion", Level-Chip dauerhaft in der Kopfzeile sichtbar
- **Lern-Streak** – Tage in Folge mit Lernaktivität, 7-Tage-Kalenderleiste im Dashboard,
  Warnhinweis wenn die Streak heute noch zu verfallen droht
- **Tägliches Lernziel** – 3 abgeschlossene Lektionen/Quizzes pro Tag mit Bonus-XP
- **Perfekte-Quiz-Serie** – Bonus-XP ab 3 perfekten Quizzes in Folge
- **Erfolge** – über 20 Achievements (Lernfortschritt, Portfolio, Zeitpunkt, Modul-Meisterschaft)
  auf einer eigenen Seite (`#/erfolge`), inkl. Freischalt-Toasts und Konfetti-Animation

Der gesamte Gamification-Fortschritt wird ebenfalls nur lokal im Browser gespeichert.

## Entwicklung

```bash
npm install
npm run build   # TypeScript → js/
npm run serve   # lokaler Server auf Port 8080
```

`npm run watch` kompiliert bei Änderungen automatisch neu.

## Deploy

Statische Seite, keine CI nötig: GitHub Pages liest direkt aus dem Repo-Root (Branch `main`).
Das kompilierte `js/`-Verzeichnis wird mit committed.
