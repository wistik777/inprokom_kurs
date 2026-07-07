const API_BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '');

export class ApiError extends Error {
    constructor(message, { status, errors, data } = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
        this.data = data;
    }
}

export async function apiRequest(path, options = {}) {
    const { method = 'GET', body, formData, headers = {} } = options;

    const init = {
        method,
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            ...headers,
        },
    };

    if (formData) {
        init.body = formData;
    } else if (body !== undefined) {
        init.headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${path}`, init);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new ApiError(data.message || 'Ошибка запроса', {
            status: response.status,
            errors: data.errors,
            data,
        });
    }

    return data;
}

export const api = {
    auth: {
        login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
        me: () => apiRequest('/auth/me'),
        logout: () => apiRequest('/auth/logout', { method: 'POST' }),
    },
    public: {
        news: () => apiRequest('/news'),
        newsShow: (id) => apiRequest(`/news/${id}`),
        products: () => apiRequest('/products'),
        productShow: (id) => apiRequest(`/products/${id}`),
        vacancies: () => apiRequest('/vacancies'),
        contactMessage: (payload) => apiRequest('/contact-messages', { method: 'POST', body: payload }),
        vacancyApplication: (formData) =>
            apiRequest('/vacancy-applications', { method: 'POST', formData }),
        newsletterSubscribe: (payload) =>
            apiRequest('/newsletter/subscribe', { method: 'POST', body: payload }),
    },
    admin: {
        dashboard: () => apiRequest('/admin/dashboard'),
        statistics: (period = 'all') =>
            apiRequest(`/admin/statistics?period=${encodeURIComponent(period)}`),
        createManager: (payload) => apiRequest('/admin/managers', { method: 'POST', body: payload }),
        deleteManager: (id) => apiRequest(`/admin/managers/${id}`, { method: 'DELETE' }),
        rollbackAuditLog: (id) =>
            apiRequest(`/admin/audit-logs/${id}/rollback`, { method: 'POST' }),
    },
    manager: {
        products: () => apiRequest('/manager/products'),
        createProduct: (formData) =>
            apiRequest('/manager/products', { method: 'POST', formData }),
        deleteProduct: (id) => apiRequest(`/manager/products/${id}`, { method: 'DELETE' }),
        inbox: () => apiRequest('/manager/inbox'),
        updateFeedbackStatus: (id, status) =>
            apiRequest(`/manager/feedback/${id}`, { method: 'PATCH', body: { status } }),
        updateVacancyStatus: (id, status) =>
            apiRequest(`/manager/vacancy-applications/${id}`, { method: 'PATCH', body: { status } }),
        content: () => apiRequest('/manager/content'),
        previewNews: (id) => apiRequest(`/manager/content/news/${id}/preview`),
        createNews: (payload) => apiRequest('/manager/content/news', { method: 'POST', body: payload }),
        updateNews: (id, payload) =>
            apiRequest(`/manager/content/news/${id}`, { method: 'PATCH', body: payload }),
        deleteNews: (id) => apiRequest(`/manager/content/news/${id}`, { method: 'DELETE' }),
        createVacancy: (payload) =>
            apiRequest('/manager/content/vacancies', { method: 'POST', body: payload }),
        updateVacancy: (id, payload) =>
            apiRequest(`/manager/content/vacancies/${id}`, { method: 'PATCH', body: payload }),
        deleteVacancy: (id) =>
            apiRequest(`/manager/content/vacancies/${id}`, { method: 'DELETE' }),
    },
};

export function getStaffLoginPath() {
    return import.meta.env.VITE_STAFF_LOGIN_PATH || 'inprokom-staff';
}

export function resolveAssetUrl(url) {
    if (!url) return url;
    if (/^https?:\/\//.test(url)) return url;

    if (url.startsWith('/storage/')) {
        const apiBase =
            import.meta.env.VITE_API_URL?.replace(/\/api\/v1\/?$/, '') ||
            import.meta.env.VITE_API_PROXY_TARGET ||
            '';

        if (apiBase) {
            return `${apiBase.replace(/\/$/, '')}${url}`;
        }
    }

    return url;
}
