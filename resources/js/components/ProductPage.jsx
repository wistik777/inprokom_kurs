import React from 'react';

const ProductPage = ({ product }) => {
    if (!product) {
        return (
            <main className="mx-auto w-full max-w-[1200px] px-6 py-12">
                <h1 className="text-[32px] font-semibold">Продукция не найдена</h1>
            </main>
        );
    }

    const categories = Array.isArray(product.categories) ? product.categories : [];

    return (
        <main className="mx-auto w-full max-w-[1120px] px-4 pt-10 pb-40 max-[768px]:text-center min-[426px]:px-6">
            <a
                href="/catalog"
                className="mb-6 inline-block text-[15px] text-[#FA4234] transition-opacity hover:opacity-70"
            >
                ← Вернуться в каталог
            </a>

            <section className="rounded-sm border-2 border-[#FA4234] bg-white p-6 lg:p-7">
                <div className="grid grid-cols-1 gap-7 lg:grid-cols-[460px_1fr] lg:gap-8">
                    <div className="flex flex-col max-[768px]:items-center">
                        <div className="flex min-h-[280px] w-full items-center justify-center border border-[#FA4234] bg-white p-6 max-[768px]:max-w-[360px] min-[426px]:min-h-[420px] min-[426px]:p-8">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full max-h-[360px] w-full object-contain"
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-2 max-[768px]:justify-center lg:justify-start">
                            {categories.map((category) => (
                                <span
                                    key={category.id}
                                    className="rounded-sm border border-[#FA4234] px-3 py-1 text-[13px] text-[#FA4234]"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col max-[768px]:items-center lg:items-start lg:text-left">
                        <h1 className="text-[28px] font-semibold leading-tight max-[768px]:text-center min-[426px]:text-[34px]">{product.name}</h1>
                        <p className="mt-2 text-[20px] text-[#555]">{product.model}</p>

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
