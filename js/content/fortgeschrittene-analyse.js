export const fortgeschritteneAnalyse = {
    id: "fortgeschrittene-analyse",
    title: "Profi-Analyse",
    icon: "🧮",
    description: "Für Fortgeschrittene: Unternehmensbewertung mit DCF, Profi-Kennzahlen, Makro und Zinsen, Chartmuster, Portfolio-Metriken und Anlagestrategien.",
    lessons: [
        {
            id: "dcf-bewertung",
            moduleId: "fortgeschrittene-analyse",
            title: "Unternehmensbewertung mit DCF",
            summary: "Der innere Wert eines Unternehmens ist die Summe seiner künftigen Cashflows – auf heute abgezinst.",
            content: [
                "Die <strong>Discounted-Cash-Flow-Methode</strong> (DCF) ist das Herzstück der professionellen Unternehmensbewertung. Ihr Grundgedanke: Ein Unternehmen ist so viel wert wie die Summe aller Free Cashflows, die es in der Zukunft erwirtschaften wird – umgerechnet auf ihren heutigen Wert.",
                "Warum umrechnen? Wegen des <strong>Zeitwerts des Geldes</strong>: Ein Euro heute ist mehr wert als ein Euro in zehn Jahren, weil man ihn zwischenzeitlich verzinsen könnte und weil zukünftige Zahlungen unsicher sind. Deshalb werden künftige Cashflows mit einem <strong>Diskontsatz</strong> abgezinst – oft den gewichteten Kapitalkosten (WACC) oder der eigenen geforderten Rendite. Je höher der Diskontsatz, desto niedriger der heutige Wert.",
                "Da man nicht unendlich viele Jahre einzeln prognostizieren kann, teilt man die Bewertung: einen <strong>Prognosezeitraum</strong> (z. B. 5–10 Jahre) mit explizit geschätzten Cashflows plus einen <strong>Terminal Value</strong>, der alle Cashflows danach zusammenfasst (häufig über das Gordon-Wachstumsmodell mit einer dauerhaften Wachstumsrate).",
                "Das Ergebnis ist der <strong>innere Wert</strong> (Intrinsic Value). Liegt er deutlich über der Marktkapitalisierung, erscheint die Aktie unterbewertet, liegt er darunter, überbewertet. Genau diese Differenz suchen Value-Investoren – die \"Sicherheitsmarge\" zwischen Preis und Wert.",
                "Die größte Gefahr: Ein DCF reagiert <strong>extrem empfindlich</strong> auf seine Annahmen. Schon kleine Änderungen bei Wachstumsrate oder Diskontsatz verändern das Ergebnis dramatisch (\"Garbage in, garbage out\"). Profis rechnen deshalb nie mit einer einzigen Punktschätzung, sondern mit Szenarien und Bandbreiten.",
            ],
            quiz: [
                {
                    question: "Was berechnet ein DCF-Modell?",
                    options: [
                        { text: "Den heutigen Wert aller künftig erwarteten Free Cashflows eines Unternehmens", correct: true },
                        { text: "Den durchschnittlichen Aktienkurs des letzten Jahres", correct: false },
                        { text: "Die Summe aller bisher gezahlten Dividenden", correct: false },
                        { text: "Die Anzahl der ausstehenden Aktien", correct: false },
                    ],
                    explanation: "Der DCF summiert die zukünftigen Free Cashflows und zinst sie auf den heutigen Wert ab – das Ergebnis ist der innere Wert des Unternehmens.",
                },
                {
                    question: "Welche Wirkung hat ein höherer Diskontsatz auf den errechneten Unternehmenswert?",
                    options: [
                        { text: "Der heutige Wert der künftigen Cashflows sinkt", correct: true },
                        { text: "Der Wert steigt", correct: false },
                        { text: "Der Wert bleibt unverändert", correct: false },
                        { text: "Die Dividende steigt automatisch", correct: false },
                    ],
                    explanation: "Ein höherer Diskontsatz zinst künftige Zahlungen stärker ab – ihr Barwert und damit der gesamte Unternehmenswert sinken.",
                },
                {
                    question: "Warum ist ein DCF mit Vorsicht zu genießen?",
                    options: [
                        { text: "Weil er gesetzlich verboten ist", correct: false },
                        { text: "Weil er extrem empfindlich auf Annahmen wie Wachstumsrate und Diskontsatz reagiert", correct: true },
                        { text: "Weil er nur für Anleihen funktioniert", correct: false },
                        { text: "Weil er den Aktienkurs exakt vorhersagt", correct: false },
                    ],
                    explanation: "Kleine Änderungen der Annahmen bewegen das Ergebnis stark – deshalb arbeitet man mit Szenarien und Bandbreiten statt einer einzelnen Zahl.",
                },
            ],
        },
    ],
};
