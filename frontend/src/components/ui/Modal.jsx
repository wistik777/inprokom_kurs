import React from "react";

function Modal({ title, children, onClose, maxWidth = "max-w-[560px]" }) {
    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4"
            onClick={onClose}
        >
            <div
                className={`w-full ${maxWidth} max-h-[90dvh] overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)]`}
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-[24px] font-semibold text-[#1b1b1b]">{title}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 w-9 shrink-0 rounded-md border border-[#ececec] text-[20px] leading-none text-[#666] transition-colors hover:border-[#FA4234] hover:text-[#FA4234]"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default Modal;
