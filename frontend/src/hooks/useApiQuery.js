import { useCallback, useEffect, useState } from 'react';

export function useApiQuery(fetcher, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetcher();
            setData(result);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => {
        reload().catch(() => {});
    }, [reload]);

    return { data, loading, error, reload, setData };
}
