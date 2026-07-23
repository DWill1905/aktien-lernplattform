const COLORS = ["#146356", "#4a6358", "#3f6375", "#ba1a1a", "#2c6e3f", "#c9a227"];

/** Kurzer Konfetti-Effekt für besondere Momente (Level-up, perfektes Quiz) – kein externes Asset. */
export function burstConfetti(count = 24): void {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const container = document.createElement("div");
  container.className = "confetti-container";
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--fall-duration", `${1.2 + Math.random() * 0.8}s`);
    piece.style.setProperty("--fall-delay", `${Math.random() * 0.3}s`);
    piece.style.setProperty("--rotate", `${Math.round(Math.random() * 360)}deg`);
    piece.style.background = COLORS[i % COLORS.length];
    container.append(piece);
  }
  document.body.append(container);
  setTimeout(() => container.remove(), 2200);
}
