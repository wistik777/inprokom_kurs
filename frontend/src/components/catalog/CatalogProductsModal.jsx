import React, { useMemo, useState } from 'react';
import { formatPrice, getProductCategoriesLabel } from '../../utils/formatPrice';
import { exportProductsToExcel, exportProductsToPdf } from '../../utils/catalogExport';
import { filterCatalogProducts } from '../../utils/filterCatalogProducts';
import CatalogFilters from './CatalogFilters';

function CatalogProductsModal({ products, onClose }) {
    const [exporting, setExporting] = useState(null);
    const [searchField, setSearchField] = useState('name');
    const [searchValue, setSearchValue] = useState('');
    const [sortMode, setSortMode] = useState('default');

    const filteredProducts = useMemo(
        () => filterCatalogProducts(products, { searchField, searchValue, sortMode }),
        [products, searchField, searchValue, sortMode]
    );

    const handleResetFilters = () => {
        setSearchField('name');
        setSearchValue('');
        setSortMode('default');
    };

    const handleExportExcel = async () => {
        setExporting('excel');
        try {
            await exportProductsToExcel(filteredProducts);
        } finally {
            setExporting(null);
        }
    };

    const handleExportPdf = async () => {
        setExporting('pdf');
        try {
            await exportProductsToPdf(filteredProducts);
        } finally {
            setExporting(null);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm min-[426px]:p-6"
            onClick={onClose}
            role="presentation"
        >
            <div
                className="flex max-h-[92vh] w-full max-w-[1180px] flex-col overflow-hidden bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="catalog-modal-title"
            >
                <div className="flex flex-col gap-4 border-b border-[#ececec] px-5 py-5 min-[426px]:flex-row min-[426px]:items-start min-[426px]:justify-between min-[426px]:px-6">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#FA4234]">
                            Прайс лист
                        </p>
                        <h3 id="catalog-modal-title" className="mt-1 text-[24px] font-semibold text-[#181818] min-[426px]:text-[28px]">
                            Вся продукция
                        </h3>
                        <p className="mt-1 text-[14px] text-[#777]">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'позиция' : 'позиций'}
                            {filteredProducts.length !== products.length && ` из ${products.length}`}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={handleExportExcel}
                            disabled={exporting !== null || filteredProducts.length === 0}
                            className="btn-fill inline-flex h-[44px] min-w-[150px] items-center justify-center bg-white px-4 text-[13px] font-semibold disabled:opacity-60"
                        >
                            <span className="relative z-10">
                                {exporting === 'excel' ? 'Формирование...' : 'Скачать Excel'}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={handleExportPdf}
                            disabled={exporting !== null || filteredProducts.length === 0}
                            className="btn-fill inline-flex h-[44px] min-w-[150px] items-center justify-center bg-white px-4 text-[13px] font-semibold disabled:opacity-60"
                        >
                            <span className="relative z-10">
                                {exporting === 'pdf' ? 'Формирование...' : 'Скачать PDF'}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-10 w-10 items-center justify-center border border-[#ececec] text-[22px] leading-none text-[#666] transition hover:border-[#FA4234] hover:text-[#FA4234]"
                            aria-label="Закрыть"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="border-b border-[#ececec] px-4 py-4 min-[426px]:px-6">
                    <CatalogFilters
                        searchField={searchField}
                        searchValue={searchValue}
                        sortMode={sortMode}
                        onSearchFieldChange={setSearchField}
                        onSearchValueChange={setSearchValue}
                        onSortModeChange={setSortMode}
                        onReset={handleResetFilters}
                    />
                </div>

                <div className="overflow-auto px-4 py-4 min-[426px]:px-6">
                    {filteredProducts.length === 0 ? (
                        <p className="py-10 text-center text-[16px] text-[#777]">Товары не найдены</p>
                    ) : (
                        <table className="w-full min-w-[760px] border-collapse text-left text-[14px]">
                            <thead>
                                <tr className="border-b-2 border-[#FA4234] text-[12px] uppercase tracking-wide text-[#FA4234]">
                                    <th className="px-3 py-3 font-semibold">№</th>
                                    <th className="px-3 py-3 font-semibold">Наименование</th>
                                    <th className="px-3 py-3 font-semibold">Модель</th>
                                    <th className="px-3 py-3 font-semibold">Цена</th>
                                    <th className="px-3 py-3 font-semibold">Категории</th>
                                    <th className="px-3 py-3 font-semibold">Описание</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product, index) => (
                                    <tr key={product.id} className="border-b border-[#ececec] align-top">
                                        <td className="px-3 py-3 text-[#777]">{index + 1}</td>
                                        <td className="px-3 py-3 font-medium text-[#181818]">{product.name}</td>
                                        <td className="px-3 py-3 text-[#555]">{product.model}</td>
                                        <td className="px-3 py-3 font-semibold whitespace-nowrap text-[#FA4234]">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-3 py-3 text-[#555]">{getProductCategoriesLabel(product)}</td>
                                        <td className="px-3 py-3 text-[#666]">{product.description || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CatalogProductsModal;
