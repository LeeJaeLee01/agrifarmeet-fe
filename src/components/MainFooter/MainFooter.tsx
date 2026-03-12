import React from 'react';
import './MainFooter.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MainFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-green">
      <div className="p-10 content">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 items-center">
          <div className="w-full">
            <img src="/logo-footer.png" alt="" className="w-80" />
          </div>
          <div className="text-white">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-2">{t('common.menu')}</p>
                <ul>
                  <li className="mb-2">
                    <Link to="/">{t('common.home')}</Link>
                  </li>
                  {/* <li className="mb-2">
                    <Link to="/farm-stand">{t('common.farmStand')}</Link>
                  </li> */}
                  <li className="mb-2">
                    <Link to="/boxes">{t('common.allBoxes')}</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/event">{t('common.events')}</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/about">{t('common.aboutUs')}</Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-2">{t('common.followUs')}</p>
                <div className="flex flex-col gap-1">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                  <a href="https://zalo.me" target="_blank" rel="noreferrer">
                    Zalo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
