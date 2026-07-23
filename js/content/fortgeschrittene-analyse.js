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
        {
            id: "profi-kennzahlen",
            moduleId: "fortgeschrittene-analyse",
            title: "Profi-Kennzahlen: ROE, ROIC, EV/EBITDA, PEG",
            summary: "Über KGV hinaus: Kennzahlen, die Kapitaleffizienz, Kapitalstruktur und Wachstum sauber einbeziehen.",
            content: [
                "Die <strong>Eigenkapitalrendite</strong> (ROE, Return on Equity) misst, wie viel Gewinn ein Unternehmen aus dem Eigenkapital erwirtschaftet: Nettogewinn ÷ Eigenkapital. Ein hoher ROE wirkt attraktiv – aber Vorsicht: Er lässt sich durch hohe Verschuldung künstlich aufblähen, weil dann wenig Eigenkapital einem großen Gewinn gegenübersteht.",
                "Deshalb schauen Profis zusätzlich auf die <strong>Kapitalrendite</strong> (ROIC, Return on Invested Capital): Sie setzt den operativen Gewinn ins Verhältnis zum gesamten investierten Kapital (Eigen- und Fremdkapital). Liegt der ROIC dauerhaft über den Kapitalkosten (WACC), schafft das Unternehmen echten Wert – ein starkes Qualitätssignal und oft ein Hinweis auf einen Burggraben.",
                "Das <strong>EV/EBITDA</strong> vergleicht den <strong>Enterprise Value</strong> (Marktkapitalisierung plus Nettoverschuldung) mit dem EBITDA. Weil der Enterprise Value die Schulden einbezieht, ist diese Kennzahl kapitalstruktur-neutral – dadurch lassen sich Unternehmen mit sehr unterschiedlicher Verschuldung fairer vergleichen als mit dem reinen KGV.",
                "Das <strong>PEG-Ratio</strong> (Price/Earnings-to-Growth) teilt das KGV durch die erwartete Gewinnwachstumsrate in Prozent. Es setzt die Bewertung ins Verhältnis zum Wachstum: Ein KGV von 30 ist bei 30 % Wachstum (PEG 1) etwas ganz anderes als bei 5 % Wachstum (PEG 6). Für Wachstumswerte ist das PEG oft aussagekräftiger als das nackte KGV.",
                "Keine Kennzahl steht für sich allein. Erst im Zusammenspiel – Kapitaleffizienz (ROIC), faire Bewertung (EV/EBITDA), Wachstum (PEG) – entsteht ein belastbares Bild von Qualität und Preis eines Unternehmens.",
            ],
            quiz: [
                {
                    question: "Warum ist der ROIC oft aussagekräftiger als der ROE?",
                    options: [
                        { text: "Weil er das gesamte investierte Kapital einbezieht und nicht durch hohe Verschuldung verzerrt wird", correct: true },
                        { text: "Weil er immer höher ist als der ROE", correct: false },
                        { text: "Weil er nur bei Banken gilt", correct: false },
                        { text: "Weil er die Dividende misst", correct: false },
                    ],
                    explanation: "Der ROE kann durch viel Fremdkapital künstlich hoch wirken; der ROIC betrachtet Eigen- und Fremdkapital gemeinsam und zeigt die echte Kapitaleffizienz.",
                },
                {
                    question: "Was ist der Vorteil von EV/EBITDA gegenüber dem KGV?",
                    options: [
                        { text: "Es ist kapitalstruktur-neutral, weil der Enterprise Value die Schulden berücksichtigt", correct: true },
                        { text: "Es ist immer niedriger als das KGV", correct: false },
                        { text: "Es berücksichtigt die Dividende", correct: false },
                        { text: "Es funktioniert nur ohne Schulden", correct: false },
                    ],
                    explanation: "Der Enterprise Value schließt die Nettoverschuldung ein – dadurch werden unterschiedlich finanzierte Unternehmen vergleichbar, anders als beim reinen KGV.",
                },
                {
                    question: "Was drückt ein PEG-Ratio von etwa 1 aus?",
                    options: [
                        { text: "Dass die Bewertung (KGV) ungefähr dem erwarteten Gewinnwachstum entspricht", correct: true },
                        { text: "Dass die Aktie garantiert unterbewertet ist", correct: false },
                        { text: "Dass das Unternehmen keine Schulden hat", correct: false },
                        { text: "Dass die Dividendenrendite bei 1 % liegt", correct: false },
                    ],
                    explanation: "Das PEG teilt das KGV durch die Wachstumsrate; ein Wert nahe 1 gilt als grobe Marke, dass Preis und Wachstum in einem ausgewogenen Verhältnis stehen.",
                },
            ],
        },
        {
            id: "makro-zinsen-konjunktur",
            moduleId: "fortgeschrittene-analyse",
            title: "Makro, Zinsen und Konjunkturzyklus",
            summary: "Der wichtigste Hebel für die gesamte Börse sitzt bei den Notenbanken – Profis behalten das große Bild im Auge.",
            content: [
                "Der stärkste übergeordnete Kurstreiber sind die <strong>Zinsen</strong>, gesteuert von Notenbanken wie der EZB und der US-Notenbank Fed über den Leitzins. Zinsen wirken auf die gesamte Bewertung von Aktien – nicht nur auf einzelne Titel.",
                "<strong>Steigende Zinsen</strong> belasten Aktien gleich mehrfach: Anleihen werfen wieder mehr ab und werden zur Konkurrenz, Kredite und Investitionen werden teurer, und künftige Gewinne werden stärker abgezinst. Besonders <strong>Wachstums- und Technologiewerte</strong> leiden, weil ihr Wert weit in der Zukunft liegt. Fallende Zinsen wirken umgekehrt tendenziell kurstreibend – daher die Börsenweisheit \"Don't fight the Fed\".",
                "Die Wirtschaft durchläuft einen <strong>Konjunkturzyklus</strong>: Aufschwung, Boom, Abschwung und Rezession. Wichtig für Anleger: Der Aktienmarkt ist ein <strong>vorlaufender Indikator</strong> – er nimmt Erholung oder Abschwung meist rund ein halbes Jahr vorweg, bevor sie in den realen Wirtschaftsdaten sichtbar werden.",
                "Ein vielbeachtetes Frühwarnsignal ist die <strong>Zinskurve</strong>. Normalerweise sind langfristige Zinsen höher als kurzfristige. Kehrt sich das um (<strong>inverse Zinskurve</strong>, kurzfristige Zinsen über langfristigen), galt das in der Vergangenheit häufig als Vorbote einer Rezession.",
                "Aus dem Zyklus folgt die <strong>Sektorrotation</strong>: In frühen Aufschwungphasen laufen oft zyklische Branchen (Industrie, Konsum-Luxus) besser, in Abschwüngen eher defensive (Versorger, Basiskonsum, Pharma), deren Nachfrage konjunkturunabhängiger ist. Wer den Zyklus grob einordnet, versteht die Rotation zwischen den Sektoren besser.",
            ],
            quiz: [
                {
                    question: "Warum belasten steigende Zinsen tendenziell besonders Wachstumsaktien?",
                    options: [
                        { text: "Weil deren Gewinne weit in der Zukunft liegen und stärker abgezinst werden – zudem werden Anleihen attraktiver", correct: true },
                        { text: "Weil Wachstumsaktien keine Dividende zahlen dürfen", correct: false },
                        { text: "Weil steigende Zinsen den Umsatz gesetzlich begrenzen", correct: false },
                        { text: "Weil Wachstumsaktien vom Handel ausgesetzt werden", correct: false },
                    ],
                    explanation: "Höhere Zinsen erhöhen den Diskontsatz für künftige Gewinne und machen Anleihen zur Konkurrenz – beides trifft weit in der Zukunft bewertete Wachstumswerte am stärksten.",
                },
                {
                    question: "Was gilt eine inverse Zinskurve historisch als Signal?",
                    options: [
                        { text: "Für einen garantierten Börsencrash am nächsten Tag", correct: false },
                        { text: "Als häufiger Vorbote einer Rezession (kurzfristige Zinsen über langfristigen)", correct: true },
                        { text: "Für steigende Dividenden", correct: false },
                        { text: "Für ein Verbot von Leerverkäufen", correct: false },
                    ],
                    explanation: "Wenn kurzfristige Zinsen über den langfristigen liegen, war das in der Vergangenheit oft ein Frühindikator für eine bevorstehende Rezession.",
                },
                {
                    question: "Was besagt der Umstand, dass der Aktienmarkt ein vorlaufender Indikator ist?",
                    options: [
                        { text: "Er bildet die aktuelle Wirtschaftslage exakt in Echtzeit ab", correct: false },
                        { text: "Er nimmt Erholung oder Abschwung meist vorweg, bevor sie in den Wirtschaftsdaten sichtbar werden", correct: true },
                        { text: "Er reagiert immer erst ein Jahr nach der Wirtschaft", correct: false },
                        { text: "Er hat mit der Konjunktur nichts zu tun", correct: false },
                    ],
                    explanation: "Kurse spiegeln Erwartungen wider und laufen der realen Wirtschaft typischerweise etwa ein halbes Jahr voraus.",
                },
            ],
        },
        {
            id: "chartmuster",
            moduleId: "fortgeschrittene-analyse",
            title: "Chartmuster: Kopf-Schulter, Dreiecke, Flaggen",
            summary: "Wiederkehrende Formationen im Chart, die Trader als Hinweise auf Umkehr oder Fortsetzung deuten.",
            content: [
                "<strong>Chartmuster</strong> sind wiederkehrende Kursformationen, die aus dem kollektiven Verhalten der Marktteilnehmer entstehen. Man unterscheidet grob <strong>Umkehrmuster</strong> (ein Trend dreht) und <strong>Fortsetzungsmuster</strong> (ein Trend pausiert und setzt sich dann fort).",
                "Das bekannteste Umkehrmuster ist die <strong>Kopf-Schulter-Formation</strong>: drei Hochs, wobei das mittlere (der Kopf) höher liegt als die beiden äußeren (die Schultern). Die Verbindungslinie der Zwischentiefs heißt <strong>Nackenlinie</strong>. Wird sie nach unten durchbrochen, gilt das als bearishes Signal. Die umgekehrte (inverse) Kopf-Schulter am Ende eines Abwärtstrends deutet spiegelbildlich auf eine Aufwärtswende hin.",
                "Typische Fortsetzungsmuster sind <strong>Dreiecke</strong> (aufsteigend, absteigend oder symmetrisch) und <strong>Flaggen bzw. Wimpel</strong> – kurze Verschnaufpausen innerhalb eines starken Trends, nach denen die Bewegung häufig in Trendrichtung weiterläuft.",
                "Entscheidend ist der <strong>Ausbruch</strong> (Breakout) aus dem Muster, idealerweise mit erhöhtem Volumen als Bestätigung. Viele Trader projizieren zudem ein <strong>Kursziel</strong>, indem sie die Höhe der Formation an den Ausbruchspunkt anlegen.",
                "Wichtig bleibt: Chartmuster sind <strong>Wahrscheinlichkeiten, keine Gewissheiten</strong>. <strong>Fehlausbrüche</strong> (false breakouts) kommen regelmäßig vor. Deshalb kombinieren Profis Muster mit einem Stop-Loss und weiteren Faktoren wie Volumen und übergeordnetem Trend, statt blind auf eine Formation zu setzen.",
            ],
            quiz: [
                {
                    question: "Was signalisiert der Bruch der Nackenlinie einer Kopf-Schulter-Formation nach unten?",
                    options: [
                        { text: "Ein bearishes Umkehrsignal (mögliches Ende des Aufwärtstrends)", correct: true },
                        { text: "Eine garantierte Kursverdopplung", correct: false },
                        { text: "Eine Dividendenerhöhung", correct: false },
                        { text: "Den Beginn eines Aktiensplits", correct: false },
                    ],
                    explanation: "Die Kopf-Schulter ist ein Umkehrmuster; der Bruch der Nackenlinie nach unten gilt als Hinweis auf eine mögliche Trendwende nach unten.",
                },
                {
                    question: "Wozu zählen Flaggen und Wimpel?",
                    options: [
                        { text: "Zu den Fortsetzungsmustern – kurze Pausen, nach denen der Trend oft weiterläuft", correct: true },
                        { text: "Zu den garantierten Umkehrsignalen", correct: false },
                        { text: "Zu den fundamentalen Kennzahlen", correct: false },
                        { text: "Zu den Ordertypen", correct: false },
                    ],
                    explanation: "Flaggen und Wimpel sind kurze Konsolidierungen innerhalb eines Trends; nach dem Ausbruch setzt sich die Bewegung häufig in Trendrichtung fort.",
                },
                {
                    question: "Warum sind Chartmuster kein Selbstläufer?",
                    options: [
                        { text: "Weil Fehlausbrüche vorkommen – Muster sind Wahrscheinlichkeiten und sollten mit Stop und weiteren Faktoren abgesichert werden", correct: true },
                        { text: "Weil sie nur für Anleihen gelten", correct: false },
                        { text: "Weil sie gesetzlich reguliert sind", correct: false },
                        { text: "Weil sie den Kurs exakt vorhersagen", correct: false },
                    ],
                    explanation: "Kein Muster liefert Gewissheit; Fehlausbrüche sind normal, weshalb Profis Muster mit Volumen, Trendkontext und einem Stop-Loss kombinieren.",
                },
            ],
        },
    ],
};
