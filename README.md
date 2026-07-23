# Börsenschule

Interaktive Lernplattform für Aktien-Investment – **keyfrei**, läuft als statische Seite auf
GitHub Pages. Drei Lernmodule mit insgesamt 22 Lektionen samt Quizzes und ein risikofreier
Portfolio-Simulator mit fiktiven, lokal generierten Aktienkursen.

**Live:** https://dwill1905.github.io/aktien-lernplattform/

## Inhalte

- **Grundlagen** – Was ist eine Aktie, wie funktioniert die Börse, Aktien vs. ETFs vs. Fonds,
  Ordertypen, Risiko & Diversifikation, Dividenden & Gesamtrendite, Kosten & Steuern,
  Sparplan & Cost-Average-Effekt, Anlegerpsychologie, Inflation & Realrendite
- **Fundamentalanalyse** – Bilanz und GuV lesen, Cashflow & Free Cashflow, KGV/KUV/KBV,
  Dividendenrendite & Ausschüttungsquote, Wettbewerbsvorteile (Burggraben)
- **Technische Analyse** – Charttypen, Trends, gleitende Durchschnitte, Unterstützung &
  Widerstand, RSI & MACD, Handelsvolumen & Liquidität
- **Portfolio-Simulator** – virtuelles Startkapital von 10.000 €, 8 fiktive Aktien mit
  seeded Random-Walk-Kursen, Kaufen/Verkaufen mit realistischer Ordergebühr (0,25 %, mind. 1 €),
  Positionsübersicht, Aufteilung nach Branchen, Zeit-Vorspulen, Charts

Jede Lektion enthält ein Quiz mit direktem Feedback. Fortschritt und Portfolio werden lokal
im Browser gespeichert (`localStorage`) – keine Anmeldung, kein Backend, keine echten
Marktdaten oder Anlageberatung.

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
