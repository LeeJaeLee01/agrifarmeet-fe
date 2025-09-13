import React, { Fragment, useEffect, useState } from 'react';
import { Table, Spin, Button, Modal, Form, Input, Space, Popconfirm, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface Product {
  id: string;
  name: string;
  image: string;
  description: string | null;
  weight: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

const Products: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [form] = Form.useForm();

  const token = useSelector((state: RootState) => state.auth.token);

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách categories
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh mục');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Thêm / sửa sản phẩm
  const handleAddOrEditProduct = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      if (isEdit && currentProduct) {
        await api.put(`/products/${currentProduct.id}`, values, { withAuth: true });
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await api.post('/products', values, { withAuth: true });
        toast.success('Thêm sản phẩm thành công!');
      }

      setOpen(false);
      form.resetFields();
      setCurrentProduct(null);
      setIsEdit(false);

      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Cập nhật sản phẩm thất bại!' : 'Thêm sản phẩm thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`, { withAuth: true });
      toast.success('Xóa sản phẩm thành công!');
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Xóa sản phẩm thất bại!');
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'STT',
      dataIndex: 'index',
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
      render: (url: string) => <img src={url} alt="product" className="object-cover w-16 h-16" />,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
      render: (text: string | null) => <span>{text || '-'}</span>,
    },
    {
      title: 'Khối lượng (g)',
      dataIndex: 'weight',
      key: 'weight',
      width: 150,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setIsEdit(true);
              setCurrentProduct(record);
              setOpen(true);
              form.setFieldsValue({
                categoryId: record.categoryId,
                name: record.name,
                image: record.image,
                description: record.description,
                weight: record.weight,
              });
            }}
          />
          <Popconfirm
            title="Xóa sản phẩm?"
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
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý sản phẩm</h1>
      <div className="flex justify-end w-full mb-5">
        <Button
          type="primary"
          onClick={() => {
            setIsEdit(false);
            setCurrentProduct(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          <PlusOutlined /> Thêm sản phẩm
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

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setIsEdit(false);
          setCurrentProduct(null);
        }}
        onOk={handleAddOrEditProduct}
        okButtonProps={{ loading: submitting, disabled: submitting }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh (URL)"
            rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
          >
            <Input placeholder="Dán link ảnh vào đây" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Khối lượng (gram)"
            getValueFromEvent={(e) => Number(e.target.value)}
            rules={[{ required: true, message: 'Vui lòng nhập khối lượng' }]}
          >
            <Input type="number" placeholder="Ví dụ: 500" />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Products;
