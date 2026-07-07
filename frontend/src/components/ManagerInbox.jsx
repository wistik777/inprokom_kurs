import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useApiQuery } from "../hooks/useApiQuery";
import { clipText } from "../utils/clipText";

const ITEMS_PER_PAGE = 8;

const statusLabels = {
    new: "Новое",
    processed: "Обработано",
};

function InboxDetailModal({ item, type, onClose }) {
    if (!item) return null;

    const titleByType = {
        feedback: "Обратная связь",
        vacancy: "Отклик на вакансию",
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
            role="presentation"
        >
            <div
                className="max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#FA4234]">
                            {titleByType[type]}
                        </p>
                        <h3 className="mt-1 text-[24px] font-semibold text-[#1b1b1b]">{item.name}</h3>
                        <p className="mt-1 text-[14px] text-[#777]">{item.created_at}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center border border-[#ececec] text-[22px] leading-none text-[#666] transition hover:border-[#FA4234] hover:text-[#FA4234]"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <dl className="mt-6 space-y-3 text-[15px]">
                    <div>
                        <dt className="font-semibold text-[#555]">E-mail</dt>
                        <dd>
                            <a href={`mailto:${item.email}`} className="text-[#FA4234] hover:underline">
                                {item.email}
                            </a>
                        </dd>
                    </div>
                    {item.phone && (
                        <div>
                            <dt className="font-semibold text-[#555]">Телефон</dt>
                            <dd>
                                <a href={`tel:${item.phone}`} className="text-[#333] hover:text-[#FA4234]">
                                    {item.phone}
                                </a>
                            </dd>
                        </div>
                    )}
                    {type === "vacancy" && item.position && (
                        <div>
                            <dt className="font-semibold text-[#555]">Вакансия</dt>
                            <dd className="text-[#333]">{item.position}</dd>
                        </div>
                    )}
                </dl>

                {item.message && (
                    <div className="mt-6 rounded-xl bg-[#f8f8f8] p-4">
                        <p className="text-[13px] font-semibold uppercase tracking-wide text-[#777]">Сообщение</p>
                        <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-[#333]">{item.message}</p>
                    </div>
                )}

                {type === "vacancy" && item.resume_url && (
                    <a
                        href={item.resume_url}
                        className="btn-fill mt-6 inline-flex h-[44px] items-center justify-center bg-white px-5 text-[13px] font-semibold"
                    >
                        <span className="relative z-10">Скачать резюме{item.resume_name ? `: ${item.resume_name}` : ""}</span>
                    </a>
                )}
            </div>
        </div>
    );
}

function InboxSection({
    title,
    description,
    items,
    type,
    onStatusChange,
    columns,
    renderExtra,
    onOpen,
}) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [statusDrafts, setStatusDrafts] = useState({});
    const [updatingId, setUpdatingId] = useState(null);

    const filteredItems = useMemo(() => {
        const query = search.trim().toLowerCase();
        let result = [...items];

        if (statusFilter !== "all") {
            result = result.filter((item) => item.status === statusFilter);
        }

        if (query) {
            result = result.filter((item) => {
                const haystack = [item.name, item.email, item.phone, item.message, item.position]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                return haystack.includes(query);
            });
        }

        return result;
    }, [items, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    const paginatedItems = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredItems, page]);

    return (
        <section className="rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
            <div>
                <h2 className="text-[28px] font-semibold text-[#1b1b1b]">{title}</h2>
                <p className="mt-2 text-[14px] text-[#666]">{description}</p>
                <p className="mt-1 text-[13px] font-medium text-[#999]">
                    Всего: {items.length}
                    {items.filter((item) => item.status === "new").length > 0 && (
                        <span className="ml-2 text-[#FA4234]">
                            · новых: {items.filter((item) => item.status === "new").length}
                        </span>
                    )}
                </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                    placeholder="Поиск..."
                    className="h-[42px] w-[240px] border border-[#f4a8a2] bg-white px-3 text-[15px]"
                />
                <select
                    value={statusFilter}
                    onChange={(event) => {
                        setStatusFilter(event.target.value);
                        setPage(1);
                    }}
                    className="h-[42px] w-[180px] border border-[#f4a8a2] bg-white px-3 text-[15px]"
                >
                    <option value="all">Все статусы</option>
                    <option value="new">Новые</option>
                    <option value="processed">Обработанные</option>
                </select>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-[#ececec]">
                <div className={`hidden bg-[#f8f8f8] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#777] md:grid ${columns}`}>
                    <p>№</p>
                    <p>Клиент</p>
                    {renderExtra?.header}
                    <p>Сообщение</p>
                    <p>Дата</p>
                    <p>Статус</p>
                </div>

                {paginatedItems.length > 0 ? (
                    paginatedItems.map((item) => (
                        <div
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => onOpen(item, type)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    onOpen(item, type);
                                }
                            }}
                            className={`cursor-pointer border-t border-[#efefef] px-5 py-4 transition-colors hover:bg-[#fff8f7] md:grid md:items-center ${columns}`}
                        >
                            <p className="text-[15px] font-semibold text-[#1f1f1f]">#{item.id}</p>
                            <div className="mt-2 min-w-0 md:mt-0" title={`${item.name} · ${item.email}`}>
                                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold text-[#1f1f1f]">
                                    {clipText(item.name, 18)}
                                </p>
                                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-[#666]">
                                    {clipText(item.email, 22)}
                                </p>
                            </div>
                            {renderExtra?.cell(item)}
                            <p
                                className="mt-2 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] text-[#3a3a3a] md:mt-0"
                                title={item.message || "—"}
                            >
                                {clipText(item.message || "—", 32)}
                            </p>
                            <p className="mt-2 whitespace-nowrap text-[13px] text-[#666] md:mt-0">{item.created_at}</p>
                            <div
                                className="mt-2 cursor-default md:mt-0"
                                onClick={(event) => event.stopPropagation()}
                                onKeyDown={(event) => event.stopPropagation()}
                            >
                                <div className="flex items-center gap-2">
                                    <select
                                        value={statusDrafts[item.id] ?? item.status}
                                        onChange={(event) =>
                                            setStatusDrafts((prev) => ({ ...prev, [item.id]: event.target.value }))
                                        }
                                        className="h-[36px] w-[130px] border border-[#FA4234] bg-white px-2 text-[13px] outline-none"
                                    >
                                        <option value="new">{statusLabels.new}</option>
                                        <option value="processed">{statusLabels.processed}</option>
                                    </select>
                                    <button
                                        type="button"
                                        disabled={updatingId === item.id}
                                        onClick={async () => {
                                            setUpdatingId(item.id);
                                            try {
                                                await onStatusChange(item.id, statusDrafts[item.id] ?? item.status);
                                            } finally {
                                                setUpdatingId(null);
                                            }
                                        }}
                                        className="btn-fill h-[36px] w-[88px] bg-white text-[12px] font-semibold"
                                    >
                                        <span className="relative z-10">{updatingId === item.id ? "…" : "OK"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="px-5 py-10 text-center text-[15px] text-[#777]">Обращений пока нет</p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        className="h-[36px] min-w-[36px] border border-[#ececec] px-3 text-[14px] disabled:opacity-40"
                    >
                        ‹
                    </button>
                    <span className="text-[14px] text-[#666]">
                        {page} / {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        className="h-[36px] min-w-[36px] border border-[#ececec] px-3 text-[14px] disabled:opacity-40"
                    >
                        ›
                    </button>
                </div>
            )}
        </section>
    );
}

function ManagerInbox() {
    const { data, loading, reload } = useApiQuery(() => api.manager.inbox().then((response) => response.data), []);
    const feedback = Array.isArray(data?.feedback) ? data.feedback : [];
    const vacancies = Array.isArray(data?.vacancyApplications) ? data.vacancyApplications : [];
    const [success, setSuccess] = useState("");
    const [modal, setModal] = useState({ item: null, type: null });

    const openModal = (item, type) => setModal({ item, type });
    const closeModal = () => setModal({ item: null, type: null });

    const handleFeedbackStatus = async (id, status) => {
        const response = await api.manager.updateFeedbackStatus(id, status);
        setSuccess(response.message || "Статус обращения обновлен");
        await reload();
    };

    const handleVacancyStatus = async (id, status) => {
        const response = await api.manager.updateVacancyStatus(id, status);
        setSuccess(response.message || "Статус отклика обновлен");
        await reload();
    };

    if (loading) {
        return (
            <main className="mx-auto w-full max-w-[1360px] px-6 py-10">
                <p className="text-[16px] text-[#666]">Загрузка…</p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-[1360px] px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-[34px] font-semibold text-[#1b1b1b]">Обращения клиентов</h1>
                    <p className="mt-2 text-[15px] text-[#666]">
                        Обратная связь и отклики на вакансии — всё в одном месте
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/manager/content"
                        className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Контент сайта</span>
                    </Link>
                    <Link
                        to="/manager"
                        className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">← Каталог продукции</span>
                    </Link>
                </div>
            </div>

            {success && (
                <div className="mt-5 rounded-xl border border-[#FA4234] bg-[#fff4f2] px-4 py-3 text-[14px] text-[#FA4234]">
                    {success}
                </div>
            )}

            <div className="mt-8 space-y-8">
                <InboxSection
                    title="Обратная связь"
                    description="Сообщения со страницы «Контакты»"
                    items={feedback}
                    type="feedback"
                    onStatusChange={handleFeedbackStatus}
                    columns="md:grid-cols-[56px_minmax(0,1fr)_minmax(0,1.2fr)_120px_200px]"
                    onOpen={openModal}
                />

                <InboxSection
                    title="Отклики на вакансии"
                    description="Заявки с резюме со страницы «Вакансии»"
                    items={vacancies}
                    type="vacancy"
                    onStatusChange={handleVacancyStatus}
                    columns="md:grid-cols-[56px_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)_120px_200px]"
                    renderExtra={{
                        header: <p>Вакансия</p>,
                        cell: (item) => (
                            <p
                                className="mt-2 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] text-[#3a3a3a] md:mt-0"
                                title={item.position || "—"}
                            >
                                {clipText(item.position || "—", 24)}
                            </p>
                        ),
                    }}
                    onOpen={openModal}
                />
            </div>

            <InboxDetailModal item={modal.item} type={modal.type} onClose={closeModal} />
        </main>
    );
}

export default ManagerInbox;
