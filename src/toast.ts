export type ToastVariant = "default" | "level" | "achievement";

let container: HTMLElement | null = null;

function getContainer(): HTMLElement {
  if (container && container.isConnected) return container;
  container = document.createElement("div");
  container.id = "toast-container";
  container.setAttribute("aria-live", "polite");
  document.body.append(container);
  return container;
}

export function showToast(text: string, variant: ToastVariant = "default", duration = 4000): void {
  const toast = document.createElement("div");
  toast.className = `toast toast-${variant}`;
  toast.textContent = text;
  getContainer().append(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
