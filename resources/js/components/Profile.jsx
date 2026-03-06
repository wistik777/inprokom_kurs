import React, { useMemo, useState } from 'react';

const Modal = ({ title, children, onClose }) => (
    <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4"
        onClick={onClose}
    >
        <div
            className="w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
            onClick={(event) => event.stopPropagation()}
        >
            <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[24px] font-semibold text-[#1b1b1b]">{title}</h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="h-9 w-9 rounded-md border border-[#ececec] text-[20px] leading-none text-[#666] transition-colors hover:border-[#FA4234] hover:text-[#FA4234]"
                    aria-label="Закрыть модальное окно"
                >
                    x
                </button>
            </div>
            {children}
        </div>
    </div>
);

const Profile = () => {
    const authUser = window.authUser || {};
    const userStorageKey = useMemo(
        () => `profile-user:${authUser.id ?? 'guest'}`,
        [authUser.id]
    );
    const companyStorageKey = useMemo(
        () => `profile-company:${authUser.id ?? 'guest'}`,
        [authUser.id]
    );

    const savedUser = (() => {
        try {
            return JSON.parse(localStorage.getItem(userStorageKey) || '{}');
        } catch {
            return {};
        }
    })();

    const savedCompany = (() => {
        try {
            return JSON.parse(localStorage.getItem(companyStorageKey) || '{}');
        } catch {
            return {};
        }
    })();

    const [profileData, setProfileData] = useState({
        login: savedUser.login || authUser.login || '',
        email: savedUser.email || authUser.email || '',
        phone: savedUser.phone || '',
    });
    const [companyData, setCompanyData] = useState({
        deliveryAddress: savedCompany.deliveryAddress || '',
        requisites: savedCompany.requisites || '',
    });

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [orderSearchField, setOrderSearchField] = useState('items');
    const [orderSearchValue, setOrderSearchValue] = useState('');
    const [orderSortMode, setOrderSortMode] = useState('default');

    const [userDraft, setUserDraft] = useState(profileData);
    const [companyDraft, setCompanyDraft] = useState(companyData);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const hasCompanyData = Boolean(companyData.deliveryAddress.trim() || companyData.requisites.trim());
    const orderHistory = useMemo(() => [
        { id: 1, number: 1024, items: 'Камера видеонаблюдения IP-720, кронштейн настенный', status: 'Доставлен' },
        { id: 2, number: 1009, items: 'Контроллер доступа серии AX-2', status: 'В обработке' },
    ], []);

    const filteredOrders = useMemo(() => {
        const normalizedQuery = orderSearchValue.trim().toLowerCase();
        let result = [...orderHistory];

        if (normalizedQuery) {
            result = result.filter((order) => {
                const source = orderSearchField === 'number'
                    ? String(order.number)
                    : String(order.items).toLowerCase();

                return orderSearchField === 'number'
                    ? source.includes(normalizedQuery)
                    : source.includes(normalizedQuery);
            });
        }

        if (orderSortMode === 'number_asc') {
            result.sort((a, b) => a.number - b.number);
        } else if (orderSortMode === 'number_desc') {
            result.sort((a, b) => b.number - a.number);
        } else if (orderSortMode === 'items_asc') {
            result.sort((a, b) => a.items.localeCompare(b.items, 'ru'));
        } else if (orderSortMode === 'items_desc') {
            result.sort((a, b) => b.items.localeCompare(a.items, 'ru'));
        }

        return result;
    }, [orderHistory, orderSearchField, orderSearchValue, orderSortMode]);

    const openUserModal = () => {
        setUserDraft(profileData);
        setIsUserModalOpen(true);
    };

    const openCompanyModal = () => {
        setCompanyDraft(companyData);
        setIsCompanyModalOpen(true);
    };

    const saveUserData = (event) => {
        event.preventDefault();
        setProfileData(userDraft);
        localStorage.setItem(userStorageKey, JSON.stringify(userDraft));
        setIsUserModalOpen(false);
    };

    const saveCompanyData = (event) => {
        event.preventDefault();
        setCompanyData(companyDraft);
        localStorage.setItem(companyStorageKey, JSON.stringify(companyDraft));
        setIsCompanyModalOpen(false);
    };

    const resetOrderFilters = () => {
        setOrderSearchField('items');
        setOrderSearchValue('');
        setOrderSortMode('default');
    };

    return (
        <>
            <main className="mx-auto w-full max-w-[1360px] px-4 pb-20 pt-10 lg:px-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-[34px] font-semibold text-[#1b1b1b]">Профиль</h1>
                <form action="/logout" method="POST">
                    <input type="hidden" name="_token" value={csrfToken} />
                    <button
                        type="submit"
                        className="rounded-xl border border-[#FA4234] bg-white px-6 py-2.5 text-[14px] font-semibold text-[#FA4234] shadow-[0_8px_20px_rgba(250,66,52,0.15)] transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#FA4234] hover:text-white"
                    >
                        Выйти из аккаунта
                    </button>
                </form>
            </div>

            <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[600px_minmax(0,1fr)] lg:items-stretch">
                <div className="w-full">
                    <div className="flex rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)] lg:h-[450px]">
                        <div className="flex w-full flex-col">
                        <div className="flex items-center gap-3">
                            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FA4234]" />
                            <h2 className="text-[24px] font-semibold text-[#1b1b1b]">Данные пользователя</h2>
                        </div>
                        <div className="mt-5 grid gap-4">
                            <div className="rounded-xl border border-[#e9e9e9] bg-[#fcfcfc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8a8a8a]">Логин</p>
                                <p className="mt-1.5 text-[18px] font-semibold text-[#1f1f1f]">{profileData.login || 'Не указан'}</p>
                            </div>
                            <div className="rounded-xl border border-[#e9e9e9] bg-[#fcfcfc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8a8a8a]">Email</p>
                                <p className="mt-1.5 text-[18px] font-semibold text-[#1f1f1f]">{profileData.email || 'Не указан'}</p>
                            </div>
                            <div className="rounded-xl border border-[#e9e9e9] bg-[#fcfcfc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8a8a8a]">Телефон</p>
                                <p className="mt-1.5 text-[18px] font-semibold text-[#1f1f1f]">{profileData.phone || 'Не указан'}</p>
                            </div>
                        </div>
                        <div className="mt-auto pt-3 pb-2">
                            <button
                                type="button"
                                onClick={openUserModal}
                                className="rounded-xl border border-[#FA4234] bg-white px-5 py-2 text-[14px] font-semibold text-[#FA4234] transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#FA4234] hover:text-white"
                            >
                                Редактировать данные
                            </button>
                        </div>
                        </div>
                    </div>

                </div>

                <div className="w-full lg:pr-1">
                    <div className="flex rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)] lg:h-[350px]">
                        <div className="flex w-full flex-col">
                        <div className="flex items-center gap-3">
                            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FA4234]" />
                            <h2 className="text-[24px] font-semibold text-[#1b1b1b]">Реквизиты и доставка</h2>
                        </div>
                        <div className="mt-5 grid gap-4">
                            <div className="rounded-xl border border-[#e9e9e9] bg-[#fcfcfc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8a8a8a]">Адрес доставки</p>
                                <p className="mt-1.5 text-[16px] text-[#1f1f1f]">
                                    {companyData.deliveryAddress || 'Не заполнено'}
                                </p>
                            </div>
                            <div className="rounded-xl border border-[#e9e9e9] bg-[#fcfcfc] px-4 py-4">
                                <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8a8a8a]">Реквизиты</p>
                                <p className="mt-1.5 text-[16px] text-[#1f1f1f]">
                                    {companyData.requisites || 'Не заполнено'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-auto pt-4">
                            <button
                                type="button"
                                onClick={openCompanyModal}
                                className="rounded-xl border border-[#FA4234] bg-white px-5 py-2 text-[14px] font-semibold text-[#FA4234] transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#FA4234] hover:text-white"
                            >
                                {hasCompanyData ? 'Редактировать' : 'Добавить'}
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-6 rounded-2xl border border-[#ececec] bg-white p-6 shadow-[0_10px_26px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FA4234]" />
                        <h2 className="text-[24px] font-semibold text-[#1b1b1b]">История заказов</h2>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <select
                            value={orderSearchField}
                            onChange={(event) => setOrderSearchField(event.target.value)}
                            className="h-[42px] w-[200px] rounded-md border border-[#FA4234] bg-white px-3 text-[14px] outline-none"
                        >
                            <option value="items">По наименованию...</option>
                            <option value="number">По номеру...</option>
                        </select>
                        <input
                            value={orderSearchValue}
                            onChange={(event) => setOrderSearchValue(event.target.value)}
                            placeholder="Введите значение..."
                            className="h-[42px] w-[220px] rounded-md border border-[#FA4234] bg-white px-3 text-[14px] outline-none"
                        />
                        <select
                            value={orderSortMode}
                            onChange={(event) => setOrderSortMode(event.target.value)}
                            className="h-[42px] w-[220px] rounded-md border border-[#FA4234] bg-white px-3 text-[14px] outline-none"
                        >
                            <option value="default">По умолчанию</option>
                            <option value="items_asc">Название (А-Я)</option>
                            <option value="items_desc">Название (Я-А)</option>
                            <option value="number_asc">Номер (по возрастанию)</option>
                            <option value="number_desc">Номер (по убыванию)</option>
                        </select>
                        <button
                            type="button"
                            onClick={resetOrderFilters}
                            className="btn-fill h-[42px] w-[145px] rounded-md bg-white text-[13px] font-semibold"
                        >
                            <span className="relative z-10">СБРОСИТЬ</span>
                        </button>
                    </div>
                </div>
                <div className="mt-5 overflow-hidden rounded-xl border border-[#ececec]">
                    <div className="hidden grid-cols-[160px_1fr_170px] bg-[#f8f8f8] px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-[#777] md:grid">
                        <p>Номер</p>
                        <p>Состав заказа</p>
                        <p>Статус</p>
                    </div>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="border-t border-[#efefef] px-5 py-4 md:grid md:grid-cols-[160px_1fr_170px] md:items-center">
                                <p className="text-[15px] font-semibold text-[#1f1f1f]">#{order.number}</p>
                                <p className="mt-2 text-[15px] text-[#3a3a3a] md:mt-0">{order.items}</p>
                                <p className="mt-3 md:mt-0">
                                    <span
                                        className={`inline-flex h-[34px] w-[140px] items-center justify-center rounded-[5px] border text-[13px] font-semibold ${
                                            order.status === 'Доставлен'
                                                ? 'border-[#FA4234] bg-[#fff1ef] text-[#FA4234]'
                                                : 'border-[#f08b5f] bg-[#fff4ed] text-[#f08b5f]'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="border-t border-[#efefef] px-5 py-8 text-center text-[15px] text-[#777]">
                            По выбранным параметрам заказы не найдены
                        </div>
                    )}
                </div>
            </section>
            </main>

            {isUserModalOpen && (
                <Modal title="Редактирование данных" onClose={() => setIsUserModalOpen(false)}>
                    <form onSubmit={saveUserData} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-[13px] font-semibold uppercase tracking-wide text-[#777]">Логин</label>
                            <input
                                value={userDraft.login}
                                onChange={(event) => setUserDraft((prev) => ({ ...prev, login: event.target.value }))}
                                className="h-[44px] w-full rounded-md border border-[#f1b3ad] px-3 text-[15px] outline-none transition-colors focus:border-[#FA4234]"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[13px] font-semibold uppercase tracking-wide text-[#777]">Email</label>
                            <input
                                type="email"
                                value={userDraft.email}
                                onChange={(event) => setUserDraft((prev) => ({ ...prev, email: event.target.value }))}
                                className="h-[44px] w-full rounded-md border border-[#f1b3ad] px-3 text-[15px] outline-none transition-colors focus:border-[#FA4234]"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[13px] font-semibold uppercase tracking-wide text-[#777]">Телефон</label>
                            <input
                                value={userDraft.phone}
                                onChange={(event) => setUserDraft((prev) => ({ ...prev, phone: event.target.value }))}
                                placeholder="+7(XXX)-XXX-XX-XX"
                                className="h-[44px] w-full rounded-md border border-[#f1b3ad] px-3 text-[15px] outline-none transition-colors focus:border-[#FA4234]"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsUserModalOpen(false)}
                                className="rounded-lg border border-[#d9d9d9] px-4 py-2 text-[14px] font-medium text-[#555] transition-colors hover:border-[#bbb]"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg border border-[#FA4234] bg-[#FA4234] px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#eb3c2e]"
                            >
                                Сохранить
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {isCompanyModalOpen && (
                <Modal title={hasCompanyData ? 'Редактирование реквизитов' : 'Добавление реквизитов'} onClose={() => setIsCompanyModalOpen(false)}>
                    <form onSubmit={saveCompanyData} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-[13px] font-semibold uppercase tracking-wide text-[#777]">Адрес доставки</label>
                            <textarea
                                value={companyDraft.deliveryAddress}
                                onChange={(event) => setCompanyDraft((prev) => ({ ...prev, deliveryAddress: event.target.value }))}
                                rows={3}
                                className="w-full resize-none rounded-md border border-[#f1b3ad] px-3 py-2 text-[15px] outline-none transition-colors focus:border-[#FA4234]"
                                placeholder="Введите адрес доставки"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-[13px] font-semibold uppercase tracking-wide text-[#777]">Реквизиты</label>
                            <textarea
                                value={companyDraft.requisites}
                                onChange={(event) => setCompanyDraft((prev) => ({ ...prev, requisites: event.target.value }))}
                                rows={3}
                                className="w-full resize-none rounded-md border border-[#f1b3ad] px-3 py-2 text-[15px] outline-none transition-colors focus:border-[#FA4234]"
                                placeholder="Введите реквизиты организации"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsCompanyModalOpen(false)}
                                className="rounded-lg border border-[#d9d9d9] px-4 py-2 text-[14px] font-medium text-[#555] transition-colors hover:border-[#bbb]"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg border border-[#FA4234] bg-[#FA4234] px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#eb3c2e]"
                            >
                                Сохранить
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
};

export default Profile;
