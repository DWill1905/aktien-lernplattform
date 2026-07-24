export const grundlagen = {
    id: "grundlagen",
    title: "Grundlagen",
    icon: "school",
    description: "Das Fundament: Was Aktien überhaupt sind, wie die Börse funktioniert und wie du dein Risiko sinnvoll streust.",
    lessons: [
        {
            id: "was-ist-eine-aktie",
            moduleId: "grundlagen",
            title: "Was ist eine Aktie?",
            summary: "Ein Wertpapier macht dich zum Miteigentümer eines Unternehmens.",
            content: [
                "Eine Aktie ist ein Anteilsschein an einem Unternehmen. Kaufst du eine Aktie der Firma XY, wirst du Miteigentümer—im Kleinen, aber rechtlich echt. Du besitzt einen winzigen Teil der Fabriken, Marken, Patente und zukünftigen Gewinne dieses Unternehmens.",
                "Unternehmen geben Aktien aus, um an frisches Kapital zu kommen, zum Beispiel um zu expandieren, neue Produkte zu entwickeln oder Schulden abzubauen. Im Gegenzug erhalten Aktionäre zwei mögliche Vorteile: <strong>Kurssteigerungen</strong>, wenn das Unternehmen an Wert gewinnt, und <strong>Dividenden</strong>, also eine Ausschüttung eines Teils des Gewinns.",
                "Als Aktionär hast du in der Regel auch ein <strong>Stimmrecht</strong> auf der Hauptversammlung – du kannst also über wichtige Unternehmensentscheidungen mitbestimmen, etwa die Wahl des Aufsichtsrats. Bei den meisten Kleinanlegern spielt das im Alltag aber eine untergeordnete Rolle gegenüber der Wertentwicklung.",
                "Wichtig zu verstehen: Der Aktienkurs ist nicht der \"faire Wert\" eines Unternehmens, sondern der Preis, zu dem gerade Käufer und Verkäufer bereit sind zu handeln. Erwartungen über die Zukunft – nicht nur die Gegenwart – bestimmen diesen Preis maßgeblich.",
            ],
            quiz: [
                {
                    question: "Was bekommst du, wenn du eine Aktie kaufst?",
                    options: [
                        { text: "Einen Kredit an das Unternehmen, den es zurückzahlen muss", correct: false },
                        { text: "Einen Miteigentumsanteil am Unternehmen", correct: true },
                        { text: "Eine garantierte jährliche Zinszahlung", correct: false },
                        { text: "Ein Nutzungsrecht an den Produkten des Unternehmens", correct: false },
                    ],
                    explanation: "Eine Aktie ist ein Anteilsschein – du wirst Miteigentümer, kein Gläubiger. Anders als bei einer Anleihe gibt es keine garantierte Rückzahlung.",
                },
                {
                    question: "Warum geben Unternehmen Aktien aus?",
                    options: [
                        { text: "Um Kapital für Wachstum, Investitionen oder Schuldenabbau zu beschaffen", correct: true },
                        { text: "Um Steuern zu vermeiden", correct: false },
                        { text: "Weil es gesetzlich vorgeschrieben ist", correct: false },
                        { text: "Um Mitarbeitern kostenlose Produkte zu geben", correct: false },
                    ],
                    explanation: "Der Börsengang (IPO) ist für Unternehmen eine Möglichkeit, sich Eigenkapital zu beschaffen, ohne Schulden aufzunehmen.",
                },
                {
                    question: "Was bestimmt den Aktienkurs am stärksten?",
                    options: [
                        { text: "Ausschließlich die Bilanz des letzten Geschäftsjahres", correct: false },
                        { text: "Der von der Regierung festgelegte Startpreis", correct: false },
                        { text: "Angebot, Nachfrage und Erwartungen an die Zukunft des Unternehmens", correct: true },
                        { text: "Die Anzahl der Mitarbeiter des Unternehmens", correct: false },
                    ],
                    explanation: "Börsenkurse spiegeln vor allem Erwartungen wider: Was Anleger über zukünftige Gewinne, Risiken und Zinsen denken.",
                },
            ],
        },
        {
            id: "wie-funktioniert-die-boerse",
            moduleId: "grundlagen",
            title: "Wie funktioniert die Börse?",
            summary: "Ein Marktplatz, an dem Käufer und Verkäufer in Echtzeit zueinanderfinden.",
            content: [
                "Die Börse ist im Kern ein organisierter Marktplatz, an dem Käufer und Verkäufer von Wertpapieren zusammenkommen. Heute läuft das fast vollständig elektronisch: Handelssysteme wie Xetra in Deutschland gleichen Kauf- und Verkaufsaufträge automatisch ab.",
                "Jeder Kurs entsteht durch ein <strong>Orderbuch</strong>: Käufer nennen den Preis, den sie maximal zahlen wollen (Geldkurs/Bid), Verkäufer den Preis, den sie mindestens erhalten wollen (Briefkurs/Ask). Sobald sich beide Seiten treffen, kommt ein Handel zustande und ein neuer Kurs wird festgestellt.",
                "Ein Unternehmen wird an der Börse gehandelt, nachdem es einen <strong>Börsengang</strong> (IPO, Initial Public Offering) durchlaufen hat. Danach handeln Anleger die Aktien untereinander weiter – das Unternehmen selbst bekommt bei diesem Weiterhandel kein zusätzliches Geld mehr.",
                "Wichtige Indizes wie der DAX (Deutschland) oder der S&P 500 (USA) fassen die Kursentwicklung vieler Unternehmen zu einer Kennzahl zusammen. Sie dienen als Stimmungsbarometer und Vergleichsmaßstab (Benchmark) für die eigene Anlage.",
            ],
            quiz: [
                {
                    question: "Wie entsteht ein Aktienkurs im elektronischen Handel?",
                    options: [
                        { text: "Eine Aufsichtsbehörde legt ihn täglich fest", correct: false },
                        { text: "Durch das Zusammentreffen von Kauf- und Verkaufsaufträgen im Orderbuch", correct: true },
                        { text: "Er wird einmal im Jahr von der Börse neu berechnet", correct: false },
                        { text: "Das Unternehmen selbst setzt den Preis fest", correct: false },
                    ],
                    explanation: "Kurse entstehen fortlaufend aus Angebot und Nachfrage: Der Preis, zu dem sich Käufer- und Verkäuferorder treffen, wird zum aktuellen Kurs.",
                },
                {
                    question: "Was passiert beim Börsengang (IPO)?",
                    options: [
                        { text: "Ein Unternehmen bietet erstmals Aktien der Öffentlichkeit zum Kauf an", correct: true },
                        { text: "Ein Unternehmen wird von der Börse entfernt", correct: false },
                        { text: "Ein Unternehmen fusioniert mit einem Konkurrenten", correct: false },
                        { text: "Ein Unternehmen zahlt seine erste Dividende aus", correct: false },
                    ],
                    explanation: "IPO steht für \"Initial Public Offering\" – der erstmalige Verkauf von Unternehmensanteilen an die Öffentlichkeit.",
                },
                {
                    question: "Wofür steht ein Aktienindex wie der DAX?",
                    options: [
                        { text: "Für den Kurs einer einzelnen, besonders wichtigen Aktie", correct: false },
                        { text: "Für die zusammengefasste Kursentwicklung mehrerer Unternehmen als Stimmungsbarometer", correct: true },
                        { text: "Für den gesetzlichen Höchstkurs, den Aktien erreichen dürfen", correct: false },
                        { text: "Für die Summe aller Dividenden eines Jahres", correct: false },
                    ],
                    explanation: "Ein Index bündelt die Kursentwicklung einer Gruppe von Aktien nach festen Regeln (z. B. Marktkapitalisierung) und dient als Vergleichsmaßstab.",
                },
            ],
        },
        {
            id: "aktien-etfs-fonds",
            moduleId: "grundlagen",
            title: "Aktien vs. ETFs vs. Fonds",
            summary: "Einzelaktie, aktiver Fonds oder passiver ETF – drei sehr unterschiedliche Wege zur Börse.",
            content: [
                "Wenn du in den Aktienmarkt investierst, hast du grundsätzlich drei Bausteine zur Auswahl: <strong>Einzelaktien</strong>, <strong>aktiv gemanagte Fonds</strong> und <strong>ETFs</strong> (Exchange Traded Funds).",
                "Eine <strong>Einzelaktie</strong> gibt dir volle Kontrolle, aber auch volles Risiko: Der Erfolg hängt an einem einzigen Unternehmen. Ein schlechtes Quartal, ein Skandal oder ein disruptiver Konkurrent können den Kurs stark belasten.",
                "Ein <strong>aktiver Fonds</strong> wird von einem Fondsmanager verwaltet, der versucht, durch geschickte Auswahl besser abzuschneiden als der Gesamtmarkt. Dafür verlangt er eine laufende Verwaltungsgebühr, oft 1–2 % pro Jahr. Studien zeigen, dass die meisten aktiven Fonds den Markt langfristig nicht schlagen.",
                "Ein <strong>ETF</strong> bildet einen Index (z. B. den MSCI World mit über 1.300 Unternehmen aus 23 Industrieländern) einfach nach, ohne dass jemand aktiv auswählt. Dadurch sind die Kosten sehr niedrig (oft unter 0,3 % pro Jahr), und du bist automatisch breit diversifiziert. Deshalb gelten ETFs für viele Privatanleger als solide Basis eines Depots.",
                "Eine sinnvolle Strategie für Einsteiger ist oft: ETFs als breiten, kostengünstigen Kern des Depots nutzen und, falls gewünscht, mit einem kleineren Anteil an Einzelaktien gezielt eigene Überzeugungen umsetzen.",
            ],
            quiz: [
                {
                    question: "Was ist der Hauptunterschied zwischen einem ETF und einer Einzelaktie?",
                    options: [
                        { text: "Ein ETF bündelt viele Unternehmen, eine Einzelaktie ist nur ein Unternehmen", correct: true },
                        { text: "Ein ETF ist immer teurer als eine Einzelaktie", correct: false },
                        { text: "Ein ETF zahlt nie Dividenden", correct: false },
                        { text: "Eine Einzelaktie ist automatisch diversifiziert", correct: false },
                    ],
                    explanation: "ETFs bilden einen ganzen Index mit vielen Unternehmen nach und streuen das Risiko dadurch automatisch über viele Titel.",
                },
                {
                    question: "Warum sind ETFs meist günstiger als aktiv gemanagte Fonds?",
                    options: [
                        { text: "Weil sie steuerlich begünstigt sind", correct: false },
                        { text: "Weil kein Fondsmanager aktiv Aktien auswählt, sondern ein Index automatisch nachgebildet wird", correct: true },
                        { text: "Weil sie nur in kleine Unternehmen investieren", correct: false },
                        { text: "Weil sie keine Kursschwankungen haben", correct: false },
                    ],
                    explanation: "Der Verzicht auf aktives Management senkt die laufenden Kosten (TER) deutlich – das ist der zentrale Kostenvorteil von ETFs.",
                },
                {
                    question: "Was zeigen Studien zur Wertentwicklung aktiver Fonds im Vergleich zum Gesamtmarkt?",
                    options: [
                        { text: "Aktive Fonds schlagen fast immer den Markt", correct: false },
                        { text: "Die meisten aktiven Fonds schlagen den Markt langfristig nicht", correct: true },
                        { text: "Aktive Fonds haben grundsätzlich kein Risiko", correct: false },
                        { text: "Es gibt keinen Unterschied zwischen aktiven Fonds und ETFs", correct: false },
                    ],
                    explanation: "Nach Abzug der Gebühren bleibt bei den meisten aktiv gemanagten Fonds langfristig keine Überrendite gegenüber dem Vergleichsindex.",
                },
            ],
        },
        {
            id: "ordertypen",
            moduleId: "grundlagen",
            title: "Ordertypen: Market, Limit, Stop",
            summary: "Mit der richtigen Orderart bestimmst du, zu welchem Preis dein Kauf oder Verkauf ausgeführt wird.",
            content: [
                "Eine <strong>Market-Order</strong> (Bestens-Order) wird sofort zum aktuell besten verfügbaren Preis ausgeführt. Vorteil: schnelle Ausführung. Nachteil: bei wenig gehandelten Werten oder hoher Volatilität kann der tatsächliche Preis vom zuletzt gesehenen Kurs abweichen (Slippage).",
                "Eine <strong>Limit-Order</strong> legt einen Höchstpreis (beim Kauf) oder Mindestpreis (beim Verkauf) fest. Die Order wird nur ausgeführt, wenn der Markt dieses Limit erreicht. Du hast Preiskontrolle, aber keine Garantie, dass die Order überhaupt ausgeführt wird.",
                "Eine <strong>Stop-Order</strong> wird erst aktiv, wenn ein bestimmter Kurs erreicht wird, und wandelt sich dann meist in eine Market-Order um. Ein <strong>Stop-Loss</strong> dient dazu, Verluste zu begrenzen: Fällt der Kurs auf die Stop-Marke, wird automatisch verkauft.",
                "Eine Kombination ist die <strong>Stop-Limit-Order</strong>: Beim Erreichen der Stop-Marke wird eine Limit-Order ausgelöst statt einer Market-Order – das gibt Preiskontrolle, kann aber in schnellen Märkten dazu führen, dass gar nicht verkauft wird, weil das Limit nicht erreicht wird.",
            ],
            quiz: [
                {
                    question: "Was passiert bei einer Market-Order?",
                    options: [
                        { text: "Sie wird sofort zum aktuell besten verfügbaren Preis ausgeführt", correct: true },
                        { text: "Sie wird nur ausgeführt, wenn ein bestimmter Preis erreicht wird", correct: false },
                        { text: "Sie wird automatisch storniert, wenn der Kurs steigt", correct: false },
                        { text: "Sie garantiert immer den niedrigsten Tagespreis", correct: false },
                    ],
                    explanation: "Market-Orders priorisieren die schnelle Ausführung, nicht die Preiskontrolle – der tatsächliche Ausführungspreis kann leicht abweichen.",
                },
                {
                    question: "Wofür wird eine Stop-Loss-Order typischerweise eingesetzt?",
                    options: [
                        { text: "Um garantiert den höchstmöglichen Gewinn mitzunehmen", correct: false },
                        { text: "Um Verluste zu begrenzen, indem bei einem festgelegten Kursrückgang automatisch verkauft wird", correct: true },
                        { text: "Um zusätzliche Dividenden zu erhalten", correct: false },
                        { text: "Um eine Aktie günstiger als den Marktpreis zu kaufen", correct: false },
                    ],
                    explanation: "Ein Stop-Loss löst automatisch einen Verkauf aus, sobald ein definierter Kurs unterschritten wird – als Absicherung nach unten.",
                },
                {
                    question: "Was ist der Unterschied zwischen einer Limit-Order und einer Market-Order?",
                    options: [
                        { text: "Es gibt keinen Unterschied", correct: false },
                        { text: "Eine Limit-Order garantiert Preiskontrolle, aber nicht die Ausführung; eine Market-Order garantiert Ausführung, aber nicht den Preis", correct: true },
                        { text: "Eine Limit-Order ist nur für Verkäufe verfügbar", correct: false },
                        { text: "Eine Market-Order kann nur einmal täglich genutzt werden", correct: false },
                    ],
                    explanation: "Limit-Orders geben Preissicherheit auf Kosten der Ausführungssicherheit – Market-Orders umgekehrt.",
                },
            ],
        },
        {
            id: "risiko-diversifikation",
            moduleId: "grundlagen",
            title: "Risiko und Diversifikation",
            summary: "Nicht alle Eier in einen Korb: Wie Streuung das Risiko senkt, ohne die Rendite zu opfern.",
            content: [
                "Risiko bei Aktien zeigt sich meist als <strong>Volatilität</strong>, also wie stark der Kurs schwankt. Höheres erwartetes Risiko geht historisch mit höherer erwarteter Rendite einher – aber eben nur im Durchschnitt und über lange Zeiträume, nicht garantiert für den Einzelfall.",
                "<strong>Diversifikation</strong> bedeutet, das Kapital auf viele unterschiedliche Anlagen zu verteilen – verschiedene Unternehmen, Branchen und Länder. Fällt eine Aktie stark, wird der Verlust durch die anderen Positionen im Depot abgefedert.",
                "Wichtig ist der Unterschied zwischen zwei Risikoarten: Das <strong>unternehmensspezifische Risiko</strong> (z. B. ein Managementfehler bei Firma X) lässt sich durch Diversifikation fast vollständig wegdiversifizieren. Das <strong>Marktrisiko</strong> (z. B. eine globale Rezession) betrifft dagegen fast alle Aktien gleichzeitig und lässt sich durch Streuung innerhalb von Aktien allein nicht beseitigen.",
                "Eine bewährte Faustregel: Je länger dein Anlagehorizont, desto eher kannst du kurzfristige Schwankungen aussitzen. Wer Geld erst in 20 Jahren braucht, kann tendenziell mehr Risiko tragen als jemand, der es in zwei Jahren benötigt.",
                "Diversifikation kostet nichts an erwarteter Rendite, senkt aber das Risiko – sie gilt deshalb als einer der wenigen \"kostenlosen Vorteile\" (Free Lunch) der Kapitalanlage.",
            ],
            quiz: [
                {
                    question: "Was bedeutet Diversifikation?",
                    options: [
                        { text: "Das gesamte Kapital in die vermeintlich beste Aktie zu investieren", correct: false },
                        { text: "Das Kapital auf viele verschiedene Anlagen zu verteilen, um Risiko zu streuen", correct: true },
                        { text: "Nur in eine einzige Branche zu investieren", correct: false },
                        { text: "Aktien täglich zu kaufen und zu verkaufen", correct: false },
                    ],
                    explanation: "Diversifikation verteilt das Kapital, sodass die Schwäche einer einzelnen Position das Gesamtdepot nicht dominiert.",
                },
                {
                    question: "Welches Risiko lässt sich durch Diversifikation über viele Aktien NICHT beseitigen?",
                    options: [
                        { text: "Das unternehmensspezifische Risiko einzelner Firmen", correct: false },
                        { text: "Das allgemeine Marktrisiko, z. B. durch eine globale Rezession", correct: true },
                        { text: "Das Risiko eines einzelnen Managementfehlers", correct: false },
                        { text: "Es gibt kein Risiko, das nicht wegdiversifizierbar wäre", correct: false },
                    ],
                    explanation: "Marktrisiko betrifft praktisch alle Aktien gleichzeitig und bleibt auch bei breiter Streuung innerhalb der Anlageklasse Aktien bestehen.",
                },
                {
                    question: "Warum gilt Diversifikation oft als \"kostenloser Vorteil\"?",
                    options: [
                        { text: "Weil sie das Risiko senkt, ohne die erwartete Rendite zu verringern", correct: true },
                        { text: "Weil Banken dafür keine Gebühren verlangen dürfen", correct: false },
                        { text: "Weil diversifizierte Depots von der Steuer befreit sind", correct: false },
                        { text: "Weil sie automatisch höhere Gewinne garantiert", correct: false },
                    ],
                    explanation: "Im Gegensatz zu den meisten anderen Strategien reduziert Diversifikation das Risiko, ohne im Erwartungswert Rendite zu kosten.",
                },
            ],
        },
        {
            id: "dividenden-gesamtrendite",
            moduleId: "grundlagen",
            title: "Dividenden und Gesamtrendite",
            summary: "Der Gewinn einer Aktie besteht aus Kursgewinn UND Ausschüttung – beides zählt.",
            content: [
                "Die <strong>Gesamtrendite</strong> (Total Return) einer Aktienanlage setzt sich aus zwei Bestandteilen zusammen: der <strong>Kursveränderung</strong> und den erhaltenen <strong>Dividenden</strong>. Wer nur auf den Kurs schaut, unterschätzt oft die tatsächliche Rendite dividendenstarker Unternehmen.",
                "Eine Dividende ist die Ausschüttung eines Teils des Unternehmensgewinns an die Aktionäre. In Deutschland wird sie meist einmal jährlich von der Hauptversammlung beschlossen, während US-Unternehmen typischerweise vierteljährlich ausschütten. Nicht jedes Unternehmen zahlt Dividenden – viele Wachstumsunternehmen reinvestieren Gewinne lieber ins eigene Geschäft.",
                "Am <strong>Ex-Dividenden-Tag</strong> sinkt der Aktienkurs rechnerisch um den Betrag der Dividende, weil das ausgeschüttete Geld dem Unternehmen nicht mehr gehört. Eine Dividende ist also kein \"geschenktes\" Extra, sondern eine Umschichtung von Unternehmens- zu Privatvermögen.",
                "Wird die Dividende wieder in weitere Aktien investiert (<strong>Reinvestition</strong> bzw. Thesaurierung bei Fonds), entsteht über lange Zeiträume ein starker Zinseszinseffekt: Historisch stammt ein erheblicher Teil der langfristigen Aktienmarktrendite aus reinvestierten Dividenden, nicht allein aus Kurssteigerungen.",
            ],
            quiz: [
                {
                    question: "Woraus setzt sich die Gesamtrendite einer Aktienanlage zusammen?",
                    options: [
                        { text: "Nur aus der Kursveränderung", correct: false },
                        { text: "Nur aus den erhaltenen Dividenden", correct: false },
                        { text: "Aus Kursveränderung und erhaltenen Dividenden zusammen", correct: true },
                        { text: "Nur aus dem Stimmrecht auf der Hauptversammlung", correct: false },
                    ],
                    explanation: "Die Gesamtrendite (Total Return) berücksichtigt sowohl Kursgewinne oder -verluste als auch ausgeschüttete Dividenden.",
                },
                {
                    question: "Was passiert mit dem Aktienkurs am Ex-Dividenden-Tag typischerweise?",
                    options: [
                        { text: "Er steigt um den Dividendenbetrag", correct: false },
                        { text: "Er sinkt rechnerisch etwa um den Dividendenbetrag", correct: true },
                        { text: "Er bleibt garantiert unverändert", correct: false },
                        { text: "Der Handel wird für diesen Tag ausgesetzt", correct: false },
                    ],
                    explanation: "Da das ausgeschüttete Geld das Unternehmen verlässt, sinkt der faire Wert der Aktie rechnerisch um den Dividendenbetrag.",
                },
                {
                    question: "Warum ist die Reinvestition von Dividenden langfristig bedeutsam?",
                    options: [
                        { text: "Weil sie den Zinseszinseffekt nutzt und einen erheblichen Teil der langfristigen Rendite ausmacht", correct: true },
                        { text: "Weil reinvestierte Dividenden steuerfrei sind", correct: false },
                        { text: "Weil sie das Unternehmen zwingt, mehr Dividende zu zahlen", correct: false },
                        { text: "Weil sie das Risiko einer Aktie vollständig eliminiert", correct: false },
                    ],
                    explanation: "Wieder investierte Dividenden kaufen zusätzliche Anteile, die selbst wieder Erträge abwerfen – über Jahrzehnte ein bedeutender Renditetreiber.",
                },
            ],
        },
        {
            id: "kosten-und-steuern",
            moduleId: "grundlagen",
            title: "Kosten und Steuern",
            summary: "Gebühren und Steuern schmälern die Rendite – wer sie kennt, behält mehr vom Ertrag.",
            content: [
                "Jeder Kauf und Verkauf verursacht <strong>Kosten</strong>, die direkt an der Rendite zehren. Dazu zählen die <strong>Ordergebühr</strong> des Brokers (fix, prozentual oder beides), die <strong>Geld-Brief-Spanne</strong> (Spread) zwischen An- und Verkaufspreis sowie mögliche Depot- oder Handelsplatzentgelte. Viele Neobroker verlangen niedrige oder gar keine Ordergebühren – dafür kann der Spread etwas größer sein.",
                "Bei Fonds und ETFs kommt die laufende <strong>Gesamtkostenquote</strong> (TER, Total Expense Ratio) hinzu. Sie wird nicht separat abgebucht, sondern täglich anteilig aus dem Fondsvermögen entnommen und schmälert so unbemerkt die Wertentwicklung. Schon ein Unterschied von 1 % pro Jahr summiert sich über Jahrzehnte durch den Zinseszinseffekt zu erheblichen Beträgen.",
                "In Deutschland fällt auf Kapitalerträge – also realisierte Kursgewinne, Dividenden und Zinsen – die <strong>Abgeltungsteuer</strong> von 25 % an, zuzüglich Solidaritätszuschlag (5,5 % der Steuer, macht rund 26,4 % gesamt) und gegebenenfalls Kirchensteuer. Wichtig: Besteuert wird erst bei <strong>Realisierung</strong>. Ein Buchgewinn auf einer noch gehaltenen Aktie ist bis zum Verkauf steuerfrei.",
                "Der <strong>Sparer-Pauschbetrag</strong> stellt pro Person 1.000 € an Kapitalerträgen im Jahr steuerfrei (2.000 € bei gemeinsam veranlagten Paaren). Über einen <strong>Freistellungsauftrag</strong> bei der Bank wird er automatisch berücksichtigt. Bei Aktienfonds und -ETFs bleiben zudem dank <strong>Teilfreistellung</strong> 30 % der Erträge steuerfrei.",
                "Für Anleger folgt daraus eine einfache Konsequenz: Häufiges Handeln verursacht mehr Gebühren und löst früher Steuern aus, was den Zinseszinseffekt bremst. Kostenbewusstes, langfristiges Investieren mit wenigen Transaktionen ist deshalb für die meisten Privatanleger überlegen. (Dies ist keine Steuerberatung – Details und Freibeträge können sich ändern.)",
            ],
            quiz: [
                {
                    question: "Wann fällt in Deutschland auf einen Aktiengewinn typischerweise Abgeltungsteuer an?",
                    options: [
                        { text: "Sobald der Kurs der noch gehaltenen Aktie steigt", correct: false },
                        { text: "Erst wenn der Gewinn durch Verkauf realisiert wird (oder bei Ausschüttung)", correct: true },
                        { text: "Jährlich pauschal auf den gesamten Depotwert", correct: false },
                        { text: "Nur wenn die Aktie länger als ein Jahr gehalten wurde", correct: false },
                    ],
                    explanation: "Buchgewinne bleiben steuerfrei; die Abgeltungsteuer greift erst bei Realisierung (Verkauf mit Gewinn) oder bei Dividenden und Zinsen.",
                },
                {
                    question: "Was ist die TER (Total Expense Ratio) eines ETFs?",
                    options: [
                        { text: "Eine einmalige Kaufgebühr beim Broker", correct: false },
                        { text: "Die laufende Gesamtkostenquote, die täglich anteilig aus dem Fondsvermögen entnommen wird", correct: true },
                        { text: "Die Steuer, die auf Dividenden anfällt", correct: false },
                        { text: "Der Spread zwischen An- und Verkaufskurs", correct: false },
                    ],
                    explanation: "Die TER wird nicht separat abgebucht, sondern schmälert die Wertentwicklung fortlaufend – schon kleine Unterschiede wirken über die Jahre stark.",
                },
                {
                    question: "Warum ist häufiges Handeln für die Nettorendite oft nachteilig?",
                    options: [
                        { text: "Weil jeder Trade Gebühren verursacht und Gewinne früher versteuert werden, was den Zinseszinseffekt bremst", correct: true },
                        { text: "Weil Broker aktives Handeln gesetzlich verbieten", correct: false },
                        { text: "Weil der Sparer-Pauschbetrag dadurch steigt", correct: false },
                        { text: "Weil Kursgewinne bei häufigem Handeln steuerfrei werden", correct: false },
                    ],
                    explanation: "Transaktionskosten und vorgezogene Steuerzahlungen mindern das für den Zinseszins verfügbare Kapital – kostenbewusstes, langfristiges Investieren bleibt meist überlegen.",
                },
            ],
        },
        {
            id: "sparplan-cost-average",
            moduleId: "grundlagen",
            title: "Sparplan und Cost-Average-Effekt",
            summary: "Regelmäßig automatisiert investieren – diszipliniert statt getrieben vom richtigen Zeitpunkt.",
            content: [
                "Ein <strong>Sparplan</strong> investiert automatisch in festen Abständen (z. B. monatlich) einen gleichbleibenden Betrag in eine Aktie oder – häufiger – einen ETF. Die meisten Broker bieten Sparpläne kostengünstig oder gebührenfrei an. Der große praktische Vorteil ist die <strong>Automatisierung</strong>: Man investiert kontinuierlich, ohne bei jeder Rate neu über den \"richtigen\" Zeitpunkt nachdenken zu müssen.",
                "Weil der Betrag konstant bleibt, kauft man bei <strong>niedrigen Kursen automatisch mehr Anteile</strong> und bei hohen Kursen weniger. Dieser <strong>Cost-Average-Effekt</strong> (Durchschnittskosteneffekt) glättet den durchschnittlichen Einstandspreis über die Zeit und nimmt dem Anleger die Angst, \"zum falschen Zeitpunkt\" alles auf einmal investiert zu haben.",
                "Wichtige Einordnung: Der Cost-Average-Effekt ist <strong>kein Garant für höhere Renditen</strong>. Da Aktienmärkte langfristig eher steigen, ist eine sofortige Einmalanlage im statistischen Mittel oft leicht überlegen, weil das Geld früher und länger investiert ist. Der Sparplan punktet vor allem dort, wo ohnehin nur laufendes Einkommen zur Verfügung steht – und indem er emotionale Fehlentscheidungen reduziert.",
                "Damit verbindet sich die Börsenweisheit <strong>\"Time in the market beats timing the market\"</strong>: Über lange Zeiträume im Markt investiert zu sein, schlägt in der Regel den Versuch, Höchst- und Tiefpunkte exakt zu erwischen. Ein Sparplan setzt genau dieses Prinzip diszipliniert und ohne ständige Entscheidungen um.",
            ],
            quiz: [
                {
                    question: "Was beschreibt der Cost-Average-Effekt bei einem Sparplan?",
                    options: [
                        { text: "Bei konstantem Sparbetrag kauft man bei niedrigen Kursen mehr und bei hohen Kursen weniger Anteile", correct: true },
                        { text: "Der Broker senkt automatisch die Gebühren, je länger man spart", correct: false },
                        { text: "Die Rendite ist garantiert höher als bei einer Einmalanlage", correct: false },
                        { text: "Man zahlt keine Steuern auf die Erträge eines Sparplans", correct: false },
                    ],
                    explanation: "Ein fester Betrag kauft bei tiefen Kursen mehr Anteile – das glättet den durchschnittlichen Einstandspreis, garantiert aber keine Mehrrendite.",
                },
                {
                    question: "Warum ist eine Einmalanlage einer Ratenzahlung im statistischen Mittel oft leicht überlegen?",
                    options: [
                        { text: "Weil Einmalanlagen von der Steuer befreit sind", correct: false },
                        { text: "Weil das Kapital früher und damit länger im tendenziell steigenden Markt investiert ist", correct: true },
                        { text: "Weil ein Sparplan höhere Gebühren verursacht", correct: false },
                        { text: "Weil der Cost-Average-Effekt die Rendite senkt", correct: false },
                    ],
                    explanation: "Da Aktienmärkte langfristig eher steigen, wirkt sich früher investiertes Kapital im Mittel positiv aus – der Sparplan bleibt dennoch für laufendes Einkommen und Disziplin wertvoll.",
                },
                {
                    question: "Was bringt die Börsenweisheit \"Time in the market beats timing the market\" auf den Punkt?",
                    options: [
                        { text: "Man sollte täglich handeln, um den Markt zu schlagen", correct: false },
                        { text: "Lange investiert zu bleiben schlägt meist den Versuch, exakte Ein- und Ausstiegszeitpunkte zu treffen", correct: true },
                        { text: "Nur kurzfristige Trades sind profitabel", correct: false },
                        { text: "Der Zeitpunkt des Kaufs ist die einzige Renditequelle", correct: false },
                    ],
                    explanation: "Das Markt-Timing gelingt kaum verlässlich; kontinuierliches Investiertsein nutzt den langfristigen Aufwärtstrend und den Zinseszinseffekt.",
                },
            ],
        },
        {
            id: "anlegerpsychologie",
            moduleId: "grundlagen",
            title: "Anlegerpsychologie: typische Denkfehler",
            summary: "Die größten Renditekiller sitzen oft nicht im Markt, sondern im eigenen Kopf.",
            content: [
                "Die Verhaltensökonomie (Behavioral Finance) zeigt: Anlageentscheidungen sind selten rein rational. Wiederkehrende Denkfehler kosten Privatanleger nachweislich Rendite – sie zu kennen ist der erste Schritt, um sie zu vermeiden.",
                "Die <strong>Verlustaversion</strong> ist einer der stärksten Effekte: Ein Verlust schmerzt psychologisch etwa doppelt so stark, wie ein gleich großer Gewinn erfreut. Daraus folgt der <strong>Dispositionseffekt</strong> – Anleger verkaufen Gewinner zu früh, um den Gewinn \"sicher\" zu haben, und halten Verlierer zu lange in der Hoffnung, \"nur bis der Kurs wieder bei meinem Einstand ist\".",
                "Der <strong>Ankereffekt</strong> beschreibt die Fixierung auf einen willkürlichen Bezugspunkt, meist den eigenen Kaufkurs. Ob eine Aktie heute kaufens- oder verkaufenswert ist, hängt aber von ihren Zukunftsaussichten ab – nicht davon, was du selbst einmal bezahlt hast. Der Markt kennt deinen Einstandskurs nicht.",
                "Weitere häufige Muster sind der <strong>Herdentrieb</strong> (der Masse in Hypes hinterherlaufen und auf dem Höhepunkt einsteigen), die <strong>Selbstüberschätzung</strong> (Overconfidence, die zu übermäßig häufigem Handeln und Unterschätzen von Risiken führt) und der <strong>Bestätigungsfehler</strong> (nur nach Informationen suchen, die die eigene Meinung stützen).",
                "Das wirksamste Gegenmittel ist kein Geheimtipp, sondern <strong>Struktur</strong>: ein vorab festgelegter Plan, breite Diversifikation, ein automatisierter Sparplan und klare Regeln, wann gekauft oder verkauft wird. Regeln nehmen der Emotion im entscheidenden Moment die Kontrolle aus der Hand.",
            ],
            quiz: [
                {
                    question: "Was besagt die Verlustaversion?",
                    options: [
                        { text: "Anleger empfinden Verluste psychologisch deutlich stärker als gleich große Gewinne", correct: true },
                        { text: "Anleger meiden grundsätzlich jede Form von Risiko", correct: false },
                        { text: "Verluste sind steuerlich immer absetzbar", correct: false },
                        { text: "Große Gewinne erfreuen genauso stark, wie gleich große Verluste schmerzen", correct: false },
                    ],
                    explanation: "Weil Verluste ungefähr doppelt so schwer wiegen wie gleich große Gewinne, treffen Anleger oft unlogische Entscheidungen, um Verluste zu vermeiden.",
                },
                {
                    question: "Was beschreibt der Dispositionseffekt?",
                    options: [
                        { text: "Gewinneraktien werden zu früh verkauft und Verliereraktien zu lange gehalten", correct: true },
                        { text: "Anleger kaufen ausschließlich Aktien mit hoher Dividende", correct: false },
                        { text: "Der Broker verteilt Aktien automatisch auf mehrere Depots", correct: false },
                        { text: "Verluste werden sofort realisiert, Gewinne nie", correct: false },
                    ],
                    explanation: "Als Folge der Verlustaversion sichern Anleger Gewinne vorschnell und klammern sich an Verlierer – häufig genau die falsche Reihenfolge.",
                },
                {
                    question: "Warum ist der eigene Kaufkurs (Ankereffekt) ein schlechter Maßstab für eine Verkaufsentscheidung?",
                    options: [
                        { text: "Weil er gesetzlich nicht berücksichtigt werden darf", correct: false },
                        { text: "Weil die Zukunftsaussichten der Aktie zählen, nicht der historisch von dir gezahlte Preis", correct: true },
                        { text: "Weil der Kaufkurs steuerlich irrelevant ist", correct: false },
                        { text: "Weil der Broker den Kaufkurs nicht speichert", correct: false },
                    ],
                    explanation: "Der Markt orientiert sich an Erwartungen über die Zukunft; dein persönlicher Einstandspreis ist für die Bewertung einer Aktie ohne Bedeutung.",
                },
            ],
        },
        {
            id: "inflation-realrendite",
            moduleId: "grundlagen",
            title: "Inflation und Realrendite",
            summary: "Entscheidend ist nicht, wie viel Geld du hast, sondern was du dir dafür kaufen kannst.",
            content: [
                "<strong>Inflation</strong> bezeichnet den allgemeinen Anstieg des Preisniveaus – dein Geld verliert an <strong>Kaufkraft</strong>. Bei 2 % Inflation pro Jahr kostet dasselbe Produkt nach einem Jahr 2 % mehr; dein nicht verzinstes Geld kauft entsprechend weniger.",
                "Deshalb unterscheidet man <strong>Nominalrendite</strong> (der reine Zuwachs in Euro) und <strong>Realrendite</strong> (der Zuwachs nach Abzug der Inflation). Als Faustformel gilt: Realrendite ≈ Nominalrendite − Inflationsrate. Erzielst du 5 % Rendite bei 3 % Inflation, wächst dein Vermögen real nur um rund 2 %.",
                "Das erklärt, warum vermeintlich \"sichere\" Sparbücher tückisch sein können: Liegt der Sparzins unter der Inflation, ist die Realrendite <strong>negativ</strong> – das Guthaben wächst nominal, verliert aber real an Kaufkraft. Nichtstun ist an der Börse also keineswegs risikofrei, sondern trägt ein schleichendes Kaufkraftrisiko.",
                "Über die Zeit wirkt Inflation wie ein negativer Zinseszins: Schon 2 % pro Jahr halbieren die Kaufkraft in gut 35 Jahren (Faustregel: 70 geteilt durch die Inflationsrate ergibt die Jahre bis zur Halbierung).",
                "<strong>Aktien</strong> gelten über lange Zeiträume als partieller Inflationsschutz, weil Unternehmen als Sachwerte gestiegene Kosten häufig über höhere Preise weitergeben und so Umsätze und Gewinne mit dem Preisniveau mitwachsen können. Ein Schutz für jedes einzelne Jahr ist das aber nicht – kurzfristig können hohe Inflation und steigende Zinsen Aktienkurse durchaus belasten.",
            ],
            quiz: [
                {
                    question: "Was ist die Realrendite einer Geldanlage?",
                    options: [
                        { text: "Der Wertzuwachs in Euro vor jeglichem Abzug", correct: false },
                        { text: "Der Wertzuwachs nach Abzug der Inflation – also der echte Kaufkraftgewinn", correct: true },
                        { text: "Die Rendite nach Abzug der Ordergebühren", correct: false },
                        { text: "Die vom Staat garantierte Mindestverzinsung", correct: false },
                    ],
                    explanation: "Die Realrendite zieht die Inflation von der Nominalrendite ab und zeigt, wie viel Kaufkraft tatsächlich hinzugewonnen wurde.",
                },
                {
                    question: "Warum kann ein Sparbuch trotz positiver Zinsen Geld \"vernichten\"?",
                    options: [
                        { text: "Weil Sparzinsen grundsätzlich verboten sind", correct: false },
                        { text: "Weil bei einem Zins unterhalb der Inflationsrate die Realrendite negativ ist und Kaufkraft verloren geht", correct: true },
                        { text: "Weil Banken das Guthaben jährlich kürzen", correct: false },
                        { text: "Weil Sparbücher höher besteuert werden als Aktien", correct: false },
                    ],
                    explanation: "Liegt der Nominalzins unter der Inflation, schrumpft die reale Kaufkraft des Guthabens – nominal wächst es, real verliert es.",
                },
                {
                    question: "Warum gelten Aktien langfristig als partieller Inflationsschutz?",
                    options: [
                        { text: "Weil ihr Kurs gesetzlich an die Inflation gekoppelt ist", correct: false },
                        { text: "Weil Unternehmen als Sachwerte gestiegene Kosten oft über höhere Preise weitergeben und Gewinne mitwachsen können", correct: true },
                        { text: "Weil Aktien in Inflationsphasen garantiert steigen", correct: false },
                        { text: "Weil Dividenden von der Inflation ausgenommen sind", correct: false },
                    ],
                    explanation: "Als Anteile an realen Unternehmen können Aktien langfristig mit dem Preisniveau mitwachsen – kurzfristig ist der Schutz aber unvollständig.",
                },
            ],
        },
    ],
};
