import React, { Fragment, useEffect, useState } from 'react';
import { Table, Image, Spin, message, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import api from '../../../utils/api';

interface Category {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const { confirm } = Modal;

const fakeCategories: Category[] = [
  {
    id: '1',
    name: 'Trái cây',
    image:
      'https://png.pngtree.com/png-clipart/20190630/original/pngtree-fruits-tropical-png-image_4172131.jpg',
    createdAt: '2025-08-23T05:36:07.348Z',
    updatedAt: '2025-08-23T05:36:07.348Z',
  },
  {
    id: '2',
    name: 'Rau',
    image: 'https://mtcs.1cdn.vn/thumbs/540x360/2023/05/30/rau-cu-qua.jpg',
    createdAt: '2025-08-23T05:35:05.035Z',
    updatedAt: '2025-08-23T05:35:05.035Z',
  },
  {
    id: '3',
    name: 'Củ',
    image: 'https://ujamaaseeds.com/cdn/shop/collections/TUBERS_1024x1024.jpg?v=1674322049',
    createdAt: '2025-08-23T05:39:59.218Z',
    updatedAt: '2025-08-23T05:39:59.218Z',
  },
  {
    id: '4',
    name: 'Trứng',
    image: 'https://mayaptrunghaoquang.com/static/images/cach-chon-trung-ga-ap-1.webp',
    createdAt: '2025-08-23T05:42:13.044Z',
    updatedAt: '2025-08-23T05:42:13.044Z',
  },
];

const Categories: React.FC = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // const categories = await api.get('/categories');
      // setData(categories.data);
      setData(fakeCategories);
    } catch (error) {
      console.error(error);
      message.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddOrEditCategory = async () => {
    try {
      const values = await form.validateFields();

      if (isEdit && currentCategory) {
        // call API update ở đây
        console.log('update', currentCategory.id, values);
        message.success('Cập nhật danh mục thành công!');
      } else {
        // call API create ở đây
        console.log('create', values);
        message.success('Thêm danh mục thành công!');
      }

      setOpen(false);
      form.resetFields();
      setCurrentCategory(null);
      setIsEdit(false);

      fetchCategories();
    } catch (error) {
      console.error(error);
      message.error(isEdit ? 'Cập nhật danh mục thất bại!' : 'Thêm danh mục thất bại!');
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1,
    },
    // {
    //   title: 'Ảnh',
    //   dataIndex: 'image',
    //   key: 'image',
    //   render: (src: string) => (
    //     <Image
    //       src={src}
    //       alt="category"
    //       width={60}
    //       height={60}
    //       className="object-cover rounded-md"
    //     />
    //   ),
    // },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: Category) => (
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
            onConfirm={() => console.log(123)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button color="danger" variant="text" icon={<DeleteOutlined />} onClick={() => {}} />
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
          pagination={{ pageSize: 5 }}
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
