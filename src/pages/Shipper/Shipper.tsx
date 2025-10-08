import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  Spin,
  Input,
  Tag,
  Tooltip,
  Button,
  Modal,
  Form,
  Select,
  Input as AntInput,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { formatDate } from '../../utils/helper';
import { useTitle } from '../../hooks/useTitle';
import { jwtDecode } from 'jwt-decode';
import { EditOutlined } from '@ant-design/icons';

const { TextArea } = AntInput;

interface JwtPayload {
  sub: string;
  role: string;
  username?: string;
}

interface Shipping {
  id: string;
  scheduledAt: string;
  deliveryAddress: string;
  deliveryDay: string;
  deliveryWeek: string;
  status: string;
  deliveryNote: string;
  createdAt: string;
  updatedAt: string;
  boxUser: {
    user: {
      username: string;
    };
    box: {
      name: string;
      price: string;
      image: string;
    };
  };
  shipperConfidence?: string | null;
  trafficCondition?: string | null;
  weatherCondition?: string | null;
}

enum ShippingStatusEnum {
  PREPARING = 'preparing',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

const ShipperShippings: React.FC = () => {
  useTitle('Danh sách đơn hàng');

  const [data, setData] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [search, setSearch] = useState<string>('');

  const [open, setOpen] = useState<boolean>(false);
  const [currentShipping, setCurrentShipping] = useState<Shipping | null>(null);
  const [form] = Form.useForm();

  const getShipperId = (): string | null => {
    try {
      const token = localStorage.getItem('shipperToken');
      if (!token) return null;
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.sub || null;
    } catch {
      return null;
    }
  };

  const fetchShippings = async (page = 1, limit = 10, keyword = '') => {
    const shipperId = getShipperId();
    if (!shipperId) {
      toast.error('Không tìm thấy thông tin shipper!');
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(
        `/shipping/shipper/${shipperId}?page=${page}&limit=${limit}&search=${keyword}`,
        { withAuth: true }
      );

      setData(res.data.data);
      setPagination({
        current: page,
        pageSize: limit,
        total: res.data.total,
      });
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShippings();
  }, []);

  // 👉 Hàm gọi API cập nhật trạng thái
  const handleUpdateStatus = async () => {
    try {
      const values = await form.validateFields();
      if (!currentShipping) return;

      await api.put(`/shipping/${currentShipping.id}/status`, values, { withAuth: true });
      toast.success('Cập nhật trạng thái thành công!');
      setOpen(false);
      fetchShippings(pagination.current, pagination.pageSize, search);
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật thất bại!');
    }
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
      title: 'Khách hàng',
      dataIndex: ['boxUser', 'user', 'username'],
      key: 'username',
      width: 150,
    },
    {
      title: 'Gói hàng',
      dataIndex: ['boxUser', 'box', 'name'],
      key: 'boxName',
      width: 200,
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.boxUser.box.image}
            alt={name}
            className="object-cover w-10 h-10 rounded-md"
          />
          <span>{name}</span>
        </div>
      ),
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
      width: 130,
      render: (status: string) => {
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
      },
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'deliveryNote',
      key: 'deliveryNote',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Điều kiện giao hàng',
      key: 'condition',
      width: 200,
      render: (_, record) => (
        <div>
          {record.weatherCondition && (
            <Tooltip title="Thời tiết">
              <Tag color="blue">{record.weatherCondition}</Tag>
            </Tooltip>
          )}
          {record.trafficCondition && (
            <Tooltip title="Giao thông">
              <Tag color="volcano">{record.trafficCondition}</Tag>
            </Tooltip>
          )}
          {record.shipperConfidence && (
            <Tooltip title="Độ tin cậy">
              <Tag color="green">{(parseFloat(record.shipperConfidence) * 100).toFixed(0)}%</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button
          color="primary"
          variant="text"
          icon={<EditOutlined />}
          onClick={() => {
            setCurrentShipping(record);
            form.setFieldsValue({ status: record.status, note: record.deliveryNote });
            setOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Danh sách đơn hàng của tôi</h1>

      <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
        <Input.Search
          placeholder="Tìm kiếm theo tên khách hàng hoặc gói hàng"
          allowClear
          enterButton
          style={{ maxWidth: 350 }}
          onSearch={(value) => {
            setSearch(value);
            fetchShippings(1, pagination.pageSize, value);
          }}
        />
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: 1300 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => fetchShippings(page, pageSize, search),
            onShowSizeChange: (current, size) => fetchShippings(current, size, search),
          }}
        />
      </Spin>

      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleUpdateStatus}
        centered
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={ShippingStatusEnum.PREPARING}>Chuẩn bị</Select.Option>
              <Select.Option value={ShippingStatusEnum.DELIVERING}>Đang giao</Select.Option>
              <Select.Option value={ShippingStatusEnum.COMPLETED}>Hoàn thành</Select.Option>
              <Select.Option value={ShippingStatusEnum.CANCELED}>Đã hủy</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <TextArea rows={3} placeholder="Nhập ghi chú (tuỳ chọn)" />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default ShipperShippings;
