import React from "react";

const csrfToken = () => document.querySelector('meta[name="csrf-token"]')?.content || "";

function StaffLogin() {
    const errors = window.errors || {};
    const oldInput = window.oldInput || {};

    return (
        <div className="staff-login-page">
            <div className="staff-login-card">
                <div className="staff-login-card__accent" aria-hidden="true" />

                <div className="staff-login-card__body">
                    <div className="staff-login-card__brand">
                        <a href="/">
                            <img
                                src="/img/logo.svg"
                                alt="Инпроком"
                                className="staff-login-card__logo"
                                width="180"
                                height="48"
                            />   
                        </a>
                        <p className="staff-login-card__eyebrow">Служебный доступ</p>
                    </div>

                    <div className="staff-login-card__intro">
                        <h1 className="staff-login-card__title">Вход для сотрудников</h1>
                        <p className="staff-login-card__subtitle">Администратор или менеджер</p>
                    </div>

                    <form action="/login" method="POST" className="staff-login-form">
                        <input type="hidden" name="_token" value={csrfToken()} />
                        <input type="hidden" name="auth_form" value="staff_login" />

                        <div className="auth-fields staff-login-form__fields">
                            <div className="auth-field">
                                <input
                                    type="text"
                                    name="login"
                                    className="auth-input"
                                    placeholder="Логин"
                                    defaultValue={oldInput.login || ""}
                                    autoComplete="username"
                                    required
                                />
                                {errors.login?.[0] && <p className="auth-error">{errors.login[0]}</p>}
                            </div>

                            <div className="auth-field">
                                <input
                                    type="password"
                                    name="password"
                                    className="auth-input"
                                    placeholder="Пароль"
                                    autoComplete="current-password"
                                    required
                                />
                                {errors.password?.[0] && <p className="auth-error">{errors.password[0]}</p>}
                            </div>
                        </div>

                        <button type="submit" className="btn-fill auth-submit staff-login-form__submit">
                            <span className="relative z-10">Войти</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StaffLogin;
