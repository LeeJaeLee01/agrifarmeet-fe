import React, { Fragment, useEffect, useState } from 'react';
import Section from '../../components/Section/Section';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { TShipping } from '../../types/TShipping';
import { TBox } from '../../types/TBox';
import { useTitle } from '../../hooks/useTitle';
import { Spin, Tag, Empty, Card, Progress } from 'antd';
import { formatDate, formatVND } from '../../utils/helper';
import api from '../../utils/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import dayjs from 'dayjs';

const Shipping: React.FC = () => {
  useTitle('Tình trạng giao hàng');

  const [shipping, setShipping] = useState<TShipping[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [boxInfo, setBoxInfo] = useState<TBox | null>(null);
  const [nearestOrder, setNearestOrder] = useState<TShipping | null>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchShipping = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shipping/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list: TShipping[] = res.data;
      setShipping(list);

      // ✅ Lấy thông tin box duy nhất
      if (list.length > 0) {
        setBoxInfo(list[0].boxUser.box);

        // ✅ Lấy đơn gần nhất với thời điểm hiện tại (chưa giao hoặc đang giao)
        const now = dayjs();
        const sorted = [...list].sort(
          (a, b) =>
            Math.abs(dayjs(a.scheduledAt).diff(now)) - Math.abs(dayjs(b.scheduledAt).diff(now))
        );
        setNearestOrder(sorted[0]);
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu giao hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  const renderStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="default">Đang chờ</Tag>;
      case 'preparing':
        return <Tag color="processing">Đang chuẩn bị</Tag>;
      case 'delivering':
        return <Tag color="blue">Đang giao</Tag>;
      case 'delivered':
        return <Tag color="green">Đã giao</Tag>;
      case 'cancelled':
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  // ✅ Map trạng thái sang % progress bar
  const getProgressPercent = (status: string) => {
    switch (status) {
      case 'pending':
        return 33;
      case 'preparing':
        return 66;
      case 'delivering':
        return 90;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Fragment>
      <MainHeader sticky />

      {/* ============ THÔNG TIN GÓI HÀNG ============ */}
      <Section>
        <div className="container mx-auto">
          <h2 className="section-title">Thông tin gói hàng</h2>
          {loading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : !boxInfo ? (
            <Empty description="Chưa có dữ liệu gói hàng" className="mt-10" />
          ) : (
            <div className="flex flex-wrap gap-10 lg:gap-20 lg:pt-10">
              <img
                src={boxInfo.image}
                alt={boxInfo.name}
                className="object-cover w-full lg:max-w-60 rounded-xl aspect-square"
              />
              <div className="flex-1">
                {boxInfo.isTrial && <p className="!mb-3 label-trial">Gói dùng thử</p>}
                <p className="text-xl font-semibold lg:text-2xl">{boxInfo.name}</p>
                <span className="text-text2">{boxInfo.description}</span>

                <div className="mt-5">
                  <p className="text-base font-medium lg:text-lg">
                    Tổng số tiền:{' '}
                    <span className="text-orange">{formatVND(boxInfo.price || '')}</span>
                  </p>
                </div>

                {shipping.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-5 text-text3">
                    <span>Ngày mua: {formatDate(shipping[0].boxUser.timeActive)}</span>
                    <span>Ngày hết hạn: {formatDate(shipping[0].boxUser.timeEnd)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ============ TÌNH TRẠNG GIAO HÀNG ============ */}
      <Section spaceBottom>
        <div className="container mx-auto">
          <h2 className="section-title">Tình trạng giao hàng</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Spin size="large" />
            </div>
          ) : shipping.length === 0 ? (
            <Empty description="Chưa có đơn giao hàng nào" className="mt-10" />
          ) : (
            <div className="flex flex-col gap-6">
              {/* 🔹 ĐƠN GẦN NHẤT VỚI HIỆN TẠI */}
              {nearestOrder && (
                <Card
                  className="border-2 border-green-500 shadow-md rounded-2xl"
                  bodyStyle={{ padding: '1.5rem' }}
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <p className="font-semibold text-green-700">
                        🌿 Đơn hàng gần nhất — Tuần {nearestOrder.deliveryWeek.replace('2025-', '')}
                      </p>
                      <p className="text-sm text-gray-700">
                        Dự kiến giao: {formatDate(nearestOrder.scheduledAt)}
                      </p>
                      <p className="text-sm text-gray-700">
                        Ghi chú: {nearestOrder.deliveryNote || 'Không có ghi chú'}
                      </p>
                      <p className="text-sm text-gray-700">
                        Địa chỉ: {nearestOrder.deliveryAddress || 'Chưa cập nhật'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      {renderStatusTag(nearestOrder.status)}
                      <p className="mt-1 text-xs text-gray-500">
                        Shipper: {nearestOrder.shipper?.username || 'Chưa phân công'}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* 🔸 CÁC ĐƠN CÒN LẠI */}
              {shipping
                .filter((s) => s.id !== nearestOrder?.id)
                .map((item) => (
                  <Card
                    key={item.id}
                    className="transition-all shadow-sm hover:shadow-md rounded-2xl"
                    bodyStyle={{ padding: '1.5rem' }}
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <p className="font-medium text-gray-800">
                          Tuần {item.deliveryWeek.replace('2025-', '')} —{' '}
                          <span className="capitalize">{item.deliveryDay}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Dự kiến giao: {formatDate(item.scheduledAt)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Ghi chú: {item.deliveryNote || 'Không có ghi chú'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Địa chỉ: {item.deliveryAddress || 'Chưa cập nhật'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        {renderStatusTag(item.status)}
                        <p className="mt-1 text-xs text-gray-500">
                          Shipper: {item.shipper?.username || 'Chưa phân công'}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </Section>

      <MainFooter />
    </Fragment>
  );
};

export default Shipping;
