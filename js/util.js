export function formatCurrency(value) {
    return value.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
export function formatPercent(value) {
    const cleaned = Math.abs(value) < 1e-9 ? 0 : value;
    const sign = cleaned > 0 ? "+" : "";
    return `${sign}${(cleaned * 100).toLocaleString("de-DE", { maximumFractionDigits: 2 })}%`;
}
