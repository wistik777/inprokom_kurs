import React, { useState } from 'react';
import { api, ApiError } from '../../api/client';
import ConfirmDeleteModal from './ConfirmDeleteModal';

function ManagerCategories({ categories, onChanged, onError }) {
    const [expandedCategory, setExpandedCategory] = useState(-1);
    const [createModal, setCreateModal] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleCreate = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = String(formData.get('name') || '').trim();
        const parentId = createModal?.parentId ? Number(createModal.parentId) : null;

        setFormError('');
        setSubmitting(true);

        try {
            const response = await api.manager.createCategory({
                name,
                parent_id: parentId,
            });
            setCreateModal(null);
            event.currentTarget.reset();
            await onChanged(response.message);
        } catch (error) {
            if (error instanceof ApiError && error.errors?.name) {
                setFormError(error.errors.name[0]);
            } else {
                setFormError(error.message || 'Не удалось создать раздел');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setSubmitting(true);

        try {
            const response = await api.manager.deleteCategory(deleteTarget.id);
            setDeleteTarget(null);
            await onChanged(response.message);
        } catch (error) {
            onError(error.message || 'Не удалось удалить раздел');
            setDeleteTarget(null);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <aside className="w-full shrink-0 bg-white p-3 lg:w-[300px]">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-[18px] font-semibold uppercase">Разделы</h2>
                    <button
                        type="button"
                        onClick={() => setCreateModal({ type: 'section' })}
                        className="btn-fill inline-flex h-[36px] items-center justify-center bg-white px-3 text-[12px] font-semibold"
                    >
                        <span className="relative z-10">+ Раздел</span>
                    </button>
                </div>

                <ul>
                    {categories.map((category, index) => (
                        <li key={category.id} className="border-t border-[#FA4234]">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setExpandedCategory(expandedCategory === index ? -1 : index)}
                                    className="flex min-w-0 flex-1 cursor-pointer items-center justify-between py-3 text-left text-[16px] leading-tight transition-colors duration-200 hover:text-[#FA4234]"
                                >
                                    <span className="pr-2">{category.name}</span>
                                    <span
                                        className={`shrink-0 transition-transform duration-300 ${expandedCategory === index ? 'rotate-90 text-[#FA4234]' : 'text-black'}`}
                                    >
                                        &#9656;
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteTarget({ id: category.id, name: category.name, type: 'section' })}
                                    className="shrink-0 text-[12px] font-semibold uppercase tracking-wide text-[#999] transition hover:text-[#FA4234]"
                                >
                                    Удалить
                                </button>
                            </div>

                            <ul
                                className={`overflow-hidden pl-2 transition-all duration-300 ${expandedCategory === index ? 'max-h-64 pb-2' : 'max-h-0'}`}
                            >
                                {(category.children || []).map((child) => (
                                    <li key={child.id} className="flex items-center justify-between gap-2">
                                        <span className="py-1 text-[14px] text-[#555]">{child.name}</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeleteTarget({
                                                    id: child.id,
                                                    name: child.name,
                                                    type: 'subsection',
                                                })
                                            }
                                            className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-[#999] transition hover:text-[#FA4234]"
                                        >
                                            Удалить
                                        </button>
                                    </li>
                                ))}
                                <li className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCreateModal({
                                                type: 'subsection',
                                                parentId: category.id,
                                                parentName: category.name,
                                            })
                                        }
                                        className="text-[13px] font-semibold text-[#FA4234] transition hover:opacity-80"
                                    >
                                        + Подраздел
                                    </button>
                                </li>
                            </ul>
                        </li>
                    ))}
                </ul>

                {categories.length === 0 && (
                    <p className="py-6 text-center text-[14px] text-[#777]">Разделы пока не созданы</p>
                )}
            </aside>

            {createModal && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4" onClick={() => setCreateModal(null)}>
                    <div
                        className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-[26px] font-semibold text-[#1b1b1b]">
                            {createModal.type === 'subsection' ? 'Новый подраздел' : 'Новый раздел'}
                        </h3>
                        {createModal.parentName && (
                            <p className="mt-2 text-[14px] text-[#777]">Раздел: {createModal.parentName}</p>
                        )}

                        <form onSubmit={handleCreate} className="mt-5">
                            <label className="mb-1 block text-[12px] font-semibold uppercase tracking-wide text-[#777]">
                                Название
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="h-[44px] w-full rounded-md border border-[#FA4234] bg-white px-3 text-[15px] outline-none"
                                required
                            />
                            {formError && <p className="mt-2 text-[13px] text-red-500">{formError}</p>}

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCreateModal(null)}
                                    className="btn-fill h-[44px] min-w-[130px] bg-white px-5 text-[14px] font-semibold"
                                >
                                    <span className="relative z-10">Отмена</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-fill h-[44px] min-w-[150px] bg-white px-5 text-[14px] font-semibold disabled:opacity-60"
                                >
                                    <span className="relative z-10">{submitting ? 'Сохранение…' : 'Создать'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <ConfirmDeleteModal
                    title="Подтверждение удаления"
                    name={deleteTarget.name}
                    description={
                        deleteTarget.type === 'section'
                            ? 'Раздел можно удалить только если в нём нет подразделов и товаров.'
                            : 'Подраздел можно удалить только если к нему не привязаны товары.'
                    }
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    submitting={submitting}
                />
            )}
        </>
    );
}

export default ManagerCategories;
