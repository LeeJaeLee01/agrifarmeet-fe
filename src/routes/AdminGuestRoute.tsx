import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
}

interface Props {
  children: React.ReactNode;
}

const AdminGuestRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.role === 'admin') {
        return <Navigate to="/admin" replace />;
      }
    } catch {
      localStorage.removeItem('adminToken');
    }
  }

  return <>{children}</>;
};

export default AdminGuestRoute;
