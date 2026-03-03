import React from "react";
import { useEffect, useState } from "react";
import { getCartCount } from "../utils/cart";

function Header({ name }) {
    const [ShowCompany, setShowCompany] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [hideMenuRow, setHideMenuRow] = useState(false);

    useEffect(() => {
        setCartCount(getCartCount());

        const refreshCartCount = () => setCartCount(getCartCount());
        window.addEventListener('cart:updated', refreshCartCount);
        window.addEventListener('storage', refreshCartCount);

        return () => {
            window.removeEventListener('cart:updated', refreshCartCount);
            window.removeEventListener('storage', refreshCartCount);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setHideMenuRow(window.scrollY > 80);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (hideMenuRow && ShowCompany) {
            setShowCompany(false);
        }
    }, [hideMenuRow, ShowCompany]);

    return (
        <>
            <div className={`w-full transition-all duration-300 ${hideMenuRow ? 'h-[96px]' : 'h-[180px]'}`} />

            <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <div className="flex justify-around mt-4">
                    <button className="cursor-pointer"><img src="/img/logo.svg" alt="Инпроком" /></button>
                    <div className="flex gap-29 items-center">
                        <p>info@inprokom.ru</p>
                        <p>8 49244 7 75 34</p>
                        <a href="/cart" className="relative cursor-pointer">
                            <img src="/img/basket.svg" alt="Корзина" className="h-[50px]" />
                            {cartCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#FA4234] px-1 text-[12px] font-semibold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </a>
                        <button className="cursor-pointer"><img src="/img/profile.svg" alt="Профиль" className="h-[50px]" /></button>
                    </div>
                </div>
                <hr className="mt-3 "/>
                <div className={`overflow-hidden transition-all duration-300  ${hideMenuRow ? 'max-h-0 opacity-0' : 'max-h-[260px] opacity-100 mt-[20px]'}`}>

                    <div className="flex gap-18 justify-center text-[21px] mb-[20px] decoration-0
                    [&_a]:transition-all [&_a]:duration-300 [&_a]:ease-in-out
                    [&_a:hover]:text-[#FA4234] ">
                        <a href="/">ГЛАВНАЯ</a>
                        <a href="" onMouseEnter={()=> setShowCompany(true)} onMouseLeave={()=> setShowCompany(false)}>О КОМПАНИИ</a>
                        <a href="/catalog">КАТАЛОГ</a>
                        <a href="">ПРЕСС-ЦЕНТР</a>
                        <a href="">КОНТАКТЫ</a>
                        <a href="">ВАКАНСИИ</a>
                        <a href="">НЕЛИКВИДЫ И ОСТАТКИ СКЛАДОВ</a>
                    </div>
                    <hr className="mt-3"/>
                </div>
            </nav>
        </>

    );
}

export default Header;
