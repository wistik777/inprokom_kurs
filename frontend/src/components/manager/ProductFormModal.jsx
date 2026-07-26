import React, { useMemo, useState } from 'react';
import { flattenCategoryOptions } from '../../utils/categoryOptions';

function ProductFormModal({ mode, product, categories, errors, onClose, onSubmit }) {
    const [selectedFileName, setSelectedFileName] = useState('');
    const isEdit = mode === 'edit';

    const categoryOptions = useMemo(() => flattenCategoryOptions(categories), [categories]);
    const selectedCategoryIds = useMemo(
        () => (Array.isArray(product?.categories) ? product.categories.map((category) => String(category.id)) : []),
        [product]
    );

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4" onClick={onClose}>
            <div
                className="max-h-[92vh] w-full max-w-[980px] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-[30px] font-semibold text-[#1b1b1b]">
                        {isEdit ? 'Редактирование продукции' : 'Добавление продукции'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 w-9 rounded-md border border-[#ececec] text-[20px] leading-none text-[#666] transition-colors hover:border-[#FA4234] hover:text-[#FA4234]"
                        aria-label="Закрыть модальное окно"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={onSubmit}
                    encType="multipart/form-data"
                    className="mt-5 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">
                                Название
                            </label>
                            <input
                                type="text"
                                name="name"
                                defaultValue={product?.name || ''}
                                className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none"
                                required
                            />
                            {errors.name && <p className="mt-1 text-[13px] text-red-500">{errors.name[0]}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">
                                Модель
                            </label>
                            <input
                                type="text"
                                name="model"
                                defaultValue={product?.model || ''}
                                className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none"
                                required
                            />
                            {errors.model && <p className="mt-1 text-[13px] text-red-500">{errors.model[0]}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">
                                Стоимость, ₽
                            </label>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                defaultValue={product?.price ?? ''}
                                className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none"
                                required
                            />
                            {errors.price && <p className="mt-1 text-[13px] text-red-500">{errors.price[0]}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">
                                Изображение
                            </label>
                            <div className="rounded-xl border border-[#FA4234] bg-white p-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="btn-fill inline-flex h-[40px] min-w-[170px] cursor-pointer items-center justify-center bg-white px-4 text-[13px] font-semibold">
                                        <span className="relative z-10">
                                            {isEdit ? 'Заменить файл' : 'Выбрать файл'}
                                        </span>
                                        <input
                                            type="file"
                                            name="image_file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name || '')}
                                        />
                                    </label>
                                    <p className={`text-[14px] ${selectedFileName ? 'text-[#333]' : 'text-[#888]'}`}>
                                        {selectedFileName || (isEdit ? 'Текущее изображение сохранится' : 'Файл не выбран')}
                                    </p>
                                </div>
                            </div>
                            {errors.image_file && <p className="mt-1 text-[13px] text-red-500">{errors.image_file[0]}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">
                                Описание
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                defaultValue={product?.description || ''}
                                className="w-full rounded-md border border-[#FA4234] bg-white px-3 py-2 text-[15px] outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#777]">Категории</p>
                            <div className="grid max-h-[180px] gap-2 overflow-y-auto rounded-md border border-[#ececec] p-3 md:grid-cols-2">
                                {categoryOptions.map((category) => (
                                    <label key={category.id} className="flex items-center gap-2 text-[14px] text-[#333]">
                                        <input
                                            type="checkbox"
                                            name="category_ids[]"
                                            value={category.id}
                                            defaultChecked={selectedCategoryIds.includes(String(category.id))}
                                        />
                                        <span>{category.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-fill mt-6 h-[44px] min-w-[210px] bg-white px-6 py-2.5 text-[14px] font-semibold">
                        <span className="relative z-10">{isEdit ? 'Сохранить изменения' : 'Создать карточку'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProductFormModal;
