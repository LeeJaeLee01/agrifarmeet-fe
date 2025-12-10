import React, { Fragment, useEffect, useState } from 'react';
import { Table, Spin, Tag, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { TShipping } from '../../../types/TShipping';

const AdminShippers: React.FC = () => {
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
      toast.error('Không thể tải danh sách giao hàng');
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
        label = 'Đang chờ';
        break;
      case 'preparing':
        color = 'orange';
        label = 'Đang chuẩn bị';
        break;
      case 'delivering':
        color = 'blue';
        label = 'Đang giao hàng';
        break;
      case 'delivered':
        color = 'green';
        label = 'Đã giao';
        break;
      case 'cancelled':
        color = 'red';
        label = 'Đã hủy';
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
      title: 'Ngày giao dự kiến',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: TShipping['status']) => renderStatus(status),
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 260,
      ellipsis: true,
    },
    {
      title: 'Shipper phụ trách',
      dataIndex: ['shipper', 'username'],
      key: 'shipper',
      width: 180,
      render: (_: unknown, record: TShipping) =>
        record.shipper ? record.shipper.username : <span className="text-text3">Chưa phân công</span>,
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Danh sách giao hàng theo Shipper</h1>

      <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
        <Input.Search
          placeholder="Tìm kiếm theo tên shipper"
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


