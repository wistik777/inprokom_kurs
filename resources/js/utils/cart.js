const isBrowser = () => typeof window !== 'undefined';
let cartItemsCache = [];
let cartCountCache = 0;

const emitCartUpdated = () => {
    if (!isBrowser()) return;
    window.dispatchEvent(new Event('cart:updated'));
};

const emitCartAdded = (payload) => {
    if (!isBrowser()) return;
    window.dispatchEvent(new CustomEvent('cart:added', { detail: payload }));
};

const getCsrfToken = () => {
    if (!isBrowser()) return '';
    return document.querySelector('meta[name="csrf-token"]')?.content || '';
};

const request = async (url, options = {}) => {
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
            ...(options.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`Cart request failed with status ${response.status}`);
    }

    return response.json();
};

const syncCache = (payload) => {
    cartItemsCache = Array.isArray(payload?.items) ? payload.items : [];
    cartCountCache = Number(payload?.count || 0);
};

export const loadCart = async () => {
    const payload = await request('/cart/data');
    syncCache(payload);
    emitCartUpdated();
    return cartItemsCache;
};

export const getCartItems = () => cartItemsCache;

export const getCartCount = () => {
    return cartCountCache;
};

export const addToCart = async (product, qty = 1) => {
    const nextQty = Math.max(1, Number(qty) || 1);
    const payload = await request('/cart/items', {
        method: 'POST',
        body: JSON.stringify({
            product_id: Number(product.id),
            qty: nextQty,
        }),
    });

    syncCache(payload);
    emitCartUpdated();

    const addedItem = cartItemsCache.find((item) => Number(item.id) === Number(product.id));
    emitCartAdded({
        productName: addedItem?.name || product.name,
        qty: nextQty,
        totalQty: Number(addedItem?.qty || nextQty),
    });
};

export const setItemQty = async (productId, qty) => {
    const nextQty = Math.max(0, Number(qty) || 0);
    const payload = await request(`/cart/items/${Number(productId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ qty: nextQty }),
    });
    syncCache(payload);
    emitCartUpdated();
};

export const removeFromCart = async (productId) => {
    const payload = await request(`/cart/items/${Number(productId)}`, {
        method: 'DELETE',
    });
    syncCache(payload);
    emitCartUpdated();
};

export const clearCart = async () => {
    const payload = await request('/cart/items', {
        method: 'DELETE',
    });
    syncCache(payload);
    emitCartUpdated();
};

export const checkoutCart = async () => {
    const payload = await request('/checkout', {
        method: 'POST',
    });

    await loadCart();

    return payload;
};
