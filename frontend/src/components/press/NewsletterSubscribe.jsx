import React, { useState } from "react";
import { api, ApiError } from "../../api/client";
import { markSkipSitePreloader } from "../../utils/skipPreloader";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function NewsletterSubscribe({
    id,
    buttonLabel = "Подписаться",
    buttonClassName = "btn-fill flex h-[52px] w-full items-center justify-center bg-white text-[14px] uppercase tracking-widest",
    inputClassName = "h-[50px] w-full border-2 border-[#FA4234]/70 bg-white px-4 text-[16px] text-[#181818] outline-none transition-all duration-200 placeholder:text-[#999] focus:border-[#FA4234] focus:ring-2 focus:ring-[#FA4234]/15",
    className = "",
}) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmed = email.trim();

        if (!trimmed || !emailPattern.test(trimmed)) {
            setError("Укажите корректный адрес электронной почты");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const data = await api.public.newsletterSubscribe({ email: trimmed });

            setSubmittedEmail(trimmed);
            markSkipSitePreloader();
            setSuccessMessage(
                data.message ||
                    "Подписка оформлена. Проверьте почту — мы отправили письмо с подтверждением."
            );
            setSubscribed(true);
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.errors?.email?.[0] || err.message || "Не удалось оформить подписку");
                return;
            }

            setError("Не удалось связаться с сервером. Попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    if (subscribed) {
        return (
            <div className={className} role="status">
                <p className="text-[15px] leading-relaxed text-[#4B4B4B] min-[426px]:text-[16px]">
                    {successMessage || (
                        <>
                            Спасибо! На{" "}
                            <span className="font-semibold text-[#181818]">{submittedEmail}</span> отправлено
                            письмо с подтверждением подписки.
                        </>
                    )}
                </p>
            </div>
        );
    }

    return (
        <form id={id} className={`flex flex-col gap-4 ${className}`} onSubmit={handleSubmit} noValidate>
            <div>
                <label htmlFor={id ? `${id}-email` : "newsletter-email"} className="sr-only">
                    Электронная почта
                </label>
                <input
                    id={id ? `${id}-email` : "newsletter-email"}
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    disabled={loading}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError("");
                    }}
                    placeholder="Ваш e-mail"
                    className={inputClassName}
                    required
                />
                {error && <p className="mt-2 text-[13px] text-[#FA4234]">{error}</p>}
            </div>
            <button type="submit" className={buttonClassName} disabled={loading}>
                <span className="relative z-10">{loading ? "Отправка…" : buttonLabel}</span>
            </button>
        </form>
    );
}

export default NewsletterSubscribe;
