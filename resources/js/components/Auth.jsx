import React, { useState } from "react";
import { applyPhoneMask, formatRuPhone } from "../utils/phoneMask";

const csrfToken = () => document.querySelector('meta[name="csrf-token"]')?.content || "";

function AuthField({ label, error, children }) {
    return (
        <div className="auth-field">
            {label && <label className="auth-label">{label}</label>}
            {children}
            {error && <p className="auth-error">{error}</p>}
        </div>
    );
}

function AuthPromoPanel({ isLogin, onSwitch }) {
    return (
        <aside className="auth-promo">
            <h2 className="auth-promo__title">{isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}</h2>
            <p className="auth-promo__text">
                {isLogin
                    ? "Создайте профиль, чтобы оформлять заказы и отслеживать их статус."
                    : "Войдите, чтобы продолжить работу с личным кабинетом и корзиной."}
            </p>
            <button type="button" className="btnw-fill auth-promo__btn" onClick={onSwitch}>
                <span className="relative z-10">{isLogin ? "Регистрация" : "Войти"}</span>
            </button>
        </aside>
    );
}

function LoginForm({ errors, loginOldInput }) {
    return (
        <form action="/login" method="POST" className="auth-form">
            <input type="hidden" name="_token" value={csrfToken()} />
            <input type="hidden" name="auth_form" value="login" />

            <h1 className="auth-title">Войти</h1>
            <p className="auth-subtitle">Введите логин и пароль для входа в аккаунт</p>

            <div className="auth-fields">
                <AuthField error={errors.login?.[0]}>
                    <input
                        type="text"
                        name="login"
                        className="auth-input"
                        placeholder="Логин"
                        defaultValue={loginOldInput.login || ""}
                        autoComplete="username"
                        required
                    />
                </AuthField>

                <AuthField error={errors.password?.[0]}>
                    <input
                        type="password"
                        name="password"
                        className="auth-input"
                        placeholder="Пароль"
                        autoComplete="current-password"
                        required
                    />
                </AuthField>
            </div>

            <button type="submit" className="btn-fill auth-submit">
                <span className="relative z-10">Войти</span>
            </button>
        </form>
    );
}

function RegisterForm({ errors, getRegisterFieldValue }) {
    return (
        <form action="/reg" method="POST" className="auth-form">
            <input type="hidden" name="_token" value={csrfToken()} />
            <input type="hidden" name="auth_form" value="register" />

            <h1 className="auth-title">Регистрация</h1>
            <p className="auth-subtitle">Заполните данные для создания нового аккаунта</p>

            <div className="auth-fields">
                <AuthField error={errors.login?.[0]}>
                    <input
                        type="text"
                        name="login"
                        className="auth-input"
                        placeholder="Логин"
                        defaultValue={getRegisterFieldValue("login")}
                        autoComplete="username"
                        required
                    />
                </AuthField>

                <AuthField error={errors.password?.[0]}>
                    <input
                        type="password"
                        name="password"
                        className="auth-input"
                        placeholder="Пароль"
                        autoComplete="new-password"
                        required
                    />
                </AuthField>

                <AuthField error={errors.phone?.[0]}>
                    <input
                        type="tel"
                        name="phone"
                        className="auth-input"
                        placeholder="Телефон +7(XXX)-XXX-XX-XX"
                        defaultValue={formatRuPhone(getRegisterFieldValue("phone"))}
                        onInput={applyPhoneMask}
                        autoComplete="tel"
                        required
                    />
                </AuthField>

                <AuthField error={errors.email?.[0]}>
                    <input
                        type="email"
                        name="email"
                        className="auth-input"
                        placeholder="Электронная почта"
                        defaultValue={getRegisterFieldValue("email")}
                        autoComplete="email"
                        required
                    />
                </AuthField>
            </div>

            <label className="auth-checkbox-row">
                <input type="checkbox" name="rule" value="success" className="auth-checkbox" required />
                <span className="auth-checkbox__text">
                    Соглашаюсь с политикой конфиденциальности и пользовательским соглашением
                </span>
            </label>
            {errors.rule && <p className="auth-error auth-error--center">{errors.rule[0]}</p>}

            <button type="submit" className="btn-fill auth-submit auth-submit--wide">
                <span className="relative z-10">Зарегистрироваться</span>
            </button>
        </form>
    );
}

const Auth = () => {
    const errors = window.errors || {};
    const oldInput = window.oldInput || {};
    const loginOldInput = oldInput.auth_form === "login" ? oldInput : {};
    const registerOldInput = oldInput.auth_form === "register" ? oldInput : {};
    const forceRegisterFromUrl =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("form") === "register";

    const getRegisterFieldValue = (field) => {
        if (field === "login") {
            return registerOldInput.login || "";
        }
        if (field === "password") {
            return "";
        }
        if (errors[field]) {
            return "";
        }
        return registerOldInput[field] || "";
    };

    const shouldOpenRegister =
        forceRegisterFromUrl ||
        oldInput.auth_form === "register" ||
        Boolean(errors.phone || errors.email || errors.rule);

    const [isLogin, setIsLogin] = useState(!shouldOpenRegister);

    const switchMode = () => setIsLogin((prev) => !prev);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-tabs lg:hidden" role="tablist" aria-label="Форма авторизации">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={isLogin}
                        className={`auth-tab ${isLogin ? "auth-tab--active" : ""}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Вход
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={!isLogin}
                        className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Регистрация
                    </button>
                </div>

                <div className={`auth-panels ${isLogin ? "" : "auth-panels--register"}`}>
                    <AuthPromoPanel isLogin={isLogin} onSwitch={switchMode} />

                    <div className="auth-form-panel">
                        <div className="auth-form-panel__inner" key={isLogin ? "login" : "register"}>
                            {isLogin ? (
                                <LoginForm errors={errors} loginOldInput={loginOldInput} />
                            ) : (
                                <RegisterForm
                                    errors={errors}
                                    getRegisterFieldValue={getRegisterFieldValue}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
