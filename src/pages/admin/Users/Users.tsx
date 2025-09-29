import React, { Fragment, useEffect, useState } from 'react';
import { Table, Spin, Button, Modal, Form, Input, Space, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';
import { TUser } from '../../../types/TUser';

const Users: React.FC = () => {
  useTitle('Quản lý Users');

  const [data, setData] = useState<TUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  const [open, setOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<TUser | null>(null);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [search, setSearch] = useState<string>('');

  const [form] = Form.useForm();

  // Lấy danh sách users
  const fetchUsers = async (page = 1, limit = 20, keyword = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/users?page=${page}&limit=${limit}&search=${keyword}`, {
        withAuth: true,
      });
      setData(res.data.data);
      setPagination({
        current: page,
        pageSize: limit,
        total: res.data.total,
      });
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Thêm / sửa user
  const handleAddOrEditUser = async () => {
    try {
      console.log(123);

      setSubmitting(true);
      const values = await form.validateFields();

      if (isEdit && currentUser) {
        await api.put(`/users/${currentUser.id}`, values, { withAuth: true });
        toast.success('Cập nhật user thành công!');
      } else {
        await api.post('/users', values, { withAuth: true });
        toast.success('Thêm user thành công!');
      }

      setOpen(false);
      form.resetFields();
      setCurrentUser(null);
      setIsEdit(false);

      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? 'Cập nhật user thất bại!' : 'Thêm user thất bại!');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<TUser> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      key: 'role',
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
      render: (_: any, record: TUser) => (
        <Space>
          <Button
            color="primary"
            variant="text"
            icon={<EditOutlined />}
            onClick={() => {
              setIsEdit(true);
              setCurrentUser(record);
              setOpen(true);
              form.setFieldsValue({
                username: record.username,
                role: record.role,
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý Users</h1>

      <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
        <Input.Search
          placeholder="Tìm kiếm theo username"
          allowClear
          enterButton
          style={{ maxWidth: 300 }}
          onSearch={(value) => {
            setSearch(value);
            fetchUsers(1, pagination.pageSize, value);
          }}
        />

        <Button
          type="primary"
          onClick={() => {
            setIsEdit(false);
            setCurrentUser(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          <PlusOutlined /> Thêm User
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: 1000 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (page, pageSize) => fetchUsers(page, pageSize, search),
            onShowSizeChange: (current, size) => fetchUsers(current, size, search),
          }}
        />
      </Spin>

      {/* Modal thêm/sửa user */}
      <Modal
        title={isEdit ? 'Sửa User' : 'Thêm User'}
        open={open}
        centered
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setIsEdit(false);
          setCurrentUser(null);
        }}
        onOk={handleAddOrEditUser}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ htmlType: 'submit', loading: submitting }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập username' }]}
          >
            <Input placeholder="Nhập username" />
          </Form.Item>

          {!isEdit && (
            <>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Nhập lại mật khẩu"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Vui lòng nhập lại mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="role"
            label="Quyền"
            rules={[{ required: true, message: 'Vui lòng chọn quyền' }]}
          >
            <Select placeholder="Chọn quyền">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="customer">Customer</Select.Option>
              <Select.Option value="farmer">Farmer</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default Users;
