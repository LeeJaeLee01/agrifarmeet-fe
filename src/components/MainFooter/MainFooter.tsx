import React from 'react';
import './MainFooter.scss';
import { Link } from 'react-router-dom';
import { FacebookOutlined, TikTokOutlined } from '@ant-design/icons';

const MainFooter: React.FC = () => {
  return (
    <footer className="w-full px-5 mt-10 lg:mt-24 md:mt-20 lg:px-20 bg-green">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 pt-10 text-white gap-y-10 lg:pt-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="logo-footer">
            <img src="/logo-footer.png" alt="" className="h-20" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="nav-footer">
              <p className="text-lg font-medium">Menu</p>
              <ul>
                <li className="mb-2">
                  <Link to="/about">CSA</Link>
                </li>
                <li className="mb-2">
                  <Link to="/about">HTX</Link>
                </li>
                <li className="mb-2">
                  <Link to="/about">Về chúng tôi</Link>
                </li>
                <li className="mb-2">
                  <Link to="/about">Điều khoản</Link>
                </li>
              </ul>
            </div>
            <div className="nav-footer">
              <p className="text-lg font-medium">Menu</p>
              <ul>
                <li className="mb-2">
                  <Link to="/about">CSA</Link>
                </li>
                <li className="mb-2">
                  <Link to="/about">HTX</Link>
                </li>
                <li className="mb-2">
                  <Link to="/about">Về chúng tôi</Link>
                </li>
                <li className="mb-2">
                  <Link to="/about">Điều khoản</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="contact">
            <p className="text-lg font-medium">Liên hệ</p>
            <div className="flex items-center gap-5">
              <FacebookOutlined className="flex items-center justify-center w-10 h-10 text-3xl lg:text-6xl" />
              <TikTokOutlined className="flex items-center justify-center w-10 h-10 text-3xl lg:text-6xl" />
              <img
                src="/icon_of_Zalo.svg"
                alt=""
                className="flex items-center justify-center w-10 h-10 p-1"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-10 mt-10 text-center text-white">
          <p className="p-0 m-0">© Agrifarmeet</p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
