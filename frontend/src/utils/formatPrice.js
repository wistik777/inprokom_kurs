export function formatPrice(value) {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
        return '—';
    }

    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(numeric);
}

export function getProductCategoriesLabel(product) {
    if (!Array.isArray(product?.categories) || product.categories.length === 0) {
        return '—';
    }

    return product.categories.map((category) => category.name).join(', ');
}
