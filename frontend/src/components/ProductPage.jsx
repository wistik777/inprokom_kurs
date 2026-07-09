import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, resolveAssetUrl } from '../api/client';

const ProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        api.public
            .productShow(productId)
            .then((response) => {
                if (!cancelled) {
                    setProduct(response.data || null);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setProduct(null);
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
    }, [productId]);

    if (loading && !product) {
        return null;
    }

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
            <Link
                to="/catalog"
                className="mb-6 inline-block text-[15px] text-[#FA4234] transition-opacity hover:opacity-70"
            >
                ← Вернуться в каталог
            </Link>

            <section className="rounded-sm border-2 border-[#FA4234] bg-white p-6 lg:p-7">
                <div className="grid grid-cols-1 gap-7 lg:grid-cols-[460px_1fr] lg:gap-8">
                    <div className="flex flex-col max-[768px]:items-center">
                        <div className="flex min-h-[280px] w-full items-center justify-center border border-[#FA4234] bg-white p-6 max-[768px]:max-w-[360px] min-[426px]:min-h-[420px] min-[426px]:p-8">
                            <img
                                src={resolveAssetUrl(product.image_url)}
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

                    <div>
                        <h1 className="text-[28px] font-semibold leading-tight text-[#1b1b1b] min-[426px]:text-[34px]">
                            {product.name}
                        </h1>
                        <p className="mt-3 text-[16px] text-[#666]">Модель: {product.model}</p>
                        {product.description && (
                            <div className="mt-8 text-[16px] leading-relaxed text-[#333]">
                                {product.description}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProductPage;
