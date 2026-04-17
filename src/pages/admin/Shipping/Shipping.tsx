import React, { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Table,
  Spin,
  Tag,
  Select,
  Button,
  Modal,
  Space,
  Input,
  Descriptions,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';

const getPayload = (res: any) => res?.data?.data ?? res?.data;

type ShipperOption = { id: string; account: string; phone: string | null };

type Delivery = {
  id: string;
  status: string;
  scheduledDeliveryDate: string;
  shipperId: string | null;
};

type AdminUserBoxRow = {
  id: string;
  status: string;
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
  deliveries: Delivery[];
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

const statusColor = (s: string) => {
  if (s === 'active') return 'green';
  if (s === 'pending') return 'gold';
  if (s === 'completed') return 'blue';
  if (s === 'cancelled') return 'red';
  return 'default';
};

const AdminShipping: React.FC = () => {
  useTitle('Quản lý vận chuyển — Admin');

  const [items, setItems] = useState<AdminUserBoxRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [phoneFilter, setPhoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const [shippers, setShippers] = useState<ShipperOption[]>([]);
  // track loading state per delivery id
  const [assigningIds, setAssigningIds] = useState<Record<string, boolean>>({});

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<AdminUserBoxRow | null>(null);

  const fetchShippers = async () => {
    try {
      const res = await api.get('/admin/users?role=shipper&limit=100', { withAuth: true });
      const payload = getPayload(res);
      const list = payload?.items ?? payload ?? [];
      setShippers(list);
    } catch (e) {
      console.error('Không tải được danh sách shipper', e);
    }
  };

  const fetchList = useCallback(
    async (page = 1, limit = 20) => {
      try {
        setLoading(true);
        const q = new URLSearchParams({ page: String(page), limit: String(limit) });
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
    fetchShippers();
    fetchList(1, pagination.pageSize);
  }, [statusFilter]);

  const handleAssignShipper = async (deliveryId: string, shipperId: string) => {
    try {
      setAssigningIds((prev) => ({ ...prev, [deliveryId]: true }));
      await api.patch(`/deliveries/${deliveryId}/shipper`, { shipperId }, { withAuth: true });
      toast.success('Đã cập nhật shipper');
      // cập nhật local state thay vì refetch toàn bộ
      setItems((prev) =>
        prev.map((row) => ({
          ...row,
          deliveries: row.deliveries.map((d) => (d.id === deliveryId ? { ...d, shipperId } : d)),
        })),
      );
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Cập nhật shipper thất bại');
    } finally {
      setAssigningIds((prev) => ({ ...prev, [deliveryId]: false }));
    }
  };

  const shipperOptions = shippers.map((s) => ({
    value: s.id,
    label: s.account || s.phone || s.id,
  }));

  const columns: ColumnsType<AdminUserBoxRow> = [
    {
      title: 'STT',
      width: 56,
      align: 'center',
      render: (_a, _b, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    {
      title: 'SĐT khách',
      width: 130,
      render: (_, r) => r.user?.phone ?? '—',
    },
    {
      title: 'Tên',
      width: 150,
      render: (_, r) => r.user?.account ?? '—',
    },
    {
      title: 'Gói',
      width: 160,
      ellipsis: true,
      render: (_, r) => r.box?.name ?? '—',
    },
    {
      title: 'Trạng thái',
      width: 110,
      render: (_, r) => <Tag color={statusColor(r.status)}>{r.status}</Tag>,
    },
    {
      title: 'Shipper',
      width: 100,
      render: (_, r) => {
        if (!r.deliveries?.length) return <span className="text-gray-400">—</span>;
        return (
          <div className="flex flex-col gap-1">
            {r.deliveries.map((d) => (
              <div key={d.id}>
                <Select
                  size="small"
                  style={{ width: '100%' }}
                  placeholder="Chọn shipper"
                  value={d.shipperId ?? undefined}
                  loading={!!assigningIds[d.id]}
                  options={shipperOptions}
                  onChange={(val) => handleAssignShipper(d.id, val)}
                  allowClear={false}
                />
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Hết hạn',
      width: 120,
      render: (_, r) => (r.expiredAt ? formatDate(r.expiredAt) : '—'),
    },
    {
      title: 'Ngày tạo',
      width: 120,
      render: (_, r) => formatDate(r.createdAt),
    },
    {
      title: 'Thao tác',
      width: 90,
      fixed: 'right',
      render: (_, r) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setDetailRow(r);
            setDetailOpen(true);
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý vận chuyển</h1>

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
              { value: 'pending', label: 'Pending' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </div>
        <Button type="primary" onClick={() => fetchList(1, pagination.pageSize)}>
          Lọc
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => fetchList(pagination.current, pagination.pageSize)}
        >
          Làm mới
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
            onChange: (page, pageSize) => fetchList(page, pageSize ?? 20),
          }}
        />
      </Spin>

      <Modal
        title="Chi tiết đơn hàng"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={720}
        destroyOnClose
      >
        {detailRow && (
          <div className="max-h-[70vh] overflow-y-auto">
            <Descriptions bordered size="small" column={1} className="mb-4">
              <Descriptions.Item label="ID">{detailRow.id}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusColor(detailRow.status)}>{detailRow.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Hết hạn">
                {detailRow.expiredAt ? formatDate(detailRow.expiredAt) : '—'}
              </Descriptions.Item>
            </Descriptions>

            <Typography.Title level={5}>Khách hàng</Typography.Title>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Tên">{detailRow.user?.account || '—'}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{detailRow.user?.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{detailRow.user?.email}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{detailRow.user?.address}</Descriptions.Item>
              <Descriptions.Item label="Chi tiết địa chỉ">
                {detailRow.user?.addressDetail}
              </Descriptions.Item>
            </Descriptions>

            <Typography.Title level={5} className="mt-4">
              Gói đã mua
            </Typography.Title>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Tên">{detailRow.box?.name}</Descriptions.Item>
              <Descriptions.Item label="Slug">{detailRow.box?.slug}</Descriptions.Item>
              <Descriptions.Item label="Giá">{detailRow.box?.price} VND</Descriptions.Item>
            </Descriptions>

            <Typography.Title level={5} className="mt-4">
              Giao hàng
            </Typography.Title>
            <ul className="pl-5 text-sm list-disc">
              {(detailRow.deliveries ?? []).map((d) => (
                <li key={d.id}>
                  {d.status} — {formatDate(d.scheduledDeliveryDate)} — shipper: {d.shipperId ?? '—'}
                </li>
              ))}
              {(detailRow.deliveries ?? []).length === 0 && <li>—</li>}
            </ul>

            <Typography.Title level={5} className="mt-4">
              Add-on
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
    </Fragment>
  );
};

export default AdminShipping;
