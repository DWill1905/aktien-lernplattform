import { el } from "./dom.js";
import { moduleById, lessonById } from "./content/index.js";
import { loadGamification, levelForXp } from "./gamification.js";

/**
 * App-Shell nach dem M3-Redesign: Navigation-Rail (Desktop), Bottom-Navigation
 * (Mobil), Top-App-Bar mit Titel/Breadcrumb sowie ein „Mehr"-Menü für die
 * seltener genutzten Werkzeuge.
 */

interface NavItem {
  label: string;
  icon: string;
  href: string;
  matches: (hash: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Start", icon: "home", href: "#/", matches: (h) => h === "#/" },
  {
    label: "Lernen",
    icon: "school",
    href: "#/modul/grundlagen",
    matches: (h) => /^#\/(modul|lektion|quiz)\//.test(h),
  },
  { label: "Portfolio", icon: "account_balance_wallet", href: "#/portfolio", matches: (h) => h.startsWith("#/portfolio") },
  { label: "Erfolge", icon: "emoji_events", href: "#/erfolge", matches: (h) => h.startsWith("#/erfolge") },
];

const MORE_ITEMS: { label: string; icon: string; href: string }[] = [
  { label: "Aktien-Screener", icon: "filter_alt", href: "#/screener" },
  { label: "Chart-Analyzer", icon: "candlestick_chart", href: "#/chart-analyse" },
  { label: "Event-Trading", icon: "bolt", href: "#/news-simulator" },
  { label: "Tägliche Wiederholung", icon: "history", href: "#/wiederholung" },
  { label: "Glossar", icon: "menu_book", href: "#/glossar" },
  { label: "Profi-Checkliste", icon: "checklist", href: "#/checkliste" },
];

/** Statische Seitentitel für Routen ohne dynamischen Inhalt. */
const STATIC_TITLES: Record<string, string> = {
  "#/portfolio": "Portfolio-Simulator",
  "#/screener": "Aktien-Screener",
  "#/erfolge": "Erfolge",
  "#/chart-analyse": "Chart-Analyzer",
  "#/news-simulator": "Event-Trading",
  "#/wiederholung": "Tägliche Wiederholung",
  "#/glossar": "Glossar",
  "#/checkliste": "Profi-Checkliste",
};

export function symbol(name: string, filled = false): HTMLElement {
  return el("span", { class: `msym${filled ? " filled" : ""}`, "aria-hidden": "true" }, [name]);
}

interface PageInfo {
  title: string;
  breadcrumb?: string;
  back?: string;
}

function pageInfo(hash: string): PageInfo | null {
  const lesson = hash.match(/^#\/lektion\/([^/]+)\/([^/]+)/);
  if (lesson) {
    return {
      title: lessonById(lesson[1], lesson[2])?.title ?? "Lektion",
      breadcrumb: moduleById(lesson[1])?.title,
      back: `#/modul/${lesson[1]}`,
    };
  }
  const quiz = hash.match(/^#\/quiz\/([^/]+)\/([^/]+)/);
  if (quiz) {
    const les = lessonById(quiz[1], quiz[2]);
    return {
      title: les ? `Quiz: ${les.title}` : "Quiz",
      breadcrumb: moduleById(quiz[1])?.title,
      back: `#/lektion/${quiz[1]}/${quiz[2]}`,
    };
  }
  const mod = hash.match(/^#\/modul\/([^/]+)/);
  if (mod) {
    const found = moduleById(mod[1]);
    return { title: found?.title ?? "Modul", breadcrumb: "Lernen", back: "#/" };
  }
  const key = Object.keys(STATIC_TITLES).find((k) => hash.startsWith(k));
  if (key) return { title: STATIC_TITLES[key], back: "#/" };
  return null; // Dashboard -> Markenkopf
}

// --- Mehr-Menü -------------------------------------------------------------

let moreOpen = false;

function closeMore(): void {
  moreOpen = false;
  syncMore();
}

function toggleMore(): void {
  moreOpen = !moreOpen;
  syncMore();
}

function syncMore(): void {
  const sheet = document.getElementById("more-sheet");
  const scrim = document.getElementById("more-scrim");
  if (!sheet || !scrim) return;
  sheet.hidden = !moreOpen;
  scrim.hidden = !moreOpen;
  document.querySelectorAll<HTMLButtonElement>(".more-trigger").forEach((b) => b.setAttribute("aria-expanded", String(moreOpen)));
}

function buildMoreSheet(): void {
  const sheet = document.getElementById("more-sheet");
  const scrim = document.getElementById("more-scrim");
  if (!sheet || !scrim) return;
  scrim.addEventListener("click", closeMore);
  sheet.replaceChildren(
    ...MORE_ITEMS.map((item) => {
      const link = el("a", { class: "more-item", href: item.href }, [symbol(item.icon), el("span", {}, [item.label])]);
      link.addEventListener("click", closeMore);
      return link;
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && moreOpen) closeMore();
  });
}

// --- Navigation ------------------------------------------------------------

function navLink(item: NavItem, hash: string, variant: "rail" | "bottom"): HTMLElement {
  const active = item.matches(hash);
  const link = el(
    "a",
    {
      class: `${variant}-item${active ? " active" : ""}`,
      href: item.href,
      "aria-current": active ? "page" : undefined,
    },
    [el("span", { class: "nav-icon" }, [symbol(item.icon, active)]), el("span", { class: "nav-label" }, [item.label])]
  );
  return link;
}

function moreTrigger(variant: "rail" | "bottom"): HTMLElement {
  const btn = el(
    "button",
    { class: `${variant}-item more-trigger`, type: "button", "aria-expanded": "false", "aria-haspopup": "menu" },
    [el("span", { class: "nav-icon" }, [symbol("more_horiz")]), el("span", { class: "nav-label" }, ["Mehr"])]
  ) as HTMLButtonElement;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMore();
  });
  return btn;
}

function buildRail(hash: string): void {
  const rail = document.getElementById("rail");
  if (!rail) return;
  rail.replaceChildren(
    el("a", { class: "rail-brand", href: "#/", "aria-label": "Börsenschule – Startseite" }, [
      el("span", { class: "logo-bar" }, []),
      el("span", { class: "logo-bar accent" }, []),
      el("span", { class: "logo-bar tall" }, []),
    ]),
    el("div", { class: "rail-items" }, NAV_ITEMS.map((i) => navLink(i, hash, "rail"))),
    moreTrigger("rail")
  );
}

function buildBottomNav(hash: string): void {
  const nav = document.getElementById("bottomnav");
  if (!nav) return;
  nav.replaceChildren(...NAV_ITEMS.map((i) => navLink(i, hash, "bottom")), moreTrigger("bottom"));
}

function buildAppBar(hash: string): void {
  const bar = document.getElementById("appbar");
  if (!bar) return;
  const info = pageInfo(hash);
  const gami = loadGamification();
  const level = levelForXp(gami.xp);

  const left = info
    ? el("div", { class: "appbar-left" }, [
        info.back
          ? el("a", { class: "icon-button", href: info.back, "aria-label": "Zurück" }, [symbol("arrow_back")])
          : null,
        el("div", { class: "appbar-titles" }, [
          el("div", { class: "appbar-title" }, [info.title]),
          info.breadcrumb ? el("div", { class: "appbar-breadcrumb" }, [info.breadcrumb]) : null,
        ]),
      ])
    : el("div", { class: "appbar-left" }, [
        el("span", { class: "appbar-logo" }, [
          el("span", { class: "logo-bar" }, []),
          el("span", { class: "logo-bar accent" }, []),
          el("span", { class: "logo-bar tall" }, []),
        ]),
        el("div", { class: "appbar-titles" }, [
          el("div", { class: "appbar-brand" }, ["Börsenschule"]),
          el("div", { class: "appbar-tagline" }, ["Lernen · Simulieren · Verstehen"]),
        ]),
      ]);

  bar.replaceChildren(
    left,
    el("div", { class: "appbar-spacer" }, []),
    el("div", { class: "appbar-chips" }, [
      gami.streak > 0
        ? el("span", { class: "chip chip-streak" }, [
            symbol("local_fire_department", true),
            `${gami.streak} Tag${gami.streak === 1 ? "" : "e"}`,
          ])
        : null,
      el("a", { class: "chip chip-level", href: "#/erfolge" }, [
        symbol("military_tech", true),
        `Level ${level.level}`,
      ]),
    ])
  );
}

/** Kennzeichnet den Inhaltsbereich, damit das CSS passende Lesebreiten setzen kann. */
function viewKey(hash: string): string {
  if (/^#\/lektion\//.test(hash)) return "lesson";
  if (/^#\/quiz\//.test(hash)) return "quiz";
  if (/^#\/modul\//.test(hash)) return "module";
  if (hash.startsWith("#/portfolio")) return "portfolio";
  if (hash.startsWith("#/erfolge")) return "achievements";
  return "default";
}

/** Aktualisiert Rail, Bottom-Navigation und App-Bar für die aktuelle Route. */
export function updateShell(): void {
  const hash = location.hash || "#/";
  buildRail(hash);
  buildBottomNav(hash);
  buildAppBar(hash);
  const app = document.getElementById("app");
  if (app) app.dataset.view = viewKey(hash);
  closeMore();
}

export function initShell(): void {
  buildMoreSheet();
  updateShell();
  window.addEventListener("hashchange", updateShell);
}
