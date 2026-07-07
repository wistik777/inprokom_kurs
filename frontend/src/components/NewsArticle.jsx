import React from "react";
import { Link, useParams } from "react-router-dom";
import PressNewsCard from "./press/PressNewsCard";
import { api } from "../api/client";
import { useNewsItems } from "../hooks/useNews";
import { useApiQuery } from "../hooks/useApiQuery";
import { getNewsUrl } from "../data/newsItems";

function NewsArticle({ previewMode = false }) {
    const { newsId } = useParams();
    const { newsItems, loading: listLoading } = useNewsItems();
    const { data: article, loading: articleLoading } = useApiQuery(
        () => {
            if (!newsId) {
                return Promise.resolve(null);
            }

            if (previewMode) {
                return api.manager.previewNews(newsId).then((response) => response.data || null);
            }

            return api.public.newsShow(newsId).then((response) => response.data || null);
        },
        [newsId, previewMode]
    );

    const loading = listLoading || articleLoading;

    if (loading) {
        return (
            <div className="page-container py-16 text-center min-[426px]:py-24">
                <p className="text-[16px] text-[#666]">Загрузка новости…</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="page-container py-16 text-center min-[426px]:py-24">
                <h1 className="section-title">Новость не найдена</h1>
                <p className="mt-6 text-[16px] text-[#4B4B4B] min-[426px]:text-[18px]">
                    Возможно, ссылка устарела или материал был удалён.
                </p>
                {previewMode ? (
                    <Link
                        to="/manager/content"
                        className="btn-fill mt-10 inline-flex h-[52px] items-center justify-center bg-white px-10 text-[14px] uppercase tracking-widest"
                    >
                        <span className="relative z-10">← К контенту</span>
                    </Link>
                ) : (
                    <Link
                        to="/press-center/news"
                        className="btn-fill mt-10 inline-flex h-[52px] items-center justify-center bg-white px-10 text-[14px] uppercase tracking-widest"
                    >
                        <span className="relative z-10">К списку новостей</span>
                    </Link>
                )}
            </div>
        );
    }

    const content = Array.isArray(article.content) ? article.content : [];

    if (previewMode) {
        return (
            <div className="overflow-x-hidden bg-[#F2F2F2]">
                <section
                    className="relative flex items-end bg-cover bg-center px-6 pb-10 pt-8 min-[426px]:px-10 min-[426px]:pb-14 min-[426px]:pt-10"
                    style={{ backgroundImage: "url('/img/cart_fon.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/92 via-[#FA4234]/88 to-[#c92e22]/85" />
                    <div className="relative z-10 mx-auto w-full max-w-[980px]">
                        <p className="inline-block border border-white/30 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-sm min-[426px]:text-[12px]">
                            {article.date}
                        </p>
                        <h1 className="mt-5 max-w-[980px] text-[26px] font-bold uppercase leading-[1.2] text-white min-[426px]:mt-6 min-[426px]:text-[38px] lg:text-[44px]">
                            {article.title}
                        </h1>
                    </div>
                </section>

                <section className="pb-14 pt-6 min-[426px]:pb-20 min-[426px]:pt-8">
                    <div className="page-container">
                        <article className="mx-auto max-w-[980px] bg-white px-6 py-8 shadow-[0_16px_48px_rgba(0,0,0,0.08)] min-[426px]:px-10 min-[426px]:py-12 lg:px-14 lg:py-14">
                            {content.length > 0 && (
                                <div className="news-article-lead border-l-4 border-[#FA4234] bg-[#FA4234]/5 px-5 py-6 min-[426px]:px-8 min-[426px]:py-7">
                                    <p className="text-[17px] font-semibold leading-[1.65] text-[#181818] min-[426px]:text-[19px]">
                                        {content[0]}
                                    </p>
                                </div>
                            )}

                            <div className="mt-8 space-y-7 text-[16px] leading-[1.8] text-[#4B4B4B] min-[426px]:mt-10 min-[426px]:space-y-8 min-[426px]:text-[17px] lg:text-[18px]">
                                {content.slice(1).map((paragraph) => (
                                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                                ))}
                            </div>
                        </article>
                    </div>
                </section>
            </div>
        );
    }

    const related = newsItems.filter((item) => item.id !== article.id).slice(0, 3);
    const currentIndex = newsItems.findIndex((item) => item.id === article.id);
    const prevNews = currentIndex > 0 ? newsItems[currentIndex - 1] : null;
    const nextNews = currentIndex < newsItems.length - 1 ? newsItems[currentIndex + 1] : null;

    return (
        <div className="overflow-x-hidden bg-[#F2F2F2]">
            <section
                className="news-article-hero hero-under-header flex items-end bg-cover bg-center"
                style={{ backgroundImage: "url('/img/cart_fon.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/92 via-[#FA4234]/88 to-[#c92e22]/85" />
                <div className="relative z-10 w-full page-container pb-10 pt-2 min-[426px]:pb-14 min-[426px]:pt-4">
                    <nav className="text-[14px] leading-relaxed text-white/80 min-[426px]:text-[15px]">
                        <Link to="/press-center" className="transition hover:text-white">
                            Пресс-центр
                        </Link>
                        <span className="mx-2">—</span>
                        <Link to="/press-center/news" className="transition hover:text-white">
                            Новости
                        </Link>
                    </nav>

                    <p className="mt-6 inline-block border border-white/30 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur-sm min-[426px]:mt-8 min-[426px]:px-5 min-[426px]:py-2.5 min-[426px]:text-[12px]">
                        {article.date}
                    </p>
                    <h1 className="mt-5 max-w-[980px] pb-2 text-[26px] font-bold uppercase leading-[1.2] text-white min-[426px]:mt-6 min-[426px]:text-[38px] min-[426px]:leading-[1.15] lg:mt-8 lg:text-[44px]">
                        {article.title}
                    </h1>
                </div>
            </section>

            <section className="pb-14 pt-6 min-[426px]:pb-20 min-[426px]:pt-8 lg:pb-24 lg:pt-10">
                <div className="page-container">
                    <div className="grid items-start gap-8 min-[426px]:gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-16">
                        <article className="bg-white px-6 py-8 shadow-[0_16px_48px_rgba(0,0,0,0.08)] min-[426px]:px-10 min-[426px]:py-12 lg:px-14 lg:py-14">
                            {content.length > 0 && (
                                <div className="news-article-lead border-l-4 border-[#FA4234] bg-[#FA4234]/5 px-5 py-6 min-[426px]:px-8 min-[426px]:py-7">
                                    <p className="text-[17px] font-semibold leading-[1.65] text-[#181818] min-[426px]:text-[19px] min-[426px]:leading-[1.7]">
                                        {content[0]}
                                    </p>
                                </div>
                            )}

                            <div className="mt-8 space-y-7 text-[16px] leading-[1.8] text-[#4B4B4B] min-[426px]:mt-10 min-[426px]:space-y-8 min-[426px]:text-[17px] lg:mt-12 lg:text-[18px] lg:leading-[1.75]">
                                {content.slice(1).map((paragraph) => (
                                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                                ))}
                            </div>

                            {(prevNews || nextNews) && (
                                <div className="mt-12 grid gap-4 border-t border-[#ECECEC] pt-10 min-[426px]:mt-14 min-[426px]:gap-5 min-[426px]:pt-12 sm:grid-cols-2">
                                    {prevNews ? (
                                        <Link
                                            to={getNewsUrl(prevNews.id)}
                                            className="group flex flex-col border border-[#ECECEC] p-5 transition hover:border-[#FA4234] hover:shadow-[0_8px_24px_rgba(250,66,52,0.1)] min-[426px]:p-6"
                                        >
                                            <span className="text-[11px] uppercase tracking-widest text-[#FA4234] min-[426px]:text-[12px]">
                                                ← Предыдущая
                                            </span>
                                            <span className="mt-3 line-clamp-3 text-[14px] font-semibold leading-snug text-[#181818] transition group-hover:text-[#FA4234] min-[426px]:text-[15px]">
                                                {prevNews.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <div />
                                    )}
                                    {nextNews ? (
                                        <Link
                                            to={getNewsUrl(nextNews.id)}
                                            className="group flex flex-col border border-[#ECECEC] p-5 transition hover:border-[#FA4234] hover:shadow-[0_8px_24px_rgba(250,66,52,0.1)] min-[426px]:p-6 sm:text-right"
                                        >
                                            <span className="text-[11px] uppercase tracking-widest text-[#FA4234] min-[426px]:text-[12px]">
                                                Следующая →
                                            </span>
                                            <span className="mt-3 line-clamp-3 text-[14px] font-semibold leading-snug text-[#181818] transition group-hover:text-[#FA4234] min-[426px]:text-[15px]">
                                                {nextNews.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <div />
                                    )}
                                </div>
                            )}
                        </article>

                        <aside className="flex flex-col gap-5 min-[426px]:gap-6 lg:sticky lg:top-[100px]">
                            <div className="bg-white px-6 py-7 shadow-[0_8px_24px_rgba(0,0,0,0.06)] min-[426px]:px-7 min-[426px]:py-8">
                                <p className="text-[12px] font-semibold uppercase tracking-widest text-[#FA4234]">
                                    НПП Инпроком
                                </p>
                                <p className="mt-4 text-[15px] leading-[1.65] text-[#4B4B4B]">
                                    Научно-производственное предприятие с полным циклом — от разработки до выпуска
                                    изделий.
                                </p>
                                <Link
                                    to="/about-company"
                                    className="btn-fill mt-6 inline-flex h-[48px] w-full items-center justify-center bg-white text-[12px] uppercase tracking-widest"
                                >
                                    <span className="relative z-10">О компании</span>
                                </Link>
                            </div>

                            <Link
                                to="/press-center/news"
                                className="btn-fill inline-flex h-[52px] w-full items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                            >
                                <span className="relative z-10">← Все новости</span>
                            </Link>

                            <a
                                href="mailto:info@inprokom.ru"
                                className="block border-2 border-[#FA4234] bg-white px-6 py-7 text-center transition hover:bg-[#FA4234]/5 min-[426px]:px-7 min-[426px]:py-8"
                            >
                                <p className="text-[12px] uppercase tracking-widest text-[#FA4234]">Пресс-служба</p>
                                <p className="mt-3 text-[15px] font-semibold text-[#181818]">info@inprokom.ru</p>
                            </a>
                        </aside>
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <section className="bg-[#FA4234] py-14 text-white min-[426px]:py-16 lg:py-20">
                    <div className="page-container">
                        <div className="flex flex-col gap-4 border-b border-white/20 pb-8 min-[426px]:flex-row min-[426px]:items-end min-[426px]:justify-between min-[426px]:pb-10">
                            <h2 className="text-[26px] font-bold uppercase min-[426px]:text-[32px] lg:text-[36px]">
                                Читайте также
                            </h2>
                            <Link
                                to="/press-center/news"
                                className="text-[13px] uppercase tracking-widest text-white/90 transition hover:text-white min-[426px]:text-[14px]"
                            >
                                Вся лента →
                            </Link>
                        </div>
                        <div className="mt-10 grid gap-6 min-[426px]:mt-12 min-[426px]:grid-cols-3 min-[426px]:gap-8">
                            {related.map((item) => (
                                <PressNewsCard
                                    key={item.id}
                                    id={item.id}
                                    title={item.title}
                                    date={item.date}
                                    invertHover
                                    className="block"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

export default NewsArticle;
