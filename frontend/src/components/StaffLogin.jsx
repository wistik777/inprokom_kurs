import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';

function StaffLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ login: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const response = await login(form);
            navigate(response.redirect || (response.data?.role === 'admin' ? '/admin' : '/manager'), {
                replace: true,
            });
        } catch (error) {
            if (error instanceof ApiError && error.errors) {
                setErrors(error.errors);
                return;
            }

            setErrors({ login: [error.message || 'Не удалось выполнить вход'] });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="staff-login-page">
            <div className="staff-login-card">
                <div className="staff-login-card__accent" aria-hidden="true" />

                <div className="staff-login-card__body">
                    <div className="staff-login-card__brand">
                        <Link to="/">
                            <img
                                src="/img/logo.svg"
                                alt="Инпроком"
                                className="staff-login-card__logo"
                                width="180"
                                height="48"
                            />
                        </Link>
                        <p className="staff-login-card__eyebrow">Служебный доступ</p>
                    </div>

                    <div className="staff-login-card__intro">
                        <h1 className="staff-login-card__title">Вход для сотрудников</h1>
                        <p className="staff-login-card__subtitle">Администратор или менеджер</p>
                    </div>

                    <form className="staff-login-form" onSubmit={handleSubmit} noValidate>
                        <div className="auth-fields staff-login-form__fields">
                            <div className="auth-field">
                                <input
                                    type="text"
                                    name="login"
                                    className="auth-input"
                                    placeholder="Логин"
                                    value={form.login}
                                    onChange={handleChange('login')}
                                    autoComplete="username"
                                    required
                                    disabled={loading}
                                />
                                {errors.login?.[0] && <p className="auth-error">{errors.login[0]}</p>}
                            </div>

                            <div className="auth-field">
                                <input
                                    type="password"
                                    name="password"
                                    className="auth-input"
                                    placeholder="Пароль"
                                    value={form.password}
                                    onChange={handleChange('password')}
                                    autoComplete="current-password"
                                    required
                                    disabled={loading}
                                />
                                {errors.password?.[0] && <p className="auth-error">{errors.password[0]}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-fill auth-submit staff-login-form__submit"
                            disabled={loading}
                        >
                            <span className="relative z-10">{loading ? 'Вход…' : 'Войти'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StaffLogin;
