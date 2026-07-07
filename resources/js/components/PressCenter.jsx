import React from "react";
import PressNewsCard from "./press/PressNewsCard";
import NewsletterSubscribe from "./press/NewsletterSubscribe";
import { newsItems, PRESS_PREVIEW_COUNT } from "../data/newsItems";

function PressCenter() {
    const previewNews = newsItems.slice(0, PRESS_PREVIEW_COUNT);

    const scrollToSubscribe = () => {
        document.getElementById("press-subscribe")?.scrollIntoView({ behavior: "smooth", block: "center" });
        document.getElementById("press-subscribe-email")?.focus();
    };

    return (
        <div>
            <section className="bg-white py-12 text-[#181818] min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <h1 className="section-title">Пресс-центр</h1>
                    <p className="mt-6 max-w-[980px] text-[16px] leading-relaxed text-[#4B4B4B] min-[426px]:mt-8 min-[426px]:text-[18px] lg:text-[20px]">
                        Мы придерживаемся принципов открытости и прозрачности. Для нас важно, чтобы партнеры,
                        заказчики и СМИ получали достоверную информацию о деятельности компании, продукции и
                        ключевых событиях НПП «Инпроком».
                    </p>
                    <NewsletterSubscribe
                        id="press-subscribe"
                        className="mt-10 max-w-[400px]"
                        buttonLabel="Подписаться на новости"
                        buttonClassName="btn-fill inline-flex h-[52px] w-full max-w-[320px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                    />
                </div>
            </section>

            <section className="bg-[#FA4234] py-12 text-white min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <h2 className="text-[28px] font-bold uppercase min-[426px]:text-[36px] lg:text-[40px]">Новости</h2>

                    <div className="press-news-grid mt-8 grid grid-cols-1 gap-5 min-[426px]:mt-12 min-[426px]:grid-cols-12 min-[426px]:gap-6">
                        {previewNews.map((item, index) => {
                            const isWide = index === 0 || index === 1 || index === 5 || index === 6;
                            const spanClass = isWide
                                ? "col-span-12 lg:col-span-6"
                                : "col-span-12 min-[426px]:col-span-6 lg:col-span-4";

                            return (
                                <PressNewsCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    date={item.date}
                                    invertHover
                                    className={spanClass}
                                />
                            );
                        })}
                    </div>

                    <div className="mt-14 flex flex-col items-center gap-6 max-[768px]:text-center min-[426px]:flex-row min-[426px]:flex-wrap min-[426px]:items-center min-[426px]:gap-8 min-[426px]:text-left">
                        <a
                            href="/press-center/news"
                            className="btn-outline-light h-[52px] min-w-[220px] text-[14px] uppercase tracking-widest"
                        >
                            Все новости
                        </a>
                        <button
                            type="button"
                            onClick={scrollToSubscribe}
                            className="cursor-pointer text-[15px] uppercase tracking-widest text-white/90 transition hover:text-white"
                        >
                            Подписаться на новости →
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PressCenter;
