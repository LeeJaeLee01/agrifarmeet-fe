import { Button, Popconfirm, Space, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { Fragment, useEffect, useState } from 'react';
import { formatDate, formatWeight } from '../../../utils/helper';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

const Shipping = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Lấy danh sách sản phẩm
  const fetchShipping = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shipping/orders');
      setData(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Mã giao hàng',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber',
      width: 140,
    },
    {
      title: 'Tên gói',
      dataIndex: 'boxName',
      key: 'boxName',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'boxUserName',
      key: 'boxUserName',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Loại giao hàng',
      dataIndex: 'shippingMethod',
      key: 'shippingMethod',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Phí giao hàng',
      dataIndex: 'shippingCost',
      key: 'shippingCost',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Khối lượng',
      dataIndex: 'totalWeight',
      key: 'totalWeight',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Số diện thoại giao hàng',
      dataIndex: 'deliveryPhone',
      key: 'deliveryPhone',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'deliveryNotes',
      key: 'deliveryNotes',
      width: 100,
      ellipsis: true,
    },
    {
      title: 'Đơn vị giao hàng',
      dataIndex: 'carrierName',
      key: 'carrierName',
      width: 150,
      ellipsis: true,
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý giao hàng</h1>
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

export default Shipping;
