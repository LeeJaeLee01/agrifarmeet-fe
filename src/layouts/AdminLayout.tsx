import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar } from 'antd';
import { useLocation, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ProductOutlined,
  CodeSandboxOutlined,
  CarryOutOutlined,
  TagOutlined,
  TruckOutlined,
  BellOutlined,
  UnorderedListOutlined,
  CommentOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { setToken } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import LanguageSwitcher from '../components/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  let path = location.pathname.replace(/^\/admin\/?/, '');
  if (path === '') path = 'dashboard';

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const menuItems = [
    // {
    //   key: 'dashboard',
    //   icon: <HomeOutlined />,
    //   label: <Link to="/admin">{t('admin.dashboard')}</Link>,
    // },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">{t('admin.users')}</Link>,
    },
    {
      key: 'categories',
      icon: <TagOutlined />,
      label: <Link to="/admin/categories">{t('admin.categories')}</Link>,
    },
    {
      key: 'products',
      icon: <ProductOutlined />,
      label: <Link to="/admin/products">{t('admin.products')}</Link>,
    },
    {
      key: 'boxes',
      icon: <CodeSandboxOutlined />,
      label: <Link to="/admin/boxes">{t('admin.boxes')}</Link>,
    },
    // {
    //   key: 'box-vegetables',
    //   icon: <UnorderedListOutlined />,
    //   label: <Link to="/admin/box-vegetables">{t('admin.boxVegetables')}</Link>,
    // },
    {
      key: 'experience-weekly',
      icon: <CarryOutOutlined />,
      label: <Link to="/admin/experience-weekly">{t('admin.experienceWeekly')}</Link>,
    },
    {
      key: 'feedbacks',
      icon: <CommentOutlined />,
      label: <Link to="/admin/feedbacks">{t('admin.feedbacks')}</Link>,
    },
    {
      key: 'news',
      icon: <BellOutlined />,
      label: <Link to="/admin/news">{t('admin.news')}</Link>,
    },
    {
      key: 'user-boxes',
      icon: <BarChartOutlined />,
      label: <Link to="/admin/user-boxes">{t('admin.userBoxes')}</Link>,
    },
    {
      key: 'shippings',
      icon: <TruckOutlined />,
      label: <Link to="/admin/shippings">{t('admin.shippings')}</Link>,
    },
    {
      key: 'shippers',
      icon: <TruckOutlined />,
      label: <Link to="/admin/shippers">{t('admin.shippers')}</Link>,
    },
  ];

  // Menu dropdown của avatar
  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <ProfileOutlined />,
          label: <Link to="/admin/profile">{t('common.myInfo')}</Link>,
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin/settings">{t('common.settings')}</Link>,
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          danger: true,
          icon: <LogoutOutlined />,
          label: t('common.logout'),
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

          {/* Language Switcher + Bell + Avatar + Dropdown */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <BellOutlined className="text-xl cursor-pointer" />
            <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  size="large"
                  src="https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1"
                />
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6 overflow-hidden bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
