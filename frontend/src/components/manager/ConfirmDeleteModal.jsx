function ConfirmDeleteModal({ title, name, description, onConfirm, onClose, submitting = false }) {
    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 px-4" onClick={onClose}>
            <div
                className="w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
                onClick={(event) => event.stopPropagation()}
            >
                <h3 className="text-[26px] font-semibold text-[#1b1b1b]">{title}</h3>
                <p className="mt-3 text-[16px] text-[#444]">
                    Точно ли вы хотите удалить <span className="font-semibold">«{name}»</span>?
                </p>
                {description && <p className="mt-2 text-[14px] text-[#777]">{description}</p>}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-fill h-[44px] min-w-[140px] bg-white px-5 py-2 text-[14px] font-semibold"
                    >
                        <span className="relative z-10">Отмена</span>
                    </button>
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={onConfirm}
                        className="h-[44px] min-w-[140px] border-2 border-[#FA4234] bg-[#FA4234] px-5 py-2 text-[14px] font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-[#FA4234] disabled:opacity-60"
                    >
                        {submitting ? 'Удаление…' : 'Удалить'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDeleteModal;
