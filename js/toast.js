let container = null;
function getContainer() {
    if (container && container.isConnected)
        return container;
    container = document.createElement("div");
    container.id = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.append(container);
    return container;
}
export function showToast(text, variant = "default", icon, duration = 4000) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${variant}`;
    if (icon) {
        const glyph = document.createElement("span");
        glyph.className = "msym filled";
        glyph.setAttribute("aria-hidden", "true");
        glyph.textContent = icon;
        toast.append(glyph);
    }
    toast.append(document.createTextNode(text));
    getContainer().append(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
