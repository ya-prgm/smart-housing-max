import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/auth/login',
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'uk_staff') {
      return <Navigate to="/uk/dashboard" replace />;
    }
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
};
