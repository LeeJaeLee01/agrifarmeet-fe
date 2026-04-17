import React, { Fragment, useEffect, useState } from 'react';
import { Table, Spin, Tag, Select, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import { ReloadOutlined } from '@ant-design/icons';
import api from '../../../utils/api';
import { formatDate } from '../../../utils/helper';
import { useTitle } from '../../../hooks/useTitle';

const getPayload = (res: any) => res?.data?.data ?? res?.data;

type ShipperOption = {
  id: string;
  account: string | null;
  phone: string | null;
  email: string | null;
};

type Delivery = {
  id: string;
  status: string;
  scheduledDeliveryDate: string;
  shipperId: string | null;
  userBox?: {
    user?: { account: string | null; phone: string | null };
    box?: { name: string };
  };
};

const statusColor = (s: string) => {
  if (s === 'delivered' || s === 'completed') return 'green';
  if (s === 'delivering') return 'blue';
  if (s === 'pending') return 'gold';
  if (s === 'cancelled') return 'red';
  return 'default';
};

const AdminShippers: React.FC = () => {
  useTitle('Quản lý shipper — Admin');

  const [shippers, setShippers] = useState<ShipperOption[]>([]);
  const [selectedShipperId, setSelectedShipperId] = useState<string | undefined>();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loadingShippers, setLoadingShippers] = useState(false);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

  const fetchShippers = async () => {
    try {
      setLoadingShippers(true);
      const res = await api.get('/admin/users?role=shipper&limit=100', { withAuth: true });
      const payload = getPayload(res);
      setShippers(payload?.items ?? payload ?? []);
    } catch (e) {
      console.error(e);
      toast.error('Không tải được danh sách shipper');
    } finally {
      setLoadingShippers(false);
    }
  };

  const fetchDeliveries = async (shipperId: string, page = 1, limit = 20) => {
    try {
      setLoadingDeliveries(true);
      const q = new URLSearchParams({ shipperId, page: String(page), limit: String(limit) });
      const res = await api.get(`/deliveries?${q.toString()}`, { withAuth: true });
      const payload = getPayload(res);
      const items = payload?.items ?? payload ?? [];
      const meta = payload?.meta;
      setDeliveries(Array.isArray(items) ? items : []);
      setPagination({
        current: meta?.page ?? page,
        pageSize: meta?.limit ?? limit,
        total: meta?.total ?? items.length,
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || 'Không tải được danh sách giao hàng');
    } finally {
      setLoadingDeliveries(false);
    }
  };

  useEffect(() => {
    fetchShippers();
  }, []);

  const handleSelectShipper = (id: string) => {
    setSelectedShipperId(id);
    setDeliveries([]);
    fetchDeliveries(id, 1, pagination.pageSize);
  };

  const handleUpdateStatus = async (deliveryId: string, status: string) => {
    try {
      setUpdatingIds((prev) => ({ ...prev, [deliveryId]: true }));
      await api.patch(`/deliveries/${deliveryId}/status`, { status }, { withAuth: true });
      toast.success('Đã cập nhật trạng thái');
      setDeliveries((prev) => prev.map((d) => (d.id === deliveryId ? { ...d, status } : d)));
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [deliveryId]: false }));
    }
  };

  const STATUS_OPTIONS = [
    { value: 'picking_up', label: 'Lên đơn' },
    { value: 'delivering', label: 'Đang vận chuyển' },
    { value: 'completed', label: 'Hoàn thành' },
  ];

  const columns: ColumnsType<Delivery> = [
    {
      title: 'STT',
      width: 56,
      align: 'center',
      render: (_a, _b, i) => (pagination.current - 1) * pagination.pageSize + i + 1,
    },
    {
      title: 'ID giao hàng',
      dataIndex: 'id',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      width: 120,
      render: (_, r) => <Tag color={statusColor(r.status)}>{r.status}</Tag>,
    },
    {
      title: 'Ngày giao',
      width: 140,
      render: (_, r) => formatDate(r.scheduledDeliveryDate),
    },
    {
      title: 'Khách hàng',
      width: 150,
      render: (_, r) => r.userBox?.user?.account || r.userBox?.user?.phone || '—',
    },
    {
      title: 'Gói',
      width: 160,
      ellipsis: true,
      render: (_, r) => r.userBox?.box?.name || '—',
    },
    {
      title: 'Cập nhật trạng thái',
      width: 180,
      fixed: 'right' as const,
      render: (_, r) => (
        <Select
          size="small"
          style={{ width: '100%' }}
          value={r.status}
          loading={!!updatingIds[r.id]}
          options={STATUS_OPTIONS}
          onChange={(val) => handleUpdateStatus(r.id, val)}
        />
      ),
    },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Quản lý shipper</h1>

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <div className="mb-1 text-xs text-gray-500">Chọn shipper</div>
          <Select
            style={{ width: 240 }}
            placeholder="Chọn shipper để xem đơn"
            loading={loadingShippers}
            value={selectedShipperId}
            onChange={handleSelectShipper}
            options={shippers.map((s) => ({
              value: s.id,
              label: s.account || s.phone || s.id,
            }))}
          />
        </div>
        {selectedShipperId && (
          <Button
            icon={<ReloadOutlined />}
            onClick={() =>
              fetchDeliveries(selectedShipperId, pagination.current, pagination.pageSize)
            }
          >
            Làm mới
          </Button>
        )}
      </div>

      {selectedShipperId ? (
        <Spin spinning={loadingDeliveries}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={deliveries}
            bordered
            scroll={{ x: 900 }}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              onChange: (page, pageSize) =>
                fetchDeliveries(selectedShipperId, page, pageSize ?? 20),
            }}
          />
        </Spin>
      ) : (
        <div className="py-16 text-center text-gray-400">
          Chọn một shipper để xem danh sách giao hàng
        </div>
      )}
    </Fragment>
  );
};

export default AdminShippers;
