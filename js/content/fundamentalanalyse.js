export const fundamentalanalyse = {
    id: "fundamentalanalyse",
    title: "Fundamentalanalyse",
    icon: "analytics",
    description: "Unternehmen anhand von Bilanzen, Kennzahlen und Geschäftsmodell bewerten – die Basis für langfristige Investment-Entscheidungen.",
    lessons: [
        {
            id: "die-bilanz-lesen",
            moduleId: "fundamentalanalyse",
            title: "Die Bilanz lesen",
            summary: "Ein Röntgenbild des Unternehmens zu einem Stichtag: Was besitzt es, wem gehört es?",
            content: [
                "Die Bilanz zeigt die finanzielle Lage eines Unternehmens zu einem bestimmten Stichtag. Sie besteht aus zwei Seiten, die sich immer die Waage halten: der <strong>Aktivseite</strong> (was das Unternehmen besitzt) und der <strong>Passivseite</strong> (wie das finanziert ist).",
                "Auf der Aktivseite stehen <strong>Vermögenswerte</strong>: Anlagevermögen wie Maschinen, Gebäude und Patente sowie Umlaufvermögen wie Lagerbestände, Forderungen und liquide Mittel.",
                "Auf der Passivseite stehen <strong>Eigenkapital</strong> (Geld der Eigentümer/Aktionäre) und <strong>Fremdkapital</strong> (Schulden gegenüber Banken, Lieferanten etc.). Die <strong>Eigenkapitalquote</strong> – Eigenkapital geteilt durch Bilanzsumme – zeigt, wie solide ein Unternehmen finanziert ist: Eine hohe Quote bedeutet mehr Sicherheitspuffer in Krisenzeiten.",
                "Ein Blick auf die <strong>Verschuldung</strong> lohnt sich besonders: Unternehmen mit viel Fremdkapital reagieren empfindlicher auf steigende Zinsen und Umsatzeinbrüche, weil Zins- und Tilgungszahlungen unabhängig vom Geschäftserfolg fällig werden.",
            ],
            quiz: [
                {
                    question: "Was zeigt die Bilanz eines Unternehmens?",
                    options: [
                        { text: "Die finanzielle Lage zu einem bestimmten Stichtag (Vermögen und Finanzierung)", correct: true },
                        { text: "Nur den Umsatz der letzten zwölf Monate", correct: false },
                        { text: "Ausschließlich die Kursentwicklung der Aktie", correct: false },
                        { text: "Die Meinung der Analysten zum Unternehmen", correct: false },
                    ],
                    explanation: "Die Bilanz ist eine Momentaufnahme: Sie zeigt Vermögenswerte (Aktiva) und deren Finanzierung durch Eigen- und Fremdkapital (Passiva) zu einem Stichtag.",
                },
                {
                    question: "Was sagt eine hohe Eigenkapitalquote aus?",
                    options: [
                        { text: "Das Unternehmen macht garantiert hohe Gewinne", correct: false },
                        { text: "Das Unternehmen ist vergleichsweise solide finanziert und hat mehr Sicherheitspuffer", correct: true },
                        { text: "Das Unternehmen zahlt automatisch hohe Dividenden", correct: false },
                        { text: "Das Unternehmen hat keine Vermögenswerte", correct: false },
                    ],
                    explanation: "Eine hohe Eigenkapitalquote bedeutet, dass ein größerer Teil der Vermögenswerte den Eigentümern statt Gläubigern gehört – das puffert Krisen ab.",
                },
                {
                    question: "Warum reagieren stark verschuldete Unternehmen empfindlicher auf steigende Zinsen?",
                    options: [
                        { text: "Weil sie dann höhere Dividenden zahlen müssen", correct: false },
                        { text: "Weil Zins- und Tilgungszahlungen unabhängig vom Geschäftserfolg fällig werden und bei höheren Zinsen teurer werden", correct: true },
                        { text: "Weil ihre Aktien automatisch vom Handel ausgesetzt werden", correct: false },
                        { text: "Weil steigende Zinsen die Eigenkapitalquote automatisch erhöhen", correct: false },
                    ],
                    explanation: "Fremdkapital muss unabhängig von der Geschäftslage bedient werden – steigende Zinsen erhöhen diese fixen Belastungen zusätzlich.",
                },
            ],
        },
        {
            id: "gewinn-und-verlustrechnung",
            moduleId: "fundamentalanalyse",
            title: "Gewinn- und Verlustrechnung verstehen",
            summary: "Vom Umsatz zum Gewinn: Wo bleibt das Geld auf dem Weg?",
            content: [
                "Die Gewinn- und Verlustrechnung (GuV) zeigt, anders als die Bilanz, die Entwicklung über einen <strong>Zeitraum</strong> (z. B. ein Geschäftsjahr): Wie viel Umsatz wurde erzielt, welche Kosten sind angefallen, was bleibt am Ende übrig.",
                "Der <strong>Umsatz</strong> (Revenue) steht ganz oben. Danach folgen die Kosten in Stufen: Materialkosten, Personalkosten, Abschreibungen, Zinsen, Steuern. Jede Stufe liefert eine eigene aussagekräftige Zwischengröße.",
                "Das <strong>EBIT</strong> (Gewinn vor Zinsen und Steuern) zeigt die operative Ertragskraft, unabhängig von Finanzierung und Steuersituation – nützlich, um Unternehmen unterschiedlicher Länder oder Kapitalstrukturen zu vergleichen. Das <strong>EBITDA</strong> rechnet zusätzlich Abschreibungen heraus und dient als grobe Näherung der operativen Ertragskraft vor buchhalterischen Abschreibungseffekten – es ist allerdings kein echter Cashflow, wie die Lektion zur Kapitalflussrechnung zeigt.",
                "Der <strong>Nettogewinn</strong> (Jahresüberschuss) ganz unten ist das, was nach allen Kosten, Zinsen und Steuern übrig bleibt – die Basis für die Kennzahl <strong>Gewinn je Aktie</strong> (Earnings per Share, EPS), die den Gewinn durch die Anzahl der Aktien teilt.",
                "Wichtig: Ein hoher Umsatz allein sagt wenig aus. Entscheidend sind die <strong>Margen</strong> – wie viel vom Umsatz tatsächlich als Gewinn hängen bleibt. Ein Unternehmen mit kleinerem Umsatz, aber hoher Marge, kann profitabler sein als ein Umsatzriese mit dünner Marge.",
            ],
            quiz: [
                {
                    question: "Was zeigt die Gewinn- und Verlustrechnung im Unterschied zur Bilanz?",
                    options: [
                        { text: "Eine Momentaufnahme des Vermögens zu einem Stichtag", correct: false },
                        { text: "Die Entwicklung von Umsatz, Kosten und Gewinn über einen Zeitraum", correct: true },
                        { text: "Nur die Aktienkursentwicklung", correct: false },
                        { text: "Die Anzahl der ausstehenden Aktien", correct: false },
                    ],
                    explanation: "Die GuV ist eine Zeitraumrechnung (z. B. ein Geschäftsjahr), während die Bilanz eine Stichtagsbetrachtung ist.",
                },
                {
                    question: "Was bedeutet EBIT?",
                    options: [
                        { text: "Gewinn nach Abzug aller Steuern und Zinsen", correct: false },
                        { text: "Gewinn vor Zinsen und Steuern – zeigt die operative Ertragskraft", correct: true },
                        { text: "Der Börsenkurs einer Aktie", correct: false },
                        { text: "Die Summe aller Dividenden eines Jahres", correct: false },
                    ],
                    explanation: "EBIT (Earnings Before Interest and Taxes) blendet Finanzierungs- und Steuereffekte aus und macht Unternehmen operativ vergleichbarer.",
                },
                {
                    question: "Warum ist ein hoher Umsatz allein keine ausreichende Erfolgskennzahl?",
                    options: [
                        { text: "Weil Umsatz steuerfrei ist", correct: false },
                        { text: "Weil entscheidend ist, wie viel davon nach Kosten als Gewinn (Marge) übrig bleibt", correct: true },
                        { text: "Weil Umsatz nichts mit dem Aktienkurs zu tun hat", correct: false },
                        { text: "Weil der Umsatz gesetzlich gedeckelt ist", correct: false },
                    ],
                    explanation: "Zwei Unternehmen mit gleichem Umsatz können sehr unterschiedlich profitabel sein – die Marge zeigt, wie effizient aus Umsatz Gewinn wird.",
                },
            ],
        },
        {
            id: "cashflow-free-cashflow",
            moduleId: "fundamentalanalyse",
            title: "Cashflow und Free Cashflow",
            summary: "Gewinn ist eine Meinung, Cash ist ein Fakt – warum der Geldfluss oft mehr verrät als der Gewinn.",
            content: [
                "Der bilanzielle Gewinn enthält buchhalterische Spielräume: Abschreibungen, Rückstellungen und der Zeitpunkt der Umsatzbuchung lassen sich in Grenzen gestalten. Der tatsächliche Geldfluss ist deutlich schwerer zu \"schönen\". Deshalb gilt an der Börse: \"Cash is king\" – Gewinn ist eine Meinung, Cash ist ein Fakt.",
                "Die <strong>Kapitalflussrechnung</strong> (Cashflow Statement) zeigt, woher das Geld eines Unternehmens im Betrachtungszeitraum kam und wohin es floss. Sie gliedert sich in drei Bereiche: <strong>operativer Cashflow</strong> (aus dem laufenden Kerngeschäft), <strong>Investitions-Cashflow</strong> (Käufe/Verkäufe von Anlagen und Beteiligungen) und <strong>Finanzierungs-Cashflow</strong> (Aufnahme oder Tilgung von Kapital, Dividenden).",
                "Der <strong>operative Cashflow</strong> ist besonders aussagekräftig: Er zeigt, ob das Kerngeschäft real Geld einbringt. Ein Unternehmen kann in der GuV Gewinne ausweisen und trotzdem einen schwachen oder negativen operativen Cashflow haben – ein Warnsignal, das im reinen Gewinn oft verborgen bleibt.",
                "Der <strong>Free Cashflow</strong> (freier Cashflow) ist der operative Cashflow abzüglich der nötigen Investitionen (Capex). Er ist das Geld, das dem Unternehmen frei zur Verfügung steht – für Dividenden, Schuldenabbau oder Aktienrückkäufe. Nachhaltige Dividenden sollten aus dem Free Cashflow bezahlbar sein.",
                "Wichtig zur Abgrenzung: Das oft zitierte <strong>EBITDA</strong> ist nicht dasselbe wie Cashflow. Es blendet Abschreibungen aus, ignoriert aber Investitionen, Veränderungen im Umlaufvermögen, Zinsen und Steuern – die alle echtes Geld kosten. Der Free Cashflow ist daher das ehrlichere Maß für die tatsächliche Finanzkraft.",
            ],
            quiz: [
                {
                    question: "Warum ist der operative Cashflow oft aussagekräftiger als der ausgewiesene Gewinn?",
                    options: [
                        { text: "Weil er gesetzlich immer höher sein muss als der Gewinn", correct: false },
                        { text: "Weil der tatsächliche Geldfluss schwerer buchhalterisch zu gestalten ist als der Gewinn", correct: true },
                        { text: "Weil er die Steuerlast eines Unternehmens angibt", correct: false },
                        { text: "Weil er die Dividende exakt vorschreibt", correct: false },
                    ],
                    explanation: "Gewinne lassen sich über Abschreibungen, Rückstellungen und Buchungszeitpunkte beeinflussen; der reale Geldzufluss aus dem Kerngeschäft ist robuster.",
                },
                {
                    question: "Wie ist der Free Cashflow definiert?",
                    options: [
                        { text: "Umsatz abzüglich aller Steuern", correct: false },
                        { text: "Operativer Cashflow abzüglich der nötigen Investitionen (Capex)", correct: true },
                        { text: "Gewinn zuzüglich der Dividende", correct: false },
                        { text: "Eigenkapital geteilt durch die Bilanzsumme", correct: false },
                    ],
                    explanation: "Der Free Cashflow ist das nach Investitionen frei verfügbare Geld – die Basis für Dividenden, Schuldenabbau oder Rückkäufe.",
                },
                {
                    question: "Warum ist EBITDA nicht mit dem tatsächlichen Cashflow gleichzusetzen?",
                    options: [
                        { text: "Weil EBITDA Investitionen, Working Capital, Zinsen und Steuern ausblendet, die echtes Geld kosten", correct: true },
                        { text: "Weil EBITDA immer negativ ist", correct: false },
                        { text: "Weil EBITDA nur bei Banken berechnet wird", correct: false },
                        { text: "Weil EBITDA die Dividende bereits enthält", correct: false },
                    ],
                    explanation: "EBITDA rechnet zwar Abschreibungen heraus, lässt aber wesentliche Zahlungsströme außen vor – der Free Cashflow bildet die reale Finanzkraft ehrlicher ab.",
                },
            ],
        },
        {
            id: "kgv-kuv-kbv",
            moduleId: "fundamentalanalyse",
            title: "KGV, KUV und KBV",
            summary: "Drei einfache Kennzahlen, um zu prüfen, ob eine Aktie teuer oder günstig bewertet ist.",
            content: [
                "Das <strong>KGV</strong> (Kurs-Gewinn-Verhältnis, engl. P/E) teilt den Aktienkurs durch den Gewinn je Aktie. Ein KGV von 20 bedeutet: Anleger zahlen das 20-fache des Jahresgewinns für die Aktie. Niedrige KGVs deuten auf eine günstige Bewertung hin – oder auf Zweifel des Marktes an zukünftigem Wachstum.",
                "Das <strong>KUV</strong> (Kurs-Umsatz-Verhältnis, engl. P/S) teilt den Kurs durch den Umsatz je Aktie. Es ist nützlich bei Unternehmen, die noch keinen (oder stark schwankenden) Gewinn erzielen, etwa junge Wachstumsfirmen, weil der Umsatz eine stabilere Bezugsgröße ist als der Gewinn.",
                "Das <strong>KBV</strong> (Kurs-Buchwert-Verhältnis, engl. P/B) teilt den Kurs durch das bilanzielle Eigenkapital je Aktie. Ein KBV unter 1 kann bedeuten, dass die Aktie unter ihrem bilanziellen Substanzwert gehandelt wird – häufig bei Banken oder Industrieunternehmen mit viel Sachvermögen relevant.",
                "Keine dieser Kennzahlen funktioniert isoliert. Ein niedriges KGV kann eine Value-Chance sein – oder ein Warnsignal, dass der Markt sinkende Gewinne erwartet (eine sogenannte \"Value-Falle\"). Kennzahlen sollten immer im Vergleich zur Branche, zu Wettbewerbern und zur eigenen Historie des Unternehmens betrachtet werden.",
            ],
            quiz: [
                {
                    question: "Was misst das Kurs-Gewinn-Verhältnis (KGV)?",
                    options: [
                        { text: "Wie viel Umsatz ein Unternehmen im Verhältnis zu seinen Schulden macht", correct: false },
                        { text: "Das Vielfache des Jahresgewinns je Aktie, das Anleger aktuell zahlen", correct: true },
                        { text: "Wie hoch die Dividendenrendite ist", correct: false },
                        { text: "Die Anzahl der Jahre bis zum nächsten Aktiensplit", correct: false },
                    ],
                    explanation: "Das KGV = Aktienkurs ÷ Gewinn je Aktie. Es zeigt, das Wievielfache des Jahresgewinns der Markt aktuell bewertet.",
                },
                {
                    question: "Wann ist das KUV besonders nützlich?",
                    options: [
                        { text: "Bei etablierten Versorgungsunternehmen mit stabilen Gewinnen", correct: false },
                        { text: "Bei jungen Wachstumsunternehmen ohne stabilen oder positiven Gewinn", correct: true },
                        { text: "Nur bei Unternehmen ohne jeglichen Umsatz", correct: false },
                        { text: "Ausschließlich bei Banken", correct: false },
                    ],
                    explanation: "Wenn der Gewinn stark schwankt oder noch negativ ist, bietet der Umsatz eine stabilere Bezugsgröße für die Bewertung als das KGV.",
                },
                {
                    question: "Warum kann ein sehr niedriges KGV eine \"Value-Falle\" sein?",
                    options: [
                        { text: "Weil ein niedriges KGV gesetzlich verboten ist", correct: false },
                        { text: "Weil es auch bedeuten kann, dass der Markt sinkende zukünftige Gewinne erwartet", correct: true },
                        { text: "Weil ein niedriges KGV automatisch zu einer Insolvenz führt", correct: false },
                        { text: "Weil das KGV bei Wachstumsunternehmen immer niedrig ist", correct: false },
                    ],
                    explanation: "Eine niedrige Bewertung kann berechtigt sein, wenn der Markt Probleme im Geschäftsmodell einpreist – \"günstig\" heißt nicht automatisch \"unterbewertet\".",
                },
            ],
        },
        {
            id: "dividendenrendite-ausschuettungsquote",
            moduleId: "fundamentalanalyse",
            title: "Dividendenrendite und Ausschüttungsquote",
            summary: "Wie viel Dividende bekommst du für dein eingesetztes Kapital – und ist das nachhaltig?",
            content: [
                "Die <strong>Dividendenrendite</strong> setzt die jährliche Dividende je Aktie ins Verhältnis zum aktuellen Aktienkurs. Bei einem Kurs von 100 € und einer Dividende von 3 € ergibt das eine Dividendenrendite von 3 %.",
                "Eine hohe Dividendenrendite wirkt attraktiv, kann aber trügerisch sein: Fällt der Kurs stark, weil der Markt Probleme im Geschäft erwartet, steigt die Dividendenrendite rechnerisch – obwohl die Dividende in Wahrheit gefährdet ist. Ein sehr hoher Wert ist deshalb oft eher ein Warnsignal als ein Kaufargument.",
                "Die <strong>Ausschüttungsquote</strong> (Payout Ratio) zeigt, welcher Anteil des Gewinns als Dividende ausgezahlt wird. Eine Quote von 40 % bedeutet: 40 % des Gewinns gehen an Aktionäre, 60 % verbleiben im Unternehmen für Investitionen oder Schuldenabbau.",
                "Liegt die Ausschüttungsquote dauerhaft über 100 %, zahlt das Unternehmen mehr aus, als es verdient – das ist auf Dauer nicht durchhaltbar und oft ein Vorbote einer Dividendenkürzung. Nachhaltige, langfristig wachsende Dividenden stammen typischerweise aus Unternehmen mit moderater Ausschüttungsquote und stabilem Cashflow.",
            ],
            quiz: [
                {
                    question: "Wie wird die Dividendenrendite berechnet?",
                    options: [
                        { text: "Dividende je Aktie geteilt durch den aktuellen Aktienkurs", correct: true },
                        { text: "Gewinn je Aktie geteilt durch den Aktienkurs", correct: false },
                        { text: "Umsatz geteilt durch die Marktkapitalisierung", correct: false },
                        { text: "Aktienkurs geteilt durch das Eigenkapital je Aktie", correct: false },
                    ],
                    explanation: "Dividendenrendite = Dividende je Aktie ÷ Aktienkurs. Sie zeigt die laufende Ausschüttung im Verhältnis zum Kapitaleinsatz.",
                },
                {
                    question: "Warum kann eine ungewöhnlich hohe Dividendenrendite ein Warnsignal sein?",
                    options: [
                        { text: "Weil hohe Dividendenrenditen gesetzlich verboten sind", correct: false },
                        { text: "Weil sie oft durch einen stark gefallenen Kurs entsteht, der Zweifel am Geschäft widerspiegelt", correct: true },
                        { text: "Weil Dividenden ab einer bestimmten Höhe automatisch versteuert werden", correct: false },
                        { text: "Weil eine hohe Rendite automatisch Kursverluste garantiert", correct: false },
                    ],
                    explanation: "Ein fallender Kurs erhöht rechnerisch die Dividendenrendite – das kann eine Bewertungschance sein, aber auch ein Signal für eine gefährdete Dividende.",
                },
                {
                    question: "Was bedeutet eine Ausschüttungsquote von dauerhaft über 100 %?",
                    options: [
                        { text: "Das Unternehmen zahlt mehr Dividende aus, als es an Gewinn erwirtschaftet – langfristig nicht durchhaltbar", correct: true },
                        { text: "Das Unternehmen macht keinen Gewinn und zahlt trotzdem keine Dividende", correct: false },
                        { text: "Das ist der gesetzliche Normalfall für alle Dividendenzahler", correct: false },
                        { text: "Das bedeutet automatisch eine Kurssteigerung", correct: false },
                    ],
                    explanation: "Wird dauerhaft mehr ausgezahlt als verdient, muss das Unternehmen Substanz oder Schulden zur Finanzierung nutzen – ein Kürzungsrisiko wächst.",
                },
            ],
        },
        {
            id: "wettbewerbsvorteile-burggraben",
            moduleId: "fundamentalanalyse",
            title: "Wettbewerbsvorteile (Burggraben) erkennen",
            summary: "Warum manche Unternehmen ihre Gewinne über Jahrzehnte gegen Konkurrenz verteidigen können.",
            content: [
                "Ein <strong>ökonomischer Burggraben</strong> (Economic Moat) beschreibt einen nachhaltigen Wettbewerbsvorteil, der es einem Unternehmen erlaubt, hohe Gewinne zu erzielen, ohne dass Konkurrenten diese schnell wegkonkurrieren können.",
                "Typische Burggraben-Quellen sind: <strong>Markenstärke</strong> (Kunden zahlen freiwillig mehr für ein vertrautes Markenprodukt), <strong>Netzwerkeffekte</strong> (ein Produkt wird wertvoller, je mehr Menschen es nutzen, z. B. bei Plattformen), <strong>Skaleneffekte</strong> (Kostenvorteile durch Größe) und <strong>Wechselkosten</strong> (es ist für Kunden aufwendig oder riskant, zu einem Konkurrenten zu wechseln).",
                "Weitere Quellen sind immaterielle Vermögenswerte wie <strong>Patente</strong> und Zulassungen (z. B. in der Pharmaindustrie) sowie ein <strong>Kostenvorteil</strong>, der es erlaubt, günstiger zu produzieren als die Konkurrenz, ohne die eigene Marge zu opfern.",
                "Burggräben sind nicht ewig: Technologische Umbrüche können selbst starke Wettbewerbsvorteile untergraben. Die Analyse eines Burggrabens ist deshalb keine einmalige Prüfung, sondern eine wiederkehrende Frage: Wird dieser Vorteil in 5 oder 10 Jahren noch bestehen?",
                "Für Anleger ist der Burggraben deshalb interessant, weil er hilft einzuschätzen, wie <strong>nachhaltig</strong> die aktuelle Profitabilität eines Unternehmens ist – eine wichtige Ergänzung zu reinen Kennzahlen wie KGV oder Marge, die nur die Gegenwart abbilden.",
            ],
            quiz: [
                {
                    question: "Was beschreibt der Begriff \"ökonomischer Burggraben\"?",
                    options: [
                        { text: "Die physische Sicherheitsanlage eines Firmensitzes", correct: false },
                        { text: "Einen nachhaltigen Wettbewerbsvorteil, der Konkurrenten fernhält", correct: true },
                        { text: "Die Höhe der Verschuldung eines Unternehmens", correct: false },
                        { text: "Den Betrag, den ein Unternehmen jährlich in Marketing investiert", correct: false },
                    ],
                    explanation: "Der Begriff (Economic Moat) stammt aus der Investmentanalyse und beschreibt strukturelle Vorteile, die hohe Gewinne dauerhaft schützen.",
                },
                {
                    question: "Welches Beispiel beschreibt einen Netzwerkeffekt?",
                    options: [
                        { text: "Eine Fabrik produziert günstiger, je mehr Stückzahlen sie herstellt", correct: false },
                        { text: "Eine Plattform wird für jeden Nutzer wertvoller, je mehr andere Menschen sie ebenfalls nutzen", correct: true },
                        { text: "Ein Unternehmen hält ein Patent auf ein Medikament", correct: false },
                        { text: "Ein Kunde müsste hohe Kosten tragen, um den Anbieter zu wechseln", correct: false },
                    ],
                    explanation: "Netzwerkeffekte entstehen, wenn der Nutzen eines Produkts mit der Zahl seiner Nutzer wächst – typisch bei Plattformen und Marktplätzen.",
                },
                {
                    question: "Warum ist die Prüfung eines Burggrabens keine einmalige Angelegenheit?",
                    options: [
                        { text: "Weil Burggräben durch technologische Umbrüche untergraben werden können und regelmäßig neu bewertet werden sollten", correct: true },
                        { text: "Weil sich Burggräben jedes Quartal automatisch auflösen", correct: false },
                        { text: "Weil Burggräben gesetzlich nur ein Jahr gültig sind", correct: false },
                        { text: "Weil nur börsennotierte Unternehmen einen Burggraben haben können", correct: false },
                    ],
                    explanation: "Wettbewerbsvorteile können durch neue Technologien, veränderte Kundenpräferenzen oder neue Konkurrenten erodieren – die Einschätzung muss aktuell bleiben.",
                },
            ],
        },
    ],
};
