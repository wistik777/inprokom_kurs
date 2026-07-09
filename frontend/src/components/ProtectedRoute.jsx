import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStaffLoginPath } from '../api/client';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requireAdmin = false, requireManager = false }) {
    const { user, loading, isAdmin, isManager } = useAuth();
    const location = useLocation();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to={`/${getStaffLoginPath()}`} replace state={{ from: location.pathname }} />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/manager" replace />;
    }

    if (requireManager && !isManager && !isAdmin) {
        return <Navigate to={`/${getStaffLoginPath()}`} replace />;
    }

    return children;
}

export default ProtectedRoute;
