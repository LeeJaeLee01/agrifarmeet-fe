import React from 'react';
import { Modal, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) {
    return (
      <Modal
        open={true} // mở luôn, không cần state
        title="Thông báo"
        closable={false}
        centered
        footer={[
          <Button key="cancel" onClick={() => navigate('/')}>
            Hủy bỏ
          </Button>,
          <Button
            key="login"
            type="primary"
            className="bg-green"
            onClick={() => navigate('/login', { state: { from: location } })}
          >
            Đăng nhập
          </Button>,
        ]}
      >
        <p>Vui lòng đăng nhập để tiếp tục.</p>
      </Modal>
    );
  }

  // ✅ chỉ render khi có token
  return <>{children}</>;
};

export default PrivateRoute;
