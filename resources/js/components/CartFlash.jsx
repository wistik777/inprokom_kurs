import React, { useEffect, useRef, useState } from 'react';

const CartFlash = () => {
    const [toast, setToast] = useState(null);
    const [visible, setVisible] = useState(false);
    const hideTimer = useRef(null);
    const removeTimer = useRef(null);

    useEffect(() => {
        const handleAdded = (event) => {
            const detail = event.detail || {};

            if (hideTimer.current) clearTimeout(hideTimer.current);
            if (removeTimer.current) clearTimeout(removeTimer.current);

            setToast({
                productName: detail.productName || 'Товар',
                qty: detail.qty || 1,
            });
            setVisible(true);

            hideTimer.current = setTimeout(() => setVisible(false), 2200);
            removeTimer.current = setTimeout(() => setToast(null), 2550);
        };

        window.addEventListener('cart:added', handleAdded);
        return () => {
            window.removeEventListener('cart:added', handleAdded);
            if (hideTimer.current) clearTimeout(hideTimer.current);
            if (removeTimer.current) clearTimeout(removeTimer.current);
        };
    }, []);

    if (!toast) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
        >
            <div className="flex min-w-[360px] items-center gap-3 rounded-sm border border-[#FA4234] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#FA4234]">
                    <img src="/img/basket.svg" alt="" className="h-5 w-5 brightness-0 invert" />
                </div>
                <div>
                    <p className="text-[14px] font-semibold text-[#FA4234]">Товар добавлен в корзину</p>
                    <p className="text-[13px] text-[#333]">
                        {toast.productName} ({toast.qty} шт.)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartFlash;
