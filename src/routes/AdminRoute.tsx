import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
}

interface Props {
  children: React.ReactNode;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  } catch {
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
