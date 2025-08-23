import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token'); // check token
  const location = useLocation();

  if (!token) {
    // chưa login → redirect về login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>; // đã login → cho phép vào
};

export default PrivateRoute;
