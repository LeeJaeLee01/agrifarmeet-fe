import React from 'react';
import './MainFooter.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MainFooter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full bg-green">
      <div className="p-10 content">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 items-center">
          <div className="w-full lg:col-span-1">
            <img src="/logo-footer.png" alt="" className="w-80" />
            <p className="mt-4 text-xs text-green-100">&copy; Bản quyền Farme 2026</p>
          </div>
          <div className="text-white lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div id="footer-contact" className="scroll-mt-28">
                <p className="mb-3 font-semibold">{t('common.contact')}</p>
                <div className="flex flex-col gap-1 text-sm text-green-100 leading-relaxed">
                  <p className="m-0">Công ty TNHH Agrifarmeet</p>
                  <p className="m-0">MST: 0111166829</p>
                  <p className="m-0">Địa chỉ: 20 Võ Chí Công, phường Tây Hồ, Hà Nội</p>
                  <p className="m-0">
                    Email:{' '}
                    <a className="hover:text-white transition-colors" href="mailto:contact@agrifarmeet.vn">
                      contact@agrifarmeet.vn
                    </a>
                  </p>
                  <p className="m-0">
                    SĐT:{' '}
                    <a className="hover:text-white transition-colors" href="tel:0981817189">
                      0981817189
                    </a>
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-3 font-semibold">
                  <Link to="/introduce">{t('common.aboutUs')}</Link>
                </p>
                <ul className="flex flex-col gap-2 text-sm text-green-100">
                  <li>
                    <a href="/introduce#cau-chuyen" className="hover:text-white transition-colors">{t('introduce.story')}</a>
                  </li>
                  <li>
                    <a href="/introduce#su-menh" className="hover:text-white transition-colors">{t('introduce.mission')}</a>
                  </li>
                  <li>
                    <a href="/introduce#gia-tri" className="hover:text-white transition-colors">{t('introduce.values')}</a>
                  </li>
                  <li>
                    <a href="/introduce#hanh-trinh" className="hover:text-white transition-colors">{t('introduce.journey')}</a>
                  </li>
                  <li>
                    <a href="/introduce#cam-ket" className="hover:text-white transition-colors">{t('introduce.commitment')}</a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-3 font-semibold">{t('common.menu')}</p>
                <ul>
                  <li className="mb-2">
                    <Link to="/">{t('common.home')}</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/boxes">{t('common.allBoxes')}</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/news">{t('common.news')}</Link>
                  </li>
                </ul>
              </div>
              <div>
                <div className="mb-8">
                  <p className="mb-3 font-semibold">{t('common.followUs')}</p>
                  <div className="flex flex-col gap-2 text-sm text-green-100">
                    <a
                      href="https://www.facebook.com/profile.php?id=61582201066240"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
                <div>
                  <p className="mb-3 font-semibold">Chứng nhận</p>
                  <img 
                    src="/op-da-thong-bao-bo-cong-thuong-183x60.png" 
                    alt="Đã thông báo Bộ Công Thương" 
                    className="h-10 object-contain" 
                  />
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
