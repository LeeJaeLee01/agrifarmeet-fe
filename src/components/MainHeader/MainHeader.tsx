import { Menu, Dropdown } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { NavLink, useNavigate } from 'react-router-dom';
import './MainHeader.scss';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '../../store/slices/authSlice';

const MainHeader = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const username = useSelector((state: RootState) => state.auth.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearToken()); // clear token + username
    navigate('/');
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: 'logout',
          label: (
            <span onClick={handleLogout} style={{ color: 'red' }}>
              Đăng xuất
            </span>
          ),
        },
      ]}
    />
  );

  return (
    <Header className="header">
      <div className="logo">
        <NavLink to="/">
          <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
        </NavLink>
      </div>

      <div className="flex items-center gap-4">
        <NavLink
          to="/"
          className="user-info"
          style={({ isActive }) => ({
            color: isActive ? '#2f751d' : 'inherit',
            fontWeight: isActive ? 600 : 'normal',
            fontSize: 16,
          })}
        >
          Trang chủ
        </NavLink>

        {token ? (
          <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
            <span className="cursor-pointer user-info" style={{ fontSize: 16 }}>
              {username}
            </span>
          </Dropdown>
        ) : (
          <NavLink
            to="/login"
            className="user-info"
            style={({ isActive }) => ({
              color: isActive ? '#2f751d' : 'inherit',
              fontWeight: isActive ? 600 : 'normal',
              fontSize: 16,
            })}
          >
            Đăng nhập
          </NavLink>
        )}

        <NavLink
          to="/cart"
          className="user-info"
          style={({ isActive }) => ({
            color: isActive ? '#2f751d' : 'inherit',
            fontWeight: isActive ? 600 : 'normal',
            fontSize: 16,
          })}
        >
          Giỏ hàng
        </NavLink>
      </div>
    </Header>
  );
};

export default MainHeader;
