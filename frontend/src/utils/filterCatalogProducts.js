export function filterCatalogProducts(products, { searchField, searchValue, sortMode, selectedGenre = '' }) {
    const normalizedQuery = searchValue.trim().toLowerCase();

    let result = [...products];

    if (selectedGenre) {
        result = result.filter((product) => {
            const names = Array.isArray(product.categories)
                ? product.categories.map((category) => String(category.name).toLowerCase())
                : [];

            return names.includes(selectedGenre.toLowerCase());
        });
    }

    if (normalizedQuery) {
        result = result.filter((product) => {
            const source = String(product[searchField] ?? '').toLowerCase();
            return source.includes(normalizedQuery);
        });
    }

    if (sortMode === 'name_asc') {
        result.sort((a, b) => String(a.name).localeCompare(String(b.name), 'ru'));
    } else if (sortMode === 'name_desc') {
        result.sort((a, b) => String(b.name).localeCompare(String(a.name), 'ru'));
    } else if (sortMode === 'price_asc') {
        result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortMode === 'price_desc') {
        result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
}
