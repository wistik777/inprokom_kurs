import React from "react";
import Modal from "../ui/Modal";

const formatPrice = (value) => `${Number(value || 0).toFixed(2)}р`;

function OrderDetailsModal({ order, onClose, statusLabel, showCustomer = false }) {
    if (!order) {
        return null;
    }

    const orderNumber = order.number ?? order.id;
    const statusText = statusLabel ?? order.status ?? "—";

    return (
        <Modal title={`Заказ #${orderNumber}`} onClose={onClose}>
            <div className="space-y-4">
                <div className="rounded-xl border border-[#efefef] bg-[#fcfcfc] px-4 py-3">
                    <p className="text-[13px] text-[#666]">
                        Статус: <span className="font-semibold text-[#1f1f1f]">{statusText}</span>
                    </p>
                    <p className="mt-1 text-[13px] text-[#666]">
                        Дата оформления:{" "}
                        <span className="font-semibold text-[#1f1f1f]">{order.created_at || "—"}</span>
                    </p>
                </div>

                {showCustomer && order.user && (
                    <div className="rounded-xl border border-[#efefef] bg-[#fcfcfc] px-4 py-3">
                        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#777]">Клиент</p>
                        <p className="mt-2 text-[14px] font-medium text-[#1f1f1f]">
                            {order.user.login || "Гость"}
                        </p>
                        <p className="mt-1 text-[13px] text-[#666]">{order.user.email || "—"}</p>
                        {order.user.phone && (
                            <p className="mt-1 text-[13px] text-[#666]">{order.user.phone}</p>
                        )}
                    </div>
                )}

                <div className="overflow-hidden rounded-xl border border-[#efefef]">
                    <div className="grid grid-cols-[1fr_90px_120px] bg-[#f8f8f8] px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-[#777]">
                        <p>Товар</p>
                        <p className="text-center">Кол-во</p>
                        <p className="text-right">Сумма</p>
                    </div>
                    {(order.items_detailed || []).length > 0 ? (
                        order.items_detailed.map((item) => (
                            <div
                                key={item.id ?? `${item.name}-${item.qty}`}
                                className="grid grid-cols-[1fr_90px_120px] border-t border-[#efefef] px-4 py-3 text-[14px] text-[#2f2f2f]"
                            >
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-[12px] text-[#777]">{item.model || "—"}</p>
                                    <p className="text-[12px] text-[#777]">{formatPrice(item.price)} за шт.</p>
                                </div>
                                <p className="self-center text-center">{item.qty}</p>
                                <p className="self-center text-right font-semibold">{formatPrice(item.sum)}</p>
                            </div>
                        ))
                    ) : (
                        <p className="border-t border-[#efefef] px-4 py-4 text-[14px] text-[#777]">
                            {order.items || "Состав заказа недоступен"}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#efefef] bg-[#fcfcfc] px-4 py-3">
                    <p className="text-[15px] font-medium text-[#333]">Итого</p>
                    <p className="text-[20px] font-semibold text-[#FA4234]">{formatPrice(order.total)}</p>
                </div>
            </div>
        </Modal>
    );
}

export default OrderDetailsModal;
