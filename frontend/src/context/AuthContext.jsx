import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const response = await api.auth.me();
            setUser(response.data || null);
            return response.data || null;
        } catch {
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        refresh().finally(() => setLoading(false));
    }, [refresh]);

    const login = useCallback(async (credentials) => {
        const response = await api.auth.login(credentials);
        setUser(response.data || null);
        return response;
    }, []);

    const logout = useCallback(async () => {
        await api.auth.logout();
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            isAdmin: user?.role === 'admin',
            isManager: user?.role === 'manager',
            isStaff: user?.role === 'admin' || user?.role === 'manager',
            login,
            logout,
            refresh,
        }),
        [user, loading, login, logout, refresh]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
