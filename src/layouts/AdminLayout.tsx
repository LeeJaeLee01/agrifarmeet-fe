import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar } from 'antd';
import { useLocation, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ProductOutlined,
  CodeSandboxOutlined,
  CarryOutOutlined,
  TagOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { setToken } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  let path = location.pathname.replace(/^\/admin\/?/, '');
  if (path === '') path = 'dashboard';

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý Users</Link>,
    },
    {
      key: 'categories',
      icon: <TagOutlined />,
      label: <Link to="/admin/categories">Quản lý Danh mục</Link>,
    },
    {
      key: 'products',
      icon: <ProductOutlined />,
      label: <Link to="/admin/products">Quản lý sản phẩm</Link>,
    },
    {
      key: 'boxes',
      icon: <CodeSandboxOutlined />,
      label: <Link to="/admin/boxes">Quản lý gói</Link>,
    },
    {
      key: 'shippings',
      icon: <TruckOutlined />,
      label: <Link to="/admin/shippings">Quản lý giao hàng</Link>,
    },
  ];

  // Menu dropdown của avatar
  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <ProfileOutlined />,
          label: <Link to="/admin/profile">Thông tin tài khoản</Link>,
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin/settings">Cài đặt</Link>,
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
            // TODO: handle logout logic
            localStorage.removeItem('adminToken');
            dispatch(setToken(''));
            navigate('/admin/login');
          },
        },
      ]}
    />
  );

  return (
    <Layout className="min-h-screen">
      {/* Sidebar menu bên trái */}
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
          <img src="/logo.png" alt="" className="object-cover h-full" />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[path]}
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
        />
      </Sider>

      {/* Layout chính */}
      <Layout>
        {/* Header */}
        <Header className="flex items-center justify-between h-16 px-4 bg-white shadow">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="mr-4"
            />
            <h1 className="mb-0 text-base font-semibold text-gray-700 lg:text-lg">Admin</h1>
          </div>

          {/* Avatar + Dropdown */}
          <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
            <Avatar
              size="large"
              src="https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
              className="cursor-pointer"
            />
          </Dropdown>
        </Header>

        {/* Content */}
        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
