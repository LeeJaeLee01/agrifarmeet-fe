import { MenuProps, Dropdown, Layout } from 'antd';
import { MenuOutlined, CloseOutlined, BellOutlined } from '@ant-design/icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './MainHeader.scss';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '../../store/slices/authSlice';
import React, { Fragment, useState, useEffect, useRef } from 'react';

const { Header } = Layout;

type MainHeaderProps = {
  sticky?: boolean;
};

const MainHeader: React.FC<MainHeaderProps> = ({ sticky = false }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const username = useSelector((state: RootState) => state.auth.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const handleLogout = () => {
    dispatch(clearToken());
    navigate('/');
    setOpen(false);
  };

  useEffect(() => {
    if (sticky) return;
    const handleScroll = () => {
      const height = headerRef.current?.offsetHeight || 96;
      if (window.scrollY > height) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

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
      isActive ? 'text-green2 font-semibold' : 'text-gray-700'
    }`;

  const headerClass = `header ${sticky ? 'header-sticky' : isFixed ? 'header-fixed' : ''} ${
    open ? 'header-drop' : ''
  }`;

  const logoSrc = sticky || isFixed || open ? '/logo.png' : '/logo-white.png';

  return (
    <Fragment>
      <header className={headerClass} ref={headerRef}>
        <div className="flex items-center justify-between content">
          {/* Logo */}
          <div className="flex items-center gap-10 logo">
            <NavLink to="/">
              <img src={logoSrc} alt="Logo" className="h-20 py-4 lg:h-24" />
            </NavLink>
          </div>

          {/* Menu desktop */}
          <div className="items-center hidden gap-5 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Trang chủ
            </NavLink>
            <NavLink to="/farm-stand" className={navLinkClass}>
              Farm stand
            </NavLink>
            <NavLink to="/boxes" className={navLinkClass}>
              Tất cả gói
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
          className={`absolute max-h-fit -z-10 left-0 w-full shadow-sm transition-all overflow-hidden bg-white top-20 md:hidden bg-gray-50 ${
            open ? 'h-screen' : 'h-0'
          }`}
        >
          <nav className="flex flex-col gap-1 px-5 py-10 space-y-5 text-text1">
            <NavLink to="/" className={navLinkClass} onClick={() => setOpen(false)}>
              Trang chủ
            </NavLink>
            <NavLink to="/farm-stand" className={navLinkClass} onClick={() => setOpen(false)}>
              Farm stand
            </NavLink>
            <NavLink to="/boxes" className={navLinkClass} onClick={() => setOpen(false)}>
              Tất cả gói
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
              } items-center text-base cursor-pointer text-red`}
              onClick={handleLogout}
            >
              Đăng xuất
            </span>
          </nav>
        </div>
      </header>
    </Fragment>
  );
};

export default MainHeader;
