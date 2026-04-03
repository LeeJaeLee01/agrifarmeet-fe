import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Select,
  InputNumber,
  Card,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate, formatVND, formatWeight } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';

interface Box {
  id: string;
  name: string;
  description: string;
  status: string;
  price: number;
  totalWeight: number;
  image: string;
  productIds: string[];
  expiredAt: number;
  createdAt: string;
  updatedAt: string;
}

const Boxes: React.FC = () => {
  useTitle('Quản lý gói');

  const [data, setData] = useState<Box[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [search, setSearch] = useState<string>('');

  const [form] = Form.useForm();

  const imageValue = Form.useWatch('image', form);

  // Normalize dữ liệu box trả về từ API
  const normalizeBox = (raw: any): Box => {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      status: raw.status,
      price: raw.price,
      totalWeight: raw.totalWeight,
      image: raw.image,
      expiredAt: raw.expiredAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      productIds: Array.isArray(raw.productIds)
        ? raw.productIds
        : raw.products
        ? raw.products.map((p: any) => p.id)
        : [],
    };
  };

  // Fetch boxes
  const fetchBoxes = async (page = 1, limit = 20, keyword = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/boxes?page=${page}&limit=${limit}&search=${keyword}`);
      const normalized = res.data.data.map((b: any) => normalizeBox(b));
      setData(normalized);
      setPagination({
        current: page,
        pageSize: limit,
        total: res.data.total,
      });
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách gói');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxes(pagination.current, pagination.pageSize, search);
  }, []);

  // Add / Edit box
  const handleAddOrEditBox = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      values.totalWeight = Number(values.totalWeight);
      values.price = Number(values.price);
      /** Sản phẩm trong gói quản lý tại /admin/box-vegetables — không gọi GET /products */
      if (isEdit && currentBox) {
        values.productIds = currentBox.productIds;
        await api.put(`/boxes/${currentBox.id}`, values, { withAuth: true });
        toast.success('Cập nhật gói thành công!');
      } else {
        values.productIds = [];
        await api.post('/boxes', values, { withAuth: true });
        toast.success('Thêm gói thành công!');
      }

      setOpen(false);
      form.resetFields();
      setCurrentBox(null);
      setIsEdit(false);
      fetchBoxes(pagination.current, pagination.pageSize, search);
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Cập nhật gói thất bại!' : 'Thêm gói thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete box
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/boxes/${id}`, { withAuth: true });
      toast.success('Xóa gói thành công!');
      fetchBoxes(pagination.current, pagination.pageSize, search);
    } catch (error) {
      console.error(error);
      toast.error('Xóa gói thất bại!');
    }
  };

  const openEditModal = (box: Box) => {
    setIsEdit(true);
    setCurrentBox(box);
    setOpen(true);
    form.setFieldsValue(box); // productIds đã chuẩn hóa rồi
  };

  const columns: ColumnsType<Box> = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (url: string) => <img src={url} alt="box" className="object-cover w-16 h-16" />,
    },
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 400,
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) =>
        status === 'active' ? (
          <Tag color="green">Hiệu lực</Tag>
        ) : (
          <Tag color="red">Hết hiệu lực</Tag>
        ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (p: number) => formatVND(p),
    },
    {
      title: 'Tổng KL (g)',
      dataIndex: 'totalWeight',
      key: 'totalWeight',
      width: 120,
      render: (weight) => formatWeight(weight, 'kg'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (d: string) => formatDate(d),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (d: string) => formatDate(d),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: Box) => (
        <Space>
          <Button
            color="primary"
            variant="text"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Xóa gói?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button color="danger" variant="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <div className="flex flex-col gap-2 mb-5 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="mb-0 text-lg font-bold lg:text-2xl">Quản lý gói</h1>
        <Link
          to="/admin/box-vegetables"
          className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
        >
          Cập nhật sản phẩm / rau trong gói →
        </Link>
      </div>

      <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
        <Input.Search
          placeholder="Tìm kiếm theo tên gói"
          allowClear
          enterButton
          style={{ maxWidth: 300 }}
          onSearch={(value) => {
            setSearch(value);
            fetchBoxes(1, pagination.pageSize, value);
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            setIsEdit(false);
            setCurrentBox(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          <PlusOutlined /> Thêm gói
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          bordered
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => fetchBoxes(page, pageSize, search),
            onShowSizeChange: (current, size) => fetchBoxes(current, size, search),
          }}
          scroll={{ x: 1200 }}
        />
      </Spin>

      <Modal
        title={isEdit ? 'Sửa gói' : 'Thêm gói'}
        open={open}
        centered
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setIsEdit(false);
          setCurrentBox(null);
        }}
        onOk={handleAddOrEditBox}
        okButtonProps={{ loading: submitting, disabled: submitting }}
        okText="Lưu"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên gói"
            rules={[{ required: true, message: 'Vui lòng nhập tên gói' }]}
          >
            <Input placeholder="Nhập tên gói" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (₫)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber<number>
              className="w-full"
              min={0}
              placeholder="Nhập giá"
              formatter={(value) => (value ? formatVND(value) : '')}
              parser={(value) => {
                const num = value ? value.replace(/[^\d]/g, '') : '';
                return num ? parseInt(num, 10) : 0;
              }}
            />
          </Form.Item>

          <Form.Item
            name="totalWeight"
            label="Tổng khối lượng (g)"
            rules={[{ required: true, message: 'Vui lòng nhập khối lượng' }]}
          >
            <InputNumber className="w-full" min={0} placeholder="Nhập tổng khối lượng gói" />
          </Form.Item>

          <Form.Item name="image" label="Ảnh (URL)">
            <Input placeholder="Nhập đường dẫn ảnh" />
          </Form.Item>

          {/* Preview ảnh chỉ hiện khi có link */}
          {imageValue && (
            <Card
              hoverable
              style={{
                width: 240,
                height: 300,
                backgroundImage: `url('${imageValue}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: 16,
              }}
            />
          )}

          <p className="mb-4 text-sm text-gray-600">
            Sản phẩm / rau trong gói: dùng{' '}
            <Link to="/admin/box-vegetables" className="font-medium text-green-600 hover:underline">
              Cập nhật rau trong gói
            </Link>
            .
          </p>

          <Form.Item
            name="expiredAt"
            label="Thời hạn (tuần)"
            rules={[{ required: true, message: 'Nhập số ngày hết hạn' }]}
          >
            <InputNumber className="w-full" min={1} placeholder="Nhập thời hạn" />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Boxes;
