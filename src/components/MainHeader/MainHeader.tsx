import { MenuProps, Dropdown, Layout } from 'antd';
import { MenuOutlined, CloseOutlined, BellOutlined } from '@ant-design/icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './MainHeader.scss';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '../../store/slices/authSlice';
import { Fragment, useState } from 'react';

const { Header } = Layout;

const MainHeader = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const username = useSelector((state: RootState) => state.auth.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/');
    setOpen(false);
  };

  const userMenu: MenuProps = {
    items: [
      {
        key: 'user-info',
        label: <Link to="/customer-info">Thông tin của tôi</Link>,
      },
      {
        key: 'order',
        label: <Link to="/shipping">Đơn mua</Link>,
      },
      {
        key: 'logout',
        label: (
          <span onClick={handleLogout} className="text-red">
            Đăng xuất
          </span>
        ),
      },
    ],
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block lg:px-3 lg:py-2 text-[16px] transition-colors duration-200 hover:text-green2 ${
      isActive ? 'text-green font-semibold' : 'text-gray-700'
    }`;

  return (
    <Fragment>
      <div className="flex items-center justify-center w-full h-10 text-center text-white bg-green">
        Minh bạch - an toàn - bền vững
      </div>
      <Header className="h-auto bg-white shadow-sm header">
        <div className="container flex items-center justify-between mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-10 logo">
            <NavLink to="/">
              <img src="/logo.png" alt="Logo" className="h-20 py-2" />
            </NavLink>
            {/* <p className="m-0 text-green">Minh bạch - an toàn - bền vững</p> */}
          </div>

          {/* Menu desktop */}
          <div className="items-center hidden gap-5 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Trang chủ
            </NavLink>

            <NavLink to="/farm-stand" className={navLinkClass}>
              Farm stand
            </NavLink>

            <NavLink to="/event" className={navLinkClass}>
              Sự kiện
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              Về chúng tôi
            </NavLink>

            {token ? (
              <div className="flex items-center gap-5">
                <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
                  <span className="cursor-pointer text-[16px] text-gray-700 hover:text-green-700">
                    {username}
                  </span>
                </Dropdown>
                <BellOutlined className="text-xl cursor-pointer" />
              </div>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                Đăng nhập
              </NavLink>
            )}

            {/* <NavLink to="/cart" className={navLinkClass}>
              <ShoppingCartOutlined className="text-xl cursor-pointer" />
            </NavLink> */}
          </div>

          {/* Mobile toggle button */}
          <div className="flex items-center gap-5 md:hidden">
            {open ? (
              <CloseOutlined className="text-xl cursor-pointer" onClick={() => setOpen(false)} />
            ) : (
              <MenuOutlined className="text-xl cursor-pointer" onClick={() => setOpen(true)} />
            )}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`absolute border border-gray max-h-fit -z-10 left-0 w-full shadow-sm transition-all overflow-hidden bg-white top-20 md:hidden bg-gray-50 ${
            open ? 'h-screen' : 'h-0'
          }`}
        >
          <nav className="flex flex-col gap-1 px-5 py-3">
            <NavLink to="/" className={navLinkClass} onClick={() => setOpen(false)}>
              Trang chủ
            </NavLink>

            <NavLink to="/farm-stand" className={navLinkClass} onClick={() => setOpen(false)}>
              Farm stand
            </NavLink>

            <NavLink to="/event" className={navLinkClass} onClick={() => setOpen(false)}>
              Sự kiện
            </NavLink>

            <NavLink to="/about" className={navLinkClass} onClick={() => setOpen(false)}>
              Về chúng tôi
            </NavLink>

            {token ? (
              <>
                <NavLink
                  to="/customer-info"
                  className={navLinkClass}
                  onClick={() => setOpen(false)}
                >
                  Thông tin của tôi
                </NavLink>
                <NavLink to="/order" className={navLinkClass} onClick={() => setOpen(false)}>
                  Đơn mua
                </NavLink>
              </>
            ) : (
              <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>
                Đăng nhập
              </NavLink>
            )}

            <span
              className={`${
                token ? 'flex' : 'hidden'
              } items-center h-16 text-base cursor-pointer text-red`}
              onClick={handleLogout}
            >
              Đăng xuất
            </span>
          </nav>
        </div>
      </Header>
    </Fragment>
  );
};

export default MainHeader;
