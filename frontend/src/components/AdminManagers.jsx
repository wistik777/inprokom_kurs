import React from 'react';

const AdminManagers = () => {
    const managers = Array.isArray(window.adminManagers) ? window.adminManagers : [];
    const success = window.adminSuccess || '';

    return (
        <main className="mx-auto w-full max-w-[1220px] px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-[34px] font-semibold text-[#1b1b1b]">Менеджеры</h1>
                <a
                    href="/admin/create-manager"
                    className="btn-fill inline-flex h-[44px] min-w-[190px] items-center justify-center bg-white px-5 py-2 text-[14px] font-semibold"
                >
                    <span className="relative z-10">Добавить менеджера</span>
                </a>
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
        </main>
    );
};

export default AdminManagers;
