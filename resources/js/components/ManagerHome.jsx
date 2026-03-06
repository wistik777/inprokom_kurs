import React, { useEffect, useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 12;

const formatPrice = (value) => `${Number(value || 0).toFixed(2)}р`;

const ManagerHome = () => {
    const products = Array.isArray(window.managerProducts) ? window.managerProducts : [];
    const categories = Array.isArray(window.managerCategories) ? window.managerCategories : [];
    const success = window.managerSuccess || '';
    const errors = window.errors || {};
    const old = window.managerFormOld || {};
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    const [searchField, setSearchField] = useState('name');
    const [searchValue, setSearchValue] = useState('');
    const [sortMode, setSortMode] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(Object.keys(errors).length > 0);
    const [productToDelete, setProductToDelete] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');

    const handleResetFilters = () => {
        setSearchField('name');
        setSearchValue('');
        setSortMode('default');
    };

    const filteredProducts = useMemo(() => {
        const normalizedQuery = searchValue.trim().toLowerCase();
        let result = [...products];

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
    }, [products, searchField, searchValue, sortMode]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

    useEffect(() => {
        setCurrentPage(1);
    }, [searchField, searchValue, sortMode]);

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
        <main className="mx-auto w-full max-w-[1360px] px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-[34px] font-semibold text-[#1b1b1b]">Панель менеджера</h1>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                >
                    <span className="relative z-10">Добавить товар</span>
                </button>
            </div>

            {success && (
                <div className="mt-5 rounded-xl border border-[#FA4234] bg-[#fff4f2] px-4 py-3 text-[14px] text-[#FA4234]">
                    {success}
                </div>
            )}

            <div className="mt-6 flex items-center gap-4">
                <select
                    value={searchField}
                    onChange={(event) => setSearchField(event.target.value)}
                    className="h-[42px] w-[260px] border border-[#f4a8a2] bg-white px-3 text-[15px]"
                >
                    <option value="name">По наименованию...</option>
                    <option value="model">По модели...</option>
                </select>
                <input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Введите значение..."
                    className="h-[42px] w-[260px] border border-[#f4a8a2] bg-white px-3 text-[15px]"
                />
                <select
                    value={sortMode}
                    onChange={(event) => setSortMode(event.target.value)}
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

            <section className="mt-6 overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                <div className="hidden grid-cols-[80px_1.3fr_1fr_1fr_1fr_1fr] bg-[#f8f8f8] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#777] md:grid">
                    <p>ID</p>
                    <p>Название</p>
                    <p>Модель</p>
                    <p>Цена</p>
                    <p>Остаток</p>
                    <p>Действие</p>
                </div>

                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                        <div key={product.id} className="border-t border-[#efefef] px-5 py-4 md:grid md:grid-cols-[80px_1.3fr_1fr_1fr_1fr_1fr] md:items-center">
                            <p className="text-[15px] text-[#1f1f1f]">{product.id}</p>
                            <p className="mt-2 text-[15px] font-semibold text-[#1f1f1f] md:mt-0">{product.name}</p>
                            <p className="mt-2 text-[15px] text-[#3a3a3a] md:mt-0">{product.model}</p>
                            <p className="mt-2 text-[15px] text-[#3a3a3a] md:mt-0">{formatPrice(product.price)}</p>
                            <p className="mt-2 text-[15px] text-[#3a3a3a] md:mt-0">{product.stock}</p>
                            <p className="mt-2 md:mt-0">
                                <button
                                    type="button"
                                    onClick={() => setProductToDelete({ id: product.id, name: product.name })}
                                    className="btn-fill inline-flex h-[34px] w-[140px] items-center justify-center bg-white text-[13px] font-semibold"
                                >
                                    <span className="relative z-10">Удалить</span>
                                </button>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="border-t border-[#efefef] px-5 py-8 text-center text-[15px] text-[#777]">
                        По выбранным параметрам товары не найдены
                    </div>
                )}
            </section>

            <div className="mt-7 flex flex-col items-center">
                <div className="flex items-center gap-4 text-[22px]">
                    <button type="button" onClick={() => goToPage(1)} className="cursor-pointer transition-colors hover:text-[#FA4234]">В начало</button>
                    <button type="button" onClick={() => goToPage(currentPage - 1)} className="cursor-pointer text-[26px] transition-colors hover:text-[#FA4234]" aria-label="Предыдущая страница">&#8249;</button>
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
                    <button type="button" onClick={() => goToPage(currentPage + 1)} className="cursor-pointer text-[26px] transition-colors hover:text-[#FA4234]" aria-label="Следующая страница">&#8250;</button>
                    <button type="button" onClick={() => goToPage(totalPages)} className="cursor-pointer transition-colors hover:text-[#FA4234]">В конец</button>
                </div>
                <div className="mt-1.5 h-[2px] w-full max-w-[700px] bg-[#FA4234]" />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4" onClick={() => setIsModalOpen(false)}>
                    <div className="w-full max-w-[980px] rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]" onClick={(event) => event.stopPropagation()}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-[30px] font-semibold text-[#1b1b1b]">Добавление товара</h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="h-9 w-9 rounded-md border border-[#ececec] text-[20px] leading-none text-[#666] transition-colors hover:border-[#FA4234] hover:text-[#FA4234]"
                                aria-label="Закрыть модальное окно"
                            >
                                x
                            </button>
                        </div>

                        <form action="/manager/products" method="POST" encType="multipart/form-data" className="mt-5 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Название</label>
                                    <input type="text" name="name" defaultValue={old.name || ''} className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none" required />
                                    {errors.name && <p className="mt-1 text-[13px] text-red-500">{errors.name[0]}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Модель</label>
                                    <input type="text" name="model" defaultValue={old.model || ''} className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none" required />
                                    {errors.model && <p className="mt-1 text-[13px] text-red-500">{errors.model[0]}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Цена</label>
                                    <input type="number" step="0.01" min="0" name="price" defaultValue={old.price || ''} className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none" required />
                                    {errors.price && <p className="mt-1 text-[13px] text-red-500">{errors.price[0]}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Остаток</label>
                                    <input type="number" min="0" name="stock" defaultValue={old.stock || '0'} className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none" required />
                                    {errors.stock && <p className="mt-1 text-[13px] text-red-500">{errors.stock[0]}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Изображение товара</label>
                                    <div className="rounded-xl border border-[#FA4234] bg-white p-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <label className="btn-fill inline-flex h-[40px] min-w-[170px] cursor-pointer items-center justify-center bg-white px-4 text-[13px] font-semibold">
                                                <span className="relative z-10">Выбрать файл</span>
                                                <input
                                                    type="file"
                                                    name="image_file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name || '')}
                                                />
                                            </label>
                                            <p className={`text-[14px] ${selectedFileName ? 'text-[#333]' : 'text-[#888]'}`}>
                                                {selectedFileName || 'Файл не выбран'}
                                            </p>
                                        </div>
                                        <p className="mt-2 text-[12px] text-[#888]">Поддерживаются изображения JPG, PNG, WEBP до 5 МБ</p>
                                    </div>
                                    {errors.image_file && <p className="mt-1 text-[13px] text-red-500">{errors.image_file[0]}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Описание</label>
                                    <textarea name="description" rows={3} defaultValue={old.description || ''} className="w-full resize-none rounded-md border border-[#FA4234] bg-white px-3 py-2 text-[15px] outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#777]">Категории</p>
                                    <div className="grid max-h-[160px] gap-2 overflow-y-auto rounded-md border border-[#ececec] p-3 md:grid-cols-2">
                                        {categories.map((category) => (
                                            <label key={category.id} className="flex items-center gap-2 text-[14px] text-[#333]">
                                                <input
                                                    type="checkbox"
                                                    name="category_ids[]"
                                                    value={category.id}
                                                    defaultChecked={Array.isArray(old.category_ids) && old.category_ids.map(String).includes(String(category.id))}
                                                />
                                                <span>{category.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn-fill mt-6 h-[44px] min-w-[210px] bg-white px-6 py-2.5 text-[14px] font-semibold">
                                <span className="relative z-10">Создать товар</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {productToDelete && (
                <div
                    className="fixed inset-0 z-[85] flex items-center justify-center bg-black/45 px-4"
                    onClick={() => setProductToDelete(null)}
                >
                    <div
                        className="w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-[26px] font-semibold text-[#1b1b1b]">Подтверждение удаления</h3>
                        <p className="mt-3 text-[16px] text-[#444]">
                            Точно ли вы хотите удалить товар <span className="font-semibold">"{productToDelete.name}"</span>?
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setProductToDelete(null)}
                                className="btn-fill h-[44px] min-w-[140px] bg-white px-5 py-2 text-[14px] font-semibold"
                            >
                                <span className="relative z-10">Отмена</span>
                            </button>

                            <form action={`/manager/products/${productToDelete.id}`} method="POST">
                                <input type="hidden" name="_token" value={csrfToken} />
                                <input type="hidden" name="_method" value="DELETE" />
                                <button
                                    type="submit"
                                    className="h-[44px] min-w-[140px] border-2 border-[#FA4234] bg-[#FA4234] px-5 py-2 text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-[#FA4234]"
                                >
                                    Удалить
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ManagerHome;
