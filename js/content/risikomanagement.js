export const risikomanagement = {
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
    ],
};
