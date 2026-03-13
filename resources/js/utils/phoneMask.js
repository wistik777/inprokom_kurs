const normalizeLocalDigits = (value) => {
    const digits = String(value || '').replace(/\D/g, '');

    if (!digits) return '';

    if (digits[0] === '7' || digits[0] === '8') {
        return digits.slice(1, 11);
    }

    return digits.slice(0, 10);
};

export const formatRuPhone = (value) => {
    const localDigits = normalizeLocalDigits(value);
    let formatted = '+7';

    if (localDigits.length > 0) {
        formatted += `(${localDigits.slice(0, 3)}`;
    }
    if (localDigits.length >= 3) {
        formatted += ')';
    }
    if (localDigits.length > 3) {
        formatted += `-${localDigits.slice(3, 6)}`;
    }
    if (localDigits.length > 6) {
        formatted += `-${localDigits.slice(6, 8)}`;
    }
    if (localDigits.length > 8) {
        formatted += `-${localDigits.slice(8, 10)}`;
    }

    return formatted;
};

export const applyPhoneMask = (event) => {
    const nextValue = formatRuPhone(event.target.value);
    event.target.value = nextValue;
};
