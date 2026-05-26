import React, { useMemo, useState } from "react";
import PressNewsCard from "./press/PressNewsCard";
import { newsItems, NEWS_PAGE_SIZE } from "../data/newsItems";

function News() {
    const [visibleCount, setVisibleCount] = useState(NEWS_PAGE_SIZE);
    const [viewMode, setViewMode] = useState("grid");
    const [search, setSearch] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const filteredNews = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return newsItems;
        }

        return newsItems.filter((item) => item.title.toLowerCase().includes(query));
    }, [search]);

    const visibleNews = filteredNews.slice(0, visibleCount);
    const featuredNews = visibleNews[0];
    const gridNews = viewMode === "grid" && featuredNews ? visibleNews.slice(1) : visibleNews;
    const canLoadMore = visibleCount < filteredNews.length;

    const handleSubscribe = (event) => {
        event.preventDefault();
        setSubscribed(true);
    };

    return (
        <div className="overflow-x-hidden">
            <section className="bg-white py-12 text-[#181818] min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <nav className="text-[15px] text-[#666]">
                        <a href="/press-center" className="transition hover:text-[#FA4234]">
                            Пресс-центр
                        </a>
                        <span className="mx-2">—</span>
                        <span className="text-[#181818]">Новости</span>
                    </nav>

                    <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-16">
                        <div>
                            <span className="inline-block bg-[#FA4234]/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#FA4234]">
                                Пресс-центр
                            </span>
                            <h1 className="section-title mt-5">Новости</h1>
                            <p className="mt-5 max-w-[720px] text-[16px] leading-relaxed text-[#4B4B4B] min-[426px]:text-[18px] lg:text-[20px]">
                                Актуальные события, проекты и достижения НПП «Инпроком» — для партнёров,
                                заказчиков и СМИ.
                            </p>
                        </div>

                        <div className="border-l-4 border-[#FA4234] bg-[#FAFAFA] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] lg:p-8">
                            <p className="text-[13px] font-semibold uppercase tracking-widest text-[#FA4234]">
                                Подписка
                            </p>
                            <p className="mt-3 text-[15px] leading-relaxed text-[#4B4B4B]">
                                Получайте новости компании на электронную почту.
                            </p>
                            <form className="mt-6" onSubmit={handleSubscribe}>
                                <button
                                    type="submit"
                                    className="btn-fill flex h-[52px] w-full items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                                >
                                    <span className="relative z-10">Подписаться</span>
                                </button>
                                {subscribed && (
                                    <p className="mt-4 text-[14px] text-[#4B4B4B]">
                                        Спасибо! Заявка принята.
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#FA4234] py-12 text-white min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <div className="flex flex-col gap-6 border-b border-white/20 pb-8 min-[426px]:flex-row min-[426px]:items-end min-[426px]:justify-between">
                        <div>
                            <p className="text-[14px] uppercase tracking-[0.25em] text-white/75">Лента</p>
                            <p className="mt-2 text-[32px] font-bold leading-none min-[426px]:text-[40px]">
                                {filteredNews.length}
                            </p>
                            <p className="mt-1 text-[15px] text-white/85">
                                {filteredNews.length === 1 ? "публикация" : "публикаций"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 min-[426px]:flex-row min-[426px]:flex-wrap min-[426px]:items-center">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    aria-label="Сетка"
                                    className={`press-view-btn ${viewMode === "grid" ? "press-view-btn--active" : ""}`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    ▦
                                </button>
                                <button
                                    type="button"
                                    aria-label="Список"
                                    className={`press-view-btn ${viewMode === "list" ? "press-view-btn--active" : ""}`}
                                    onClick={() => setViewMode("list")}
                                >
                                    ≡
                                </button>
                            </div>

                            <div className="relative w-full min-w-[260px] min-[426px]:max-w-[420px]">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#999]">
                                    ⌕
                                </span>
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setVisibleCount(NEWS_PAGE_SIZE);
                                    }}
                                    placeholder="Поиск по заголовку..."
                                    className="press-search w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {filteredNews.length === 0 ? (
                        <div className="mt-16 rounded-sm border border-white/25 bg-white/10 px-8 py-14 text-center backdrop-blur-sm">
                            <p className="text-[20px] font-bold uppercase">Ничего не найдено</p>
                            <p className="mt-3 text-[16px] text-white/85">Попробуйте изменить запрос в поиске.</p>
                        </div>
                    ) : (
                        <>
                            {viewMode === "grid" && featuredNews && (
                                <div className="mt-10">
                                    <p className="mb-4 text-[13px] uppercase tracking-[0.2em] text-white/70">
                                        Главная новость
                                    </p>
                                    <PressNewsCard
                                        id={featuredNews.id}
                                        title={featuredNews.title}
                                        date={featuredNews.date}
                                        invertHover
                                        featured
                                        className="block"
                                    />
                                </div>
                            )}

                            <div
                                className={`${
                                    viewMode === "grid" && featuredNews ? "mt-10" : "mt-12"
                                } ${
                                    viewMode === "grid"
                                        ? "grid gap-6 min-[426px]:gap-8 md:grid-cols-2"
                                        : "flex flex-col gap-5"
                                }`}
                            >
                                {gridNews.map((item, index) => (
                                    <PressNewsCard
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        date={item.date}
                                        layout={viewMode}
                                        invertHover
                                        highlight={viewMode === "grid" && index === 1}
                                    />
                                ))}
                            </div>

                            {canLoadMore && (
                                <div className="mt-14 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setVisibleCount((count) =>
                                                Math.min(count + NEWS_PAGE_SIZE, filteredNews.length)
                                            )
                                        }
                                        className="btn-outline-light h-[52px] min-w-[260px] text-[14px] uppercase tracking-widest"
                                    >
                                        Показать еще
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <section className="bg-[#ECECEC] py-12 min-[426px]:py-16">
                <div className="page-container flex flex-col items-start justify-between gap-6 min-[426px]:flex-row min-[426px]:items-center">
                    <p className="max-w-[560px] text-[16px] leading-relaxed text-[#4B4B4B] min-[426px]:text-[18px]">
                        Нужна официальная информация для СМИ? Свяжитесь с пресс-службой НПП «Инпроком».
                    </p>
                    <a
                        href="/press-center"
                        className="btn-fill inline-flex h-[52px] min-w-[240px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                    >
                        <span className="relative z-10">В пресс-центр</span>
                    </a>
                </div>
            </section>
        </div>
    );
}

export default News;
