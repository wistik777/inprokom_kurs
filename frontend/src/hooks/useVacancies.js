import { useApiQuery } from './useApiQuery';
import { api } from '../api/client';

export function useVacancyList() {
    const query = useApiQuery(() => api.public.vacancies().then((response) => response.data || []), []);

    return {
        vacancies: query.data || [],
        loading: query.loading,
        error: query.error,
        reload: query.reload,
    };
}
