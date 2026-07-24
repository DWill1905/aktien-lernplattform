export const technischeAnalyse = {
    id: "technische-analyse",
    title: "Technische Analyse",
    icon: "candlestick_chart",
    description: "Kursverläufe, Charts und Indikatoren lesen, um Handelssignale und Marktstimmung besser einzuschätzen.",
    lessons: [
        {
            id: "charttypen",
            moduleId: "technische-analyse",
            title: "Charttypen: Linie, Balken, Candlestick",
            summary: "Dieselben Kursdaten, drei verschiedene Darstellungen – mit unterschiedlichem Informationsgehalt.",
            content: [
                "Der <strong>Linienchart</strong> verbindet meist die Schlusskurse aufeinanderfolgender Zeiträume zu einer Linie. Er ist einfach zu lesen und gut geeignet, um langfristige Trends auf einen Blick zu erfassen, zeigt aber keine Informationen über Schwankungen innerhalb eines Zeitraums.",
                "Der <strong>Balkenchart</strong> (OHLC-Chart) zeigt für jeden Zeitraum vier Werte: Eröffnungskurs (Open), Höchstkurs (High), Tiefstkurs (Low) und Schlusskurs (Close) – dargestellt als vertikaler Balken mit zwei kleinen seitlichen Strichen.",
                "Der <strong>Candlestick-Chart</strong> zeigt dieselben vier Werte (OHLC), aber visuell übersichtlicher als \"Kerze\": Ein Körper zeigt die Spanne zwischen Eröffnungs- und Schlusskurs, dünne \"Dochte\" zeigen die Extremwerte. Ist der Schlusskurs höher als der Eröffnungskurs, wird die Kerze meist grün/weiß eingefärbt, andernfalls rot/schwarz.",
                "Candlestick-Charts sind heute der Standard in den meisten Handelsplattformen, weil sie auf einen Blick zeigen, ob Käufer oder Verkäufer einen Zeitraum dominiert haben – eine Information, die dem einfachen Linienchart komplett fehlt.",
            ],
            quiz: [
                {
                    question: "Welche Information liefert ein Linienchart NICHT direkt?",
                    options: [
                        { text: "Den langfristigen Trend eines Kurses", correct: false },
                        { text: "Schwankungen (Höchst- und Tiefstkurs) innerhalb eines einzelnen Zeitraums", correct: true },
                        { text: "Ob der Kurs über die Zeit gestiegen oder gefallen ist", correct: false },
                        { text: "Den ungefähren Kursverlauf über mehrere Monate", correct: false },
                    ],
                    explanation: "Ein Linienchart nutzt meist nur Schlusskurse und zeigt daher keine Information über die Spanne innerhalb eines Zeitraums.",
                },
                {
                    question: "Wofür steht die Abkürzung OHLC?",
                    options: [
                        { text: "Order, Hold, Limit, Cancel", correct: false },
                        { text: "Open, High, Low, Close", correct: true },
                        { text: "Overbought, High, Low, Correction", correct: false },
                        { text: "Order-Historie, Level, Chance", correct: false },
                    ],
                    explanation: "OHLC steht für Eröffnungskurs, Höchstkurs, Tiefstkurs und Schlusskurs eines Zeitraums – die Basis von Balken- und Candlestick-Charts.",
                },
                {
                    question: "Was zeigt der \"Körper\" einer Candlestick-Kerze?",
                    options: [
                        { text: "Die Spanne zwischen Höchst- und Tiefstkurs", correct: false },
                        { text: "Die Spanne zwischen Eröffnungs- und Schlusskurs", correct: true },
                        { text: "Das gehandelte Volumen", correct: false },
                        { text: "Die Anzahl der Transaktionen", correct: false },
                    ],
                    explanation: "Der Kerzenkörper zeigt Open und Close; die dünnen Dochte darüber und darunter zeigen High und Low des Zeitraums.",
                },
            ],
        },
        {
            id: "trends-erkennen",
            moduleId: "technische-analyse",
            title: "Trends erkennen",
            summary: "Der Markt bewegt sich selten geradlinig – Trends zu erkennen ist die Grundlage jeder Chartanalyse.",
            content: [
                "Ein <strong>Aufwärtstrend</strong> zeigt sich durch eine Abfolge steigender Hochs und steigender Tiefs: Jeder neue Kursrücksetzer endet höher als der vorherige. Ein <strong>Abwärtstrend</strong> zeigt spiegelbildlich fallende Hochs und fallende Tiefs.",
                "Eine <strong>Seitwärtsbewegung</strong> (Range) liegt vor, wenn der Kurs zwischen einer erkennbaren Ober- und Untergrenze pendelt, ohne klare Richtung. Viele Trader warten solche Phasen ab, statt gegen den fehlenden Trend zu handeln.",
                "Trendlinien werden gezogen, indem man mindestens zwei (besser drei) aufeinanderfolgende Hochs oder Tiefs verbindet. Ein <strong>Trendbruch</strong> – wenn der Kurs eine etablierte Trendlinie deutlich durchbricht – gilt vielen technischen Analysten als frühes Signal für eine mögliche Trendwende, ist aber kein garantiertes Signal.",
                "Die alte Börsenweisheit \"The trend is your friend\" fasst eine zentrale Idee der technischen Analyse zusammen: Es ist statistisch häufiger erfolgreich, mit einem etablierten Trend zu handeln, als frühzeitig gegen ihn zu wetten – auch wenn kein Trend ewig anhält.",
            ],
            quiz: [
                {
                    question: "Woran erkennt man einen Aufwärtstrend?",
                    options: [
                        { text: "An fallenden Hochs und fallenden Tiefs", correct: false },
                        { text: "An steigenden Hochs und steigenden Tiefs", correct: true },
                        { text: "An einem Kurs, der sich nie bewegt", correct: false },
                        { text: "Ausschließlich am Handelsvolumen", correct: false },
                    ],
                    explanation: "Ein Aufwärtstrend zeigt eine Abfolge von jeweils höheren Zwischenhochs und höheren Zwischentiefs.",
                },
                {
                    question: "Was bedeutet eine \"Seitwärtsbewegung\" (Range)?",
                    options: [
                        { text: "Der Kurs steigt kontinuierlich ohne Unterbrechung", correct: false },
                        { text: "Der Kurs pendelt ohne klare Richtung zwischen einer Ober- und Untergrenze", correct: true },
                        { text: "Der Handel mit der Aktie wurde ausgesetzt", correct: false },
                        { text: "Der Kurs fällt kontinuierlich ohne Unterbrechung", correct: false },
                    ],
                    explanation: "In einer Range fehlt eine klare Trendrichtung – der Kurs bewegt sich zwischen erkennbaren Grenzen hin und her.",
                },
                {
                    question: "Was besagt die Börsenweisheit \"The trend is your friend\"?",
                    options: [
                        { text: "Man sollte immer gegen den aktuellen Trend handeln", correct: false },
                        { text: "Trends halten für immer und ändern sich nie", correct: false },
                        { text: "Es ist statistisch oft erfolgreicher, mit einem etablierten Trend zu handeln als gegen ihn", correct: true },
                        { text: "Trends sind für die technische Analyse irrelevant", correct: false },
                    ],
                    explanation: "Die Weisheit betont, dass ein bestehender Trend eher fortbesteht als sich sofort umkehrt – ein Grundprinzip vieler trendfolgender Strategien.",
                },
            ],
        },
        {
            id: "gleitende-durchschnitte",
            moduleId: "technische-analyse",
            title: "Gleitende Durchschnitte",
            summary: "Kursrauschen glätten, um den zugrunde liegenden Trend klarer zu sehen.",
            content: [
                "Ein <strong>gleitender Durchschnitt</strong> (Moving Average, MA) berechnet den Durchschnittskurs der letzten n Handelstage und wandert mit jedem neuen Tag mit. Ein 50-Tage-Durchschnitt etwa glättet kurzfristiges Auf und Ab und macht den mittelfristigen Trend sichtbar.",
                "Der <strong>einfache gleitende Durchschnitt</strong> (SMA) gewichtet alle Tage im Betrachtungszeitraum gleich. Der <strong>exponentielle gleitende Durchschnitt</strong> (EMA) gewichtet jüngere Kurse stärker und reagiert dadurch schneller auf aktuelle Kursbewegungen.",
                "Häufig beobachtet wird der Vergleich von kurz- und langfristigen Durchschnitten: Kreuzt ein kurzfristiger Durchschnitt (z. B. 50-Tage) von unten nach oben durch einen langfristigen (z. B. 200-Tage), spricht man von einem <strong>Golden Cross</strong> – von vielen als bullisches Signal gedeutet. Der umgekehrte Fall heißt <strong>Death Cross</strong> und gilt als potenziell bearishes Signal.",
                "Wichtig: Gleitende Durchschnitte sind <strong>nachlaufende</strong> Indikatoren (Lagging Indicators) – sie basieren auf vergangenen Kursen und bestätigen einen Trend typischerweise erst, nachdem er bereits begonnen hat. Sie sind kein Frühwarnsystem, sondern ein Glättungswerkzeug.",
            ],
            quiz: [
                {
                    question: "Was macht ein gleitender Durchschnitt mit dem Kursverlauf?",
                    options: [
                        { text: "Er sagt zukünftige Kurse exakt voraus", correct: false },
                        { text: "Er glättet kurzfristige Schwankungen und macht den Trend besser sichtbar", correct: true },
                        { text: "Er verändert die tatsächlichen historischen Kurse", correct: false },
                        { text: "Er berechnet die Dividendenrendite", correct: false },
                    ],
                    explanation: "Ein gleitender Durchschnitt mittelt Kurse über einen Zeitraum und reduziert dadurch \"Rauschen\" im Chart.",
                },
                {
                    question: "Was unterscheidet den EMA vom SMA?",
                    options: [
                        { text: "Der EMA gewichtet jüngere Kurse stärker und reagiert schneller auf neue Bewegungen", correct: true },
                        { text: "Der EMA berücksichtigt nur den ältesten Kurs im Zeitraum", correct: false },
                        { text: "Der SMA reagiert immer schneller als der EMA", correct: false },
                        { text: "Es gibt keinen praktischen Unterschied", correct: false },
                    ],
                    explanation: "Der exponentielle gleitende Durchschnitt (EMA) legt mehr Gewicht auf aktuelle Kurse und passt sich dadurch schneller an als der einfache Durchschnitt (SMA).",
                },
                {
                    question: "Warum gelten gleitende Durchschnitte als \"nachlaufende\" Indikatoren?",
                    options: [
                        { text: "Weil sie auf vergangenen Kursen basieren und einen Trend erst bestätigen, nachdem er begonnen hat", correct: true },
                        { text: "Weil sie nur einmal im Jahr aktualisiert werden", correct: false },
                        { text: "Weil sie ausschließlich für Anleihen verwendet werden", correct: false },
                        { text: "Weil sie zukünftige Kurse mit Sicherheit vorhersagen", correct: false },
                    ],
                    explanation: "Da sie aus historischen Kursen berechnet werden, hinken gleitende Durchschnitte der aktuellen Kursbewegung zwangsläufig etwas hinterher.",
                },
            ],
        },
        {
            id: "unterstuetzung-widerstand",
            moduleId: "technische-analyse",
            title: "Unterstützung und Widerstand",
            summary: "Preiszonen, an denen Kaufs- oder Verkaufsdruck historisch besonders stark war.",
            content: [
                "Eine <strong>Unterstützung</strong> (Support) ist ein Kursniveau, an dem in der Vergangenheit wiederholt genug Kaufinteresse entstand, um einen weiteren Kursrückgang zu stoppen oder umzukehren. Eine <strong>Widerstand</strong>-Zone (Resistance) ist das Gegenstück nach oben: ein Niveau, an dem wiederholt Verkaufsdruck einen weiteren Anstieg gebremst hat.",
                "Diese Zonen entstehen aus <strong>Marktpsychologie</strong>: Anleger erinnern sich an frühere Kursniveaus und platzieren dort erneut Kauf- oder Verkaufsorders – eine sich selbst verstärkende Erwartung, solange genug Marktteilnehmer ähnlich handeln.",
                "Wird eine Widerstandszone nach oben durchbrochen, wird sie häufig zur neuen Unterstützung (<strong>Rollentausch</strong>) – und umgekehrt bei einem Bruch nach unten. Dieses Muster wird von vielen technischen Analysten als eines der zuverlässigsten Grundprinzipien angesehen.",
                "Wichtig: Support und Resistance sind selten exakte Linien, sondern eher <strong>Zonen</strong>. Und sie sind kein Naturgesetz – bei ausreichend starkem fundamentalen Druck (etwa einer überraschenden Gewinnwarnung) werden auch lange etablierte Marken glatt durchbrochen.",
            ],
            quiz: [
                {
                    question: "Was ist eine Unterstützung (Support) im Chart?",
                    options: [
                        { text: "Ein Kursniveau, an dem historisch wiederholt Kaufinteresse einen weiteren Rückgang bremste", correct: true },
                        { text: "Der garantierte Mindestkurs einer Aktie", correct: false },
                        { text: "Ein staatlich festgelegter Kursboden", correct: false },
                        { text: "Das exakte Tageshoch einer Aktie", correct: false },
                    ],
                    explanation: "Support-Zonen entstehen aus wiederholtem Kaufinteresse an einem bestimmten Kursniveau, sind aber keine Garantie, sondern eine Erwartung basierend auf Marktpsychologie.",
                },
                {
                    question: "Was passiert häufig, wenn ein Widerstand nach oben durchbrochen wird?",
                    options: [
                        { text: "Der Widerstand wird oft zur neuen Unterstützung (Rollentausch)", correct: true },
                        { text: "Der Handel mit der Aktie wird beendet", correct: false },
                        { text: "Der Kurs kehrt garantiert sofort zum alten Niveau zurück", correct: false },
                        { text: "Das Unternehmen muss eine neue Bilanz veröffentlichen", correct: false },
                    ],
                    explanation: "Ein durchbrochener Widerstand wird häufig zur neuen Unterstützungszone – ein klassisches Muster der technischen Analyse.",
                },
                {
                    question: "Warum sind Support- und Resistance-Niveaus keine Garantie?",
                    options: [
                        { text: "Weil sie auf Marktpsychologie beruhen und bei starkem fundamentalen Druck durchbrochen werden können", correct: true },
                        { text: "Weil sie nur bei Anleihen gelten, nicht bei Aktien", correct: false },
                        { text: "Weil sie von Regulierungsbehörden täglich neu festgelegt werden", correct: false },
                        { text: "Weil sie ausschließlich auf reinen Zufallszahlen basieren", correct: false },
                    ],
                    explanation: "Support/Resistance spiegeln kollektives Anlegerverhalten wider – bei ausreichend starken neuen Informationen können diese Niveaus schnell fallen.",
                },
            ],
        },
        {
            id: "rsi-macd",
            moduleId: "technische-analyse",
            title: "Indikatoren: RSI und MACD",
            summary: "Zwei der meistgenutzten Indikatoren, um Marktdynamik und mögliche Über- bzw. Untertreibungen zu messen.",
            content: [
                "Der <strong>RSI</strong> (Relative Strength Index) misst auf einer Skala von 0 bis 100, wie stark und wie schnell sich ein Kurs zuletzt bewegt hat. Werte über 70 gelten traditionell als Hinweis auf eine <strong>überkaufte</strong> Situation, Werte unter 30 als <strong>überverkauft</strong> – beides mögliche (nicht garantierte) Signale für eine bevorstehende Gegenbewegung.",
                "Wichtig: In starken Trends kann der RSI lange in überkauftem oder überverkauftem Bereich verharren, ohne dass eine Umkehr folgt. Der RSI allein reicht deshalb selten als Handelssignal – er wird meist mit anderen Werkzeugen kombiniert.",
                "Der <strong>MACD</strong> (Moving Average Convergence Divergence) misst den Abstand zwischen zwei exponentiellen gleitenden Durchschnitten unterschiedlicher Länge (meist 12 und 26 Tage). Eine zusätzliche \"Signallinie\" (meist ein 9-Tage-EMA des MACD) hilft, Richtungswechsel zu erkennen.",
                "Kreuzt die MACD-Linie die Signallinie von unten nach oben, deuten viele Trader dies als möglicherweise bullisches Signal, im umgekehrten Fall als möglicherweise bearishes Signal. Wie beim RSI gilt: Kein Indikator liefert Gewissheit, sondern nur zusätzliche, statistisch mal mehr, mal weniger belastbare Hinweise auf die Marktstimmung.",
            ],
            quiz: [
                {
                    question: "Was deutet ein RSI-Wert über 70 traditionell an?",
                    options: [
                        { text: "Eine möglicherweise überkaufte Situation", correct: true },
                        { text: "Eine garantierte Kurssteigerung von 70 %", correct: false },
                        { text: "Dass die Aktie insolvent ist", correct: false },
                        { text: "Eine möglicherweise überverkaufte Situation", correct: false },
                    ],
                    explanation: "RSI-Werte über 70 gelten traditionell als Hinweis auf eine überkaufte Lage – das ist aber ein Signal, keine Garantie für eine Umkehr.",
                },
                {
                    question: "Warum reicht ein hoher RSI-Wert allein oft nicht als Verkaufssignal?",
                    options: [
                        { text: "Weil der RSI in starken Trends lange in überkauftem Bereich bleiben kann, ohne dass eine Umkehr folgt", correct: true },
                        { text: "Weil der RSI nur bei Anleihen berechnet werden kann", correct: false },
                        { text: "Weil ein hoher RSI immer einen Kursanstieg bedeutet", correct: false },
                        { text: "Weil der RSI keine Zahl zwischen 0 und 100 liefert", correct: false },
                    ],
                    explanation: "In anhaltenden Trends kann der RSI längere Zeit extrem bleiben – deshalb wird er meist mit anderen Analysewerkzeugen kombiniert.",
                },
                {
                    question: "Worauf basiert der MACD-Indikator?",
                    options: [
                        { text: "Auf dem Handelsvolumen einer Aktie", correct: false },
                        { text: "Auf dem Abstand zwischen zwei exponentiellen gleitenden Durchschnitten unterschiedlicher Länge", correct: true },
                        { text: "Ausschließlich auf der Dividendenrendite", correct: false },
                        { text: "Auf der Marktkapitalisierung des Unternehmens", correct: false },
                    ],
                    explanation: "Der MACD berechnet die Differenz zweier EMAs (meist 12- und 26-Tage) und vergleicht sie zusätzlich mit einer Signallinie.",
                },
            ],
        },
        {
            id: "handelsvolumen-liquiditaet",
            moduleId: "technische-analyse",
            title: "Handelsvolumen und Liquidität",
            summary: "Wie viele Stücke gehandelt werden, verrät, wie ernst eine Kursbewegung zu nehmen ist.",
            content: [
                "Das <strong>Handelsvolumen</strong> gibt an, wie viele Aktien in einem Zeitraum gehandelt wurden. In den meisten Charts wird es als Balken unter dem Kursverlauf dargestellt. Volumen misst die Beteiligung – also wie viele Marktteilnehmer an einer Bewegung mitwirken.",
                "Eine zentrale Regel der technischen Analyse lautet: <strong>Volumen bestätigt den Preis</strong>. Ein Kursausbruch oder Trend, der von hohem Volumen begleitet wird, gilt als glaubwürdiger als eine Bewegung bei dünnem Handel. Steigt ein Kurs dagegen bei stetig fallendem Volumen, kann das auf nachlassende Dynamik und eine mögliche Erschöpfung des Trends hindeuten (eine sogenannte Divergenz).",
                "Auffällige <strong>Volumenspitzen</strong> treten häufig an Wendepunkten und bei wichtigen Nachrichten auf – etwa Quartalszahlen oder Übernahmegerüchten. Sie zeigen, dass viele Anleger gleichzeitig ihre Einschätzung überdenken und handeln.",
                "Eng mit dem Volumen verbunden ist die <strong>Liquidität</strong>: Ein liquider, viel gehandelter Wert hat eine enge Geld-Brief-Spanne (Spread) und lässt sich kaufen oder verkaufen, ohne den Kurs stark zu bewegen. Bei wenig gehandelten Nebenwerten mit geringem Volumen ist der Spread größer, und schon eine mittelgroße Order kann den Kurs spürbar verschieben (Slippage).",
                "Für die Praxis heißt das: Volumen ist selten ein eigenständiges Kauf- oder Verkaufssignal, aber ein wertvoller <strong>Bestätigungsindikator</strong>. Ein Kurssignal, das durch hohes Volumen gestützt wird, ist verlässlicher als eines im Handel bei dünner Beteiligung.",
            ],
            quiz: [
                {
                    question: "Was misst das Handelsvolumen?",
                    options: [
                        { text: "Die Anzahl der in einem Zeitraum gehandelten Aktien", correct: true },
                        { text: "Den Höchstkurs des Tages", correct: false },
                        { text: "Die Dividende je Aktie", correct: false },
                        { text: "Die Anzahl der Aktionäre eines Unternehmens", correct: false },
                    ],
                    explanation: "Das Volumen zählt die gehandelten Stücke und zeigt so, wie viele Marktteilnehmer an einer Bewegung beteiligt sind.",
                },
                {
                    question: "Was bedeutet die Regel \"Volumen bestätigt den Preis\"?",
                    options: [
                        { text: "Ein Kurs darf sich nur bei hohem Volumen bewegen", correct: false },
                        { text: "Eine Kursbewegung mit hohem Volumen gilt als glaubwürdiger als eine bei dünnem Handel", correct: true },
                        { text: "Das Volumen legt den Schlusskurs fest", correct: false },
                        { text: "Hohes Volumen garantiert steigende Kurse", correct: false },
                    ],
                    explanation: "Hohes Volumen zeigt breite Beteiligung und macht Ausbrüche oder Trends verlässlicher; dünnes Volumen macht Bewegungen anfälliger für schnelle Umkehrungen.",
                },
                {
                    question: "Welche Folge hat geringe Liquidität eines Wertes?",
                    options: [
                        { text: "Ein engerer Spread und stabilere Kurse", correct: false },
                        { text: "Ein größerer Geld-Brief-Spread, und schon mittlere Orders können den Kurs spürbar bewegen (Slippage)", correct: true },
                        { text: "Garantiert höhere Dividenden", correct: false },
                        { text: "Steuerfreiheit auf Kursgewinne", correct: false },
                    ],
                    explanation: "Bei geringer Liquidität ist die Geld-Brief-Spanne breiter und der Kurs reagiert empfindlicher auf einzelne Orders – der Handel wird teurer und schwankungsanfälliger.",
                },
            ],
        },
    ],
};
