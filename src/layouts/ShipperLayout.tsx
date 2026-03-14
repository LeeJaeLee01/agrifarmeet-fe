import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar } from 'antd';
import { useLocation, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  TruckOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { setToken } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const { Header, Sider, Content } = Layout;

const ShipperLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  let path = location.pathname.replace(/^\/shipper\/?/, '');
  if (path === '') path = 'dashboard';

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Menu bên trái
  const menuItems = [
    {
      key: 'dashboard',
      icon: <TruckOutlined />,
      label: <Link to="/shipper">Danh sách đơn hàng</Link>,
    },
  ];

  // ✅ Menu dropdown user
  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <ProfileOutlined />,
          label: <Link to="/shipper/profile">Thông tin cá nhân</Link>,
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <Link to="/shipper/settings">Cài đặt</Link>,
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          danger: true,
          icon: <LogoutOutlined />,
          label: 'Đăng xuất',
          onClick: () => {
            localStorage.removeItem('shipperToken');
            localStorage.removeItem('shipperPhone');
            dispatch(setToken(''));
            navigate('/shipper');
          },
        },
      ]}
    />
  );

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        width={220}
        trigger={null}
        className="bg-white shadow"
      >
        <div className="flex items-center justify-center h-16 py-3 text-base font-semibold lg:text-lg">
          <img src="/logo.png" alt="logo" className="object-cover h-full" />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[path]}
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
        />
      </Sider>

      {/* Main layout */}
      <Layout>
        <Header className="flex items-center justify-between h-16 px-4 bg-white shadow">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="mr-4"
            />
            <h1 className="mb-0 text-base font-semibold text-gray-700 lg:text-lg">
              Shipper Dashboard
            </h1>
          </div>

          {/* Avatar dropdown */}
          <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar
                size="large"
                src="https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
              />
            </div>
          </Dropdown>
        </Header>

        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ShipperLayout;
