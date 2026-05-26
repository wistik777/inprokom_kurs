import React, { useEffect, useState } from "react";
import { getCartCount, loadCart } from "../utils/cart";

const MOBILE_BREAKPOINT = 768;

const navLinks = [
    { href: "/", label: "ГЛАВНАЯ" },
    { href: "/about-company", label: "О КОМПАНИИ" },
    { href: "/catalog", label: "КАТАЛОГ" },
    { href: "/press-center", label: "ПРЕСС-ЦЕНТР" },
    { href: "/contacts", label: "КОНТАКТЫ" },
    { href: "/vacancies", label: "ВАКАНСИИ" },
];

const navLinkClass =
    "whitespace-nowrap transition-all duration-300 ease-in-out hover:text-[#FA4234]";

function Header({ adminMode = false, overlapHero = false }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [hideMenuRow, setHideMenuRow] = useState(false);
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT
    );
    const isGuest = !window.authUser;

    useEffect(() => {
        setCartCount(getCartCount());
        loadCart().then(() => setCartCount(getCartCount())).catch(() => {});

        const refreshCartCount = () => setCartCount(getCartCount());
        window.addEventListener("cart:updated", refreshCartCount);

        return () => window.removeEventListener("cart:updated", refreshCartCount);
    }, []);

    useEffect(() => {
        const updateViewport = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
        updateViewport();
        window.addEventListener("resize", updateViewport);
        return () => window.removeEventListener("resize", updateViewport);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                setHideMenuRow(false);
                return;
            }
            setHideMenuRow(window.scrollY > 80);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    useEffect(() => {
        if (!isMobile) {
            setMenuOpen(false);
        }
    }, [isMobile]);

    const closeMenu = () => setMenuOpen(false);

    const spacerHeight = hideMenuRow
        ? "max-[768px]:h-[72px] min-[769px]:h-[96px]"
        : overlapHero
          ? "h-0"
          : "max-[768px]:h-[72px] min-[769px]:max-[1024px]:h-[132px] min-[900px]:max-[1024px]:h-[148px] min-[1025px]:h-[180px]";

    if (adminMode) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || "";

        return (
            <>
                <div className="h-[96px] w-full" />
                <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                    <div className="mx-auto mt-4 flex items-center justify-around">
                        <a href="/" className="cursor-pointer">
                            <img src="/img/logo.svg" alt="Инпроком" />
                        </a>
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
                    <hr className="mt-3" />
                </nav>
            </>
        );
    }

    return (
        <>
            <div className={`w-full transition-all duration-300 ${spacerHeight}`} />

            <nav
                className={`fixed inset-x-0 top-0 z-50 bg-white ${
                    overlapHero && !hideMenuRow && !menuOpen
                        ? ""
                        : "shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                }`}
            >
                {/* Мобильная шапка (≤768px) */}
                <div className="min-[769px]:hidden">
                    <div className="flex min-h-[72px] items-center justify-between gap-3 px-4">
                        <a href="/" className="shrink-0" onClick={closeMenu}>
                            <img src="/img/logo.svg" alt="Инпроком" className="h-10 w-auto" />
                        </a>
                        <div className="flex items-center gap-3">
                            <a href="/cart" className="relative cursor-pointer" onClick={closeMenu}>
                                <img src="/img/basket.svg" alt="Корзина" className="h-10 w-10" />
                                {cartCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FA4234] px-1 text-[11px] font-semibold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </a>
                            <button
                                type="button"
                                className={`header-burger flex ${menuOpen ? "header-burger--open" : ""}`}
                                aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                                aria-expanded={menuOpen}
                                onClick={() => setMenuOpen((open) => !open)}
                            >
                                <span className="header-burger__line" />
                                <span className="header-burger__line" />
                                <span className="header-burger__line" />
                            </button>
                        </div>
                    </div>

                    <div
                        className={`header-mobile-menu ${menuOpen ? "header-mobile-menu--open" : ""}`}
                        aria-hidden={!menuOpen}
                    >
                        <div className="header-mobile-menu__inner">
                            <div className="header-mobile-menu__content">
                                <p className="mb-4 text-[13px] text-[#666]">
                                    info@inprokom.ru · 8 49244 7 75 34
                                </p>
                                {navLinks.map((link) => (
                                    <a
                                        key={`mobile-${link.href}`}
                                        href={link.href}
                                        tabIndex={menuOpen ? undefined : -1}
                                        onClick={closeMenu}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                                {isGuest && (
                                    <a
                                        href="/auth"
                                        className="btn-fill mt-6 flex h-[48px] w-full items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                                        tabIndex={menuOpen ? undefined : -1}
                                        onClick={closeMenu}
                                    >
                                        <span className="relative z-10">Вход / Регистрация</span>
                                    </a>
                                )}
                                {!isGuest && (
                                    <a
                                        href="/profile"
                                        className="mt-6 block py-3 text-center text-[14px] font-semibold uppercase text-[#FA4234]"
                                        tabIndex={menuOpen ? undefined : -1}
                                        onClick={closeMenu}
                                    >
                                        Личный кабинет
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Десктопная шапка (≥769px); компакт 769–1024px — в CSS */}
                <div className="header-desktop-top relative mt-4 hidden min-h-[58px] items-center justify-around min-[769px]:flex">
                    <div
                        className={`header-desktop-nav-scroll absolute inset-0 z-[18] flex items-center justify-center gap-6 text-[16px] transition-opacity duration-300 ${
                            hideMenuRow
                                ? "pointer-events-auto opacity-100"
                                : "pointer-events-none opacity-0"
                        }`}
                        aria-hidden={!hideMenuRow}
                    >
                        {navLinks.map((link) => (
                            <a key={`top-${link.href}`} href={link.href} className={navLinkClass}>
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <a href="/" className="relative z-20 shrink-0 cursor-pointer">
                        <img src="/img/logo.svg" alt="Инпроком" />
                    </a>
                    <div
                        className={`relative z-20 flex items-center gap-8 ${
                            hideMenuRow ? "pointer-events-none" : ""
                        }`}
                    >
                        <div className="header-contacts-slot pointer-events-none relative hidden min-h-[32px] min-w-[820px] min-[1025px]:block">
                            <div
                                className={`absolute inset-0 flex items-center gap-10 transition-all duration-300 ${
                                    hideMenuRow
                                        ? "-translate-y-2 opacity-0"
                                        : "translate-y-0 opacity-100"
                                }`}
                            >
                                <p>info@inprokom.ru</p>
                                <p>8 49244 7 75 34</p>
                            </div>
                        </div>
                        <a href="/cart" className="pointer-events-auto relative z-10 cursor-pointer">
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
                                className="btn-fill pointer-events-auto relative z-10 h-[44px] min-w-[190px] whitespace-nowrap bg-white px-4 py-2 text-center text-[14px] font-semibold"
                            >
                                <span className="relative z-10">Вход/Регистрация</span>
                            </a>
                        )}
                        {!isGuest && (
                            <a href="/profile" className="pointer-events-auto relative z-10 cursor-pointer">
                                <img src="/img/profile.svg" alt="Профиль" className="h-[50px]" />
                            </a>
                        )}
                    </div>
                </div>

                <hr className="mt-3 hidden min-[769px]:block" />

                <div
                    className={`header-desktop-nav-wrap hidden overflow-hidden transition-all duration-300 min-[769px]:block ${
                        hideMenuRow ? "max-h-0 opacity-0" : "mt-[20px] max-h-[96px] opacity-100"
                    }`}
                >
                    <div className="header-desktop-nav mb-[20px] flex justify-center gap-[72px] text-[21px] decoration-0 [&_a]:transition-all [&_a]:duration-300 [&_a]:ease-in-out [&_a:hover]:text-[#FA4234]">
                        {navLinks.map((link) => (
                            <a key={`bottom-${link.href}`} href={link.href} className={navLinkClass}>
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <hr className="mt-3 border-[#E8E8E8]" />
                </div>

            </nav>
        </>
    );
}

export default Header;
