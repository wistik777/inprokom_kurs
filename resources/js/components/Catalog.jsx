import React, { useEffect, useMemo, useState } from 'react';
import Card from './Card';

const categories = [
    {
        name: 'Объектовая безопасность',
        children: ['Видеонаблюдение', 'Контроль доступа'],
    },
    {
        name: 'Опорно-поворотные устройства',
        children: ['Уличные платформы', 'Стационарные модули'],
    },
    {
        name: 'Военная техника',
        children: ['Наблюдательные комплексы'],
    },
    {
        name: 'Контрактное производство',
        children: ['Электронные модули'],
    },
    {
        name: 'Пожарная безопасность',
        children: ['Пожарные извещатели'],
    },
    {
        name: 'Ядерная безопасность',
        children: ['Радиационный контроль'],
    },
    {
        name: 'Экологическая безопасность',
        children: ['Мониторинг окружающей среды'],
    },
];

const ITEMS_PER_PAGE = 16;

const Catalog = ({ products }) => {
    const [searchField, setSearchField] = useState('name');
    const [searchValue, setSearchValue] = useState('');
    const [sortMode, setSortMode] = useState('default');
    const [expandedCategory, setExpandedCategory] = useState(-1);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleResetFilters = () => {
        setSearchField('name');
        setSearchValue('');
        setSortMode('default');
        setSelectedGenre('');
        setExpandedCategory(-1);
    };

    const filteredProducts = useMemo(() => {
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

        if (sortMode === 'price_asc') {
            result.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortMode === 'price_desc') {
            result.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortMode === 'name_asc') {
            result.sort((a, b) => String(a.name).localeCompare(String(b.name), 'ru'));
        } else if (sortMode === 'name_desc') {
            result.sort((a, b) => String(b.name).localeCompare(String(a.name), 'ru'));
        }

        return result;
    }, [products, searchField, searchValue, sortMode, selectedGenre]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

    useEffect(() => {
        setCurrentPage(1);
    }, [searchField, searchValue, sortMode, selectedGenre]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const visiblePages = useMemo(() => {
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages, start + 2);

        if (end - start < 2) {
            start = Math.max(1, end - 2);
        }

        return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
    }, [currentPage, totalPages]);

    const goToPage = (page) => {
        setCurrentPage(Math.min(totalPages, Math.max(1, page)));
    };

    return (
        <main className="mx-auto w-full max-w-[78%] px-0 pb-16 pt-6  ml-60">
            <div className="flex items-start gap-4">
                <aside className="hidden w-[270px] shrink-0 bg-white p-3 lg:block">
                    <h2 className="mb-2 text-[18px] font-semibold uppercase">Категории</h2>
                    <ul>
                        {categories.map((category, index) => (
                            <li key={category.name} className="border-t border-[#FA4234]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setExpandedCategory(expandedCategory === index ? -1 : index);
                                        setSelectedGenre((prev) => prev === category.name ? '' : category.name);
                                    }}
                                    className={`flex w-full cursor-pointer items-center justify-between py-3 text-left text-[18px] leading-tight transition-colors duration-200 hover:text-[#FA4234] ${selectedGenre === category.name ? 'text-[#FA4234]' : 'text-black'}`}
                                >
                                    <span className="pr-2">{category.name}</span>
                                    <span className={`transition-transform duration-300 ${expandedCategory === index ? 'rotate-90 text-[#FA4234]' : 'text-black'}`}>&#9656;</span>
                                </button>

                                <ul className={`overflow-hidden pl-2 transition-all duration-300 ${expandedCategory === index ? 'max-h-36 pb-2' : 'max-h-0'}`}>
                                    {category.children.map((child) => (
                                        <li key={child}>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedGenre((prev) => prev === child ? '' : child)}
                                                className={`w-full cursor-pointer py-1 text-left text-[14px] transition-colors duration-200 hover:text-[#FA4234] ${selectedGenre === child ? 'text-[#FA4234]' : 'text-[#555]'}`}
                                            >
                                                {child}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="ml-[6%] flex-1">
                    <h2 className="mb-3 text-[28px] font-semibold uppercase">
                        {selectedGenre ? `Все товары: ${selectedGenre}` : 'Все товары'}
                    </h2>

                    <div className="mb-6 flex items-center justify-between bg-white px-0 py-4">

                        <div className="flex items-center gap-4">
                            <select
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                                className="h-[42px] w-[300px] border border-[#f4a8a2] bg-white px-3 text-[15px]"
                            >
                                <option value="name">По наименованию...</option>
                                <option value="model">По модели...</option>
                            </select>
                            <input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Введите значение..."
                                className="h-[42px] w-[260px] border border-[#f4a8a2] bg-white px-3 text-[15px]"
                            />
                            <select
                                value={sortMode}
                                onChange={(e) => setSortMode(e.target.value)}
                                className="h-[42px] w-[260px] border border-[#f4a8a2] bg-white px-3 text-[15px]"
                            >
                                <option value="default">По умолчанию</option>
                                <option value="name_asc">Название (А-Я)</option>
                                <option value="name_desc">Название (Я-А)</option>
                                <option value="price_asc">Цена (по возрастанию)</option>
                                <option value="price_desc">Цена (по убыванию)</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="btn-fill h-[42px] w-[150px] bg-white text-[13px] font-semibold"
                            >
                                <span className="relative z-10">СБРОСИТЬ</span>
                            </button>
                        </div>
                    </div>

                    <section className="grid flex-1 grid-cols-2 justify-items-start gap-x-6 gap-y-4 md:grid-cols-3 xl:grid-cols-4">
                        {paginatedProducts.map((product) => (
                            <Card key={product.id} product={product} />
                        ))}
                    </section>

                    <div className="mt-7 mr-[3%] flex flex-col items-center">
                        <div className="flex items-center gap-4 text-[22px]">
                            <button
                                type="button"
                                onClick={() => goToPage(1)}
                                className="cursor-pointer transition-colors hover:text-[#FA4234]"
                            >
                                В начало
                            </button>
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage - 1)}
                                className="cursor-pointer text-[26px] transition-colors hover:text-[#FA4234]"
                                aria-label="Предыдущая страница"
                            >
                                &#8249;
                            </button>

                            <div className="flex items-center gap-2.5">
                                {visiblePages.map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => goToPage(page)}
                                        className={`cursor-pointer transition-colors ${currentPage === page ? 'text-[#FA4234]' : 'text-black hover:text-[#FA4234]'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => goToPage(currentPage + 1)}
                                className="cursor-pointer text-[26px] transition-colors hover:text-[#FA4234]"
                                aria-label="Следующая страница"
                            >
                                &#8250;
                            </button>
                            <button
                                type="button"
                                onClick={() => goToPage(totalPages)}
                                className="cursor-pointer transition-colors hover:text-[#FA4234]"
                            >
                                В конец
                            </button>
                        </div>
                        <div className="mt-1.5 h-[2px] w-full max-w-[700px] bg-[#FA4234]" />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Catalog;
