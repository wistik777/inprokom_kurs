/**
 * Обрезает строку по числу символов с многоточием.
 */
export function clipText(value, maxLength = 24) {
    const text = String(value ?? "").trim();

    if (!text) {
        return "—";
    }

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength)}…`;
}
