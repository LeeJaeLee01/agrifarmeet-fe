import React, { Fragment, useEffect, useState } from 'react';
import { Table, Spin, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';
import { TCategory } from '../../../types/TCategory';

const Categories: React.FC = () => {
  useTitle('Quản lý danh mục');

  const [data, setData] = useState<TCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<TCategory | null>(null);

  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categories = await api.get('/categories');
      setData(categories.data);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddOrEditCategory = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      if (isEdit && currentCategory) {
        await api.put(`/categories/${currentCategory.id}`, values, { withAuth: true });
        toast.success('Cập nhật danh mục thành công!');
      } else {
        await api.post('/categories', values, { withAuth: true });
        toast.success('Thêm danh mục thành công!');
      }

      setOpen(false);
      form.resetFields();
      setCurrentCategory(null);
      setIsEdit(false);

      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Cập nhật danh mục thất bại!' : 'Thêm danh mục thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`, { withAuth: true });
      toast.success('Xóa danh mục thành công!');
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error('Xóa danh mục thất bại!');
    }
  };

  const columns: ColumnsType<TCategory> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
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
      render: (_: any, record: TCategory) => (
        <Space>
          <Button
            color="primary"
            variant="text"
            icon={<EditOutlined />}
            onClick={() => {
              setIsEdit(true);
              setCurrentCategory(record);
              setOpen(true);
              form.setFieldsValue({
                name: record.name,
                image: record.image,
              });
            }}
          />
          <Popconfirm
            title="Xóa danh mục?"
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
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý danh mục</h1>
      <div className="flex justify-end w-full mb-5">
        <Button
          type="primary"
          onClick={() => {
            setIsEdit(false);
            setCurrentCategory(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          <PlusOutlined />
          Thêm danh mục
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          scroll={{ x: 800 }}
          bordered
          pagination={{ pageSize: 20 }}
        />
      </Spin>

      {/* Modal thêm/sửa danh mục */}
      <Modal
        title={isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setIsEdit(false);
          setCurrentCategory(null);
        }}
        onOk={handleAddOrEditCategory}
        okButtonProps={{ loading: submitting, disabled: submitting }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            className="[&_.ant-form-item-explain-error]:text-xs"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh (URL)"
            className="[&_.ant-form-item-explain-error]:text-xs"
            rules={[{ required: true, message: 'Vui lòng nhập URL ảnh' }]}
          >
            <Input placeholder="Dán link ảnh vào đây" />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Categories;
