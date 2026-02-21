import React from 'react';
import './MainFooter.scss';
import { Link } from 'react-router-dom';
import { FacebookOutlined, MailOutlined, PhoneOutlined, TikTokOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const MainFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-green">
      <div className="p-10 content">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="w-full">
            <img src="/logo-footer.png" alt="" className="w-80" />
          </div>
          <div className="text-white">
            <p>{t('common.menu')}</p>
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
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
