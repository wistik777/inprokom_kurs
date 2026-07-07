import React, { useState } from "react";
import { api, ApiError } from "../api/client";
import { applyPhoneMask } from "../utils/phoneMask";
import { markSkipSitePreloader } from "../utils/skipPreloader";

function Contacts() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (event) => {
        const value = field === "phone" ? applyPhoneMask(event.target.value) : event.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.public.contactMessage({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                message: form.message.trim(),
            });

            setSubmitted(true);
            markSkipSitePreloader();
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (err) {
            if (err instanceof ApiError) {
                const serverError =
                    err.errors?.message?.[0] ||
                    err.errors?.email?.[0] ||
                    err.errors?.name?.[0] ||
                    err.message ||
                    "Не удалось отправить сообщение";
                setError(serverError);
                return;
            }

            setError("Не удалось связаться с сервером. Попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-white px-6 text-[18px] text-[#333] outline-none placeholder:text-[#9A9A9A]";

    return (
        <div>
            <section
                className="hero-under-header bg-cover bg-center"
                style={{ backgroundImage: "url('/img/contact.png')" }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
                <div className="relative z-10 page-container w-full py-8 min-[426px]:py-10">
                    <h1 className="section-title text-white">Контакты</h1>
                    <p className="mt-3 max-w-[720px] text-[16px] text-white/90 min-[426px]:text-[20px]">
                        Свяжитесь с нами, чтобы узнать подробнее об услугах
                    </p>
                </div>
            </section>

            <section className="bg-[#2B2B2B] py-12 text-white min-[426px]:py-16">
                <div className="page-container grid w-full gap-12 min-[426px]:gap-16 lg:grid-cols-2 lg:gap-24">
                    <div>
                        <div className="h-[380px] w-full overflow-hidden bg-[#1a1a1a]">
                            <iframe
                                title="Карта — НПП Инпроком"
                                src="https://yandex.ru/map-widget/v1/?text=%D0%B1%D0%B0%D0%BB%D0%B0%D0%BA%D0%B8%D1%80%D0%B5%D0%B2%D0%BE%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%97%D0%B0%D0%B2%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D1%8F%2010&z=16&l=map"
                                className="h-full w-full border-0"
                                loading="lazy"
                            />
                        </div>

                        <p className="mt-8 text-[22px] leading-relaxed">
                            Связаться с нами можно любым удобным способом
                        </p>

                        <dl className="mt-8 space-y-6 text-[20px]">
                            <div>
                                <dt className="font-semibold">Адрес:</dt>
                                <dd className="mt-1 text-white/80">
                                    Владимирская обл., Александровский р-н, пос. Балакирево, а/я 33
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Телефон:</dt>
                                <dd className="mt-1">
                                    <a href="tel:+74924477534" className="text-white/80 transition hover:text-[#FA4234]">
                                        8 49244 7 75 34
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Почта:</dt>
                                <dd className="mt-1">
                                    <a
                                        href="mailto:info@inprokom.ru"
                                        className="text-white/80 transition hover:text-[#FA4234]"
                                    >
                                        info@inprokom.ru
                                    </a>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h2 className="text-center text-[26px] font-bold uppercase min-[426px]:text-[32px] lg:text-[36px]">Обратная связь</h2>

                        <form className="mt-10 space-y-5" onSubmit={handleSubmit} noValidate>
                            <input
                                type="text"
                                name="name"
                                placeholder="ФИО"
                                value={form.name}
                                onChange={handleChange("name")}
                                required
                                disabled={loading}
                                className={`${inputClass} h-[55px]`}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Почта"
                                value={form.email}
                                onChange={handleChange("email")}
                                required
                                disabled={loading}
                                className={`${inputClass} h-[55px]`}
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Телефон"
                                value={form.phone}
                                onChange={handleChange("phone")}
                                disabled={loading}
                                className={`${inputClass} h-[55px]`}
                            />
                            <textarea
                                name="message"
                                placeholder="Сообщение..."
                                value={form.message}
                                onChange={handleChange("message")}
                                required
                                disabled={loading}
                                rows={6}
                                className={`${inputClass} min-h-[180px] py-4`}
                            />

                            {error && <p className="text-[16px] text-[#FA4234]">{error}</p>}
                            {submitted && !error && (
                                <p className="text-[16px] text-white/80">
                                    Спасибо! Сообщение отправлено. Мы свяжемся с вами в ближайшее время.
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-fill mt-2 h-[52px] w-full bg-white text-[14px] uppercase tracking-widest disabled:opacity-60"
                            >
                                <span className="relative z-10">{loading ? "Отправка…" : "Отправить"}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contacts;
