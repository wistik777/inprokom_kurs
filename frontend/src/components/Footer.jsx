import React from "react";
import { footerSitemapSections } from "../config/siteNavigation";

const Footer = () => {
    return (
        <footer className="site-footer w-full bg-[#F2F3F5] pb-6 pt-2">
            <div className="page-container max-w-[1220px]">
                <div className="mb-8 h-px w-full bg-[#FA4234]/20" />

                <div className="flex flex-col gap-10 max-[768px]:items-center max-[768px]:text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
                    <div className="shrink-0 max-[768px]:mx-auto lg:max-w-[240px]">
                        <a href="/">
                            <img
                                src="/img/logo_footer.svg"
                                alt="Инпроком"
                                className="h-14 w-auto min-[426px]:h-[72px]"
                            />
                        </a>
                        <address className="mt-5 not-italic text-[14px] leading-6 text-[#555] min-[426px]:text-[16px]">
                            Россия, г. Балакирево,
                            <br />
                            ул. Заводская, 10
                            <br />
                            <a href="mailto:info@inprokom.ru" className="site-footer__link mt-2 inline-block">
                                info@inprokom.ru
                            </a>
                            <br />
                            <a href="tel:+74924477534" className="site-footer__link">
                                +7 49244 7 75 34
                            </a>
                            <br />
                            <a href="tel:+74924474685" className="site-footer__link">
                                +7 49244 7 46 85
                            </a>
                        </address>
                    </div>

                    <div className="flex-1 max-[768px]:w-full lg:max-w-[720px]">
                        <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#FA4234] max-[768px]:text-center">
                            Карта сайта
                        </p>
                        <div className="grid grid-cols-2 gap-8 max-[768px]:mx-auto max-[768px]:max-w-[320px] max-[768px]:text-left min-[480px]:grid-cols-3 min-[480px]:gap-6 min-[480px]:max-w-none">
                            {footerSitemapSections.map((section) => (
                                <div key={section.title} className="site-footer__column">
                                    <h3 className="site-footer__column-title">{section.title}</h3>
                                    <ul className="mt-3 space-y-2.5">
                                        {section.links.map((link) => (
                                            <li key={`${section.title}-${link.href}-${link.label}`}>
                                                <a href={link.href} className="site-footer__link">
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="shape-fill hidden shrink-0 scale-75 self-start lg:block"
                        aria-label="Наверх"
                    >
                        <svg width="32" height="20" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.5864 11.7854C19.0312 11.5062 19.5278 11.3167 20.0463 11.2309C20.5509 11.2389 21.0356 11.4363 21.4006 11.7854L32.833 22.7889C34.4485 24.3067 36.9656 24.3167 38.5911 22.8089L38.6509 22.753C39.0404 22.3888 39.3512 21.9487 39.5641 21.4598C39.7771 20.9709 39.8877 20.4436 39.8892 19.9104C39.8907 19.3771 39.783 18.8492 39.5728 18.3591C39.3626 17.8691 39.0543 17.4272 38.6669 17.0608L21.4884 0.572416C21.0955 0.209121 20.5814 0.00506921 20.0463 0C19.4986 0.0877596 18.9734 0.282246 18.5006 0.572416L1.21839 17.0608C0.831488 17.4277 0.523795 17.87 0.314263 18.3604C0.10473 18.8508 -0.00220758 19.3788 3.45405e-05 19.9121C0.00227666 20.4453 0.113651 20.9725 0.3273 21.4611C0.540949 21.9496 0.852349 22.3893 1.24233 22.753L1.31413 22.8089C2.9516 24.3167 5.47463 24.3067 7.09814 22.7889L18.5864 11.7854Z"
                                fill="#FA4234"
                            />
                        </svg>
                    </button>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4 border-t border-[#E0E0E0] pt-6 max-[768px]:text-center min-[426px]:flex-row min-[426px]:items-center min-[426px]:justify-between">
                    <p className="text-[14px] text-[#666] min-[426px]:text-[16px]">© НПП ИНПРОКОМ 2026</p>
                    <a
                        href="/contacts"
                        className="btn-fill mx-auto flex h-[48px] w-full max-w-[220px] items-center justify-center text-[14px] min-[426px]:h-[52px] min-[426px]:w-[172px] lg:mx-0"
                    >
                        <span className="relative z-10">Обратная связь</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
