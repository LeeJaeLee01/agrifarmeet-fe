import React, { Fragment, useEffect, useState } from 'react';
import { Table, Spin, Button, Modal, Form, Input, Space, Popconfirm, Select, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate, formatWeight } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';
import { TProduct } from '../../../types/TProduct';
import { TCategory } from '../../../types/TCategory';

const Products: React.FC = () => {
  useTitle('Quản lý sản phẩm');

  const [data, setData] = useState<TProduct[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<TProduct | null>(null);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [search, setSearch] = useState<string>('');
  const [categorySlug, setCategorySlug] = useState<string>('');

  const [form] = Form.useForm();

  const imageValue = Form.useWatch('image', form);

  const jsonHeaders = { Accept: 'application/json' as const };

  const productThumbUrl = (p: TProduct) => {
    if (p.image) return p.image;
    if (Array.isArray(p.images)) return p.images[0];
    if (typeof p.images === 'string') return p.images;
    return undefined;
  };

  // Lấy danh sách sản phẩm theo danh mục: GET /categories/:slug/products
  const fetchProducts = async (page = 1, limit = 20, keyword = '', slug = categorySlug) => {
    if (!slug) return;
    try {
      setLoading(true);
      const q = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (keyword) q.set('search', keyword);
      const res = await api.get(`/categories/${slug}/products?${q.toString()}`, {
        headers: jsonHeaders,
      });
      const payload = res.data.data;
      const items = payload?.items ?? [];
      const meta = payload?.meta;
      setData(items);
      setPagination({
        current: meta?.page ?? page,
        pageSize: meta?.limit ?? limit,
        total: meta?.total ?? items.length,
      });
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách categories — response { status, data: [...] }
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories', { headers: jsonHeaders });
      const list: TCategory[] = res.data.data ?? [];
      setCategories(list);
      return list;
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh mục');
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      const list = await fetchCategories();
      if (list.length === 0) return;
      const firstSlug = list[0].slug;
      setCategorySlug(firstSlug);
      await fetchProducts(1, 20, '', firstSlug);
    })();
  }, []);

  // Thêm / sửa sản phẩm
  const handleAddOrEditProduct = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      values.weight = Number(values.weight);
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

      fetchProducts(pagination.current, pagination.pageSize, search, categorySlug);
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
      fetchProducts(pagination.current, pagination.pageSize, search, categorySlug);
    } catch (error) {
      console.error(error);
      toast.error('Xóa sản phẩm thất bại!');
    }
  };

  const columns: ColumnsType<TProduct> = [
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
      render: (_: unknown, record: TProduct) => {
        const url = productThumbUrl(record);
        return url ? (
          <img src={url} alt="product" className="object-cover w-16 h-16" />
        ) : (
          <span className="text-gray-400">—</span>
        );
      },
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
      render: (weight) => formatWeight(weight),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: TCategory) => category?.name || null,
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
      render: (_: any, record: TProduct) => (
        <Space>
          <Button
            color="primary"
            variant="text"
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
            <Button color="danger" variant="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý sản phẩm</h1>
      <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
        <Select
          placeholder="Chọn danh mục"
          className="min-w-[200px]"
          value={categorySlug || undefined}
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          onChange={(slug) => {
            setCategorySlug(slug);
            setSearch('');
            fetchProducts(1, pagination.pageSize, '', slug);
          }}
        />
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          allowClear
          enterButton
          style={{ maxWidth: 300 }}
          onSearch={(value) => {
            setSearch(value);
            fetchProducts(1, pagination.pageSize, value, categorySlug);
          }}
        />

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
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => fetchProducts(page, pageSize, search, categorySlug),
            onShowSizeChange: (current, size) => fetchProducts(current, size, search, categorySlug),
          }}
          scroll={{ x: 1200 }}
        />
      </Spin>

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        open={open}
        centered
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
