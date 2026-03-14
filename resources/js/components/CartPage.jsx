import React, { useEffect, useMemo, useState } from 'react';
import { checkoutCart, clearCart, getCartItems, loadCart, removeFromCart, setItemQty } from '../utils/cart';

const formatPrice = (value) => `${Number(value).toFixed(2)}р`;

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState('');
    const [successOrderId, setSuccessOrderId] = useState(null);
    const isGuest = !window.authUser;

    useEffect(() => {
        loadCart()
            .then(() => setItems(getCartItems()))
            .catch(() => {});

        const handleUpdate = () => setItems(getCartItems());
        window.addEventListener('cart:updated', handleUpdate);

        return () => window.removeEventListener('cart:updated', handleUpdate);
    }, []);

    const total = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0),
        [items]
    );

    return (
        <>
            <main className="mx-auto w-full max-w-[1220px] px-6 py-10">
                <h1 className="text-[34px] font-semibold uppercase">Корзина</h1>

                {items.length === 0 ? (
                    <div className="mt-6 rounded-sm border-2 border-[#FA4234] bg-white p-10 text-center">
                        <p className="text-[22px] text-[#333]">Корзина пока пуста</p>
                        <a
                            href="/catalog"
                            className="mt-6 inline-block rounded-sm border border-[#FA4234] bg-[#FA4234] px-7 py-2 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#FA4234]"
                        >
                            Перейти в каталог
                        </a>
                    </div>
                ) : (
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
                                            onClick={() => {
                                                removeFromCart(item.id).catch(() => {});
                                            }}
                                            className="text-[13px] text-[#888] transition-colors hover:text-[#FA4234]"
                                        >
                                            Удалить
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setItemQty(item.id, Number(item.qty) - 1).catch(() => {});
                                                }}
                                                className="h-9 w-9 border border-[#FA4234] bg-white text-[18px] text-[#FA4234]"
                                            >
                                                -
                                            </button>
                                            <span className="min-w-[36px] text-center text-[16px] font-medium">{item.qty}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setItemQty(item.id, Number(item.qty) + 1).catch(() => {});
                                                }}
                                                className="h-9 w-9 border border-[#FA4234] bg-white text-[18px] text-[#FA4234]"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {checkoutError && (
                            <div className="mt-4 rounded-sm border border-[#f08b5f] bg-[#fff4ed] px-4 py-3 text-[14px] text-[#d96a3d]">
                                {checkoutError}
                            </div>
                        )}

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#d8d8d8] pt-5">
                            <button
                                type="button"
                                onClick={() => {
                                    clearCart().catch(() => {});
                                }}
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
                                    disabled={isCheckoutLoading}
                                    onClick={() => {
                                        if (isGuest) {
                                            window.location.assign('/auth?form=register');
                                            return;
                                        }

                                        setCheckoutError('');
                                        setIsCheckoutLoading(true);
                                        checkoutCart()
                                            .then((payload) => {
                                                setSuccessOrderId(payload?.order_id ?? '');
                                            })
                                            .catch(() => {
                                                setCheckoutError('Не удалось оформить заказ. Проверьте корзину и попробуйте снова.');
                                            })
                                            .finally(() => setIsCheckoutLoading(false));
                                    }}
                                    className="rounded-sm border border-[#FA4234] bg-[#FA4234] px-6 py-2 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#FA4234] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isCheckoutLoading ? 'Оформление...' : 'Оформить заказ'}
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {successOrderId !== null && (
                <div
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4"
                    onClick={() => setSuccessOrderId(null)}
                >
                    <div
                        className="w-full max-w-[448px] rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-[28px] font-semibold text-[#1b1b1b]">Заказ успешно оформлен</h3>
                        <p className="mt-3 text-[16px] text-[#444]">
                            {successOrderId ? `Ваш заказ №${successOrderId} создан.` : 'Ваш заказ создан.'}
                        </p>
                        <p className="mt-1 text-[14px] text-[#666]">
                            Вы можете перейти в историю заказов или закрыть это окно.
                        </p>
                        <div className="mt-6 flex items-center gap-7">
                            <button
                                type="button"
                                onClick={() => window.location.assign('/profile')}
                                className="btn-fill h-[42px] min-w-[240px] rounded-md px-5 text-[14px] font-semibold"
                            >
                                <span className="relative z-10">К истории заказов</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSuccessOrderId(null)}
                                className="btn-fill h-[42px] min-w-[120px] rounded-md px-4 text-[14px] font-semibold"
                            >
                                <span className="relative z-10">Закрыть</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartPage;
