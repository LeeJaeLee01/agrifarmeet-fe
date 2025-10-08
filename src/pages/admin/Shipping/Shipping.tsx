import React, { Fragment, useEffect, useState } from 'react';
import { Table, Spin, Tag, Select, DatePicker, Button, DatePickerProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'dayjs/locale/vi';
import { SyncOutlined } from '@ant-design/icons';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.locale('vi');

interface Shipping {
  id: string;
  scheduledAt: string;
  status: string;
  deliveryAddress: string;
  deliveryNote: string;
  deliveryDay: string;
  deliveryWeek: string;
  createdAt: string;
  updatedAt: string;
  shipperConfidence?: string | null;
  trafficCondition?: string | null;
  weatherCondition?: string | null;
}

const AdminShipping: React.FC = () => {
  const [data, setData] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getInitialDelivery = () => {
    const today = dayjs();
    const todayISOWeek = today.format('YYYY-[W]WW');
    const weekday = today.day();

    let deliveryDay = 'tuesday';
    let deliveryWeek = todayISOWeek;

    if (weekday < 2) {
      // Trước thứ 3 (CN, T2)
      deliveryDay = 'tuesday';
      deliveryWeek = todayISOWeek;
    } else if (weekday >= 2 && weekday < 5) {
      // Sau thứ 3 nhưng trước thứ 6 (T3-T5)
      deliveryDay = 'friday';
      deliveryWeek = todayISOWeek;
    } else if (weekday >= 5) {
      // Sau thứ 6 (T6-T7)
      deliveryDay = 'tuesday';
      deliveryWeek = today.add(1, 'week').format('YYYY-[W]WW');
    }

    return { deliveryDay, deliveryWeek };
  };

  const { deliveryDay, deliveryWeek } = getInitialDelivery();

  const [selectedDay, setSelectedDay] = useState<string>(deliveryDay);
  const [selectedWeek, setSelectedWeek] = useState<string>(deliveryWeek);

  // Gọi API lấy shipping theo ngày và tuần giao
  const fetchShipping = async (day: string, week: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/shipping/delivery?day=${day}&week=${week}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách giao hàng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipping(selectedDay, selectedWeek);
  }, []);

  // Chuyển status sang tiếng Việt
  const renderStatus = (status: string) => {
    let color = 'default';
    let label = '';

    switch (status) {
      case 'preparing':
        color = 'orange';
        label = 'Đang chuẩn bị';
        break;
      case 'delivering':
        color = 'blue';
        label = 'Đang giao hàng';
        break;
      case 'completed':
        color = 'green';
        label = 'Hoàn thành';
        break;
      case 'canceled':
        color = 'red';
        label = 'Đã hủy';
        break;
      default:
        label = 'Không xác định';
    }

    return <Tag color={color}>{label}</Tag>;
  };

  const columns: ColumnsType<Shipping> = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Ngày giao dự kiến',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 180,
      render: (date) => formatDate(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => renderStatus(status),
    },
    {
      title: 'Ngày giao (day)',
      dataIndex: 'deliveryDay',
      key: 'deliveryDay',
      width: 120,
    },
    {
      title: 'Tuần giao (week)',
      dataIndex: 'deliveryWeek',
      key: 'deliveryWeek',
      width: 150,
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'deliveryNote',
      key: 'deliveryNote',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Thời tiết / Giao thông',
      key: 'conditions',
      width: 200,
      render: (_, record) => (
        <>
          {record.weatherCondition && <Tag color="blue">{record.weatherCondition}</Tag>}
          {record.trafficCondition && <Tag color="volcano">{record.trafficCondition}</Tag>}
        </>
      ),
    },
  ];

  const parseISOWeek = (weekStr: string) => {
    if (!weekStr || !weekStr.includes('-W')) return dayjs();

    const [yearStr, weekStrNum] = weekStr.split('-W');
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStrNum, 10);

    const jan4 = dayjs(`${year}-01-04`);
    const startOfISOWeek1 = jan4.startOf('week').add(1, 'day');

    const targetDate = startOfISOWeek1.add(week - 1, 'week');

    return targetDate;
  };

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý giao hàng</h1>

      {/* Bộ lọc theo ngày và tuần */}
      <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
        <Select
          value={selectedDay}
          onChange={(val) => setSelectedDay(val)}
          style={{ width: 160 }}
          options={[
            { label: 'Thứ hai', value: 'monday' },
            { label: 'Thứ ba', value: 'tuesday' },
            { label: 'Thứ tư', value: 'wednesday' },
            { label: 'Thứ năm', value: 'thursday' },
            { label: 'Thứ sáu', value: 'friday' },
            { label: 'Thứ bảy', value: 'saturday' },
            { label: 'Chủ nhật', value: 'sunday' },
          ]}
        />
        <DatePicker
          picker="week"
          value={parseISOWeek(selectedWeek)}
          onChange={(date) => {
            if (date) {
              const formattedWeek = date.format('GGGG-[W]WW');
              setSelectedWeek(formattedWeek);
            }
          }}
          allowClear={false}
        />
        <Button
          type="primary"
          onClick={() => fetchShipping(selectedDay, selectedWeek)}
          loading={loading}
          icon={<SyncOutlined />}
        >
          Cập nhật
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          bordered
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1200 }}
        />
      </Spin>
    </Fragment>
  );
};

export default AdminShipping;
