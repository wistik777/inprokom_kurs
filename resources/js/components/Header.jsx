import React from "react";
import { useEffect, useState } from "react";
import { getCartCount } from "../utils/cart";

function Header({ name, adminMode = false }) {
    const [ShowCompany, setShowCompany] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [hideMenuRow, setHideMenuRow] = useState(false);
    const isGuest = !window.authUser;

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

    if (adminMode) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

        return (
            <>
                <div className="h-[96px] w-full" />
                <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                    <div className="mx-auto mt-4 flex items-center justify-around">
                        <a href="/" className="cursor-pointer"><img src="/img/logo.svg" alt="Инпроком" /></a>
                        <div className="flex items-center gap-10">
                            <p>info@inprokom.ru</p>
                            <p>8 49244 7 75 34</p>
                            <form action="/logout" method="POST">
                                <input type="hidden" name="_token" value={csrfToken} />
                                <button
                                    type="submit"
                                    className="btn-fill h-[44px] min-w-[180px] whitespace-nowrap bg-white px-4 py-2 text-center text-[14px] font-semibold"
                                >
                                    <span className="relative z-10">Выйти из аккаунта</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <hr className="mt-3 " />
                </nav>
            </>
        );
    }

    return (
        <>
            <div className={`w-full transition-all duration-300 ${hideMenuRow ? 'h-[96px]' : 'h-[180px]'}`} />

            <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                <div className="mt-4 flex items-center justify-around">
                    <button className="cursor-pointer"><img src="/img/logo.svg" alt="Инпроком" /></button>
                    <div className="flex items-center gap-8">
                        <div className="relative min-h-[32px] min-w-[820px]">
                            <div className={`absolute inset-0 flex items-center gap-10 transition-all duration-300 ${hideMenuRow ? 'pointer-events-none -translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
                                <p>info@inprokom.ru</p>
                                <p>8 49244 7 75 34</p>
                            </div>
                            <div className={`absolute inset-0 flex items-center gap-6 mx-[-180px] text-[16px] decoration-0
                            [&_a]:whitespace-nowrap [&_a]:transition-all [&_a]:duration-300 [&_a]:ease-in-out
                            [&_a:hover]:text-[#FA4234] transition-all duration-300 ${hideMenuRow ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0 '}`}>
                                <a href="/">ГЛАВНАЯ</a>
                                <a href="/about-company" onMouseEnter={()=> setShowCompany(true)} onMouseLeave={()=> setShowCompany(false)}>О КОМПАНИИ</a>
                                <a href="/catalog">КАТАЛОГ</a>
                                <a href="/press-center">ПРЕСС-ЦЕНТР</a>
                                <a href="/contacts">КОНТАКТЫ</a>
                                <a href="/vacancies">ВАКАНСИИ</a>
                                <a href="/stock-remainders">НЕЛИКВИДЫ И ОСТАТКИ СКЛАДОВ</a>
                            </div>
                        </div>
                        <a href="/cart" className="relative cursor-pointer">
                            <img src="/img/basket.svg" alt="Корзина" className="h-[50px]" />
                            {cartCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#FA4234] px-1 text-[12px] font-semibold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </a>
                        {isGuest && (
                            <a
                                href="/auth"
                                className="btn-fill h-[44px] min-w-[190px] whitespace-nowrap bg-white px-4 py-2 text-center text-[14px] font-semibold"
                            >
                                <span className="relative z-10">Вход/Регистрация</span>
                            </a>
                        )}
                        {!isGuest && (
                            <a href="/profile" className="cursor-pointer"><img src="/img/profile.svg" alt="Профиль" className="h-[50px]" /></a>
                        )}
                    </div>
                </div>
                <hr className="mt-3 "/>
                <div className={`overflow-hidden transition-all duration-300  ${hideMenuRow ? 'max-h-0 opacity-0' : 'max-h-[260px] opacity-100 mt-[20px]'}`}>

                    <div className="flex gap-18 justify-center text-[21px] mb-[20px] decoration-0
                    [&_a]:transition-all [&_a]:duration-300 [&_a]:ease-in-out
                    [&_a:hover]:text-[#FA4234] ">
                        <a href="/">ГЛАВНАЯ</a>
                        <a href="/about-company" onMouseEnter={()=> setShowCompany(true)} onMouseLeave={()=> setShowCompany(false)}>О КОМПАНИИ</a>
                        <a href="/catalog">КАТАЛОГ</a>
                        <a href="/press-center">ПРЕСС-ЦЕНТР</a>
                        <a href="/contacts">КОНТАКТЫ</a>
                        <a href="/vacancies">ВАКАНСИИ</a>
                        <a href="/stock-remainders">НЕЛИКВИДЫ И ОСТАТКИ СКЛАДОВ</a>
                    </div>
                    <hr className="mt-3"/>
                </div>
            </nav>
        </>

    );
}

export default Header;
