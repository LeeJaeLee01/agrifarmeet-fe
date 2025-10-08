import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
  exp?: number;
}

interface Props {
  children: React.ReactNode;
}

const ShipperRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('shipperToken');
  const location = useLocation();

  // ❌ Không có token → quay lại login
  if (!token) {
    return <Navigate to="/shipper/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // ❌ Token không đúng role → chặn truy cập
    if (decoded.role !== 'shipper') {
      return <Navigate to="/" replace />;
    }

    // ✅ Token hợp lệ → cho phép truy cập
    return <>{children}</>;
  } catch (error) {
    console.error('Invalid shipper token:', error);
    localStorage.removeItem('shipperToken');
    return <Navigate to="/shipper/login" replace />;
  }
};

export default ShipperRoute;
