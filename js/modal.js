import { el } from "./dom.js";
/**
 * Bestätigungsdialog für unumkehrbare Aktionen: der Button bleibt gesperrt, bis das
 * Bestätigungswort exakt eingetippt wurde (schützt vor versehentlichem Datenverlust
 * durch einen einzelnen Fehlklick).
 */
export function confirmDestructiveAction(options) {
    const { title, message, confirmWord, confirmLabel, onConfirm } = options;
    const input = el("input", {
        type: "text",
        class: "modal-input",
        placeholder: confirmWord,
        autocomplete: "off",
        "aria-label": `Zum Bestätigen "${confirmWord}" eingeben`,
    });
    const confirmBtn = el("button", { class: "btn danger" }, [confirmLabel]);
    confirmBtn.setAttribute("disabled", "true");
    const cancelBtn = el("button", { class: "btn secondary" }, ["Abbrechen"]);
    const dialog = el("div", { class: "modal-dialog", role: "alertdialog", "aria-modal": "true", "aria-label": title }, [
        el("h3", {}, [title]),
        el("p", { class: "muted" }, [message]),
        el("p", { class: "muted modal-hint" }, [`Gib zum Bestätigen „${confirmWord}" ein:`]),
        input,
        el("div", { class: "actions" }, [confirmBtn, cancelBtn]),
    ]);
    const overlay = el("div", { class: "modal-overlay" }, [dialog]);
    function close() {
        overlay.remove();
        document.removeEventListener("keydown", onKeydown);
    }
    function onKeydown(e) {
        if (e.key === "Escape")
            close();
    }
    input.addEventListener("input", () => {
        if (input.value === confirmWord)
            confirmBtn.removeAttribute("disabled");
        else
            confirmBtn.setAttribute("disabled", "true");
    });
    confirmBtn.addEventListener("click", () => {
        if (input.value !== confirmWord)
            return;
        close();
        onConfirm();
    });
    cancelBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay)
            close();
    });
    document.addEventListener("keydown", onKeydown);
    document.body.append(overlay);
    input.focus();
}
