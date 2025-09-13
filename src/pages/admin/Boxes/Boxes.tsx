import React, { Fragment, useEffect, useState } from 'react';
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
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

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

interface Product {
  id: string;
  name: string;
  image?: string;
}

const Boxes: React.FC = () => {
  const [data, setData] = useState<Box[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBox, setCurrentBox] = useState<Box | null>(null);

  const [form] = Form.useForm();
  const token = useSelector((state: RootState) => state.auth.token);

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
  const fetchBoxes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/boxes');
      const normalized = res.data.map((b: any) => normalizeBox(b));
      setData(normalized);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách gói');
    } finally {
      setLoading(false);
    }
  };

  // Fetch products để chọn cho box
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải sản phẩm');
    }
  };

  useEffect(() => {
    fetchBoxes();
    fetchProducts();
  }, []);

  // Add / Edit box
  const handleAddOrEditBox = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      if (isEdit && currentBox) {
        await api.put(`/boxes/${currentBox.id}`, values, { withAuth: true });
        toast.success('Cập nhật gói thành công!');
      } else {
        await api.post('/boxes', values, { withAuth: true });
        toast.success('Thêm gói thành công!');
      }

      setOpen(false);
      form.resetFields();
      setCurrentBox(null);
      setIsEdit(false);
      fetchBoxes();
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
      fetchBoxes();
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
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (p: number) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(p),
    },
    {
      title: 'Tổng KL (g)',
      dataIndex: 'totalWeight',
      key: 'totalWeight',
      width: 120,
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
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Xóa gói?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý gói</h1>

      <div className="flex justify-end w-full mb-5">
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
          pagination={{ pageSize: 20 }}
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
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (₫)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item
            name="totalWeight"
            label="Tổng khối lượng (g)"
            rules={[{ required: true, message: 'Vui lòng nhập khối lượng' }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item name="image" label="Ảnh (URL)">
            <Input />
          </Form.Item>

          <Form.Item
            name="productIds"
            label="Sản phẩm trong gói"
            rules={[{ required: true, message: 'Chọn ít nhất 1 sản phẩm' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
              optionFilterProp="children"
              style={{ width: '100%' }}
            >
              {products.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  <div className="flex items-center gap-2">
                    {p.image && (
                      <img src={p.image} alt={p.name} className="object-cover w-6 h-6 rounded" />
                    )}
                    <span>{p.name}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="expiredAt"
            label="Thời hạn (tuần)"
            rules={[{ required: true, message: 'Nhập số ngày hết hạn' }]}
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Boxes;
