export function flattenCategoryOptions(categories) {
    const options = [];

    categories.forEach((category) => {
        options.push({
            id: category.id,
            label: category.name,
        });

        (category.children || []).forEach((child) => {
            options.push({
                id: child.id,
                label: `${category.name} → ${child.name}`,
            });
        });
    });

    return options;
}
