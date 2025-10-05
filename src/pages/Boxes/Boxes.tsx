import React, { Fragment, useEffect, useState } from 'react';
import Section from '../../components/Section/Section';
import { TBox } from '../../types/TBox';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  QrcodeOutlined,
  TruckOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { formatVND, formatWeight } from '../../utils/helper';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedBoxId } from '../../store/slices/boxSlice';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { Spin } from 'antd';
import { useTitle } from '../../hooks/useTitle';

const Boxes: React.FC = () => {
  useTitle('Tất cả gói');

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
      <MainHeader sticky />

      <Section>
        <h2 className="max-w-4xl mx-auto mt-2 mb-0 text-4xl font-semibold tracking-tight text-center text-balance sm:text-5xl">
          Lựa chọn gói dành riêng cho bạn
        </h2>
        <p className="max-w-4xl mx-auto mt-6 mb-0 text-base font-medium text-center text-text3 text-pretty sm:text-lg/8">
          Lựa chọn gói dịch vụ hợp lý, được trang bị những sản phẩm tươi ngon nhất từ nông trại.
        </p>
        <div className="grid items-center grid-cols-1 gap-5 mx-auto mt-16 gap-y-6 sm:mt-20 lg:grid-cols-3">
          {loading ? (
            <div className="flex items-center justify-center col-span-3 py-20">
              <Spin size="large" tip="Đang tải gói..." />
            </div>
          ) : (
            boxes.map((box) => (
              <div
                key={box.id}
                className="flex flex-col justify-between h-full p-8 bg-white border sm:p-10 rounded-3xl border-gray-border"
              >
                <Link to={`/boxes/${box.id}`} className="hover:text-inherit">
                  <div className="flex items-start justify-between">
                    <p className="m-0 font-semibold text-base/7 text-orange">{box.name}</p>
                    {box.isTrial && (
                      <p className="px-2 py-1 m-0 text-xs font-semibold rounded-full text-green2 bg-secondary-green">
                        Dùng thử
                      </p>
                    )}
                  </div>
                  <p className="m-0 mt-4 text-sm/6 text-text2">{box.description}</p>
                  <p className="flex items-baseline m-0 mt-6 gap-x-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      {formatVND(box.price)}
                    </span>
                    <span className="text-sm">/{box.expiredAt} tuần</span>
                  </p>

                  <ul role="list" className="m-0 mt-8 space-y-3 text-sm/6">
                    <li className="flex gap-x-3">
                      <CheckCircleOutlined
                        aria-hidden="true"
                        className="flex-none w-5 h-6 text-orange"
                      />
                      Khối lượng {formatWeight(box.totalWeight, 'kg')}
                    </li>
                    <li className="flex gap-x-3">
                      <CheckCircleOutlined
                        aria-hidden="true"
                        className="flex-none w-5 h-6 text-orange"
                      />
                      Bao gồm {box.products.length} sản phẩm
                    </li>
                    {!box.isTrial && (
                      <li className="flex gap-x-3">
                        <CheckCircleOutlined
                          aria-hidden="true"
                          className="flex-none w-5 h-6 text-orange"
                        />
                        Tùy chỉnh sản phẩm trong gói
                      </li>
                    )}
                  </ul>
                </Link>

                <Link to={`/purchase/${box.id}`}>
                  {box.isTrial ? (
                    <button
                      className="w-full bg-white text-green2 border border-green3 mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
                      onClick={() => dispatch(setSelectedBoxId(box.id))}
                    >
                      Mua ngay
                    </button>
                  ) : (
                    <button
                      className="w-full bg-green2 text-white mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
                      onClick={() => dispatch(setSelectedBoxId(box.id))}
                    >
                      Mua ngay
                    </button>
                  )}
                </Link>
              </div>
            ))
          )}
        </div>
      </Section>

      <Section spaceBottom>
        <h2 className="max-w-4xl mx-auto mt-2 mb-0 text-4xl font-semibold tracking-tight text-center text-balance sm:text-5xl">
          Vì sao CSA khác biệt?
        </h2>
        <p className="max-w-4xl mx-auto mt-6 mb-0 text-base font-medium text-center text-text3 text-pretty sm:text-lg/8">
          Mỗi gói CSA không chỉ mang đến nông sản tươi sạch theo mùa mà còn giúp bạn gắn kết trực
          tiếp với người nông dân và hành trình canh tác bền vững.
        </p>
        <div className="grid items-center max-w-4xl grid-cols-1 mx-auto mt-16 gap-y-10 gap-x-8 sm:mt-20 lg:grid-cols-2">
          <div className="flex gap-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green2">
              <CalendarOutlined className="text-xl text-center text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base/7">Đặt gói mùa vụ</p>
              <p className="mt-2 mb-0 text-text2 text-base/7">
                Chọn gói CSA theo mùa để luôn nhận được rau củ quả tươi ngon, đúng thời điểm thu
                hoạch.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green2">
              <QrcodeOutlined className="text-xl text-center text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base/7">QR truy xuất</p>
              <p className="mt-2 mb-0 text-text2 text-base/7">
                Mỗi sản phẩm đều có mã QR để bạn dễ dàng kiểm tra nguồn gốc và minh bạch.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green2">
              <VideoCameraOutlined className="text-xl text-center text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base/7">Livestream/ Farm tour</p>
              <p className="mt-2 mb-0 text-text2 text-base/7">
                Theo dõi trực tiếp quá trình thu hoạch hoặc tham gia farm tour để gắn kết cùng nông
                trại.
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green2">
              <TruckOutlined className="text-xl text-center text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base/7">Giao định kỳ</p>
              <p className="mt-2 mb-0 text-text2 text-base/7">
                Nhận nông sản tại nhà hàng tuần với lịch giao cố định, đảm bảo tươi mới và tiện lợi.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <MainFooter />
    </Fragment>
  );
};

export default Boxes;
