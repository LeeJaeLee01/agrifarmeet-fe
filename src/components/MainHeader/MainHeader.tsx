import { MenuProps, Dropdown } from 'antd';
import { MenuOutlined, CloseOutlined, BellOutlined } from '@ant-design/icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './MainHeader.scss';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken } from '../../store/slices/authSlice';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

type MainHeaderProps = {
  sticky?: boolean;
  simple?: boolean; // Simple header for landing page
};

const MainHeader: React.FC<MainHeaderProps> = ({ sticky = false, simple = false }) => {
  const { t } = useTranslation();
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
    if (sticky || simple) return;
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
  }, [sticky, simple]);

  const userMenu: MenuProps = {
    items: [
      {
        key: 'user-info',
        label: <Link to="/customer-info">{t('common.myInfo')}</Link>,
      },
      {
        key: 'order',
        label: <Link to="/shipping">{t('common.myOrders')}</Link>,
      },
      {
        key: 'logout',
        label: (
          <span onClick={handleLogout} className="text-red">
            {t('common.logout')}
          </span>
        ),
      },
    ],
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block lg:px-3 lg:py-2 text-[16px] transition-colors duration-200 hover:text-green2 ${isActive ? 'text-green2 font-semibold' : 'text-gray-700'
    }`;

  const headerClass = simple
    ? 'header header-simple'
    : `header ${sticky ? 'header-sticky' : isFixed ? 'header-fixed' : ''} ${open ? 'header-drop' : ''}`;

  const logoSrc = simple || sticky || isFixed || open ? '/logo.png' : '/logo-white.png';

  /* Animation logic */
  const [animKey, setAnimKey] = useState(0);
  const sloganText = t('common.slogan');

  useEffect(() => {
    const runAnimation = () => {
      setAnimKey(prev => prev + 1);
    };

    // Initial run
    runAnimation();

    const interval = setInterval(runAnimation, 3600); // Match slide autoplay delay
    return () => clearInterval(interval);
  }, []);

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

          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 text-xl uppercase tracking-wider text-center wavy-text">
            {sloganText
              .split('')
              .map((char, index) => (
                <span
                  key={`${index}-${animKey}`} // Update key to re-trigger animation
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
          </div>

          {/* Menu desktop */}
          <div className="items-center hidden gap-5 md:flex">
            {/* <NavLink to="/home" className={navLinkClass}>
              {t('common.home')}
            </NavLink>
            <NavLink to="/boxes" className={navLinkClass}>
              {t('common.allBoxes')}
            </NavLink> */}

            {/* {simple ? (
              <LanguageSwitcher />
            ) : (
              <>
                {token ? (
                  <div className="flex items-center gap-5">
                    <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
                      <span className="cursor-pointer text-[16px] text-gray-700 hover:text-green-700">
                        {username}
                      </span>
                    </Dropdown>
                    <BellOutlined className="text-xl cursor-pointer" />
                    <LanguageSwitcher />
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <NavLink to="/login" className={navLinkClass}>
                      {t('common.login')}
                    </NavLink>
                    <LanguageSwitcher />
                  </div>
                )}
              </>
            )} */}
            <LanguageSwitcher />
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
        {/* <div
          className={`absolute max-h-fit -z-10 left-0 w-full shadow-sm transition-all overflow-hidden bg-white top-20 md:hidden bg-gray-50 ${
            open ? 'h-screen' : 'h-0'
          }`}
        >
          <nav className="flex flex-col gap-1 px-5 py-10 space-y-5 text-text1">
            <NavLink to="/home" className={navLinkClass} onClick={() => setOpen(false)}>
              {t('common.home')}
            </NavLink>
            <NavLink to="/boxes" className={navLinkClass} onClick={() => setOpen(false)}>
              {t('common.allBoxes')}
            </NavLink>
            {simple ? (
              <div className="mt-5">
                <LanguageSwitcher />
              </div>
            ) : (
              <>
                {token ? (
                  <>
                    <NavLink
                      to="/customer-info"
                      className={navLinkClass}
                      onClick={() => setOpen(false)}
                    >
                      {t('common.myInfo')}
                    </NavLink>
                    <NavLink to="/shipping" className={navLinkClass} onClick={() => setOpen(false)}>
                      {t('common.myOrders')}
                    </NavLink>
                  </>
                ) : (
                  <NavLink to="/login" className={navLinkClass} onClick={() => setOpen(false)}>
                    {t('common.login')}
                  </NavLink>
                )}
                <span
                  className={`${
                    token ? 'flex' : 'hidden'
                  } items-center text-base cursor-pointer text-red`}
                  onClick={handleLogout}
                >
                  {t('common.logout')}
                </span>
              </>
            )}
          </nav>
        </div> */}
      </header>
    </Fragment>
  );
};

export default MainHeader;
