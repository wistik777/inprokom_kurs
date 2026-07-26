import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useApiQuery } from '../hooks/useApiQuery';
import { formatPrice } from '../utils/formatPrice';
import ConfirmDeleteModal from './manager/ConfirmDeleteModal';
import ManagerCategories from './manager/ManagerCategories';
import ProductFormModal from './manager/ProductFormModal';

const ITEMS_PER_PAGE = 12;

const ManagerHome = () => {
    const { data, loading, reload } = useApiQuery(() => api.manager.products().then((response) => response.data), []);
    const products = Array.isArray(data?.products) ? data.products : [];
    const categories = Array.isArray(data?.categories) ? data.categories : [];
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});

    const [searchField, setSearchField] = useState('name');
    const [searchValue, setSearchValue] = useState('');
    const [sortMode, setSortMode] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const [productModal, setProductModal] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(false);

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

    const handleProductSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        setErrors({});
        setSuccess('');

        try {
            const response =
                productModal?.mode === 'edit'
                    ? await api.manager.updateProduct(productModal.product.id, formData)
                    : await api.manager.createProduct(formData);

            setSuccess(response.message || 'Продукция успешно сохранена');
            setProductModal(null);
            await reload();
        } catch (error) {
            if (error instanceof ApiError && error.errors) {
                setErrors(error.errors);
                return;
            }

            setErrors({ name: [error.message || 'Не удалось сохранить продукцию'] });
        }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        setDeletingProduct(true);

        try {
            const response = await api.manager.deleteProduct(productToDelete.id);
            setSuccess(response.message || 'Продукция успешно удалена');
            setProductToDelete(null);
            await reload();
        } catch (error) {
            setErrors({ name: [error.message || 'Не удалось удалить продукцию'] });
            setProductToDelete(null);
        } finally {
            setDeletingProduct(false);
        }
    };

    const handleCategoriesChanged = async (message) => {
        setSuccess(message || 'Разделы обновлены');
        await reload();
    };

    if (loading && !data) {
        return null;
    }

    return (
        <main className="mx-auto w-full max-w-[1360px] px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-[34px] font-semibold text-[#1b1b1b]">Панель менеджера</h1>
                    <p className="mt-2 text-[15px] text-[#666]">Управление каталогом продукции и контентом сайта</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/manager/content"
                        className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Контент сайта</span>
                    </Link>
                    <Link
                        to="/manager/inbox"
                        className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Обращения клиентов</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            setErrors({});
                            setProductModal({ mode: 'create' });
                        }}
                        className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Добавить продукцию</span>
                    </button>
                </div>
            </div>

            {success && (
                <div className="mt-5 rounded-xl border border-[#FA4234] bg-[#fff4f2] px-4 py-3 text-[14px] text-[#FA4234]">
                    {success}
                </div>
            )}

            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
                <ManagerCategories
                    categories={categories}
                    onChanged={handleCategoriesChanged}
                    onError={(message) => setErrors({ name: [message] })}
                />

                <div className="min-w-0 flex-1">
                    <div className="catalog-filters flex w-full items-center gap-2 overflow-x-auto pb-1">
                        <select
                            value={searchField}
                            onChange={(event) => setSearchField(event.target.value)}
                            className="catalog-filters__control h-[42px] w-[170px] shrink-0 border border-[#f4a8a2] bg-white px-3 text-[14px]"
                        >
                            <option value="name">По наименованию...</option>
                            <option value="model">По модели...</option>
                        </select>
                        <input
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Введите значение..."
                            className="catalog-filters__control h-[42px] w-[170px] shrink-0 border border-[#f4a8a2] bg-white px-3 text-[14px]"
                        />
                        <select
                            value={sortMode}
                            onChange={(event) => setSortMode(event.target.value)}
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
                            onClick={handleResetFilters}
                            className="btn-fill h-[42px] w-[130px] shrink-0 bg-white text-[13px] font-semibold"
                        >
                            <span className="relative z-10">СБРОСИТЬ</span>
                        </button>
                    </div>

                    <section className="mt-6 overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                        <div className="hidden grid-cols-[70px_1.2fr_0.8fr_0.8fr_1fr] bg-[#f8f8f8] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#777] lg:grid">
                            <p>ID</p>
                            <p>Название</p>
                            <p>Модель</p>
                            <p>Цена</p>
                            <p>Действия</p>
                        </div>

                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="border-t border-[#efefef] px-5 py-4 lg:grid lg:grid-cols-[70px_1.2fr_0.8fr_0.8fr_1fr] lg:items-center"
                                >
                                    <p className="text-[15px] text-[#1f1f1f]">{product.id}</p>
                                    <p className="mt-2 text-[15px] font-semibold text-[#1f1f1f] lg:mt-0">{product.name}</p>
                                    <p className="mt-2 text-[15px] text-[#3a3a3a] lg:mt-0">{product.model}</p>
                                    <p className="mt-2 text-[15px] font-semibold text-[#FA4234] lg:mt-0">
                                        {formatPrice(product.price)}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2 lg:mt-0">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setErrors({});
                                                setProductModal({ mode: 'edit', product });
                                            }}
                                            className="btn-fill inline-flex h-[34px] min-w-[120px] items-center justify-center bg-white px-3 text-[13px] font-semibold"
                                        >
                                            <span className="relative z-10">Изменить</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProductToDelete({ id: product.id, name: product.name })}
                                            className="btn-fill inline-flex h-[34px] min-w-[120px] items-center justify-center bg-white px-3 text-[13px] font-semibold"
                                        >
                                            <span className="relative z-10">Удалить</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="border-t border-[#efefef] px-5 py-8 text-center text-[15px] text-[#777]">
                                По выбранным параметрам продукция не найдена
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
                </div>
            </div>

            {productModal && (
                <ProductFormModal
                    mode={productModal.mode}
                    product={productModal.product}
                    categories={categories}
                    errors={errors}
                    onClose={() => setProductModal(null)}
                    onSubmit={handleProductSubmit}
                />
            )}

            {productToDelete && (
                <ConfirmDeleteModal
                    title="Подтверждение удаления"
                    name={productToDelete.name}
                    description="Карточка товара будет удалена без возможности восстановления."
                    onClose={() => setProductToDelete(null)}
                    onConfirm={handleDeleteProduct}
                    submitting={deletingProduct}
                />
            )}
        </main>
    );
};

export default ManagerHome;
