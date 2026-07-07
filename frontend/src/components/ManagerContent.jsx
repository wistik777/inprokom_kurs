import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "../api/client";
import { useApiQuery } from "../hooks/useApiQuery";
import { clipText } from "../utils/clipText";

const NEWS_PER_PAGE = 8;
const VACANCIES_PER_PAGE = 6;

const inputClass =
    "h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none focus:ring-2 focus:ring-[#FA4234]/20";
const textareaClass =
    "w-full rounded-md border border-[#FA4234] bg-white px-3 py-2 text-[15px] outline-none focus:ring-2 focus:ring-[#FA4234]/20";
const labelClass = "mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]";
const NEWS_TITLE_PREVIEW_LENGTH = 52;
const NEWS_CONTENT_PREVIEW_LENGTH = 72;

const newsStatusMeta = {
    live: { label: "На сайте", className: "bg-[#e8f7ee] text-[#1a7f4b]" },
    scheduled: { label: "Запланирована", className: "bg-[#fff4e8] text-[#c45a00]" },
    hidden: { label: "Скрыта", className: "bg-[#f3f3f3] text-[#777]" },
};

function readNewsForm(form) {
    const formData = new FormData(form);

    return {
        title: String(formData.get("title") || ""),
        published_at: String(formData.get("published_at") || "") || null,
        content_text: String(formData.get("content_text") || ""),
        is_published: formData.get("is_published") === "1",
    };
}

function readVacancyForm(form) {
    const formData = new FormData(form);

    return {
        title: String(formData.get("title") || ""),
        department: String(formData.get("department") || ""),
        experience: String(formData.get("experience") || ""),
        schedule: String(formData.get("schedule") || ""),
        published_at: String(formData.get("published_at") || "") || null,
        short: String(formData.get("short") || ""),
        duties_text: String(formData.get("duties_text") || ""),
        requirements_text: String(formData.get("requirements_text") || ""),
        is_active: formData.get("is_active") === "1",
    };
}

function getMinDateTimeLocal() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function PublishToggle({ name, defaultChecked, label, hint }) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#ececec] bg-[#fafafa] px-4 py-4">
            <div>
                <p className="text-[14px] font-semibold text-[#1b1b1b]">{label}</p>
                {hint && <p className="mt-1 text-[12px] leading-relaxed text-[#888]">{hint}</p>}
            </div>
            <label className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center">
                <input
                    type="checkbox"
                    name={name}
                    value="1"
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-[#d9d9d9] transition-colors duration-300 peer-checked:bg-[#FA4234] peer-focus-visible:ring-2 peer-focus-visible:ring-[#FA4234]/30" />
                <span className="absolute left-1 h-6 w-6 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18)] transition-transform duration-300 peer-checked:translate-x-6" />
            </label>
        </div>
    );
}

function NewsStatusBadge({ status }) {
    const meta = newsStatusMeta[status] || newsStatusMeta.hidden;

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${meta.className}`}>
            {meta.label}
        </span>
    );
}

function ContentPagination({ currentPage, totalPages, onPageChange }) {
    const visiblePages = useMemo(() => {
        let start = Math.max(1, currentPage - 1);
        let end = Math.min(totalPages, start + 2);

        if (end - start < 2) {
            start = Math.max(1, end - 2);
        }

        return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
    }, [currentPage, totalPages]);

    if (totalPages <= 1) {
        return null;
    }

    const goToPage = (page) => onPageChange(Math.min(totalPages, Math.max(1, page)));

    return (
        <div className="mt-7 flex flex-col items-center">
            <div className="flex items-center gap-4 text-[22px]">
                <button type="button" onClick={() => goToPage(1)} className="cursor-pointer transition-colors hover:text-[#FA4234]">
                    В начало
                </button>
                <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    className="cursor-pointer text-[26px] transition-colors hover:text-[#FA4234]"
                    aria-label="Предыдущая страница"
                >
                    &#8249;
                </button>
                <div className="flex items-center gap-2.5">
                    {visiblePages.map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => goToPage(page)}
                            className={`cursor-pointer transition-colors ${
                                currentPage === page ? "text-[#FA4234]" : "text-black hover:text-[#FA4234]"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    className="cursor-pointer text-[26px] transition-colors hover:text-[#FA4234]"
                    aria-label="Следующая страница"
                >
                    &#8250;
                </button>
                <button type="button" onClick={() => goToPage(totalPages)} className="cursor-pointer transition-colors hover:text-[#FA4234]">
                    В конец
                </button>
            </div>
            <div className="mt-1.5 h-[2px] w-full max-w-[700px] bg-[#FA4234]" />
        </div>
    );
}

function ConfirmDeleteModal({ title, name, onConfirm, onClose, submitting = false }) {
    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4" onClick={onClose}>
            <div
                className="w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                onClick={(event) => event.stopPropagation()}
            >
                <h3 className="text-[26px] font-semibold text-[#1b1b1b]">{title}</h3>
                <p className="mt-3 text-[16px] text-[#444]">
                    Точно ли вы хотите удалить <span className="font-semibold">«{name}»</span>?
                </p>
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-fill h-[44px] min-w-[140px] bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Отмена</span>
                    </button>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={onConfirm}
                        className="h-[44px] min-w-[140px] border-2 border-[#FA4234] bg-[#FA4234] px-5 py-2 text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-[#FA4234]"
                    >
                        {submitting ? "Удаление…" : "Удалить"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function NewsDetailModal({ item, onClose, onEdit, onDelete }) {
    if (!item) return null;

    const contentText = String(item.content_text ?? "").trim();
    const paragraphs = contentText
        ? contentText.split(/\n+/).map((part) => part.trim()).filter(Boolean)
        : [];

    return (
        <div
            className="fixed inset-0 z-[85] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
            role="presentation"
        >
            <div
                className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#FA4234]">Новость #{item.id}</p>
                        <h3 className="mt-1 text-[24px] font-semibold leading-snug text-[#1b1b1b]">{item.title}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#ececec] text-[22px] leading-none text-[#666] transition hover:border-[#FA4234] hover:text-[#FA4234]"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <dl className="mt-6 grid gap-3 text-[15px] sm:grid-cols-2">
                    <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#777]">Дата публикации</dt>
                        <dd className="mt-1 text-[#333]">{item.published_at_label || item.display_date}</dd>
                    </div>
                    <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#777]">Статус</dt>
                        <dd className="mt-1">
                            <NewsStatusBadge status={item.publication_status} />
                        </dd>
                    </div>
                    <div>
                        <dt className="text-[12px] font-semibold uppercase tracking-wide text-[#777]">Обновлено</dt>
                        <dd className="mt-1 text-[#333]">{item.updated_at || "—"}</dd>
                    </div>
                </dl>

                <div className="mt-6 rounded-xl bg-[#f8f8f8] p-4">
                    <p className="text-[13px] font-semibold uppercase tracking-wide text-[#777]">Текст новости</p>
                    {paragraphs.length > 0 ? (
                        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#333]">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-3 text-[15px] leading-relaxed text-[#666]">
                            Текст не задан — на сайте будет использован шаблонный текст по заголовку.
                        </p>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        to={`/manager/content/news/${item.id}/preview`}
                        className="btn-fill inline-flex h-[44px] items-center justify-center bg-white px-5 text-[13px] font-semibold"
                    >
                        <span className="relative z-10">Предпросмотр</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onEdit(item);
                        }}
                        className="btn-fill inline-flex h-[44px] items-center justify-center bg-white px-5 text-[13px] font-semibold"
                    >
                        <span className="relative z-10">Изменить</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onDelete(item);
                        }}
                        className="inline-flex h-[44px] items-center justify-center border border-[#FA4234] px-5 text-[13px] font-semibold text-[#FA4234] transition hover:bg-[#FA4234] hover:text-white"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
}

function NewsFormModal({ item, onClose, errors, oldValues, onSubmit, submitting = false }) {
    const isEdit = Boolean(item);
    const defaults = isEdit
        ? item
        : {
              title: oldValues.title || "",
              published_at_input: oldValues.published_at || "",
              content_text: oldValues.content_text || "",
              is_published: oldValues.is_published !== undefined ? oldValues.is_published : true,
          };

    const minDateTime = useMemo(() => {
        if (isEdit && defaults.published_at_input) {
            const parsed = new Date(defaults.published_at_input);
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            if (parsed < todayStart) {
                return defaults.published_at_input.slice(0, 16);
            }
        }

        return getMinDateTimeLocal();
    }, [isEdit, defaults.published_at_input]);

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-6" onClick={onClose}>
            <div
                className="max-h-[92vh] w-full max-w-[920px] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-[30px] font-semibold text-[#1b1b1b]">
                        {isEdit ? "Редактирование новости" : "Добавление новости"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#ececec] text-[20px] leading-none text-[#666] transition hover:border-[#FA4234] hover:text-[#FA4234]"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={async (event) => {
                        event.preventDefault();
                        await onSubmit(readNewsForm(event.currentTarget), item);
                    }}
                    className="mt-5 space-y-4"
                >

                    <div>
                        <label className={labelClass}>Заголовок</label>
                        <input type="text" name="title" defaultValue={defaults.title} className={inputClass} required />
                        {errors.title && <p className="mt-1 text-[13px] text-red-500">{errors.title[0]}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Дата и время публикации</label>
                        <input
                            type="datetime-local"
                            name="published_at"
                            defaultValue={defaults.published_at_input || oldValues.published_at || ""}
                            min={minDateTime}
                            className={inputClass}
                        />
                        <p className="mt-2 text-[12px] leading-relaxed text-[#888]">
                            Оставьте пустым — новость будет опубликована сразу в текущий момент. Укажите будущую дату и время
                            для отложенной публикации.
                        </p>
                        {errors.published_at && <p className="mt-1 text-[13px] text-red-500">{errors.published_at[0]}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Текст новости</label>
                        <textarea
                            name="content_text"
                            rows={8}
                            defaultValue={defaults.content_text || ""}
                            placeholder="Введите текст новости. Каждая новая строка будет отдельным абзацем на сайте."
                            className={textareaClass}
                        />
                        {errors.content_text && <p className="mt-1 text-[13px] text-red-500">{errors.content_text[0]}</p>}
                    </div>

                    <PublishToggle
                        name="is_published"
                        defaultChecked={isEdit ? defaults.is_published : defaults.is_published !== false}
                        label="Опубликовано на сайте"
                        hint="Выключите, чтобы сохранить новость как черновик без показа на сайте."
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-fill h-[44px] min-w-[210px] bg-white px-6 py-2.5 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">
                            {submitting ? "Сохранение…" : isEdit ? "Сохранить изменения" : "Добавить новость"}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}

function VacancyFormModal({ item, onClose, errors, oldValues, onSubmit, submitting = false }) {
    const isEdit = Boolean(item);
    const defaults = isEdit
        ? item
        : {
              title: oldValues.title || "",
              department: oldValues.department || "",
              experience: oldValues.experience || "",
              schedule: oldValues.schedule || "Полный день",
              published_at_input: oldValues.published_at || "",
              short: oldValues.short || "",
              duties_text: oldValues.duties_text || "",
              requirements_text: oldValues.requirements_text || "",
              is_active: oldValues.is_active !== undefined ? oldValues.is_active : true,
          };

    const minDateTime = useMemo(() => {
        if (isEdit && defaults.published_at_input) {
            const parsed = new Date(defaults.published_at_input);
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            if (parsed < todayStart) {
                return defaults.published_at_input.slice(0, 16);
            }
        }

        return getMinDateTimeLocal();
    }, [isEdit, defaults.published_at_input]);

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-6" onClick={onClose}>
            <div
                className="max-h-[92vh] w-full max-w-[920px] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-[30px] font-semibold text-[#1b1b1b]">
                        {isEdit ? "Редактирование вакансии" : "Добавление вакансии"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#ececec] text-[20px] leading-none text-[#666] transition hover:border-[#FA4234] hover:text-[#FA4234]"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <form
                    onSubmit={async (event) => {
                        event.preventDefault();
                        await onSubmit(readVacancyForm(event.currentTarget), item);
                    }}
                    className="mt-5 space-y-4"
                >

                    <div>
                        <label className={labelClass}>Название</label>
                        <input type="text" name="title" defaultValue={defaults.title} className={inputClass} required />
                        {errors.title && <p className="mt-1 text-[13px] text-red-500">{errors.title[0]}</p>}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Подразделение</label>
                            <input type="text" name="department" defaultValue={defaults.department} className={inputClass} required />
                            {errors.department && <p className="mt-1 text-[13px] text-red-500">{errors.department[0]}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Опыт</label>
                            <input type="text" name="experience" defaultValue={defaults.experience || ""} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>График</label>
                            <input type="text" name="schedule" defaultValue={defaults.schedule || ""} className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Дата и время публикации</label>
                        <input
                            type="datetime-local"
                            name="published_at"
                            defaultValue={defaults.published_at_input || oldValues.published_at || ""}
                            min={minDateTime}
                            className={inputClass}
                        />
                        <p className="mt-2 text-[12px] leading-relaxed text-[#888]">
                            Оставьте пустым — вакансия будет опубликована сразу. Укажите будущую дату для отложенной публикации.
                        </p>
                        {errors.published_at && <p className="mt-1 text-[13px] text-red-500">{errors.published_at[0]}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Краткое описание</label>
                        <textarea name="short" rows={3} defaultValue={defaults.short} className={textareaClass} required />
                        {errors.short && <p className="mt-1 text-[13px] text-red-500">{errors.short[0]}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Обязанности</label>
                        <textarea
                            name="duties_text"
                            rows={5}
                            defaultValue={defaults.duties_text || ""}
                            placeholder="Каждый пункт с новой строки"
                            className={textareaClass}
                            required
                        />
                        {errors.duties_text && <p className="mt-1 text-[13px] text-red-500">{errors.duties_text[0]}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Требования</label>
                        <textarea
                            name="requirements_text"
                            rows={5}
                            defaultValue={defaults.requirements_text || ""}
                            placeholder="Каждый пункт с новой строки"
                            className={textareaClass}
                            required
                        />
                        {errors.requirements_text && <p className="mt-1 text-[13px] text-red-500">{errors.requirements_text[0]}</p>}
                    </div>

                    <PublishToggle
                        name="is_active"
                        defaultChecked={isEdit ? defaults.is_active : defaults.is_active !== false}
                        label="Активна на странице вакансий"
                        hint="Выключите, чтобы скрыть вакансию с сайта без удаления."
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-fill h-[44px] min-w-[210px] bg-white px-6 py-2.5 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">
                            {submitting ? "Сохранение…" : isEdit ? "Сохранить изменения" : "Добавить вакансию"}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}

const ManagerContent = () => {
    const { data, loading, reload } = useApiQuery(() => api.manager.content().then((response) => response.data), []);
    const newsPosts = Array.isArray(data?.newsPosts) ? data.newsPosts : [];
    const vacancies = Array.isArray(data?.vacancies) ? data.vacancies : [];
    const [success, setSuccess] = useState(null);
    const [errors, setErrors] = useState({});
    const [oldValues, setOldValues] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const [activeTab, setActiveTab] = useState("news");
    const [newsSearch, setNewsSearch] = useState("");
    const [vacancySearch, setVacancySearch] = useState("");
    const [newsModal, setNewsModal] = useState(null);
    const [newsView, setNewsView] = useState(null);
    const [vacancyModal, setVacancyModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [newsPage, setNewsPage] = useState(1);
    const [vacancyPage, setVacancyPage] = useState(1);

    const filteredNews = useMemo(() => {
        const query = newsSearch.trim().toLowerCase();
        if (!query) return newsPosts;
        return newsPosts.filter(
            (item) => item.title.toLowerCase().includes(query) || item.display_date.toLowerCase().includes(query)
        );
    }, [newsPosts, newsSearch]);

    const filteredVacancies = useMemo(() => {
        const query = vacancySearch.trim().toLowerCase();
        if (!query) return vacancies;
        return vacancies.filter(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                item.department.toLowerCase().includes(query) ||
                item.short.toLowerCase().includes(query)
        );
    }, [vacancies, vacancySearch]);

    const newsTotalPages = Math.max(1, Math.ceil(filteredNews.length / NEWS_PER_PAGE));
    const vacancyTotalPages = Math.max(1, Math.ceil(filteredVacancies.length / VACANCIES_PER_PAGE));

    const paginatedNews = useMemo(() => {
        const start = (newsPage - 1) * NEWS_PER_PAGE;
        return filteredNews.slice(start, start + NEWS_PER_PAGE);
    }, [filteredNews, newsPage]);

    const paginatedVacancies = useMemo(() => {
        const start = (vacancyPage - 1) * VACANCIES_PER_PAGE;
        return filteredVacancies.slice(start, start + VACANCIES_PER_PAGE);
    }, [filteredVacancies, vacancyPage]);

    useEffect(() => {
        setNewsPage(1);
    }, [newsSearch]);

    useEffect(() => {
        setVacancyPage(1);
    }, [vacancySearch]);

    useEffect(() => {
        if (newsPage > newsTotalPages) {
            setNewsPage(newsTotalPages);
        }
    }, [newsPage, newsTotalPages]);

    useEffect(() => {
        if (vacancyPage > vacancyTotalPages) {
            setVacancyPage(vacancyTotalPages);
        }
    }, [vacancyPage, vacancyTotalPages]);

    const openCreateNews = Object.keys(oldValues).length > 0 && !oldValues.id && activeTab === "news";
    const openCreateVacancy = Object.keys(oldValues).length > 0 && !oldValues.id && activeTab === "vacancies";

    const handleSaveNews = async (payload, item) => {
        setSubmitting(true);
        setErrors({});

        try {
            const response = item
                ? await api.manager.updateNews(item.id, payload)
                : await api.manager.createNews(payload);
            setSuccess(response.message || "Новость сохранена");
            setNewsModal(null);
            setOldValues({});
            await reload();
        } catch (error) {
            if (error instanceof ApiError && error.errors) {
                setErrors(error.errors);
                setOldValues(payload);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveVacancy = async (payload, item) => {
        setSubmitting(true);
        setErrors({});

        try {
            const response = item
                ? await api.manager.updateVacancy(item.id, payload)
                : await api.manager.createVacancy(payload);
            setSuccess(response.message || "Вакансия сохранена");
            setVacancyModal(null);
            setOldValues({});
            await reload();
        } catch (error) {
            if (error instanceof ApiError && error.errors) {
                setErrors(error.errors);
                setOldValues(payload);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTarget = async () => {
        if (!deleteTarget) return;

        setSubmitting(true);

        try {
            const response =
                deleteTarget.type === "news"
                    ? await api.manager.deleteNews(deleteTarget.id)
                    : await api.manager.deleteVacancy(deleteTarget.id);
            setSuccess(response.message || "Удалено");
            setDeleteTarget(null);
            await reload();
        } catch (error) {
            if (error instanceof ApiError && error.errors) {
                setErrors(error.errors);
            }
        } finally {
            setSubmitting(false);
        }
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
                    <p className="text-[12px] font-semibold uppercase tracking-wide text-[#FA4234]">Панель менеджера</p>
                    <h1 className="text-[34px] font-semibold text-[#1b1b1b]">Контент сайта</h1>
                    <p className="mt-1 max-w-[640px] text-[15px] text-[#666]">
                        Управление новостями пресс-центра и вакансиями. Изменения сразу отображаются на публичных страницах.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/manager"
                        className="btn-fill inline-flex h-[44px] min-w-[170px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">К каталогу продукции</span>
                    </Link>
                    <Link
                        to="/manager/inbox"
                        className="btn-fill inline-flex h-[44px] min-w-[170px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Обращения клиентов</span>
                    </Link>
                </div>
            </div>

            {success && (
                <div className="mt-5 rounded-xl border border-[#FA4234] bg-[#fff4f2] px-4 py-3 text-[14px] text-[#FA4234]">
                    {success}
                </div>
            )}

            <div className="mt-8 flex flex-wrap gap-2">
                {[
                    { id: "news", label: "Новости", count: newsPosts.length },
                    { id: "vacancies", label: "Вакансии", count: vacancies.length },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition ${
                            activeTab === tab.id
                                ? "bg-[#FA4234] text-white shadow-[0_8px_20px_rgba(250,66,52,0.25)]"
                                : "border border-[#ececec] bg-white text-[#333] hover:border-[#FA4234] hover:text-[#FA4234]"
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {activeTab === "news" && (
                <section className="mt-6 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-[28px] font-semibold text-[#1b1b1b]">Новости пресс-центра</h2>
                        <button
                            type="button"
                            onClick={() => setNewsModal("create")}
                            className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                        >
                            <span className="relative z-10">Добавить новость</span>
                        </button>
                    </div>

                    <div className="mt-5">
                        <input
                            type="search"
                            value={newsSearch}
                            onChange={(event) => setNewsSearch(event.target.value)}
                            placeholder="Поиск по заголовку или дате"
                            className="h-[44px] w-full max-w-[420px] rounded-md border border-[#ececec] bg-[#fafafa] px-4 text-[15px] outline-none focus:border-[#FA4234]"
                        />
                    </div>

                    <div className="mt-5 overflow-hidden rounded-xl border border-[#efefef]">
                        <div className="hidden grid-cols-[70px_minmax(0,1.6fr)_120px_110px_200px] bg-[#f8f8f8] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#777] lg:grid">
                            <p>ID</p>
                            <p>Заголовок</p>
                            <p>Дата</p>
                            <p>Статус</p>
                            <p>Действия</p>
                        </div>

                        {filteredNews.length > 0 ? (
                            paginatedNews.map((item) => (
                                <div
                                    key={item.id}
                                    className="border-t border-[#efefef] px-5 py-4 lg:grid lg:grid-cols-[70px_minmax(0,1.6fr)_120px_110px_200px] lg:items-center"
                                >
                                    <p className="text-[15px] text-[#888]">{item.id}</p>
                                    <div className="mt-2 min-w-0 lg:mt-0">
                                        <button
                                            type="button"
                                            onClick={() => setNewsView(item)}
                                            className="group w-full min-w-0 text-left"
                                            title="Открыть новость полностью"
                                        >
                                            <p className="text-[15px] font-semibold text-[#1f1f1f] transition group-hover:text-[#FA4234]">
                                                {clipText(item.title, NEWS_TITLE_PREVIEW_LENGTH)}
                                            </p>
                                            {item.content_text && (
                                                <p className="mt-1 text-[13px] leading-snug text-[#888]">
                                                    {clipText(item.content_text.replace(/\s+/g, " "), NEWS_CONTENT_PREVIEW_LENGTH)}
                                                </p>
                                            )}
                                            <p className="mt-1 text-[11px] font-medium text-[#FA4234] opacity-70 transition group-hover:opacity-100">
                                                Нажмите для просмотра
                                            </p>
                                        </button>
                                        <p className="mt-1 text-[12px] text-[#999] lg:hidden">Обновлено: {item.updated_at || "—"}</p>
                                    </div>
                                    <p className="mt-2 shrink-0 text-[14px] text-[#555] lg:mt-0">{item.display_date}</p>
                                    <p className="mt-2 lg:mt-0">
                                        <NewsStatusBadge status={item.publication_status} />
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2 lg:mt-0">
                                        <button
                                            type="button"
                                            onClick={() => setNewsModal(item)}
                                            className="btn-fill inline-flex h-[34px] min-w-[110px] items-center justify-center bg-white px-3 text-[13px] font-semibold"
                                        >
                                            <span className="relative z-10">Изменить</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeleteTarget({
                                                    type: "news",
                                                    id: item.id,
                                                    name: item.title,
                                                })
                                            }
                                            className="inline-flex h-[34px] min-w-[110px] items-center justify-center border border-[#FA4234] px-3 text-[13px] font-semibold text-[#FA4234] transition hover:bg-[#FA4234] hover:text-white"
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="border-t border-[#efefef] px-5 py-10 text-center text-[15px] text-[#777]">
                                {newsPosts.length === 0 ? "Новостей пока нет — добавьте первую." : "По запросу ничего не найдено."}
                            </div>
                        )}
                    </div>

                    <ContentPagination currentPage={newsPage} totalPages={newsTotalPages} onPageChange={setNewsPage} />
                </section>
            )}

            {activeTab === "vacancies" && (
                <section className="mt-6 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-[28px] font-semibold text-[#1b1b1b]">Вакансии</h2>
                        <button
                            type="button"
                            onClick={() => setVacancyModal("create")}
                            className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                        >
                            <span className="relative z-10">Добавить вакансию</span>
                        </button>
                    </div>

                    <div className="mt-5">
                        <input
                            type="search"
                            value={vacancySearch}
                            onChange={(event) => setVacancySearch(event.target.value)}
                            placeholder="Поиск по названию, отделу или описанию"
                            className="h-[44px] w-full max-w-[420px] rounded-md border border-[#ececec] bg-[#fafafa] px-4 text-[15px] outline-none focus:border-[#FA4234]"
                        />
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        {filteredVacancies.length > 0 ? (
                            paginatedVacancies.map((item) => (
                                <article
                                    key={item.id}
                                    className="overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_8px_22px_rgba(0,0,0,0.04)]"
                                >
                                    <div
                                        className="relative h-[120px] bg-cover bg-center"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(135deg, rgba(250,66,52,0.85), rgba(24,24,24,0.75)), url(/img/cart_fon.png)",
                                        }}
                                    >
                                        <div className="absolute inset-0 flex flex-col justify-end p-4">
                                            <p className="text-[12px] font-semibold uppercase tracking-wide text-white/80">
                                                {item.department}
                                            </p>
                                            <h3 className="text-[20px] font-semibold text-white">{item.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-[14px] leading-relaxed text-[#555]">{clipText(item.short, 140)}</p>
                                        <div className="mt-3 flex flex-wrap gap-2 text-[12px] text-[#777]">
                                            {item.experience && <span className="rounded-full bg-[#f5f5f5] px-3 py-1">{item.experience}</span>}
                                            {item.schedule && <span className="rounded-full bg-[#f5f5f5] px-3 py-1">{item.schedule}</span>}
                                            <NewsStatusBadge status={item.publication_status} />
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setVacancyModal(item)}
                                                className="btn-fill inline-flex h-[36px] min-w-[120px] items-center justify-center bg-white px-4 text-[13px] font-semibold"
                                            >
                                                <span className="relative z-10">Изменить</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setDeleteTarget({
                                                        type: "vacancy",
                                                        id: item.id,
                                                        name: item.title,
                                                    })
                                                }
                                                className="inline-flex h-[36px] min-w-[120px] items-center justify-center border border-[#FA4234] px-4 text-[13px] font-semibold text-[#FA4234] transition hover:bg-[#FA4234] hover:text-white"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="lg:col-span-2 rounded-xl border border-dashed border-[#ddd] px-5 py-12 text-center text-[15px] text-[#777]">
                                {vacancies.length === 0 ? "Вакансий пока нет — добавьте первую." : "По запросу ничего не найдено."}
                            </div>
                        )}
                    </div>

                    <ContentPagination currentPage={vacancyPage} totalPages={vacancyTotalPages} onPageChange={setVacancyPage} />
                </section>
            )}

            {(newsModal === "create" || (newsModal && newsModal !== "create")) && (
                <NewsFormModal
                    item={newsModal === "create" ? null : newsModal}
                    onClose={() => setNewsModal(null)}
                    errors={errors}
                    oldValues={openCreateNews ? oldValues : {}}
                    onSubmit={handleSaveNews}
                    submitting={submitting}
                />
            )}

            {newsView && (
                <NewsDetailModal
                    item={newsView}
                    onClose={() => setNewsView(null)}
                    onEdit={(item) => setNewsModal(item)}
                    onDelete={(item) =>
                        setDeleteTarget({
                            type: "news",
                            id: item.id,
                            name: item.title,
                        })
                    }
                />
            )}

            {(vacancyModal === "create" || (vacancyModal && vacancyModal !== "create")) && (
                <VacancyFormModal
                    item={vacancyModal === "create" ? null : vacancyModal}
                    onClose={() => setVacancyModal(null)}
                    errors={errors}
                    oldValues={openCreateVacancy ? oldValues : {}}
                    onSubmit={handleSaveVacancy}
                    submitting={submitting}
                />
            )}

            {deleteTarget && (
                <ConfirmDeleteModal
                    title={deleteTarget.type === "news" ? "Удаление новости" : "Удаление вакансии"}
                    name={deleteTarget.name}
                    onConfirm={handleDeleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    submitting={submitting}
                />
            )}
        </main>
    );
};

export default ManagerContent;
