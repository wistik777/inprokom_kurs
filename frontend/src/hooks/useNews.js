import { useApiQuery } from './useApiQuery';
import { api } from '../api/client';

export function useNewsItems() {
    const query = useApiQuery(() => api.public.news().then((response) => response.data || []), []);

    return {
        newsItems: query.data || [],
        loading: query.loading,
        error: query.error,
        reload: query.reload,
    };
}

export function useNewsArticle(newsId) {
    const query = useApiQuery(
        () => {
            if (!newsId) {
                return Promise.resolve(null);
            }

            return api.public.newsShow(newsId).then((response) => response.data || null);
        },
        [newsId]
    );

    return {
        article: query.data,
        loading: query.loading,
        error: query.error,
        reload: query.reload,
    };
}
