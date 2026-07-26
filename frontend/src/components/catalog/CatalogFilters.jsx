function CatalogFilters({
    searchField,
    searchValue,
    sortMode,
    onSearchFieldChange,
    onSearchValueChange,
    onSortModeChange,
    onReset,
    trailing = null,
}) {
    return (
        <div className="catalog-filters flex w-full items-center gap-2 overflow-x-auto pb-1">
            <select
                value={searchField}
                onChange={(event) => onSearchFieldChange(event.target.value)}
                className="catalog-filters__control h-[42px] w-[170px] shrink-0 border border-[#f4a8a2] bg-white px-3 text-[14px]"
            >
                <option value="name">По наименованию...</option>
                <option value="model">По модели...</option>
            </select>
            <input
                value={searchValue}
                onChange={(event) => onSearchValueChange(event.target.value)}
                placeholder="Введите значение..."
                className="catalog-filters__control h-[42px] w-[170px] shrink-0 border border-[#f4a8a2] bg-white px-3 text-[14px]"
            />
            <select
                value={sortMode}
                onChange={(event) => onSortModeChange(event.target.value)}
                className="catalog-filters__control h-[42px] w-[170px] shrink-0 border border-[#f4a8a2] bg-white px-3 text-[14px]"
            >
                <option value="default">По умолчанию</option>
                <option value="name_asc">Название (А-Я)</option>
                <option value="name_desc">Название (Я-А)</option>
                <option value="price_asc">Цена (по возрастанию)</option>
                <option value="price_desc">Цена (по убыванию)</option>
            </select>
            <button
                type="button"
                onClick={onReset}
                className="btn-fill h-[42px] w-[130px] shrink-0 bg-white text-[13px] font-semibold"
            >
                <span className="relative z-10">СБРОСИТЬ</span>
            </button>
            {trailing}
        </div>
    );
}

export default CatalogFilters;
