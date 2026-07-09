import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { useApiQuery } from "../hooks/useApiQuery";

const PERIOD_OPTIONS = [
    { id: "all", label: "За всё время" },
    { id: "year", label: "За год" },
    { id: "quarter", label: "За квартал" },
    { id: "month", label: "За этот месяц" },
];

function KpiCard({ label, value, hint, accent = false }) {
    return (
        <article className={`admin-stat-kpi ${accent ? "admin-stat-kpi--accent" : ""}`}>
            <p className="admin-stat-kpi__label">{label}</p>
            <p className="admin-stat-kpi__value">{value}</p>
            {hint && <p className="admin-stat-kpi__hint">{hint}</p>}
        </article>
    );
}

function PeriodSelector({ currentPeriod, periodLabel }) {
    return (
        <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-white/75">Период:</p>
            <div className="flex flex-wrap gap-2">
                {PERIOD_OPTIONS.map((option) => (
                    <Link
                        key={option.id}
                        to={`/admin/statistics?period=${option.id}`}
                        className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                            currentPeriod === option.id
                                ? "bg-white text-[#FA4234] shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
                                : "border border-white/35 bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                        {option.label}
                    </Link>
                ))}
            </div>
            <p className="w-full text-[13px] text-white/70 sm:ml-auto sm:w-auto">{periodLabel}</p>
        </div>
    );
}

function MonthlyChart({ monthly, emptySuffix = "обр." }) {
    const maxValue = useMemo(
        () => Math.max(...monthly.map((item) => Number(item.count || 0)), 1),
        [monthly]
    );

    if (monthly.length === 0) {
        return <p className="py-8 text-center text-[15px] text-[#777]">Нет данных за выбранный период</p>;
    }

    return (
        <div className="admin-stat-chart">
            <div
                className="admin-stat-chart__bars"
                style={{ gridTemplateColumns: `repeat(${Math.min(monthly.length, 12)}, minmax(0, 1fr))` }}
            >
                {monthly.map((item) => {
                    const value = Number(item.count || 0);
                    const height = value > 0 ? Math.max(10, (value / maxValue) * 100) : 4;

                    return (
                        <div key={item.month} className="admin-stat-chart__col">
                            <p className="admin-stat-chart__value">{value}</p>
                            <div className="admin-stat-chart__track">
                                <div
                                    className="admin-stat-chart__bar"
                                    style={{ height: `${height}%` }}
                                    title={`${item.label}: ${value}`}
                                />
                            </div>
                            <p className="admin-stat-chart__label">{item.label}</p>
                            <p className="admin-stat-chart__orders">
                                {value} {emptySuffix}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function RecentList({ items, emptyText, renderRow }) {
    if (items.length === 0) {
        return <p className="py-8 text-center text-[15px] text-[#777]">{emptyText}</p>;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-[#efefef]">
            {items.map((item) => (
                <div key={item.id} className="border-t border-[#efefef] px-4 py-3.5 first:border-t-0">
                    {renderRow(item)}
                </div>
            ))}
        </div>
    );
}

function AdminSiteStats() {
    const [searchParams] = useSearchParams();
    const currentPeriod = searchParams.get("period") || "all";
    const { data, loading } = useApiQuery(
        () => api.admin.statistics(currentPeriod).then((response) => response.data),
        [currentPeriod]
    );

    const stats = data || {};
    const summary = stats.summary || {};
    const newsletter = stats.newsletter || {};
    const feedbackMonthly = Array.isArray(stats.feedback_monthly) ? stats.feedback_monthly : [];
    const vacancyAppsMonthly = Array.isArray(stats.vacancy_apps_monthly) ? stats.vacancy_apps_monthly : [];
    const newsletterMonthly = Array.isArray(newsletter.monthly) ? newsletter.monthly : [];
    const recentFeedback = Array.isArray(stats.recent_feedback) ? stats.recent_feedback : [];
    const recentVacancyApps = Array.isArray(stats.recent_vacancy_apps) ? stats.recent_vacancy_apps : [];

    const chartSubtitle =
        currentPeriod === "month"
            ? "По дням выбранного месяца"
            : currentPeriod === "quarter"
              ? "По месяцам квартала"
              : currentPeriod === "year"
                ? "По месяцам года"
                : "За последние 6 месяцев";

    if (loading && !data) {
        return null;
    }

    return (
        <main className="mx-auto w-full max-w-[1360px] px-6 py-10">
            <div className="admin-stat-hero">
                <div className="relative z-10">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/75">Аналитика</p>
                            <h1 className="mt-2 text-[34px] font-semibold text-white min-[426px]:text-[40px]">Статистика сайта</h1>
                            <p className="mt-3 max-w-[640px] text-[15px] leading-relaxed text-white/85">
                                Обращения, отклики, подписки и контент
                            </p>
                        </div>
                        <Link
                            to="/admin"
                            className="btn-outline-light inline-flex h-[44px] min-w-[190px] items-center justify-center px-5 text-[14px] font-semibold uppercase tracking-wide"
                        >
                            ← Админ-панель
                        </Link>
                    </div>
                    <PeriodSelector currentPeriod={currentPeriod} periodLabel={stats.period_label} />
                </div>
            </div>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    label="Обращений всего"
                    value={summary.feedback_total ?? 0}
                    hint={`За период: ${summary.feedback_period ?? 0} · новых: ${summary.feedback_new ?? 0}`}
                    accent
                />
                <KpiCard
                    label="Откликов на вакансии"
                    value={summary.vacancy_apps_total ?? 0}
                    hint={`За период: ${summary.vacancy_apps_period ?? 0} · новых: ${summary.vacancy_apps_new ?? 0}`}
                />
                <KpiCard
                    label="Подписчиков рассылки"
                    value={summary.newsletter_total ?? 0}
                    hint={`Новых за период: ${summary.newsletter_period_new ?? 0}`}
                />
                <KpiCard
                    label="Активных позиций каталога"
                    value={summary.products_active ?? 0}
                    hint={`Новостей: ${summary.news_published ?? 0} · вакансий: ${summary.vacancies_active ?? 0}`}
                />
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-2">
                <article className="admin-stat-panel">
                    <div className="admin-stat-panel__head">
                        <div>
                            <h2 className="text-[22px] font-semibold text-[#1b1b1b]">Обратная связь</h2>
                            <p className="mt-1 text-[14px] text-[#777]">{chartSubtitle}</p>
                        </div>
                        <span className="admin-stat-badge">✉</span>
                    </div>
                    <MonthlyChart monthly={feedbackMonthly} emptySuffix="обр." />
                </article>

                <article className="admin-stat-panel">
                    <div className="admin-stat-panel__head">
                        <div>
                            <h2 className="text-[22px] font-semibold text-[#1b1b1b]">Отклики на вакансии</h2>
                            <p className="mt-1 text-[14px] text-[#777]">{chartSubtitle}</p>
                        </div>
                        <span className="admin-stat-badge">CV</span>
                    </div>
                    <MonthlyChart monthly={vacancyAppsMonthly} emptySuffix="откл." />
                </article>
            </section>

            <section className="mt-8">
                <article className="admin-stat-panel">
                    <div className="admin-stat-panel__head">
                        <div>
                            <h2 className="text-[22px] font-semibold text-[#1b1b1b]">Подписки на новости</h2>
                            <p className="mt-1 text-[14px] text-[#777]">E-mail подписки с сайта</p>
                        </div>
                        <span className="admin-stat-badge">@</span>
                    </div>
                    <MonthlyChart monthly={newsletterMonthly} emptySuffix="подп." />
                </article>
            </section>

            <section className="mt-8 grid gap-6 xl:grid-cols-2">
                <article className="admin-stat-panel">
                    <div className="admin-stat-panel__head">
                        <div>
                            <h2 className="text-[22px] font-semibold text-[#1b1b1b]">Последние обращения</h2>
                            <p className="mt-1 text-[14px] text-[#777]">Со страницы «Контакты»</p>
                        </div>
                    </div>
                    <RecentList
                        items={recentFeedback}
                        emptyText="Обращений за период нет"
                        renderRow={(item) => (
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="text-[15px] font-semibold text-[#1f1f1f]">{item.name}</p>
                                    <p className="text-[13px] text-[#666]">{item.email}</p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
                                            item.status === "processed"
                                                ? "bg-[#e8f7ee] text-[#1a7f4b]"
                                                : "bg-[#fff4f2] text-[#FA4234]"
                                        }`}
                                    >
                                        {item.status_label}
                                    </span>
                                    <p className="mt-1 text-[12px] text-[#999]">{item.created_at}</p>
                                </div>
                            </div>
                        )}
                    />
                </article>

                <article className="admin-stat-panel">
                    <div className="admin-stat-panel__head">
                        <div>
                            <h2 className="text-[22px] font-semibold text-[#1b1b1b]">Последние отклики</h2>
                            <p className="mt-1 text-[14px] text-[#777]">Со страницы «Вакансии»</p>
                        </div>
                    </div>
                    <RecentList
                        items={recentVacancyApps}
                        emptyText="Откликов за период нет"
                        renderRow={(item) => (
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="text-[15px] font-semibold text-[#1f1f1f]">{item.name}</p>
                                    <p className="text-[13px] text-[#666]">{item.position || "—"}</p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${
                                            item.status === "processed"
                                                ? "bg-[#e8f7ee] text-[#1a7f4b]"
                                                : "bg-[#fff4f2] text-[#FA4234]"
                                        }`}
                                    >
                                        {item.status_label}
                                    </span>
                                    <p className="mt-1 text-[12px] text-[#999]">{item.created_at}</p>
                                </div>
                            </div>
                        )}
                    />
                </article>
            </section>
        </main>
    );
}

export default AdminSiteStats;
