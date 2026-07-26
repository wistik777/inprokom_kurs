import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import Card from './Card';
import CatalogProductsModal from './catalog/CatalogProductsModal';
import CatalogFilters from './catalog/CatalogFilters';
import { filterCatalogProducts } from '../utils/filterCatalogProducts';

const ITEMS_PER_PAGE = 16;

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchField, setSearchField] = useState('name');
    const [searchValue, setSearchValue] = useState('');
    const [sortMode, setSortMode] = useState('default');
    const [expandedCategory, setExpandedCategory] = useState(-1);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;

        Promise.all([api.public.products(), api.public.categories()])
            .then(([productsResponse, categoriesResponse]) => {
                if (!cancelled) {
                    setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);
                    setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setProducts([]);
                    setCategories([]);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const handleResetFilters = () => {
        setSearchField('name');
        setSearchValue('');
        setSortMode('default');
        setSelectedGenre('');
        setExpandedCategory(-1);
    };

    const filteredProducts = useMemo(
        () => filterCatalogProducts(products, { searchField, searchValue, sortMode, selectedGenre }),
        [products, searchField, searchValue, sortMode, selectedGenre]
    );

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
        <main className="page-container w-full max-w-full pb-12 pt-4 min-[426px]:pb-16 min-[426px]:pt-6 lg:ml-60 lg:max-w-[calc(100%-15rem)] lg:pr-8">
            <div className="flex flex-col items-start gap-6 max-[768px]:items-center lg:flex-row lg:gap-4">
                <aside className="hidden w-full shrink-0 bg-white p-3 lg:block lg:w-[270px]">
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
                                    {(category.children || []).map((child) => (
                                        <li key={child.id || child.name}>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedGenre((prev) => prev === child.name ? '' : child.name)}
                                                className={`w-full cursor-pointer py-1 text-left text-[14px] transition-colors duration-200 hover:text-[#FA4234] ${selectedGenre === child.name ? 'text-[#FA4234]' : 'text-[#555]'}`}
                                            >
                                                {child.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        onClick={() => setIsCatalogModalOpen(true)}
                        className="btn-fill mt-6 flex h-[48px] w-full items-center justify-center bg-white text-[13px] font-semibold uppercase tracking-widest"
                    >
                        <span className="relative z-10">Прайс лист</span>
                    </button>
                </aside>

                <div className="w-full flex-1 lg:ml-[6%]">
                    <h2 className="mb-3 w-full text-[22px] font-semibold uppercase max-[768px]:text-center min-[426px]:text-[28px]">
                        {selectedGenre ? `Продукция: ${selectedGenre}` : 'Вся продукция'}
                    </h2>

                    <div className="mb-6 bg-white px-0 py-4">
                        <CatalogFilters
                            searchField={searchField}
                            searchValue={searchValue}
                            sortMode={sortMode}
                            onSearchFieldChange={setSearchField}
                            onSearchValueChange={setSearchValue}
                            onSortModeChange={setSortMode}
                            onReset={handleResetFilters}
                            trailing={
                                <button
                                    type="button"
                                    onClick={() => setIsCatalogModalOpen(true)}
                                    className="btn-fill h-[42px] w-[130px] shrink-0 bg-white text-[13px] font-semibold uppercase tracking-widest lg:hidden"
                                >
                                    <span className="relative z-10">Прайс лист</span>
                                </button>
                            }
                        />
                    </div>

                    <section className="catalog-product-grid grid flex-1 grid-cols-1 justify-items-stretch gap-x-4 gap-y-4 min-[426px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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

            {isCatalogModalOpen && (
                <CatalogProductsModal
                    products={products}
                    onClose={() => setIsCatalogModalOpen(false)}
                />
            )}
        </main>
    );
};

export default Catalog;
