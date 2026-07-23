import { LearningModule } from "../types.js";

export const risikomanagement: LearningModule = {
  id: "risikomanagement",
  title: "Risiko & Trading",
  icon: "🛡️",
  description: "Der wichtigste Unterschied zwischen Profi und Zocker: konsequentes Risiko- und Money-Management, das dich langfristig im Spiel hält.",
  lessons: [
    {
      id: "positionsgroesse-risiko",
      moduleId: "risikomanagement",
      title: "Positionsgröße und Risiko pro Trade",
      summary: "Profis fragen nicht zuerst \"Wie viel kann ich gewinnen?\", sondern \"Wie viel darf ich verlieren?\".",
      content: [
        "Der teuerste Anfängerfehler ist eine zu große Position. Profis drehen die Frage um: Sie legen zuerst fest, wie viel Kapital sie in einem einzelnen Trade maximal verlieren wollen – und leiten daraus die Stückzahl ab. Kapitalerhalt hat oberste Priorität, denn wer sein Konto halbiert, braucht danach +100 %, nur um wieder bei null zu sein.",
        "Eine verbreitete Faustregel ist die <strong>1-%-Regel</strong>: Pro Trade wird höchstens 1 % des Gesamtkapitals riskiert. Bei 10.000 € Depot sind das 100 € maximaler Verlust je Position. So übersteht man auch eine lange Serie von Fehltrades, ohne das Konto zu sprengen.",
        "Entscheidend ist die Unterscheidung zwischen <strong>Positionsgröße</strong> und <strong>Risiko</strong>: Das Risiko wird nicht durch die Positionsgröße allein bestimmt, sondern durch den Abstand zwischen Einstiegskurs und <strong>Stop-Loss</strong>. Die Formel lautet: Stückzahl = (Kapital × Risiko-Prozent) ÷ (Einstiegskurs − Stop-Kurs).",
        "Beispiel: 10.000 € Kapital, 1 % Risiko = 100 €. Einstieg bei 50 €, Stop-Loss bei 45 €. Das Risiko je Aktie beträgt 5 €. Also: 100 € ÷ 5 € = 20 Aktien. Die Position ist 1.000 € groß, das tatsächliche Risiko aber nur 100 €.",
        "Merke: Ein enger Stop erlaubt eine größere Stückzahl bei gleichem Risiko, ein weiter Stop erzwingt eine kleinere. Nicht das Bauchgefühl bestimmt die Größe, sondern eine nüchterne Rechnung – das ist der Kern professionellen Money-Managements.",
      ],
      quiz: [
        {
          question: "Wovon leitet ein Profi die Positionsgröße primär ab?",
          options: [
            { text: "Vom vorab festgelegten maximalen Verlust und dem Abstand zum Stop-Loss", correct: true },
            { text: "Vom Bauchgefühl und der aktuellen Marktstimmung", correct: false },
            { text: "Davon, wie viel Gewinn maximal möglich erscheint", correct: false },
            { text: "Vom gesamten verfügbaren Guthaben – möglichst all-in", correct: false },
          ],
          explanation: "Zuerst steht das erlaubte Risiko fest; zusammen mit dem Stop-Abstand ergibt sich daraus rechnerisch die Stückzahl.",
        },
        {
          question: "Wie viele Aktien kaufst du nach der 1-%-Regel bei 10.000 € Kapital, Einstieg 50 €, Stop 45 €?",
          options: [
            { text: "200 Aktien", correct: false },
            { text: "20 Aktien", correct: true },
            { text: "100 Aktien", correct: false },
            { text: "2 Aktien", correct: false },
          ],
          explanation: "1 % von 10.000 € = 100 € Risiko. Risiko je Aktie = 50 − 45 = 5 €. 100 ÷ 5 = 20 Aktien (Positionswert 1.000 €, Risiko 100 €).",
        },
        {
          question: "Warum ist Kapitalerhalt für Trader so zentral?",
          options: [
            { text: "Weil ein großer Verlust überproportional hohe Gewinne zum Ausgleich erfordert (−50 % braucht +100 %)", correct: true },
            { text: "Weil Verluste steuerlich nicht anrechenbar sind", correct: false },
            { text: "Weil kleine Konten grundsätzlich verboten sind", correct: false },
            { text: "Weil Gewinne garantiert sind, sobald man diszipliniert ist", correct: false },
          ],
          explanation: "Verluste wirken asymmetrisch: Je tiefer das Konto fällt, desto schwerer die Erholung. Deshalb schützen Profis das Kapital vor allem anderen.",
        },
      ],
    },
    {
      id: "chancen-risiko-verhaeltnis",
      moduleId: "risikomanagement",
      title: "Chancen-Risiko-Verhältnis und Erwartungswert",
      summary: "Warum du mit weniger als 50 % Trefferquote trotzdem dauerhaft Geld verdienen kannst.",
      content: [
        "Das <strong>Chancen-Risiko-Verhältnis</strong> (CRV, engl. Risk-Reward-Ratio) setzt den potenziellen Gewinn ins Verhältnis zum potenziellen Verlust eines Trades. Einstieg 50 €, Stop-Loss 45 € (Risiko 5 €), Kursziel 65 € (Chance 15 €) ergibt ein CRV von 3:1 – dreimal so viel Chance wie Risiko.",
        "Profis denken in <strong>R-Multiples</strong>: 1 R ist das riskierte Kapital pro Trade. Ein Gewinn von 3 R bedeutet das Dreifache des Risikos, ein Verlust am Stop kostet 1 R. Diese Einheit macht Trades unabhängig von der Positionsgröße vergleichbar.",
        "Ob eine Strategie profitabel ist, entscheidet der <strong>Erwartungswert</strong>: Trefferquote × durchschnittlicher Gewinn − Verlustquote × durchschnittlicher Verlust. Er muss über viele Trades positiv sein – ein einzelner Trade sagt nichts aus.",
        "Beispiel: Bei einem CRV von 2:1 und nur 40 % Trefferquote ergibt sich: 0,40 × 2 R − 0,60 × 1 R = +0,20 R pro Trade. Trotz mehr Fehltrades als Treffern ist die Strategie profitabel, weil die Gewinner deutlich größer sind als die Verlierer.",
        "Die Konsequenz für den Profi: Nicht die Trefferquote allein zählt, sondern das Zusammenspiel aus Trefferquote und CRV. Gezielt asymmetrische Chancen zu suchen – große mögliche Gewinne bei klein gehaltenem Risiko – ist ein Kernprinzip erfolgreichen Tradings.",
      ],
      quiz: [
        {
          question: "Wie ist das Chancen-Risiko-Verhältnis bei Einstieg 50 €, Stop 45 € und Ziel 65 €?",
          options: [
            { text: "1:3", correct: false },
            { text: "3:1 (Chance 15 €, Risiko 5 €)", correct: true },
            { text: "1:1", correct: false },
            { text: "5:1", correct: false },
          ],
          explanation: "Chance = 65 − 50 = 15 €, Risiko = 50 − 45 = 5 €. 15 ÷ 5 = 3, also ein CRV von 3:1.",
        },
        {
          question: "Kann eine Strategie mit nur 40 % Trefferquote profitabel sein?",
          options: [
            { text: "Nein, unter 50 % Treffer ist Verlust unvermeidlich", correct: false },
            { text: "Ja, wenn das Chancen-Risiko-Verhältnis hoch genug ist (positiver Erwartungswert)", correct: true },
            { text: "Nur wenn keine Gebühren anfallen", correct: false },
            { text: "Nur bei Dividendenaktien", correct: false },
          ],
          explanation: "Bei CRV 2:1 gilt 0,4 × 2R − 0,6 × 1R = +0,2R pro Trade – die größeren Gewinner überwiegen die häufigeren, aber kleineren Verlierer.",
        },
        {
          question: "Was misst der Erwartungswert einer Handelsstrategie?",
          options: [
            { text: "Den garantierten Gewinn des nächsten Trades", correct: false },
            { text: "Den durchschnittlich zu erwartenden Gewinn oder Verlust pro Trade über viele Trades", correct: true },
            { text: "Die maximale Verlustserie", correct: false },
            { text: "Die Höhe der Ordergebühr", correct: false },
          ],
          explanation: "Der Erwartungswert kombiniert Trefferquote und CRV zu einer Kennzahl pro Trade – er muss über viele Trades positiv sein, ein Einzeltrade ist bedeutungslos.",
        },
      ],
    },
  ],
};
