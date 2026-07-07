import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useApiQuery } from '../hooks/useApiQuery';
import { applyPhoneMask, formatRuPhone } from '../utils/phoneMask';

const AUDIT_LOGS_PER_PAGE = 8;

const AdminHome = () => {
    const { data, loading, reload } = useApiQuery(() => api.admin.dashboard().then((response) => response.data), []);
    const managers = Array.isArray(data?.managers) ? data.managers : [];
    const auditLogs = Array.isArray(data?.auditLogs) ? data.auditLogs : [];
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});
    const [old, setOld] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [managerToDelete, setManagerToDelete] = useState(null);
    const [auditCurrentPage, setAuditCurrentPage] = useState(1);

    const auditTotalPages = Math.max(1, Math.ceil(auditLogs.length / AUDIT_LOGS_PER_PAGE));

    useEffect(() => {
        if (auditCurrentPage > auditTotalPages) {
            setAuditCurrentPage(auditTotalPages);
        }
    }, [auditCurrentPage, auditTotalPages]);

    const paginatedAuditLogs = useMemo(() => {
        const start = (auditCurrentPage - 1) * AUDIT_LOGS_PER_PAGE;
        return auditLogs.slice(start, start + AUDIT_LOGS_PER_PAGE);
    }, [auditLogs, auditCurrentPage]);

    const visibleAuditPages = useMemo(() => {
        let start = Math.max(1, auditCurrentPage - 1);
        let end = Math.min(auditTotalPages, start + 2);

        if (end - start < 2) {
            start = Math.max(1, end - 2);
        }

        return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
    }, [auditCurrentPage, auditTotalPages]);

    const goToAuditPage = (page) => {
        setAuditCurrentPage(Math.min(auditTotalPages, Math.max(1, page)));
    };

    const handleCreateManager = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            login: String(formData.get('login') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            password: String(formData.get('password') || ''),
            phone: String(formData.get('phone') || '').trim(),
        };

        setErrors({});
        setSuccess('');

        try {
            const response = await api.admin.createManager(payload);
            setSuccess(response.message || 'Менеджер успешно создан');
            setIsModalOpen(false);
            setOld({});
            event.currentTarget.reset();
            await reload();
        } catch (error) {
            if (error instanceof ApiError && error.errors) {
                setErrors(error.errors);
                setOld(payload);
                return;
            }

            setErrors({ login: [error.message || 'Не удалось создать менеджера'] });
        }
    };

    const handleDeleteManager = async () => {
        if (!managerToDelete) return;

        try {
            const response = await api.admin.deleteManager(managerToDelete.id);
            setSuccess(response.message || 'Менеджер удалён');
            setManagerToDelete(null);
            await reload();
        } catch (error) {
            setSuccess('');
            setErrors({ login: [error.message || 'Не удалось удалить менеджера'] });
        }
    };

    const handleRollback = async (logId) => {
        try {
            const response = await api.admin.rollbackAuditLog(logId);
            setSuccess(response.message || 'Изменение откачено');
            await reload();
        } catch (error) {
            setSuccess('');
            setErrors({ login: [error.message || 'Не удалось выполнить откат'] });
        }
    };

    if (loading) {
        return (
            <main className="mx-auto w-full max-w-[1220px] px-6 py-10">
                <p className="text-[16px] text-[#666]">Загрузка…</p>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-[1220px] px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-[34px] font-semibold text-[#1b1b1b]">Админ-панель</h1>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/admin/statistics"
                        className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Статистика сайта</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Добавить менеджера</span>
                    </button>
                </div>
            </div>

            {success && (
                <div className="mt-5 rounded-xl border border-[#FA4234] bg-[#fff4f2] px-4 py-3 text-[14px] text-[#FA4234]">
                    {success}
                </div>
            )}

            <section className="mt-6 overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                <div className="hidden grid-cols-[90px_1fr_1fr_1fr_180px_160px] bg-[#f8f8f8] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#777] md:grid">
                    <p>ID</p>
                    <p>Логин</p>
                    <p>Email</p>
                    <p>Телефон</p>
                    <p>Дата создания</p>
                    <p>Действие</p>
                </div>

                {managers.length > 0 ? (
                    managers.map((manager) => (
                        <div key={manager.id} className="border-t border-[#efefef] px-5 py-4 md:grid md:grid-cols-[90px_1fr_1fr_1fr_180px_160px] md:items-center">
                            <p className="text-[15px] text-[#1f1f1f]">{manager.id}</p>
                            <p className="mt-2 text-[15px] font-semibold text-[#1f1f1f] md:mt-0">{manager.login}</p>
                            <p className="mt-2 text-[15px] text-[#3a3a3a] md:mt-0">{manager.email}</p>
                            <p className="mt-2 text-[15px] text-[#3a3a3a] md:mt-0">{manager.phone}</p>
                            <p className="mt-2 text-[15px] text-[#666] md:mt-0">{manager.created_at}</p>
                            <p className="mt-2 md:mt-0">
                                <button
                                    type="button"
                                    onClick={() => setManagerToDelete({ id: manager.id, login: manager.login })}
                                    className="btn-fill inline-flex h-[34px] w-[140px] items-center justify-center bg-white text-[13px] font-semibold"
                                >
                                    <span className="relative z-10">Удалить</span>
                                </button>
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="border-t border-[#efefef] px-5 py-8 text-center text-[15px] text-[#777]">
                        Пока нет созданных менеджеров
                    </div>
                )}
            </section>

            <section className="mt-8 overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                <div className="bg-[#f8f8f8] px-5 py-3">
                    <h2 className="text-[22px] font-semibold text-[#1b1b1b]">История изменений админа</h2>
                </div>
                <div className="hidden grid-cols-[80px_180px_190px_1fr_170px] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#777] md:grid">
                    <p>ID</p>
                    <p>Действие</p>
                    <p>Цель</p>
                    <p>Когда/Кто</p>
                    <p>Откат</p>
                </div>

                {paginatedAuditLogs.length > 0 ? (
                    paginatedAuditLogs.map((log) => (
                        <div key={log.id} className="border-t border-[#efefef] px-5 py-4 md:grid md:grid-cols-[80px_180px_190px_1fr_170px] md:items-center">
                            <p className="text-[15px] text-[#1f1f1f]">#{log.id}</p>
                            <p className="mt-2 text-[14px] font-semibold text-[#1f1f1f] md:mt-0">
                                {log.action === 'create_manager' ? 'Создание менеджера' : 'Удаление менеджера'}
                            </p>
                            <p className="mt-2 text-[14px] text-[#3a3a3a] md:mt-0">{log.target_login || '—'}</p>
                            <div className="mt-2 text-[13px] text-[#666] md:mt-0">
                                <p>{log.created_at || '—'}</p>
                                <p>{log.actor_login ? `Админ: ${log.actor_login}` : 'Админ: —'}</p>
                                {log.is_reverted && (
                                    <p className="mt-1 text-[#4b8c53]">
                                        Откачено {log.reverted_at || ''} {log.reverted_by_login ? `( ${log.reverted_by_login} )` : ''}
                                    </p>
                                )}
                            </div>
                            <div className="mt-2 md:mt-0">
                                {log.is_reverted ? (
                                    <span className="inline-flex h-[34px] min-w-[140px] items-center justify-center rounded-md border border-[#d8d8d8] bg-[#f6f6f6] px-3 text-[12px] font-semibold text-[#777]">
                                        Уже откачено
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleRollback(log.id)}
                                        className="btn-fill inline-flex h-[34px] min-w-[140px] items-center justify-center bg-white px-3 text-[12px] font-semibold"
                                    >
                                        <span className="relative z-10">Откатить</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="border-t border-[#efefef] px-5 py-8 text-center text-[15px] text-[#777]">
                        История изменений пока пуста
                    </div>
                )}

                {auditLogs.length > 0 && (
                    <div className="border-t border-[#efefef] px-5 py-5">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-4 text-[20px]">
                                <button type="button" onClick={() => goToAuditPage(1)} className="cursor-pointer transition-colors hover:text-[#FA4234]">В начало</button>
                                <button type="button" onClick={() => goToAuditPage(auditCurrentPage - 1)} className="cursor-pointer text-[26px] transition-colors hover:text-[#FA4234]" aria-label="Предыдущая страница истории">&#8249;</button>
                                <div className="flex items-center gap-2.5">
                                    {visibleAuditPages.map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => goToAuditPage(page)}
                                            className={`cursor-pointer transition-colors ${auditCurrentPage === page ? 'text-[#FA4234]' : 'text-black hover:text-[#FA4234]'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button type="button" onClick={() => goToAuditPage(auditCurrentPage + 1)} className="cursor-pointer text-[26px] transition-colors hover:text-[#FA4234]" aria-label="Следующая страница истории">&#8250;</button>
                                <button type="button" onClick={() => goToAuditPage(auditTotalPages)} className="cursor-pointer transition-colors hover:text-[#FA4234]">В конец</button>
                            </div>
                            <div className="mt-1.5 h-[2px] w-full max-w-[700px] bg-[#FA4234]" />
                        </div>
                    </div>
                )}
            </section>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="w-full max-w-[920px] rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-[30px] font-semibold text-[#1b1b1b]">Добавление менеджера</h2>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="h-9 w-9 rounded-md border border-[#ececec] text-[20px] leading-none text-[#666] transition-colors hover:border-[#FA4234] hover:text-[#FA4234]"
                                aria-label="Закрыть модальное окно"
                            >
                                x
                            </button>
                        </div>

                        <form onSubmit={handleCreateManager} className="mt-5 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Логин</label>
                                    <input
                                        type="text"
                                        name="login"
                                        defaultValue={old.login || ''}
                                        className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none"
                                        required
                                    />
                                    {errors.login && <p className="mt-1 text-[13px] text-red-500">{errors.login[0]}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={old.email || ''}
                                        className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-[13px] text-red-500">{errors.email[0]}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Пароль</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none"
                                        required
                                    />
                                    {errors.password && <p className="mt-1 text-[13px] text-red-500">{errors.password[0]}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">Телефон</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        defaultValue={formatRuPhone(old.phone || '')}
                                        placeholder="+7(XXX)-XXX-XX-XX"
                                        onInput={applyPhoneMask}
                                        className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none"
                                        required
                                    />
                                    {errors.phone && <p className="mt-1 text-[13px] text-red-500">{errors.phone[0]}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-fill mt-6 h-[44px] min-w-[210px] bg-white px-6 py-2.5 text-[14px] font-semibold"
                            >
                                <span className="relative z-10">Создать менеджера</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {managerToDelete && (
                <div
                    className="fixed inset-0 z-[85] flex items-center justify-center bg-black/45 px-4"
                    onClick={() => setManagerToDelete(null)}
                >
                    <div
                        className="w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-[26px] font-semibold text-[#1b1b1b]">Подтверждение удаления</h3>
                        <p className="mt-3 text-[16px] text-[#444]">
                            Точно ли вы хотите удалить менеджера <span className="font-semibold">"{managerToDelete.login}"</span>?
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setManagerToDelete(null)}
                                className="btn-fill h-[44px] min-w-[140px] bg-white px-5 py-2 text-[14px] font-semibold"
                            >
                                <span className="relative z-10">Отмена</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteManager}
                                className="h-[44px] min-w-[140px] border-2 border-[#FA4234] bg-[#FA4234] px-5 py-2 text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-[#FA4234]"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AdminHome;
