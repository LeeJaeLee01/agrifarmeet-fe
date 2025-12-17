import React, { Fragment, useEffect, useState } from 'react';
import { Table, Spin, Tag, Select, DatePicker, Button, Modal, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'dayjs/locale/vi';
import { SyncOutlined, EditOutlined } from '@ant-design/icons';

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
  shipperId?: string | null;
  shipperName?: string | null;
  shipperConfidence?: string | null;
  trafficCondition?: string | null;
  weatherCondition?: string | null;
}

interface ShipperOption {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const AdminShipping: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [assigning, setAssigning] = useState<boolean>(false);
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(null);
  const [selectedShipper, setSelectedShipper] = useState<string | undefined>(undefined);
  const [shippers, setShippers] = useState<ShipperOption[]>([]);
  const [loadingShippers, setLoadingShippers] = useState<boolean>(false);

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
      const res = await api.get(`/shipping/delivery?day=${day}&week=${week}`, {
        withAuth: true,
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error(t('messages.loadShippingFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Gọi API lấy danh sách shippers
  const fetchShippers = async () => {
    try {
      setLoadingShippers(true);
      const res = await api.get(`/users/shippers`, {
        withAuth: true,
      });
      setShippers(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(t('messages.loadShipperFailed'));
    } finally {
      setLoadingShippers(false);
    }
  };

  useEffect(() => {
    fetchShipping(selectedDay, selectedWeek);
    fetchShippers();
  }, []);

  // Chuyển status sang ngôn ngữ hiện tại
  const renderStatus = (status: string) => {
    let color = 'default';
    let label = '';

    switch (status) {
      case 'preparing':
        color = 'orange';
        label = t(`status.preparing`);
        break;
      case 'delivering':
        color = 'blue';
        label = t(`status.delivering`);
        break;
      case 'completed':
        color = 'green';
        label = t(`status.completed`);
        break;
      case 'canceled':
        color = 'red';
        label = t(`status.canceled`);
        break;
      default:
        label = status;
    }

    return <Tag color={color}>{label}</Tag>;
  };

  const columns: ColumnsType<Shipping> = [
    {
      title: t('common.index'),
      key: 'index',
      width: 70,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: t('admin.scheduledDate'),
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 180,
      render: (date) => formatDate(date),
    },
    {
      title: t('admin.status'),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => renderStatus(status),
    },
    {
      title: t('common.deliveryDay'),
      dataIndex: 'deliveryDay',
      key: 'deliveryDay',
      width: 120,
    },
    {
      title: t('common.deliveryWeek'),
      dataIndex: 'deliveryWeek',
      key: 'deliveryWeek',
      width: 150,
    },
    {
      title: t('admin.deliveryAddress'),
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 250,
      ellipsis: true,
    },
    {
      title: t('common.note'),
      dataIndex: 'deliveryNote',
      key: 'deliveryNote',
      width: 250,
      ellipsis: true,
    },
    {
      title: t('common.shipper'),
      dataIndex: 'shipperName',
      key: 'shipperName',
      width: 180,
      render: (name: string | null | undefined) =>
        name ? (
          <span>{name}</span>
        ) : (
          <span className="text-text3">{t('admin.notAssigned')}</span>
        ),
    },
    {
      title: t('common.update'),
      key: 'update',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Tooltip title={t('admin.updateShipper')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedShipping(record);
              setSelectedShipper(record.shipperId || undefined);
            }}
          />
        </Tooltip>
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

  const dayOptions = [
    { label: t('days.monday'), value: 'monday' },
    { label: t('days.tuesday'), value: 'tuesday' },
    { label: t('days.wednesday'), value: 'wednesday' },
    { label: t('days.thursday'), value: 'thursday' },
    { label: t('days.friday'), value: 'friday' },
    { label: t('days.saturday'), value: 'saturday' },
    { label: t('days.sunday'), value: 'sunday' },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">{t('admin.shippingManagement')}</h1>

      {/* Bộ lọc theo ngày và tuần */}
      <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
        <Select
          value={selectedDay}
          onChange={(val) => setSelectedDay(val)}
          style={{ width: 160 }}
          options={dayOptions}
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
          {t('admin.refresh')}
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

      <Modal
        title={t('admin.updateShipper')}
        open={!!selectedShipping}
        onCancel={() => {
          setSelectedShipping(null);
          setSelectedShipper(undefined);
        }}
        onOk={async () => {
          if (!selectedShipping || !selectedShipper) {
            return;
          }
          try {
            setAssigning(true);
            await api.put(
              `/shipping/${selectedShipping.id}/assign-shipper`,
              {
                shipperId: selectedShipper,
                note: 'Assigned by admin',
              },
              { withAuth: true }
            );
            
            toast.success(t('messages.updateShipperSuccess'));
            setSelectedShipping(null);
            setSelectedShipper(undefined);
            // Refresh lại danh sách shipping để lấy dữ liệu mới nhất
            await fetchShipping(selectedDay, selectedWeek);
          } catch (error) {
            console.error(error);
            toast.error(t('messages.updateShipperFailed'));
          } finally {
            setAssigning(false);
          }
        }}
        confirmLoading={assigning}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        centered
      >
        <p className="mb-2 text-sm text-text2">
          {t('admin.selectShipperForOrder')} <strong>{selectedShipping?.id}</strong>
        </p>
        <Select
          value={selectedShipper}
          onChange={(value) => setSelectedShipper(value)}
          placeholder={t('admin.selectShipper')}
          style={{ width: '100%' }}
          loading={loadingShippers}
          options={shippers.map((s) => ({ label: s.username, value: s.id }))}
        />
      </Modal>
    </Fragment>
  );
};

export default AdminShipping;
