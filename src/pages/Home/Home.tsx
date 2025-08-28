import React, { Fragment } from 'react';
import Hero from '../../components/Hero/Hero';
import './Home.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import Section from '../../components/Section/Section';
import {
  CalendarOutlined,
  QrcodeOutlined,
  VideoCameraOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Fragment>
      <Hero />
      <Section>
        <div className="container mx-auto">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">
            Vì sao CSA khác biệt?
          </h2>
          <div className="grid grid-cols-2 gap-5 mb-10 lg:mb-10 gap-y-10 lg:grid-cols-4">
            <div className="text-center lg:text-left">
              <CalendarOutlined className="mb-5 text-6xl text-center md:text-7xl lg:text-8xl text-green" />
              <p className="mb-2 text-base font-medium lg:text-lg text-text1">Đặt gói mùa vụ</p>
              <span className="text-xs lg:text-sm text-text2">Ổn định giá</span>
            </div>
            <div className="text-center lg:text-left">
              <QrcodeOutlined className="mb-5 text-6xl text-center md:text-7xl lg:text-8xl text-green" />
              <p className="mb-2 text-base font-medium lg:text-lg text-text1">QR truy xuất</p>
              <span className="text-xs lg:text-sm text-text2">Minh bạch</span>
            </div>
            <div className="text-center lg:text-left">
              <VideoCameraOutlined className="mb-5 text-6xl text-center md:text-7xl lg:text-8xl text-green" />
              <p className="mb-2 text-base font-medium lg:text-lg text-text1">
                Livestream/ Farm tour
              </p>
              <span className="text-xs lg:text-sm text-text2">Ổn định giá</span>
            </div>
            <div className="text-center lg:text-left">
              <TruckOutlined className="mb-5 text-6xl text-center md:text-7xl lg:text-8xl text-green" />
              <p className="mb-2 text-base font-medium lg:text-lg text-text1">Giao định kỳ</p>
              <span className="text-xs lg:text-sm text-text2">Tiện lợi</span>
            </div>
          </div>
          <Link to="/" className="text-base font-semibold lg:text-lg text-green">
            Tìm hiểu CSA
          </Link>
        </div>
      </Section>
      <Section>
        <div className="container mx-auto">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">
            Gói phổ biến
          </h2>
          <div className="grid grid-cols-1 mb-10 lg:gap-5 lg:mb-10 gap-y-3 lg:gap-y-10 lg:grid-cols-2">
            <div className="flex gap-5 p-4 rounded-lg bg-gray">
              <div className="w-20 h-20 lg:w-40 lg:h-40">
                <img src="/hero.png" alt="" className="object-cover w-full h-full" />
              </div>
              <div className="">
                <p className="mb-3 text-lg font-semibold lg:mb-5 lg:text-2xl text-text1">
                  Trial Box 199k
                </p>
                <button className="px-4 py-2 font-medium text-white rounded-lg lg:px-10 lg:py-3 bg-green">
                  Đặt ngay
                </button>
              </div>
            </div>
            <div className="flex items-center gap-5 p-4 rounded-lg bg-gray">
              <div className="w-20 h-20 lg:w-40 lg:h-40">
                <img src="/hero.png" alt="" className="object-cover w-full h-full" />
              </div>
              <div className="">
                <div className="mb-3 lg:mb-5">
                  <p className="mb-0 text-lg font-semibold lg:text-2xl text-text1">
                    CSA Mini 8 tuần
                  </p>
                  <span>1,6 - 1,9tr/box</span>
                </div>
                <button className="px-4 py-2 font-medium text-white rounded-lg lg:px-10 lg:py-3 bg-green">
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Fragment>
  );
};

export default Home;
