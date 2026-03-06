import React from 'react';

const AdminCreateManager = () => {
    const errors = window.errors || {};
    const old = window.adminFormOld || {};
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    return (
        <main className="mx-auto w-full max-w-[920px] px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-[34px] font-semibold text-[#1b1b1b]">Добавление менеджера</h1>
                <a href="/admin" className="text-[14px] font-semibold text-[#FA4234] hover:underline">К списку менеджеров</a>
            </div>

            <form action="/admin/create-manager" method="POST" className="mt-6 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
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
        </main>
    );
};

export default AdminCreateManager;
