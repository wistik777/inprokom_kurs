import React, { useMemo, useState } from 'react';
import { formatRuPhone } from '../utils/phoneMask';

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

const formatPrice = (value) => `${Number(value || 0).toFixed(2)}р`;

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
        phone: formatRuPhone(savedUser.phone || authUser.phone || ''),
    });
    const [companyData, setCompanyData] = useState({
        deliveryAddress: savedCompany.deliveryAddress || '',
        requisites: savedCompany.requisites || '',
    });

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderSearchField, setOrderSearchField] = useState('items');
    const [orderSearchValue, setOrderSearchValue] = useState('');
    const [orderSortMode, setOrderSortMode] = useState('default');

    const [userDraft, setUserDraft] = useState(profileData);
    const [userDraftErrors, setUserDraftErrors] = useState({});
    const [isUserSaveLoading, setIsUserSaveLoading] = useState(false);
    const [companyDraft, setCompanyDraft] = useState(companyData);

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
    const hasCompanyData = Boolean(companyData.deliveryAddress.trim() || companyData.requisites.trim());
    const statusLabelMap = {
        new: 'Новый',
        processing: 'В обработке',
        shipped: 'Отправлен',
        delivered: 'Доставлен',
        cancelled: 'Отменен',
        ordered: 'Новый',
    };

    const orderHistory = useMemo(() => {
        const rawOrders = Array.isArray(window.profileOrders) ? window.profileOrders : [];

        return rawOrders.map((order) => ({
            ...order,
            statusRaw: order.status,
            status: statusLabelMap[order.status] || order.status || 'Новый',
        }));
    }, []);

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
        setUserDraftErrors({});
        setIsUserModalOpen(true);
    };

    const openCompanyModal = () => {
        setCompanyDraft(companyData);
        setIsCompanyModalOpen(true);
    };

    const validateUserDraft = () => {
        const errors = {};
        const trimmedLogin = String(userDraft.login || '').trim();
        const trimmedEmail = String(userDraft.email || '').trim();
        const trimmedPhone = String(userDraft.phone || '').trim();

        if (!trimmedLogin) {
            errors.login = 'Введите логин';
        } else if (trimmedLogin.length < 6) {
            errors.login = 'Логин должен быть не менее 6 символов';
        }

        if (!trimmedEmail) {
            errors.email = 'Введите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            errors.email = 'Некорректный формат email';
        }

        if (!trimmedPhone) {
            errors.phone = 'Введите телефон';
        } else if (!/^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/.test(trimmedPhone)) {
            errors.phone = 'Телефон должен соответствовать +7(XXX)-XXX-XX-XX';
        }

        return errors;
    };

    const saveUserData = async (event) => {
        event.preventDefault();
        const errors = validateUserDraft();
        setUserDraftErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const normalizedUserData = {
            login: String(userDraft.login || '').trim(),
            email: String(userDraft.email || '').trim(),
            phone: formatRuPhone(userDraft.phone),
        };

        setIsUserSaveLoading(true);
        try {
            const response = await fetch('/profile', {
                method: 'PATCH',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(normalizedUserData),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                const serverErrors = payload?.errors || {};
                setUserDraftErrors({
                    login: serverErrors.login?.[0],
                    email: serverErrors.email?.[0],
                    phone: serverErrors.phone?.[0],
                });
                return;
            }

            const payload = await response.json();
            const persistedUser = payload?.user || normalizedUserData;

            setProfileData(persistedUser);
            localStorage.setItem(userStorageKey, JSON.stringify(persistedUser));
            window.authUser = { ...(window.authUser || {}), ...persistedUser };
            setIsUserModalOpen(false);
        } catch {
            setUserDraftErrors({ login: 'Не удалось сохранить данные. Повторите попытку.' });
        } finally {
            setIsUserSaveLoading(false);
        }
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

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
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
                        className="btn-fill h-[46px] min-w-[210px] rounded-md px-6 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Выйти из аккаунта</span>
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
                                className="btn-fill h-[42px] min-w-[220px] rounded-md px-5 text-[14px] font-semibold"
                            >
                                <span className="relative z-10">Редактировать данные</span>
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
                                className="btn-fill h-[42px] min-w-[190px] rounded-md px-5 text-[14px] font-semibold"
                            >
                                <span className="relative z-10">{hasCompanyData ? 'Редактировать' : 'Добавить'}</span>
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
                            <div
                                key={order.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => openOrderDetails(order)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        openOrderDetails(order);
                                    }
                                }}
                                className="cursor-pointer border-t border-[#efefef] px-5 py-4 transition-colors hover:bg-[#fff8f7] md:grid md:grid-cols-[160px_1fr_170px] md:items-center"
                            >
                                <p className="text-[15px] font-semibold text-[#1f1f1f]">#{order.number}</p>
                                <p className="mt-2 text-[15px] text-[#3a3a3a] md:mt-0">{order.items}</p>
                                <p className="mt-3 md:mt-0">
                                    <span
                                        className={`inline-flex h-[34px] w-[140px] items-center justify-center rounded-[5px] border text-[13px] font-semibold ${
                                            order.statusRaw === 'delivered'
                                                ? 'border-[#FA4234] bg-[#fff1ef] text-[#FA4234]'
                                                : order.statusRaw === 'cancelled'
                                                    ? 'border-[#9a9a9a] bg-[#f4f4f4] text-[#666]'
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
                            {userDraftErrors.login && (
                                <p className="mt-1 text-[12px] text-red-500">{userDraftErrors.login}</p>
                            )}
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
                            {userDraftErrors.email && (
                                <p className="mt-1 text-[12px] text-red-500">{userDraftErrors.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-[13px] font-semibold uppercase tracking-wide text-[#777]">Телефон</label>
                            <input
                                value={userDraft.phone}
                                onChange={(event) => setUserDraft((prev) => ({ ...prev, phone: formatRuPhone(event.target.value) }))}
                                placeholder="+7(XXX)-XXX-XX-XX"
                                className="h-[44px] w-full rounded-md border border-[#f1b3ad] px-3 text-[15px] outline-none transition-colors focus:border-[#FA4234]"
                            />
                            {userDraftErrors.phone && (
                                <p className="mt-1 text-[12px] text-red-500">{userDraftErrors.phone}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsUserModalOpen(false)}
                                className="btn-fill h-[40px] min-w-[120px] rounded-md px-4 text-[14px] font-medium"
                            >
                                <span className="relative z-10">Отмена</span>
                            </button>
                            <button
                                type="submit"
                                disabled={isUserSaveLoading}
                                className="btn-fill h-[40px] min-w-[140px] rounded-md px-5 text-[14px] font-semibold"
                            >
                                <span className="relative z-10">{isUserSaveLoading ? 'Сохранение...' : 'Сохранить'}</span>
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
                                className="btn-fill h-[40px] min-w-[120px] rounded-md px-4 text-[14px] font-medium"
                            >
                                <span className="relative z-10">Отмена</span>
                            </button>
                            <button
                                type="submit"
                                className="btn-fill h-[40px] min-w-[140px] rounded-md px-5 text-[14px] font-semibold"
                            >
                                <span className="relative z-10">Сохранить</span>
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {selectedOrder && (
                <Modal title={`Заказ #${selectedOrder.number}`} onClose={() => setSelectedOrder(null)}>
                    <div className="space-y-4">
                        <div className="rounded-xl border border-[#efefef] bg-[#fcfcfc] px-4 py-3">
                            <p className="text-[13px] text-[#666]">
                                Статус: <span className="font-semibold text-[#1f1f1f]">{selectedOrder.status}</span>
                            </p>
                            <p className="mt-1 text-[13px] text-[#666]">
                                Дата оформления: <span className="font-semibold text-[#1f1f1f]">{selectedOrder.created_at || '—'}</span>
                            </p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-[#efefef]">
                            <div className="grid grid-cols-[1fr_90px_120px] bg-[#f8f8f8] px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-[#777]">
                                <p>Товар</p>
                                <p className="text-center">Кол-во</p>
                                <p className="text-right">Сумма</p>
                            </div>
                            {(selectedOrder.items_detailed || []).map((item) => (
                                <div key={item.id} className="grid grid-cols-[1fr_90px_120px] border-t border-[#efefef] px-4 py-3 text-[14px] text-[#2f2f2f]">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-[12px] text-[#777]">{item.model || '—'}</p>
                                        <p className="text-[12px] text-[#777]">{formatPrice(item.price)} за шт.</p>
                                    </div>
                                    <p className="self-center text-center">{item.qty}</p>
                                    <p className="self-center text-right font-semibold">{formatPrice(item.sum)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-[#efefef] bg-[#fcfcfc] px-4 py-3">
                            <p className="text-[15px] font-medium text-[#333]">Итого</p>
                            <p className="text-[20px] font-semibold text-[#FA4234]">{formatPrice(selectedOrder.total)}</p>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Profile;
