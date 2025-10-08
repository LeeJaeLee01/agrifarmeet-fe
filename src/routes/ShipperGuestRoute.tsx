import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
}

interface Props {
  children: React.ReactNode;
}

const ShipperGuestRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('shipperToken');

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.role === 'shipper') {
        return <Navigate to="/shipper" replace />;
      }
    } catch {
      localStorage.removeItem('shipperToken');
    }
  }

  return <>{children}</>;
};

export default ShipperGuestRoute;
