import React, { Fragment, useEffect, useState } from 'react';
import Section from '../../components/Section/Section';
import { TBox } from '../../types/TBox';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import {
  CalendarFilled,
  CheckCircleOutlined,
  QrcodeOutlined,
  TruckFilled,
  VideoCameraFilled,
} from '@ant-design/icons';
import { formatWeight } from '../../utils/helper';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { setSelectedBoxId } from '../../store/slices/boxSlice';

const Boxes: React.FC = () => {
  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    api
      .get<TBox[]>('/boxes')
      .then((res) => setBoxes(res.data))
      .catch((err) => {
        toast.error('Đã có lỗi xảy ra khi lấy thông tin gói');
        console.error('Error fetching boxes:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Fragment>
      <div className="banner relative w-full h-fit md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 background">
          <img src="/banner-box.jpg" alt="" className="object-cover object-bottom w-full h-full" />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative z-10 items-center justify-center h-full">
          <div className="flex items-center justify-center order-last w-full h-full">
            <div className="w-full px-5 py-10 text-center rounded-lg lg:p-10 lg:text-left">
              <h2 className="text-2xl font-bold text-center text-white lg:mb-10 md:text-3xl lg:text-4xl">
                Vì sao CSA khác biệt?
              </h2>
              <div className="grid grid-cols-2 gap-5 lg:mb-10 gap-y-10 lg:grid-cols-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <CalendarFilled className="mb-5 text-6xl text-center md:text-7xl lg:text-8xl text-green" />
                  <p className="mb-2 text-base font-medium text-white lg:text-lg">Đặt gói mùa vụ</p>
                  <span className="text-xs text-white lg:text-sm">Ổn định giá</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <QrcodeOutlined className="mb-5 text-6xl text-center md:text-7xl lg:text-8xl text-green" />
                  <p className="mb-2 text-base font-medium text-white lg:text-lg">QR truy xuất</p>
                  <span className="text-xs text-white lg:text-sm">Minh bạch</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <VideoCameraFilled className="mb-5 text-6xl text-center md:text-7xl lg:text-8xl text-green" />
                  <p className="mb-2 text-base font-medium text-white lg:text-lg">
                    Livestream/ Farm tour
                  </p>
                  <span className="text-xs text-white lg:text-sm">Tin cậy</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <TruckFilled className="mb-5 text-6xl text-center md:text-7xl lg:text-8xl text-green" />
                  <p className="mb-2 text-base font-medium text-white lg:text-lg">Giao định kỳ</p>
                  <span className="text-xs text-white lg:text-sm">Tiện lợi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Section secondary>
        <div className="container mx-auto">
          <h1 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-text1">
            Tất cả gói
          </h1>
          <div className="grid grid-cols-1 mb-10 lg:gap-5 lg:mb-10 gap-y-3 lg:gap-y-10 lg:grid-cols-3">
            {boxes.map((box) => (
              <div key={box.id} className="p-4 bg-white rounded-lg shadow-md">
                <p className="mb-3 text-lg font-semibold text-center lg:mb-5 lg:text-2xl text-text1">
                  {box.name}
                </p>
                <p>{box.description}</p>
                <ul className="mb-5">
                  <li className="flex gap-2 mb-3">
                    <CheckCircleOutlined className="text-base text-orange" />
                    <span className="truncate">
                      {box.products.map((product) => product.name).join(', ')}
                    </span>
                  </li>
                  <li className="flex gap-2 mb-3">
                    <CheckCircleOutlined className="text-base text-orange" />
                    <span>Khối lượng {formatWeight(box.totalWeight, 'kg')}</span>
                  </li>
                  <li className="flex gap-2 mb-3">
                    <CheckCircleOutlined className="text-base text-orange" />
                    <span>{box.expiredAt} tuần</span>
                  </li>
                </ul>
                <Link to={`/purchase/${box.id}`}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    className="text-base font-semibold"
                    onClick={() => dispatch(setSelectedBoxId(box.id))}
                  >
                    Mua ngay
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <div className="w-full mt-10 lg:mt-24 md:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-[500px] hidden md:block">
            <img src="/fc-box-bg.jpg" alt="" className="object-cover w-full h-full" />
          </div>
          <div className="flex items-center justify-center w-full h-full px-5 py-10 bg-beige lg:p-20">
            <div className="text-center lg:text-left">
              <h2 className="mb-10 text-2xl font-bold md:text-3xl lg:text-4xl text-brown">
                Cảm nhận từ khách hàng
              </h2>
              <p className="max-w-md text-text2">
                "Dịch vụ này giúp tôi ăn uống lành mạnh hơn rất nhiều và thật tuyệt khi biết rằng
                mình đang ủng hộ các doanh nghiệp địa phương”
              </p>
              <p className="text-brown">— Phùng Đức Cường</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Boxes;
