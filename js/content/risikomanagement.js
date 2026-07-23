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
        {
            id: "stop-loss-trailing-stop",
            moduleId: "risikomanagement",
            title: "Stop-Loss und Trailing Stop",
            summary: "Der Stop ist die Lebensversicherung des Traders – richtig gesetzt begrenzt er Verluste und sichert Gewinne.",
            content: [
                "Ein <strong>Stop-Loss</strong> ist der vorab definierte Punkt, an dem ein Trade mit Verlust geschlossen wird. Sein eigentlicher Zweck ist Disziplin: Die Ausstiegsentscheidung wird getroffen, bevor Emotionen wie Hoffnung oder Angst im Verlust die Kontrolle übernehmen.",
                "Für die <strong>Platzierung</strong> gibt es mehrere professionelle Ansätze: unterhalb einer markttechnischen Unterstützung oder des letzten Swing-Tiefs, anhand der Volatilität (z. B. ein Vielfaches der durchschnittlichen Schwankungsbreite, ATR) oder als fester Prozentsatz. Der Stop sollte dort liegen, wo die ursprüngliche Trade-Idee als widerlegt gilt – nicht an einer willkürlichen Zahl.",
                "Dabei gilt ein Spannungsfeld: Ein <strong>zu enger Stop</strong> wird oft schon vom normalen Kursrauschen ausgelöst, ein <strong>zu weiter Stop</strong> vergrößert das Risiko und zwingt zu einer kleineren Position. Beide Extreme kosten Rendite – die Kunst liegt in der Balance.",
                "Ein <strong>Trailing Stop</strong> (nachziehender Stop) wandert mit steigendem Kurs nach oben mit, niemals aber zurück nach unten. Steigt die Aktie, wird der Stop nachgezogen und sichert einen wachsenden Teil des Gewinns; fällt sie, greift der Stop auf dem zuletzt erreichten Niveau. So setzt er die Regel \"Gewinne laufen lassen, Verluste begrenzen\" mechanisch um.",
                "Wichtig: Ein im Markt platzierter Stop schützt auch dann, wenn du nicht am Bildschirm bist. Ein rein \"mentaler\" Stop funktioniert nur, wenn er im entscheidenden Moment tatsächlich diszipliniert ausgeführt wird – erfahrungsgemäß die größere Schwäche.",
            ],
            quiz: [
                {
                    question: "Was ist der eigentliche Zweck eines Stop-Loss?",
                    options: [
                        { text: "Den maximalen Gewinn zu garantieren", correct: false },
                        { text: "Verluste zu begrenzen und die Ausstiegsentscheidung diszipliniert vor dem Emotionsmoment festzulegen", correct: true },
                        { text: "Die Steuer auf Kursgewinne zu senken", correct: false },
                        { text: "Die Dividende zu erhöhen", correct: false },
                    ],
                    explanation: "Der Stop legt den Ausstieg fest, bevor Hoffnung oder Angst im Verlust die Entscheidung verzerren – Verlustbegrenzung durch Disziplin.",
                },
                {
                    question: "Was kennzeichnet einen Trailing Stop?",
                    options: [
                        { text: "Er wird täglich neu zufällig gesetzt", correct: false },
                        { text: "Er zieht mit steigendem Kurs nach oben mit, fällt aber nie zurück", correct: true },
                        { text: "Er verkauft automatisch bei jedem kleinen Kursrücksetzer", correct: false },
                        { text: "Er gilt nur für Anleihen", correct: false },
                    ],
                    explanation: "Der Trailing Stop sichert bei steigenden Kursen zunehmend Gewinn, bleibt bei fallenden Kursen aber auf dem zuletzt erreichten Niveau stehen.",
                },
                {
                    question: "Warum ist ein zu eng gesetzter Stop problematisch?",
                    options: [
                        { text: "Weil er häufig schon vom normalen Kursrauschen ausgelöst wird und man gute Trades vorzeitig verlässt", correct: true },
                        { text: "Weil enge Stops gesetzlich verboten sind", correct: false },
                        { text: "Weil er die Positionsgröße automatisch verkleinert", correct: false },
                        { text: "Weil er die Dividende gefährdet", correct: false },
                    ],
                    explanation: "Zu enge Stops reagieren auf zufällige Schwankungen und stoppen aus, bevor sich die Trade-Idee entfalten kann – zu weite Stops erhöhen dagegen das Risiko.",
                },
            ],
        },
        {
            id: "handelsplan-journal",
            moduleId: "risikomanagement",
            title: "Handelsplan und Trading-Journal",
            summary: "Profis handeln nach einem schriftlichen Plan und werten jeden Trade aus – Amateure improvisieren.",
            content: [
                "Ein <strong>Handelsplan</strong> ist das schriftlich festgehaltene Regelwerk: Welche Märkte handle ich? Welches <strong>Setup</strong> (welche Bedingungen) muss erfüllt sein, damit ich einsteige? Wo liegen Einstieg, Stop und Ziel? Wie viel riskiere ich pro Trade? Ein Plan ersetzt willkürliche Bauchentscheidungen durch wiederholbare, überprüfbare Abläufe.",
                "Der wichtigste Perspektivwechsel für Profis lautet: <strong>Prozess vor Ergebnis</strong>. Ein regelkonformer Trade kann verlieren, ein regelwidriger \"Zockertrade\" kann zufällig gewinnen. Bewertet wird nicht der einzelne Ausgang, sondern ob der Plan diszipliniert eingehalten wurde – denn nur ein guter Prozess ist über viele Trades hinweg profitabel.",
                "Das <strong>Trading-Journal</strong> dokumentiert jeden Trade: Setup, Einstiegsgrund, Ein- und Ausstiegskurs, das Ergebnis in R-Multiples sowie die eigene Verfassung und begangene Fehler. Es verwandelt Erfahrung in überprüfbare Daten statt in vage Erinnerungen.",
                "Aus dem Journal lassen sich die entscheidenden Kennzahlen ableiten: Trefferquote, durchschnittliches R, Erwartungswert und der <strong>Profit-Faktor</strong> (Summe der Gewinne ÷ Summe der Verluste). So erkennt man, welche Setups wirklich funktionieren und welche man streichen sollte.",
                "Ohne Journal wiederholt man dieselben Fehler unbemerkt. Mit Journal wird Trading zu einem datengetriebenen Handwerk, das sich systematisch verbessern lässt – genau das trennt den Profi vom Glücksspieler.",
            ],
            quiz: [
                {
                    question: "Was bedeutet der Grundsatz „Prozess vor Ergebnis\"?",
                    options: [
                        { text: "Nur gewinnende Trades sind gute Trades", correct: false },
                        { text: "Ein Trade wird danach bewertet, ob der Plan diszipliniert eingehalten wurde – nicht allein am einzelnen Ausgang", correct: true },
                        { text: "Der Prozess ist egal, solange der Trade gewinnt", correct: false },
                        { text: "Man sollte den Plan nach jedem Verlust ändern", correct: false },
                    ],
                    explanation: "Einzelne Ergebnisse sind vom Zufall geprägt; nur ein konsequent guter Prozess führt über viele Trades zu Profitabilität.",
                },
                {
                    question: "Wozu dient ein Trading-Journal?",
                    options: [
                        { text: "Trades zu dokumentieren, um aus Daten zu lernen und die eigenen Setups auszuwerten", correct: true },
                        { text: "Steuern automatisch abzuführen", correct: false },
                        { text: "Kursziele der Bank zu übernehmen", correct: false },
                        { text: "Ordergebühren zu vermeiden", correct: false },
                    ],
                    explanation: "Das Journal macht aus Erfahrung überprüfbare Daten (Setup, R-Multiple, Fehler) und deckt auf, welche Ansätze wirklich funktionieren.",
                },
                {
                    question: "Was beschreibt der Profit-Faktor?",
                    options: [
                        { text: "Die Summe aller Gewinne geteilt durch die Summe aller Verluste", correct: true },
                        { text: "Den höchsten Einzelgewinn eines Jahres", correct: false },
                        { text: "Die Anzahl der Trades pro Tag", correct: false },
                        { text: "Die Höhe der Dividende", correct: false },
                    ],
                    explanation: "Ein Profit-Faktor über 1 bedeutet, dass die Gewinne die Verluste in Summe übersteigen – eine zentrale Auswertungskennzahl aus dem Journal.",
                },
            ],
        },
        {
            id: "drawdown-risk-of-ruin",
            moduleId: "risikomanagement",
            title: "Drawdown, Verlustserien und Risk of Ruin",
            summary: "Verlustphasen gehören dazu – wer sie überlebt, gewinnt langfristig. Wer zu groß riskiert, scheidet aus.",
            content: [
                "Der <strong>Drawdown</strong> misst den Rückgang des Kontos von seinem bisherigen Höchststand (Peak) bis zum Tiefpunkt (Trough). Der <strong>maximale Drawdown</strong> ist der größte solche Rückgang in der Historie – die zentrale Kennzahl dafür, wie viel Schmerz eine Strategie unterwegs verursacht.",
                "Die Erholung aus einem Drawdown ist <strong>asymmetrisch</strong>: −20 % erfordern +25 %, um zurück zum Ausgangswert zu kommen, −50 % bereits +100 % und −90 % ganze +900 %. Große Drawdowns sind deshalb nicht nur unangenehm, sondern rechnerisch nur sehr schwer aufzuholen.",
                "<strong>Verlustserien sind normal</strong>, nicht die Ausnahme. Selbst bei einer soliden 50-%-Trefferquote treten über viele Trades hinweg zwangsläufig Serien von fünf, sechs oder mehr Verlusten in Folge auf. Wer pro Trade nur 1 % riskiert, verkraftet das leicht; wer 10 % riskiert, kann durch eine einzige normale Pechsträhne ausscheiden.",
                "Genau das beschreibt das <strong>Risk of Ruin</strong> – die Wahrscheinlichkeit, das Konto oder einen kritischen Teil davon zu verlieren. Sie steigt stark mit dem Risiko pro Trade und mit einem schlechten Erwartungswert. Kleines, konstantes Risiko pro Position ist der wirksamste Schutz.",
                "Zu beachten ist außerdem die <strong>Korrelation</strong>: Fünf gleichzeitige Trades im selben Sektor sind faktisch ein einziger großer Trade – fällt der Sektor, greifen alle Stops zugleich. Das effektive Risiko ist dann viel höher als die Summe der einzelnen 1-%-Ansätze vermuten lässt.",
            ],
            quiz: [
                {
                    question: "Welchen Gewinn braucht es, um einen Drawdown von 50 % wieder auszugleichen?",
                    options: [
                        { text: "+50 %", correct: false },
                        { text: "+100 %", correct: true },
                        { text: "+25 %", correct: false },
                        { text: "+75 %", correct: false },
                    ],
                    explanation: "Aus 100 werden bei −50 % nur 50; um von 50 zurück auf 100 zu kommen, ist eine Verdopplung (+100 %) nötig – Erholung ist asymmetrisch.",
                },
                {
                    question: "Warum sind Verlustserien für die Risikohöhe pro Trade so entscheidend?",
                    options: [
                        { text: "Weil selbst bei guter Strategie längere Pechsträhnen normal sind – zu großes Risiko pro Trade führt dann zum Ruin", correct: true },
                        { text: "Weil Verlustserien gegen die Börsenregeln verstoßen", correct: false },
                        { text: "Weil sie nur bei schlechten Tradern vorkommen", correct: false },
                        { text: "Weil sie die Trefferquote erhöhen", correct: false },
                    ],
                    explanation: "Serien von 5–6 Verlusten sind über viele Trades erwartbar; nur kleines Risiko pro Position lässt einen solche Phasen überstehen.",
                },
                {
                    question: "Warum erhöhen mehrere gleichzeitige Trades im selben Sektor das tatsächliche Risiko?",
                    options: [
                        { text: "Weil sie stark korreliert sind und bei einem Sektorabschwung gemeinsam verlieren – wie ein einziger großer Trade", correct: true },
                        { text: "Weil der Broker dafür höhere Gebühren verlangt", correct: false },
                        { text: "Weil Sektor-Trades steuerlich benachteiligt sind", correct: false },
                        { text: "Sie erhöhen das Risiko nicht, solange jeder Trade nur 1 % riskiert", correct: false },
                    ],
                    explanation: "Korrelierte Positionen bewegen sich gemeinsam; das effektive Klumpenrisiko ist dann viel größer als die Summe der einzeln geplanten 1-%-Risiken.",
                },
            ],
        },
    ],
};
