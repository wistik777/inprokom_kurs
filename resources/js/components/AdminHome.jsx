import React, { useState } from 'react';

const AdminHome = () => {
    const managers = Array.isArray(window.adminManagers) ? window.adminManagers : [];
    const success = window.adminSuccess || '';
    const errors = window.errors || {};
    const old = window.adminFormOld || {};
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const [isModalOpen, setIsModalOpen] = useState(Object.keys(errors).length > 0);

    return (
        <main className="mx-auto w-full max-w-[1220px] px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-[34px] font-semibold text-[#1b1b1b]">Админ-панель</h1>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                >
                    <span className="relative z-10">Добавить менеджера</span>
                </button>
            </div>

            {success && (
                <div className="mt-5 rounded-xl border border-[#FA4234] bg-[#fff4f2] px-4 py-3 text-[14px] text-[#FA4234]">
                    {success}
                </div>
            )}

            <section className="mt-6 overflow-hidden rounded-2xl border border-[#ececec] bg-white shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                <div className="hidden grid-cols-[90px_1fr_1fr_1fr_180px] bg-[#f8f8f8] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#777] md:grid">
                    <p>ID</p>
                    <p>Логин</p>
                    <p>Email</p>
                    <p>Телефон</p>
                    <p>Дата создания</p>
                </div>

                {managers.length > 0 ? (
                    managers.map((manager) => (
                        <div key={manager.id} className="border-t border-[#efefef] px-5 py-4 md:grid md:grid-cols-[90px_1fr_1fr_1fr_180px] md:items-center">
                            <p className="text-[15px] text-[#1f1f1f]">{manager.id}</p>
                            <p className="mt-2 text-[15px] font-semibold text-[#1f1f1f] md:mt-0">{manager.login}</p>
                            <p className="mt-2 text-[15px] text-[#3a3a3a] md:mt-0">{manager.email}</p>
                            <p className="mt-2 text-[15px] text-[#3a3a3a] md:mt-0">{manager.phone}</p>
                            <p className="mt-2 text-[15px] text-[#666] md:mt-0">{manager.created_at}</p>
                        </div>
                    ))
                ) : (
                    <div className="border-t border-[#efefef] px-5 py-8 text-center text-[15px] text-[#777]">
                        Пока нет созданных менеджеров
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

                        <form action="/admin/create-manager" method="POST" className="mt-5 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                            <input type="hidden" name="_token" value={csrfToken} />
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
                                        defaultValue={old.phone || ''}
                                        placeholder="+7(XXX)-XXX-XX-XX"
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
        </main>
    );
};

export default AdminHome;
