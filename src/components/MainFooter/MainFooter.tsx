import React from 'react';
import './MainFooter.scss';
import { Link } from 'react-router-dom';
import { FacebookOutlined, MailOutlined, PhoneOutlined, TikTokOutlined } from '@ant-design/icons';

const MainFooter: React.FC = () => {
  return (
    <footer className="w-full bg-green">
      <div className="bg-secondary-green">
        <div className="flex items-center justify-center gap-5 p-5 content">
          <div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-green2">
            <FacebookOutlined className="text-2xl" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-green2">
            <TikTokOutlined className="text-2xl" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-green2">
            <MailOutlined className="text-2xl" />
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-green2">
            <img
              src="https://page.widget.zalo.me/static/images/2.0/Logo.svg"
              alt="zalo"
              className="flex items-center justify-center w-6 h-6"
            />
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-green2">
            <PhoneOutlined className="text-2xl" />
          </div>
        </div>
      </div>
      <div className="p-10 content">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="w-full">
            <img src="/logo-footer.png" alt="" className="w-80" />
          </div>
          <div className="text-white">
            <p>Menu</p>
            <ul>
              <li className="mb-2">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="mb-2">
                <Link to="/farm-stand">Farm stand</Link>
              </li>
              <li className="mb-2">
                <Link to="/boxes">Tất cả gói</Link>
              </li>
              <li className="mb-2">
                <Link to="/event">Sự kiện</Link>
              </li>
              <li className="mb-2">
                <Link to="/about">Về chúng tôi</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
