import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const userString = localStorage.getItem('google_user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
