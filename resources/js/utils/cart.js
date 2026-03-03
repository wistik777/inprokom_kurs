const CART_KEY = 'inprokom_cart_items';

const isBrowser = () => typeof window !== 'undefined';

const emitCartUpdated = () => {
    if (!isBrowser()) return;
    window.dispatchEvent(new Event('cart:updated'));
};

const emitCartAdded = (payload) => {
    if (!isBrowser()) return;
    window.dispatchEvent(new CustomEvent('cart:added', { detail: payload }));
};

const readCart = () => {
    if (!isBrowser()) return [];

    try {
        const raw = window.localStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeCart = (items) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    emitCartUpdated();
};

export const getCartItems = () => readCart();

export const getCartCount = () => {
    return readCart().reduce((sum, item) => sum + Number(item.qty || 0), 0);
};

export const addToCart = (product, qty = 1) => {
    const nextQty = Math.max(1, Number(qty) || 1);
    const current = readCart();
    const productId = Number(product.id);
    const existing = current.find((item) => Number(item.id) === productId);

    if (existing) {
        existing.qty = Number(existing.qty || 0) + nextQty;
        writeCart(current);
        emitCartAdded({
            productName: existing.name,
            qty: nextQty,
            totalQty: existing.qty,
        });
        return;
    }

    current.push({
        id: productId,
        name: product.name,
        model: product.model,
        description: product.description || '',
        price: Number(product.price),
        image_url: product.image_url,
        stock: Number(product.stock || 0),
        qty: nextQty,
    });

    writeCart(current);
    emitCartAdded({
        productName: product.name,
        qty: nextQty,
        totalQty: nextQty,
    });
};

export const setItemQty = (productId, qty) => {
    const nextQty = Number(qty) || 0;
    const current = readCart();
    const updated = current
        .map((item) => {
            if (Number(item.id) !== Number(productId)) return item;
            return { ...item, qty: nextQty };
        })
        .filter((item) => Number(item.qty) > 0);

    writeCart(updated);
};

export const removeFromCart = (productId) => {
    const updated = readCart().filter((item) => Number(item.id) !== Number(productId));
    writeCart(updated);
};

export const clearCart = () => {
    writeCart([]);
};
