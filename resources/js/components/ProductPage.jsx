import React from 'react';
import { addToCart } from '../utils/cart';

const formatPrice = (value) => `${Number(value).toFixed(2)}р`;

const ProductPage = ({ product }) => {
    if (!product) {
        return (
            <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
                <h1 className="text-[32px] font-semibold">Товар не найден</h1>
            </main>
        );
    }

    const categories = Array.isArray(product.categories) ? product.categories : [];

    return (
        <main className="mx-auto w-full max-w-[1120px] px-6 pt-10 pb-40">
            <a
                href="/catalog"
                className="mb-6 inline-block text-[15px] text-[#FA4234] transition-opacity hover:opacity-70"
            >
                ← Вернуться в каталог
            </a>

            <section className="rounded-sm border-2 border-[#FA4234] bg-white p-6 lg:p-7">
                <div className="grid grid-cols-1 gap-7 lg:grid-cols-[460px_1fr] lg:gap-8">
                    <div className="flex flex-col">
                        <div className="flex min-h-[420px] items-center justify-center border border-[#FA4234] bg-white p-8">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full max-h-[360px] w-full object-contain"
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <span
                                    key={category.id}
                                    className="rounded-sm border border-[#FA4234] px-3 py-1 text-[13px] text-[#FA4234]"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => addToCart(product)}
                                className="cursor-pointer rounded-sm border border-[#FA4234] bg-[#FA4234] px-8 py-3 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#FA4234]"
                            >
                                В КОРЗИНУ
                            </button>
                            <span className="text-[16px] text-[#444]">
                                В наличии: <strong>{product.stock}</strong>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-[34px] font-semibold leading-tight">{product.name}</h1>
                        <p className="mt-2 text-[20px] text-[#555]">{product.model}</p>
                        <p className="mt-5 text-[36px] font-semibold text-[#FA4234]">
                            {formatPrice(product.price)}
                        </p>

                        <div className="mt-6 rounded-sm bg-[#efefef] p-5">
                            <h2 className="text-[22px] font-medium">Описание</h2>
                            <p className="mt-2 text-[16px] leading-7 text-[#333]">
                                {product.description || 'Описание будет добавлено позже.'}
                            </p>
                        </div>

                        <div className="mt-5 rounded-sm bg-[#efefef] p-5">
                            <h2 className="text-[22px] font-medium">Технические характеристики</h2>
                            <div className="mt-3 space-y-1.5 text-[16px] text-[#333]">
                                <p>Модель: <strong>{product.model}</strong></p>
                                <p>Цена: <strong>{formatPrice(product.price)}</strong></p>
                                <p>Наличие на складе: <strong>{product.stock}</strong></p>
                                <p>
                                    Категории: <strong>{categories.length ? categories.map((category) => category.name).join(', ') : '—'}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProductPage;
