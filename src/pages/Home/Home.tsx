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
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import WeeklyFarm from '../../modules/Home/WeeklyFarm';
import { Button } from 'antd';

const Home: React.FC = () => {
  return (
    <Fragment>
      <Hero />
      <WeeklyFarm />
      <Section>
        <div className="container mx-auto">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">
            Gói phổ biến
          </h2>
          <div className="grid grid-cols-1 mb-10 lg:gap-5 lg:mb-10 gap-y-3 lg:gap-y-10 lg:grid-cols-3">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="mb-3 text-lg font-semibold text-center lg:mb-5 lg:text-2xl text-text1">
                Gói Mini
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, ipsam in harum
                quidem soluta nulla ducimus ex cum illum reprehenderit, doloribus non veritatis
                praesentium totam, enim fugiat minus? Possimus, aliquam!
              </p>
              <ul className="mb-5">
                <li className="flex gap-2 mb-3">
                  <CheckCircleOutlined className="text-base text-orange" />
                  <span>Lorem ipsum dolor sit amet consectetur</span>
                </li>
                <li className="flex gap-2 mb-3">
                  <CheckCircleOutlined className="text-base text-orange" />
                  <span>Lorem ipsum dolor sit amet consectetur</span>
                </li>
                <li className="flex gap-2 mb-3">
                  <CheckCircleOutlined className="text-base text-orange" />
                  <span>Lorem ipsum dolor sit amet consectetur</span>
                </li>
              </ul>
              <Button
                type="primary"
                block
                size="large"
                className="text-base font-semibold bg-green"
              >
                Mua ngay
              </Button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="mb-3 text-lg font-semibold text-center lg:mb-5 lg:text-2xl text-text1">
                Gói Premium
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, ipsam in harum
                quidem soluta nulla ducimus ex cum illum reprehenderit, doloribus non veritatis
                praesentium totam, enim fugiat minus? Possimus, aliquam!
              </p>
              <ul className="mb-5">
                <li className="flex gap-2 mb-3">
                  <CheckCircleOutlined className="text-base text-orange" />
                  <span>Lorem ipsum dolor sit amet consectetur</span>
                </li>
                <li className="flex gap-2 mb-3">
                  <CheckCircleOutlined className="text-base text-orange" />
                  <span>Lorem ipsum dolor sit amet consectetur</span>
                </li>
                <li className="flex gap-2 mb-3">
                  <CheckCircleOutlined className="text-base text-orange" />
                  <span>Lorem ipsum dolor sit amet consectetur</span>
                </li>
              </ul>
              <Button
                type="primary"
                block
                size="large"
                className="text-base font-semibold bg-green"
              >
                Mua ngay
              </Button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md">
              <p className="mb-3 text-lg font-semibold text-center lg:mb-5 lg:text-2xl text-text1">
                Gói Custom Hybrid
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, ipsam in harum
                quidem soluta nulla ducimus ex cum illum reprehenderit, doloribus non veritatis
                praesentium totam, enim fugiat minus? Possimus, aliquam!
              </p>
              <ul className="mb-5">
                <li className="flex gap-2 mb-3">
                  <CheckCircleOutlined className="text-base text-orange" />
                  <span>Lorem ipsum dolor sit amet consectetur</span>
                </li>
                <li className="flex gap-2 mb-3">
                  <CheckCircleOutlined className="text-base text-orange" />
                  <span>Lorem ipsum dolor sit amet consectetur</span>
                </li>
                <li className="flex gap-2 mb-3">
                  <CheckCircleOutlined className="text-base text-orange" />
                  <span>Lorem ipsum dolor sit amet consectetur</span>
                </li>
              </ul>
              <Button
                type="primary"
                block
                size="large"
                className="text-base font-semibold bg-green"
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </Section>
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
    </Fragment>
  );
};

export default Home;
