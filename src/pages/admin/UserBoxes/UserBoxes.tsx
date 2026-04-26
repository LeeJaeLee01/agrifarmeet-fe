import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Table,
  Spin,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Space,
  Popconfirm,
  Tag,
  Descriptions,
  Typography,
  Input,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';

const getPayload = (res: any) => res?.data?.data ?? res?.data;

type AdminUserBoxRow = {
  id: string;
  status: string;
  totalQuantity: number;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    phone: string | null;
    email: string | null;
    account: string | null;
    address: string | null;
    addressDetail: string | null;
  };
  box: { id: string; name: string; slug: string; price: string; duration: number };
  addOns: Array<{
    id: string;
    productId: string;
    quantity: number;
    priceSnapshot: number;
    product?: { id: string; name: string; slug: string } | null;
  }>;
  deliveries: Array<{
    id: string;
    status: string;
    scheduledDeliveryDate: string;
    shipperId: string | null;
  }>;
  transactions: Array<{
    id: string;
    amount: string;
    type: string;
    status: string;
    referenceId: string | null;
    paymentMethod: string | null;
    createdAt: string;
  }>;
};

const UserBoxes: React.FC = () => {
  useTitle('Gói đã bán — Admin');

  const [items, setItems] = useState<AdminUserBoxRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [phoneFilter, setPhoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<AdminUserBoxRow | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserBoxRow | null>(null);
  const [form] = Form.useForm();

  const fetchList = useCallback(
    async (page = 1, limit = 20) => {
      try {
        setLoading(true);
        const q = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (phoneFilter.trim()) q.set('phone', phoneFilter.trim());
        if (statusFilter) q.set('status', statusFilter);
        const res = await api.get(`/admin/user-boxes?${q.toString()}`, { withAuth: true });
        const payload = getPayload(res);
        setItems(payload?.items ?? []);
        const meta = payload?.meta;
        setPagination({
          current: meta?.page ?? page,
          pageSize: meta?.limit ?? limit,
          total: meta?.total ?? 0,
        });
      } catch (e: any) {
        console.error(e);
        toast.error(e?.response?.data?.message || 'Không tải được danh sách');
      } finally {
        setLoading(false);
      }
    },
    [phoneFilter, statusFilter],
  );

  useEffect(() => {
    fetchList(1, pagination.pageSize);
  }, [statusFilter]);

  const openDetail = (row: AdminUserBoxRow) => {
    setDetailRow(row);
    setDetailOpen(true);
  };

  const openEdit = (row: AdminUserBoxRow) => {
    setEditing(row);
    form.setFieldsValue({
      status: row.status,
      totalQuantity: row.totalQuantity ?? 1,
      expiredAt: row.expiredAt ? dayjs(row.expiredAt) : null,
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try {
      setSubmitting(true);
      const values = await form.validateFields();
      const body: { status?: string; expiredAt?: string | null; totalQuantity?: number } = {};
      if (values.status != null) body.status = values.status;
      if (values.totalQuantity != null) body.totalQuantity = Number(values.totalQuantity);
      if (values.expiredAt === null || values.expiredAt === undefined) {
        body.expiredAt = null;
      } else if (values.expiredAt) {
        body.expiredAt = values.expiredAt.format('YYYY-MM-DD');
      }
      await api.patch(`/admin/user-boxes/${editing.id}`, body, { withAuth: true });
      toast.success('Đã cập nhật');
      setEditOpen(false);
      fetchList(pagination.current, pagination.pageSize);
    } catch (e: any) {
      if (e?.errorFields) return;
      toast.error(e?.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (row: AdminUserBoxRow) => {
    try {
      await api.delete(`/admin/user-boxes/${row.id}`, { withAuth: true });
      toast.success('Đã xóa');
      fetchList(pagination.current, pagination.pageSize);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const q = new URLSearchParams({
        page: String(pagination.current),
        limit: String(pagination.pageSize),
      });
      if (phoneFilter.trim()) q.set('phone', phoneFilter.trim());
      if (statusFilter) q.set('status', statusFilter);

      const res = await api.get(`/admin/user-boxes/export/excel?${q.toString()}`, {
        withAuth: true,
        responseType: 'blob',
      });

      const disposition = String(res.headers?.['content-disposition'] || '');
      const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^\";]+)/i);
      const filename = match?.[1] ? decodeURIComponent(match[1].replace(/"/g, '')) : 'user-boxes.xlsx';

      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Xuất Excel thành công');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Xuất Excel thất bại');
    } finally {
      setExporting(false);
    }
  };

  const statusColor = (s: string) => {
    if (s === 'active') return 'green';
    if (s === 'pending') return 'gold';
    if (s === 'completed') return 'blue';
    return 'default';
  };

  const columns: ColumnsType<AdminUserBoxRow> = [
    {
      title: 'STT',
      width: 56,
      align: 'center',
      render: (_a, _b, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    {
      title: 'Khách (SĐT)',
      width: 140,
      render: (_, r) => r.user?.phone ?? '—',
    },
    {
      title: 'Tên',
      width: 160,
      render: (_, r) => r.user?.account ?? '—',
    },
    {
      title: 'Email',
      width: 220,
      ellipsis: true,
      render: (_, r) => r.user?.email ?? '—',
    },
    {
      title: 'Tên box mua',
      width: 180,
      ellipsis: true,
      render: (_, r) => r.box?.name ?? '—',
    },
    {
      title: 'Gói',
      ellipsis: true,
      render: (_, r) => (
        <div>
          <div className="font-medium">{r.box?.name}</div>
          <Typography.Text type="secondary" className="text-xs">
            {r.box?.slug}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      width: 110,
      render: (_, r) => <Tag color={statusColor(r.status)}>{r.status}</Tag>,
    },
    {
      title: 'Số lượng',
      width: 100,
      align: 'center',
      render: (_, r) => <span className="font-bold text-green-700">{r.totalQuantity ?? 1}</span>,
    },
    {
      title: 'Tổng sản phẩm',
      width: 120,
      align: 'center',
      render: (_, r) => r.addOns?.length ?? 0,
    },
    {
      title: 'Giao hàng',
      width: 88,
      align: 'center',
      render: (_, r) => r.deliveries?.length ?? 0,
    },
    {
      title: 'Ngày tạo',
      width: 120,
      render: (_, r) => formatDate(r.createdAt),
    },
    {
      title: 'Thao tác',
      width: 200,
      fixed: 'right',
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(r)}>
            Chi tiết
          </Button>
          <Button size="small" type="primary" ghost icon={<EditOutlined />} onClick={() => openEdit(r)}>
            Sửa
          </Button>
          <Popconfirm title="Xóa bản ghi user_box?" okText="Xóa" onConfirm={() => handleDelete(r)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-2 text-xl font-bold text-gray-900 lg:text-2xl">Gói đã bán (user_boxes)</h1>
      <p className="mb-6 text-sm text-gray-500">
        API: <code className="text-xs">GET/PATCH/DELETE /admin/user-boxes</code>
      </p>

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <div className="mb-1 text-xs text-gray-500">SĐT</div>
          <Input
            placeholder="Lọc theo SĐT"
            allowClear
            style={{ width: 160 }}
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            onPressEnter={() => fetchList(1, pagination.pageSize)}
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-gray-500">Trạng thái</div>
          <Select
            allowClear
            placeholder="Tất cả"
            style={{ width: 140 }}
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            options={[
              { value: 'pending', label: 'pending' },
              { value: 'active', label: 'active' },
              { value: 'completed', label: 'completed' },
              { value: 'cancelled', label: 'cancelled' },
            ]}
          />
        </div>
        <Button type="primary" onClick={() => fetchList(1, pagination.pageSize)}>
          Lọc
        </Button>
        <Button icon={<ReloadOutlined />} onClick={() => fetchList(pagination.current, pagination.pageSize)}>
          Làm mới
        </Button>
        <Button onClick={handleExportExcel} loading={exporting}>
          Xuất Excel
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={items}
          bordered
          scroll={{ x: 1100 }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            onChange: (page, pageSize) => fetchList(page, pageSize ?? 20),
          }}
        />
      </Spin>

      <Modal
        title="Chi tiết gói của khách"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={720}
      >
        {detailRow && (
          <div className="max-h-[70vh] overflow-y-auto">
            <Descriptions bordered size="small" column={1} className="mb-4">
              <Descriptions.Item label="user_box id">{detailRow.id}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{detailRow.status}</Descriptions.Item>
              <Descriptions.Item label="Số lượng cộng dồn">
                <span className="font-bold text-green-700">{detailRow.totalQuantity ?? 1}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Hết hạn">
                {detailRow.expiredAt ? formatDate(detailRow.expiredAt) : '—'}
              </Descriptions.Item>
            </Descriptions>
            <Typography.Title level={5}>User</Typography.Title>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Account">{detailRow.user?.account || '—'}</Descriptions.Item>
              <Descriptions.Item label="Phone">{detailRow.user?.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{detailRow.user?.email}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{detailRow.user?.address}</Descriptions.Item>
              <Descriptions.Item label="Chi tiết">{detailRow.user?.addressDetail}</Descriptions.Item>
            </Descriptions>
            <Typography.Title level={5} className="mt-4">
              Box
            </Typography.Title>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Tên">{detailRow.box?.name}</Descriptions.Item>
              <Descriptions.Item label="Slug">{detailRow.box?.slug}</Descriptions.Item>
              <Descriptions.Item label="Giá">{detailRow.box?.price} VND</Descriptions.Item>
            </Descriptions>
            <Typography.Title level={5} className="mt-4">
              Bao gồm
            </Typography.Title>
            <ul className="pl-5 text-sm list-disc">
              {(detailRow.addOns ?? []).map((a) => (
                <li key={a.id}>
                  {a.product?.name ?? a.productId} × {a.quantity} ({a.priceSnapshot}đ)
                </li>
              ))}
              {(detailRow.addOns ?? []).length === 0 && <li>—</li>}
            </ul>
            <Typography.Title level={5} className="mt-4">
              Giao hàng
            </Typography.Title>
            <ul className="pl-5 text-sm list-disc">
              {(detailRow.deliveries ?? []).map((d) => (
                <li key={d.id}>
                  {d.status} — {formatDate(d.scheduledDeliveryDate)}
                </li>
              ))}
              {(detailRow.deliveries ?? []).length === 0 && <li>—</li>}
            </ul>
            <Typography.Title level={5} className="mt-4">
              Giao dịch
            </Typography.Title>
            <ul className="pl-5 text-sm list-disc">
              {(detailRow.transactions ?? []).map((t) => (
                <li key={t.id}>
                  {t.type} {t.amount}đ — {t.status} — {t.referenceId ?? '—'}
                </li>
              ))}
              {(detailRow.transactions ?? []).length === 0 && <li>—</li>}
            </ul>
          </div>
        )}
      </Modal>

      <Modal
        title="Sửa user_box"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={handleSaveEdit}
        okButtonProps={{ loading: submitting }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'pending', label: 'pending' },
                { value: 'active', label: 'active' },
                { value: 'completed', label: 'completed' },
                { value: 'cancelled', label: 'cancelled' },
              ]}
            />
          </Form.Item>
          <Form.Item name="totalQuantity" label="Tổng số lượng box (Cộng dồn)" rules={[{ required: true }]}>
            <Input type="number" min={1} className="w-full" />
          </Form.Item>
          <Form.Item name="expiredAt" label="Hết hạn (để trống = xóa)">
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default UserBoxes;
