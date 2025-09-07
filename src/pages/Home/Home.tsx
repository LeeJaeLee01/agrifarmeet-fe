import React, { Fragment, useEffect, useState } from 'react';
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
import MainFooter from '../../components/MainFooter/MainFooter';
import axios from 'axios';

type Box = {
  id: string;
  name: string;
  description: string;
  status: string;
  price: string;
  image: string;
  totalWeight: string;
  expiredAt: null;
  createdAt: string;
  updatedAt: string;
};

const Home: React.FC = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Box[]>('http://localhost:3030/boxes');
        setBoxes(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('Error fetching boxes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Fragment>
      <Hero />
      <Section>
        <div className="container mx-auto">
          <h2 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">
            Gói phổ biến
          </h2>
          <div className="grid grid-cols-1 mb-10 lg:gap-5 lg:mb-10 gap-y-3 lg:gap-y-10 lg:grid-cols-3">
            {boxes.map((box) => (
              <div className="p-4 bg-white rounded-lg shadow-md">
                <p className="mb-3 text-lg font-semibold text-center lg:mb-5 lg:text-2xl text-text1">
                  {box.name}
                </p>
                <p>{box.description}</p>
                <ul className="mb-5">
                  <li className="flex gap-2 mb-3">
                    <CheckCircleOutlined className="text-base text-orange" />
                    <span>Rau, cà rốt</span>
                  </li>
                  <li className="flex gap-2 mb-3">
                    <CheckCircleOutlined className="text-base text-orange" />
                    <span>Khối lượng 4kg</span>
                  </li>
                  <li className="flex gap-2 mb-3">
                    <CheckCircleOutlined className="text-base text-orange" />
                    <span>8 - 12 tuần</span>
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
            ))}
          </div>
        </div>
      </Section>
      <Section>
        <div className="container mx-auto">
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="w-full max-w-md">
              <img
                src="https://thanhnien.mediacdn.vn/Uploaded/ngocthanh/2015_10_25/trai-cay_CZLU.jpg?width=500"
                alt=""
                className="object-cover w-full rounded-lg shadow-md"
              />
            </div>
            <div className="">
              <p className="lg:text-base text-text1">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis est autem fugit
                assumenda perspiciatis quaerat ad laudantium quam iure repellendus? Id harum
                laudantium voluptatem atque dolore, quia ipsum assumenda vitae.
              </p>
              <Link to="/about" className="text-base font-semibold lg:text-lg text-green">
                Xem thêm
              </Link>
            </div>
          </div>
        </div>
      </Section>
      <WeeklyFarm />
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
      <MainFooter />
    </Fragment>
  );
};

export default Home;
