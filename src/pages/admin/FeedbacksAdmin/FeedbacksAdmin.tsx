import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Table,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  InputNumber,
  Upload,
  Image,
  Typography,
  Radio,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';

const getPayloadData = (res: any) => res?.data?.data ?? res?.data;

interface FeedbackRow {
  id: string;
  name: string;
  userId: string;
  vote: number;
  description?: string | null;
  images?: string[] | null;
  createdAt?: string;
  address?: string | null;
}

const FeedbacksAdmin: React.FC = () => {
  useTitle('Feedback — Admin');

  const [items, setItems] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editing, setEditing] = useState<FeedbackRow | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const fetchList = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/feedbacks?page=${page}&limit=${limit}`, { withAuth: true });
      const payload = getPayloadData(res);
      const list = payload?.items ?? [];
      const meta = payload?.meta;
      setItems(list);
      setPagination({
        current: meta?.page ?? page,
        pageSize: meta?.limit ?? limit,
        total: meta?.total ?? list.length,
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Không tải được feedback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList(1, 20);
  }, [fetchList]);

  const openCreate = () => {
    setIsEdit(false);
    setEditing(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({ vote: 5, imageMode: 'append' });
    setOpen(true);
  };

  const openEdit = (row: FeedbackRow) => {
    setIsEdit(true);
    setEditing(row);
    setFileList([]);
    form.setFieldsValue({
      name: row.name,
      userId: row.userId,
      vote: row.vote,
      description: row.description ?? '',
      imageMode: 'append',
    });
    setOpen(true);
  };

  const buildCreateFd = (values: any, files: File[]) => {
    const fd = new FormData();
    fd.append('name', values.name);
    fd.append('userId', values.userId);
    fd.append('vote', String(values.vote));
    if (values.description != null && values.description !== '') {
      fd.append('description', String(values.description));
    }
    files.forEach((f) => fd.append('files', f));
    return fd;
  };

  const buildUpdateFd = (values: any, files: File[]) => {
    const fd = new FormData();
    if (values.name != null) fd.append('name', values.name);
    if (values.userId != null) fd.append('userId', values.userId);
    if (values.vote != null) fd.append('vote', String(values.vote));
    if (values.description !== undefined) fd.append('description', values.description ?? '');
    files.forEach((f) => fd.append('files', f));
    return fd;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const files = fileList.map((f) => f.originFileObj).filter(Boolean) as File[];

      if (!isEdit) {
        const fd = buildCreateFd(values, files);
        await api.post('/admin/feedbacks', fd, { withAuth: true });
        toast.success('Đã tạo feedback');
      } else if (editing) {
        const fd = buildUpdateFd(values, files);
        const mode = values.imageMode === 'replace' ? 'replace' : 'append';
        await api.patch(`/admin/feedbacks/${editing.id}?mode=${mode}`, fd, { withAuth: true });
        toast.success('Đã cập nhật');
      }
      setOpen(false);
      setFileList([]);
      fetchList(pagination.current, pagination.pageSize);
    } catch (e: any) {
      console.error(e);
      if (e?.errorFields) return;
      toast.error(e?.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (row: FeedbackRow) => {
    try {
      await api.delete(`/admin/feedbacks/${row.id}`, { withAuth: true });
      toast.success('Đã xóa');
      fetchList(pagination.current, pagination.pageSize);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const columns: ColumnsType<FeedbackRow> = [
    {
      title: 'STT',
      width: 56,
      align: 'center',
      render: (_a, _b, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    {
      title: 'Tên hiển thị',
      dataIndex: 'name',
      width: 160,
      ellipsis: true,
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      width: 280,
      ellipsis: true,
      render: (id: string) => <Typography.Text copyable={{ text: id }}>{id}</Typography.Text>,
    },
    {
      title: 'Điểm',
      dataIndex: 'vote',
      width: 72,
    },
    {
      title: 'Ảnh',
      width: 200,
      render: (_, r) => {
        const imgs = r.images;
        if (!Array.isArray(imgs) || !imgs.length) return '—';
        return (
          <Image.PreviewGroup>
            <Space wrap size="small">
              {imgs.slice(0, 3).map((src, i) => (
                <Image key={i} src={src} width={46} height={46} className="object-cover rounded" />
              ))}
            </Space>
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true,
      width: 220,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 160,
      render: (d: string) => (d ? formatDate(d) : '—'),
    },
    {
      title: 'Hành động',
      width: 120,
      fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="Xóa feedback này?" onConfirm={() => handleDelete(r)}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý đánh giá (feedback)</h1>
      <div className="flex flex-wrap justify-end gap-3 mb-5">
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Thêm feedback
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          bordered
          scroll={{ x: 1200 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (page, pageSize) => fetchList(page, pageSize ?? 20),
          }}
        />
      </Spin>

      <Modal
        title={isEdit ? 'Sửa feedback' : 'Thêm feedback'}
        open={open}
        onCancel={() => {
          setOpen(false);
          setFileList([]);
        }}
        onOk={handleSubmit}
        okButtonProps={{ loading: submitting }}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên hiển thị" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input placeholder="Tên người đánh giá" />
          </Form.Item>
          <Form.Item
            name="userId"
            label="User ID (UUID)"
            rules={[{ required: true, message: 'Nhập UUID user trong hệ thống' }]}
          >
            <Input placeholder="UUID của bảng users" />
          </Form.Item>
          <Form.Item
            name="vote"
            label="Điểm (1–5)"
            rules={[{ required: true, message: 'Nhập điểm' }]}
          >
            <InputNumber className="w-full" min={1} max={5} step={0.5} />
          </Form.Item>
          <Form.Item name="description" label="Nội dung">
            <Input.TextArea rows={4} placeholder="Nội dung đánh giá" />
          </Form.Item>
          {isEdit && (
            <Form.Item name="imageMode" label="Ảnh upload" initialValue="append">
              <Radio.Group>
                <Radio value="append">Thêm vào ảnh hiện có</Radio>
                <Radio value="replace">Thay toàn bộ ảnh</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          <Form.Item label="Ảnh (có thể nhiều file)">
            <Upload
              multiple
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList: fl }) => setFileList(fl)}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default FeedbacksAdmin;
