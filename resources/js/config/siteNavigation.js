export const mainNavLinks = [
    { href: "/", label: "Главная" },
    { href: "/about-company", label: "О компании" },
    { href: "/catalog", label: "Каталог" },
    { href: "/press-center", label: "Пресс-центр" },
    { href: "/contacts", label: "Контакты" },
    { href: "/vacancies", label: "Вакансии" },
];

export const footerSitemapSections = [
    {
        title: "Компания",
        links: [
            { href: "/", label: "Главная" },
            { href: "/about-company", label: "О компании" },
            { href: "/press-center", label: "Пресс-центр" },
            { href: "/vacancies", label: "Вакансии" },
        ],
    },
    {
        title: "Продукция",
        links: [{ href: "/catalog", label: "Каталог продукции" }],
    },
    {
        title: "Связь",
        links: [{ href: "/contacts", label: "Обратная связь" }],
    },
];

export function isNavLinkActive(href, pathname = typeof window !== "undefined" ? window.location.pathname : "") {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}
