import React, { useMemo, useState } from "react";
import VacancyCard from "./vacancies/VacancyCard";
import { applyPhoneMask } from "../utils/phoneMask";
import { vacancies, vacancyBenefits, VACANCY_PAGE_SIZE } from "../data/vacanciesData";

function Vacancies() {
    const [visibleCount, setVisibleCount] = useState(VACANCY_PAGE_SIZE);
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const filteredVacancies = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return vacancies;
        }

        return vacancies.filter(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                item.department.toLowerCase().includes(query) ||
                item.short.toLowerCase().includes(query)
        );
    }, [search]);

    const visibleVacancies = filteredVacancies.slice(0, visibleCount);
    const canLoadMore = visibleCount < filteredVacancies.length;

    const scrollToForm = () => {
        document.getElementById("vacancy-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleApply = (vacancy) => {
        setForm((prev) => ({ ...prev, position: vacancy.title }));
        setSelectedVacancy(null);
        scrollToForm();
    };

    const handleChange = (field) => (event) => {
        const value = field === "phone" ? applyPhoneMask(event.target.value) : event.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", position: "", message: "" });
    };

    const inputClass =
        "w-full border border-white/20 bg-white/10 px-5 py-4 text-[16px] text-white outline-none placeholder:text-white/50 focus:border-[#FA4234]";

    return (
        <div>
            <section
                className="hero-under-header min-h-[360px] items-end bg-cover bg-center min-[426px]:min-h-[420px]"
                style={{ backgroundImage: "url('/img/cart_fon.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/90 via-[#FA4234]/85 to-[#c92e22]/80" />
                <div className="relative z-10 page-container w-full pb-10 pt-4 min-[426px]:pb-14 min-[426px]:pt-8">
                    <p className="text-[12px] uppercase tracking-[0.2em] text-white/80 min-[426px]:text-[14px]">Карьера в НПП Инпроком</p>
                    <h1 className="section-title mt-3 max-w-[900px] text-white">
                        Вакансии
                    </h1>
                    <p className="mt-5 max-w-[760px] text-[16px] leading-relaxed text-white/90 min-[426px]:text-[18px] lg:text-[20px]">
                        Мы создаем рабочие места и развиваем научно-технический потенциал страны. Присоединяйтесь
                        к команде инженеров, технологов и специалистов, которые выпускают высокотехнологичную
                        продукцию полного цикла — от разработки до серийного производства.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <button
                            type="button"
                            onClick={scrollToForm}
                            className="btn-fill inline-flex h-[52px] min-w-[260px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                        >
                            <span className="relative z-10">Отправить резюме</span>
                        </button>
                        <a
                            href="/about-company"
                            className="inline-flex h-[52px] min-w-[240px] items-center justify-center border-2 border-white/60 px-6 text-[14px] uppercase tracking-widest text-white transition hover:border-white hover:bg-white/10"
                        >
                            О компании
                        </a>
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <h2 className="text-center text-[26px] font-bold uppercase text-[#181818] min-[426px]:text-[32px] lg:text-[36px]">Почему Инпроком</h2>
                    <div className="mt-8 grid gap-5 min-[426px]:mt-12 min-[426px]:gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {vacancyBenefits.map((item) => (
                            <article
                                key={item.title}
                                className="border border-[#ECECEC] bg-[#FAFAFA] p-6 transition duration-300 hover:border-[#FA4234]/40 hover:shadow-[0_12px_30px_rgba(250,66,52,0.12)]"
                            >
                                <h3 className="text-[18px] font-bold uppercase text-[#FA4234]">{item.title}</h3>
                                <p className="mt-3 text-[15px] leading-relaxed text-[#4B4B4B]">{item.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#ECECEC] py-12 min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <div className="flex flex-col gap-4 min-[426px]:flex-row min-[426px]:flex-wrap min-[426px]:items-end min-[426px]:justify-between min-[426px]:gap-6">
                        <div>
                            <h2 className="text-[26px] font-bold uppercase text-[#181818] min-[426px]:text-[32px] lg:text-[36px]">Открытые позиции</h2>
                            <p className="mt-3 max-w-[640px] text-[17px] leading-relaxed text-[#4B4B4B]">
                                Выберите направление, изучите задачи и отправьте отклик. Если подходящей вакансии
                                нет — оставьте резюме в общей форме, мы свяжемся при появлении позиции.
                            </p>
                        </div>
                        <p className="text-[14px] font-semibold uppercase tracking-widest text-[#FA4234]">
                            {filteredVacancies.length} {filteredVacancies.length === 1 ? "вакансия" : "вакансий"}
                        </p>
                    </div>

                    <div className="relative mt-10 max-w-[420px]">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#999]">
                            ⌕
                        </span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setVisibleCount(VACANCY_PAGE_SIZE);
                            }}
                            placeholder="Поиск по должности или отделу..."
                            className="h-[48px] w-full border border-[#D0D0D0] bg-white pl-12 pr-4 text-[16px] text-[#333] outline-none placeholder:text-[#999] focus:border-[#FA4234]"
                        />
                    </div>

                    {filteredVacancies.length === 0 ? (
                        <p className="mt-12 text-center text-[18px] text-[#666]">
                            По вашему запросу вакансии не найдены.
                        </p>
                    ) : (
                        <>
                            <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                                {visibleVacancies.map((vacancy) => (
                                    <VacancyCard
                                        key={vacancy.id}
                                        vacancy={vacancy}
                                        onDetails={setSelectedVacancy}
                                        onApply={handleApply}
                                    />
                                ))}
                            </div>

                            {canLoadMore && (
                                <div className="mt-14 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setVisibleCount((count) =>
                                                Math.min(count + VACANCY_PAGE_SIZE, filteredVacancies.length)
                                            )
                                        }
                                        className="btn-fill inline-flex h-[52px] min-w-[240px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                                    >
                                        <span className="relative z-10">Показать еще</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <section id="vacancy-form" className="bg-[#2B2B2B] py-12 text-white min-[426px]:py-16 lg:py-20">
                <div className="page-container grid w-full gap-12 min-[426px]:gap-16 lg:grid-cols-2">
                    <div>
                        <h2 className="text-[26px] font-bold uppercase leading-tight min-[426px]:text-[32px] lg:text-[36px]">Отклик на вакансию</h2>
                        <p className="mt-6 text-[18px] leading-relaxed text-white/85">
                            Заполните форму — отдел кадров рассмотрит резюме и свяжется с вами по указанным
                            контактам. Также можно направить резюме на{" "}
                            <a href="mailto:info@inprokom.ru" className="text-[#FA4234] hover:underline">
                                info@inprokom.ru
                            </a>{" "}
                            с темой «Вакансия».
                        </p>
                        <dl className="mt-10 space-y-4 text-[16px] text-white/80">
                            <div>
                                <dt className="font-semibold text-white">Адрес:</dt>
                                <dd className="mt-1">пос. Балакирево, ул. Заводская, 10, корп. 50</dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-white">Телефон:</dt>
                                <dd className="mt-1">
                                    <a href="tel:+74924477534" className="transition hover:text-[#FA4234]">
                                        8 (49244) 77-53-4
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-white">График приема:</dt>
                                <dd className="mt-1">пн–пт, 8:00–17:00</dd>
                            </div>
                        </dl>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                            type="text"
                            required
                            placeholder="ФИО"
                            value={form.name}
                            onChange={handleChange("name")}
                            className={inputClass}
                        />
                        <input
                            type="email"
                            required
                            placeholder="E-mail"
                            value={form.email}
                            onChange={handleChange("email")}
                            className={inputClass}
                        />
                        <input
                            type="tel"
                            required
                            placeholder="Телефон"
                            value={form.phone}
                            onChange={handleChange("phone")}
                            className={inputClass}
                        />
                        <select
                            required
                            value={form.position}
                            onChange={handleChange("position")}
                            className={`${inputClass} appearance-none`}
                        >
                            <option value="" className="text-[#333]">
                                Выберите вакансию
                            </option>
                            {vacancies.map((item) => (
                                <option key={item.id} value={item.title} className="text-[#333]">
                                    {item.title}
                                </option>
                            ))}
                            <option value="Другое" className="text-[#333]">
                                Другое / резюме в резерв
                            </option>
                        </select>
                        <textarea
                            rows={4}
                            placeholder="Сопроводительное письмо"
                            value={form.message}
                            onChange={handleChange("message")}
                            className={`${inputClass} resize-none`}
                        />
                        <button
                            type="submit"
                            className="btn-fill inline-flex h-[52px] w-full items-center justify-center bg-[#2B2B2B] text-[14px] uppercase tracking-widest"
                        >
                            <span className="relative z-10">Отправить</span>
                        </button>
                        {submitted && (
                            <p className="text-[16px] text-[#FA4234]">
                                Спасибо! Ваш отклик принят, мы свяжемся с вами в ближайшее время.
                            </p>
                        )}
                    </form>
                </div>
            </section>

            {selectedVacancy && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
                    onClick={() => setSelectedVacancy(null)}
                    role="presentation"
                >
                    <div
                        className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="vacancy-modal-title"
                    >
                        <div className="vacancy-card__media relative h-[200px]">
                            <img
                                src={selectedVacancy.image}
                                alt=""
                                className="h-full w-full object-cover"
                                style={{ objectPosition: selectedVacancy.imagePosition }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${selectedVacancy.accent}`} />
                            <button
                                type="button"
                                onClick={() => setSelectedVacancy(null)}
                                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-white/90 text-[20px] text-[#181818] transition hover:bg-[#FA4234] hover:text-white"
                                aria-label="Закрыть"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8">
                            <p className="text-[13px] uppercase tracking-widest text-[#FA4234]">
                                {selectedVacancy.department}
                            </p>
                            <h3 id="vacancy-modal-title" className="mt-2 text-[28px] font-bold uppercase text-[#181818]">
                                {selectedVacancy.title}
                            </h3>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="vacancy-tag">{selectedVacancy.experience}</span>
                                <span className="vacancy-tag">{selectedVacancy.schedule}</span>
                            </div>

                            <p className="mt-6 text-[16px] leading-relaxed text-[#4B4B4B]">{selectedVacancy.short}</p>

                            <h4 className="mt-8 text-[14px] font-bold uppercase tracking-widest text-[#181818]">
                                Обязанности
                            </h4>
                            <ul className="mt-3 space-y-2 text-[15px] text-[#4B4B4B]">
                                {selectedVacancy.duties.map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="text-[#FA4234]">—</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <h4 className="mt-8 text-[14px] font-bold uppercase tracking-widest text-[#181818]">
                                Требования
                            </h4>
                            <ul className="mt-3 space-y-2 text-[15px] text-[#4B4B4B]">
                                {selectedVacancy.requirements.map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="text-[#FA4234]">—</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={() => handleApply(selectedVacancy)}
                                className="btn-fill mt-10 inline-flex p-4 h-[52px] min-w-[240px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                            >
                                <span className="relative z-10">Откликнуться на эту позицию</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Vacancies;
