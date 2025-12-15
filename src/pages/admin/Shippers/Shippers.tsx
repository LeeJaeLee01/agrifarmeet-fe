import React, { Fragment, useEffect, useState } from 'react';
import { Table, Spin, Tag, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { TShipping } from '../../../types/TShipping';

const AdminShippers: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<TShipping[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const fetchShippings = async (page = 1, limit = 10, keyword = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/shipping/all?search=${keyword}&limit=${limit}&page=${page}`, {
        withAuth: true,
      });
      setData(res.data.data || []);
      setPagination({
        current: page,
        pageSize: limit,
        total: res.data.total || 0,
      });
    } catch (error) {
      console.error(error);
      toast.error(t('messages.loadShippingListFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippings();
  }, []);

  const renderStatus = (status: TShipping['status']) => {
    let color: string = 'default';
    let label = '';

    switch (status) {
      case 'pending':
        color = 'default';
        label = t('status.pending');
        break;
      case 'preparing':
        color = 'orange';
        label = t('status.preparing');
        break;
      case 'delivering':
        color = 'blue';
        label = t('status.delivering');
        break;
      case 'delivered':
        color = 'green';
        label = t('status.delivered');
        break;
      case 'cancelled':
        color = 'red';
        label = t('status.cancelled');
        break;
      default:
        label = status;
    }

    return <Tag color={color}>{label}</Tag>;
  };

  const columns: ColumnsType<TShipping> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 220,
      ellipsis: true,
    },
    {
      title: t('admin.scheduledDate'),
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: t('admin.status'),
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: TShipping['status']) => renderStatus(status),
    },
    {
      title: t('admin.deliveryAddress'),
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 260,
      ellipsis: true,
    },
    {
      title: t('admin.assignedShipper'),
      dataIndex: ['shipper', 'username'],
      key: 'shipper',
      width: 180,
      render: (_: unknown, record: TShipping) =>
        record.shipper ? record.shipper.username : <span className="text-text3">{t('admin.notAssigned')}</span>,
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">{t('admin.shippingList')}</h1>

      <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
        <Input.Search
          placeholder={t('admin.searchByShipper')}
          allowClear
          enterButton
          style={{ maxWidth: 350 }}
          onSearch={(value) => {
            setSearch(value);
            fetchShippings(1, pagination.pageSize, value);
          }}
          onChange={(e) => {
            if (!e.target.value) {
              setSearch('');
              fetchShippings(1, pagination.pageSize, '');
            }
          }}
        />
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => fetchShippings(page, pageSize, search),
            onShowSizeChange: (current, size) => fetchShippings(current, size, search),
          }}
          scroll={{ x: 1100 }}
        />
      </Spin>
    </Fragment>
  );
};

export default AdminShippers;


