import React from 'react';
import Section from '../Section/Section';
import { CheckCircleFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const Hero = () => {
  return (
    <Section>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-5 lg:gap-10 md:grid-cols-2 hero-content">
          <div className="">
            <h1 className="mb-5 text-3xl font-semibold lg:mb-8 md:text-5xl lg:text-6xl text-text1">
              CSA - Gói nông sản mùa vụ giao tận nhà
            </h1>
            <p className="mb-5 text-base md:text-lg text-text2">
              Minh bạch từ HTX, giá ổn định, giao định kỳ
            </p>
            <div className="flex items-center gap-5 mb-5">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray">
                <CheckCircleFilled className="text-green" />
                <span className="text-sm font-semibold lg:text-base">HTX VietGAP</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray">
                <CheckCircleFilled className="text-green" />
                <span className="text-sm font-semibold lg:text-base">Giao định kỳ</span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <Link to="/">
                <button className="px-10 py-3 text-base font-semibold text-white rounded-lg lg:text-lg bg-green">
                  Đặt Trial 199k
                </button>
              </Link>
              <Link to="/">
                <button className="px-5 py-3 text-base font-semibold rounded-lg lg:text-lg bg-secondary-green text-text1">
                  Xem gói CSA
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center w-full">
            <div className="w-full max-w-60 sm:max-w-sm">
              <img src="/hero.png" alt="" className="block w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
