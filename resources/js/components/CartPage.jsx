import React, { useEffect, useMemo, useState } from 'react';
import { clearCart, getCartItems, removeFromCart, setItemQty } from '../utils/cart';

const formatPrice = (value) => `${Number(value).toFixed(2)}р`;

const CartPage = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(getCartItems());

        const handleUpdate = () => setItems(getCartItems());
        window.addEventListener('cart:updated', handleUpdate);

        return () => window.removeEventListener('cart:updated', handleUpdate);
    }, []);

    const total = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0),
        [items]
    );

    if (items.length === 0) {
        return (
            <main className="mx-auto w-full max-w-[1220px] px-6 py-12">
                <h1 className="text-[34px] font-semibold uppercase">Корзина</h1>
                <div className="mt-6 rounded-sm border-2 border-[#FA4234] bg-white p-10 text-center">
                    <p className="text-[22px] text-[#333]">Корзина пока пуста</p>
                    <a
                        href="/catalog"
                        className="mt-6 inline-block rounded-sm border border-[#FA4234] bg-[#FA4234] px-7 py-2 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#FA4234]"
                    >
                        Перейти в каталог
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-[1220px] px-6 py-10">
            <h1 className="text-[34px] font-semibold uppercase">Корзина</h1>

            <section className="mt-6 rounded-sm border-2 border-[#FA4234] bg-white p-5">
                <div className="space-y-4">
                    {items.map((item) => (
                        <article
                            key={item.id}
                            className="grid grid-cols-[140px_1fr_auto] gap-5 border border-[#FA4234] bg-[#f9f9f9] p-4"
                        >
                            <div className="flex h-[120px] items-center justify-center bg-white p-2">
                                <img src={item.image_url} alt={item.name} className="max-h-full w-full object-contain" />
                            </div>

                            <div>
                                <h2 className="text-[22px] font-medium">{item.name}</h2>
                                <p className="mt-1 text-[15px] text-[#555]">{item.model}</p>
                                <p className="mt-3 text-[24px] font-semibold text-[#FA4234]">{formatPrice(item.price)}</p>
                            </div>

                            <div className="flex min-w-[220px] flex-col items-end justify-between">
                                <button
                                    type="button"
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-[13px] text-[#888] transition-colors hover:text-[#FA4234]"
                                >
                                    Удалить
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setItemQty(item.id, Number(item.qty) - 1)}
                                        className="h-9 w-9 border border-[#FA4234] bg-white text-[18px] text-[#FA4234]"
                                    >
                                        -
                                    </button>
                                    <span className="min-w-[36px] text-center text-[16px] font-medium">{item.qty}</span>
                                    <button
                                        type="button"
                                        onClick={() => setItemQty(item.id, Number(item.qty) + 1)}
                                        className="h-9 w-9 border border-[#FA4234] bg-white text-[18px] text-[#FA4234]"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#d8d8d8] pt-5">
                    <button
                        type="button"
                        onClick={clearCart}
                        className="rounded-sm border border-[#FA4234] bg-white px-5 py-2 text-[14px] font-medium text-[#FA4234] transition-colors hover:bg-[#FA4234] hover:text-white"
                    >
                        Очистить корзину
                    </button>

                    <div className="flex items-center gap-5">
                        <p className="text-[24px] font-semibold">
                            Итого: <span className="text-[#FA4234]">{formatPrice(total)}</span>
                        </p>
                        <button
                            type="button"
                            className="rounded-sm border border-[#FA4234] bg-[#FA4234] px-6 py-2 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#FA4234]"
                        >
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default CartPage;
