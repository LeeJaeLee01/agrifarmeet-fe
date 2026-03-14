import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  Spin,
  Input,
  Tag,
  Tooltip,
  Button,
  Modal,
  Form,
  Select,
  Tabs,
  Input as AntInput,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { formatDate } from '../../utils/helper';
import { useTitle } from '../../hooks/useTitle';
import { jwtDecode } from 'jwt-decode';
import { EditOutlined } from '@ant-design/icons';

const { TextArea } = AntInput;

interface JwtPayload {
  sub: string;
  role: string;
  username?: string;
}

interface Shipping {
  id: string;
  scheduledAt: string;
  deliveryAddress: string;
  deliveryDay: string;
  deliveryWeek: string;
  status: string;
  deliveryNote: string;
  createdAt: string;
  updatedAt: string;
  boxUser: {
    user: {
      username: string;
    };
    box: {
      name: string;
      price: string;
      image: string;
    };
  };
  shipperConfidence?: string | null;
  trafficCondition?: string | null;
  weatherCondition?: string | null;
}

interface ShipperProfile {
  id: string;
  account: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  role: string;
  deliveries?: any[];
}

enum ShippingStatusEnum {
  PREPARING = 'preparing',
  DELIVERING = 'delivering',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

const ShipperShippings: React.FC = () => {
  useTitle('Danh sách đơn hàng');

  const [data, setData] = useState<Shipping[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [search, setSearch] = useState<string>('');
  const [shipperPhone, setShipperPhone] = useState<string>(() => localStorage.getItem('shipperPhone') || '');
  const [phoneSubmitted, setPhoneSubmitted] = useState<boolean>(() => !!localStorage.getItem('shipperPhone'));
  const [shipperProfile, setShipperProfile] = useState<ShipperProfile | null>(() => {
    try {
      const raw = localStorage.getItem('shipperProfile');
      return raw ? (JSON.parse(raw) as ShipperProfile) : null;
    } catch {
      return null;
    }
  });

  const [open, setOpen] = useState<boolean>(false);
  const [currentShipping, setCurrentShipping] = useState<Shipping | null>(null);
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState<string>('my');
  const [pendingDeliveries, setPendingDeliveries] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState<boolean>(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [claimSuccessOpen, setClaimSuccessOpen] = useState<boolean>(false);
  const [claimedDelivery, setClaimedDelivery] = useState<any | null>(null);

  const getShipperTokenSub = (): string | null => {
    try {
      const token = localStorage.getItem('shipperToken');
      if (!token) return null;
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.sub || null;
    } catch {
      return null;
    }
  };

  const fetchShippings = async (page = 1, limit = 10, keyword = '') => {
    const shipperIdFromToken = getShipperTokenSub();
    const token = localStorage.getItem('shipperToken');
    const phone = (localStorage.getItem('shipperPhone') || shipperPhone || '').replace(/\D/g, '');
    if (!shipperIdFromToken && !phone) return;

    try {
      setLoading(true);
      if (shipperIdFromToken) {
        const res = await api.get(`/shipping/shipper/${shipperIdFromToken}?page=${page}&limit=${limit}&search=${keyword}`, {
          withAuth: !!token,
        });
        setData(res.data.data);
        setPagination({
          current: page,
          pageSize: limit,
          total: res.data.total,
        });
      } else {
        // Mode: nhập SĐT shipper → lấy profile + deliveries
        const res = await api.get(`/users/phone/${phone}`);
        const profile = (res.data?.data ?? res.data) as ShipperProfile;
        setShipperProfile(profile);
        localStorage.setItem('shipperProfile', JSON.stringify(profile));

        const deliveries: any[] = Array.isArray(profile?.deliveries) ? profile.deliveries : [];
        // Client-side search
        const kw = (keyword || '').trim().toLowerCase();
        const filtered = kw
          ? deliveries.filter((d) => {
              const customer = d?.user?.account || d?.user?.username || d?.user?.phone || '';
              const boxName = d?.userBox?.box?.name || '';
              return String(customer).toLowerCase().includes(kw) || String(boxName).toLowerCase().includes(kw);
            })
          : deliveries;

        // Map deliveries → Shipping-like rows for existing table/columns
        const mapped: Shipping[] = filtered.map((d) => ({
          id: d.id,
          scheduledAt: d.scheduledDeliveryDate,
          deliveryAddress: d.address,
          deliveryDay: '',
          deliveryWeek: '',
          status: d.status,
          deliveryNote: '',
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          boxUser: {
            user: { username: d?.user?.account || d?.user?.username || d?.user?.phone || '—' },
            box: {
              name: d?.userBox?.box?.name || '—',
              price: d?.userBox?.box?.price || '',
              image: d?.userBox?.box?.images?.[0] || '',
            },
          },
        }));

        const total = mapped.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        setData(mapped.slice(start, end));
        setPagination({
          current: page,
          pageSize: limit,
          total,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('shipperToken');
    const phone = (localStorage.getItem('shipperPhone') || shipperPhone || '').replace(/\D/g, '');
    if (token || phoneSubmitted || phone.length === 10) {
      fetchShippings();
    }
  }, [phoneSubmitted]);

  const handleSubmitPhone = () => {
    const trimmed = shipperPhone.replace(/\D/g, '').slice(0, 10);
    if (trimmed.length !== 10) {
      toast.error('Vui lòng nhập đúng 10 số điện thoại shipper');
      return;
    }
    localStorage.setItem('shipperPhone', trimmed);
    localStorage.removeItem('shipperToken');
    setPhoneSubmitted(true);
    fetchShippings(1, pagination.pageSize, search);
  };

  const fetchPendingDeliveries = async () => {
    try {
      setLoadingPending(true);
      const res = await api.get('/deliveries', { params: { status: 'picking_up' } });
      const list = res.data?.data ?? res.data;
      setPendingDeliveries(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      toast.error('Không tải được đơn đang chờ nhận.');
      setPendingDeliveries([]);
    } finally {
      setLoadingPending(false);
    }
  };

  const getShipperId = (): string | null => {
    if (shipperProfile?.id) return shipperProfile.id;
    return getShipperTokenSub();
  };

  const handleAcceptDelivery = async (record: any) => {
    const shipperId = getShipperId();
    if (!shipperId) {
      toast.error('Không xác định được shipper. Vui lòng nhập lại số điện thoại.');
      return;
    }
    const deliveryId = record?.id;
    if (!deliveryId) return;
    try {
      setAcceptingId(deliveryId);
      const res = await api.post(`/deliveries/${deliveryId}/claim`, { shipperId });
      setClaimedDelivery(res.data?.data ?? res.data ?? record);
      setClaimSuccessOpen(true);
      await fetchPendingDeliveries();
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message ?? err?.message ?? 'Nhận đơn thất bại.';
      toast.error(msg);
    } finally {
      setAcceptingId(null);
    }
  };

  // 👉 Hàm gọi API cập nhật trạng thái (PATCH /deliveries/:id/shipper/status)
  const handleUpdateStatus = async () => {
    try {
      const values = await form.validateFields();
      if (!currentShipping) return;

      const shipperId = getShipperId();
      if (!shipperId) {
        toast.error('Không xác định được shipper.');
        return;
      }

      await api.patch(`/deliveries/${currentShipping.id}/shipper/status`, {
        shipperId,
        status: values.status,
      });
      toast.success('Cập nhật trạng thái thành công!');
      setOpen(false);
      fetchShippings(pagination.current, pagination.pageSize, search);
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật thất bại!');
    }
  };

  const columns: ColumnsType<Shipping> = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Khách hàng',
      dataIndex: ['boxUser', 'user', 'username'],
      key: 'username',
      width: 150,
    },
    {
      title: 'Gói hàng',
      dataIndex: ['boxUser', 'box', 'name'],
      key: 'boxName',
      width: 200,
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.boxUser.box.image}
            alt={name}
            className="object-cover w-10 h-10 rounded-md"
          />
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: 'Ngày giao dự kiến',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 180,
      render: (date) => formatDate(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => {
        let color = 'default';
        let label = '';

        switch (status) {
          case 'preparing':
            color = 'orange';
            label = 'Đang chuẩn bị';
            break;
          case 'picking_up':
            color = 'orange';
            label = 'Đang lấy hàng';
            break;
          case 'delivering':
            color = 'blue';
            label = 'Đang giao hàng';
            break;
          case 'completed':
            color = 'green';
            label = 'Hoàn thành';
            break;
          case 'canceled':
            color = 'red';
            label = 'Đã hủy';
            break;
          default:
            label = status ? String(status) : 'Không xác định';
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'deliveryNote',
      key: 'deliveryNote',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Điều kiện giao hàng',
      key: 'condition',
      width: 200,
      render: (_, record) => (
        <div>
          {record.weatherCondition && (
            <Tooltip title="Thời tiết">
              <Tag color="blue">{record.weatherCondition}</Tag>
            </Tooltip>
          )}
          {record.trafficCondition && (
            <Tooltip title="Giao thông">
              <Tag color="volcano">{record.trafficCondition}</Tag>
            </Tooltip>
          )}
          {record.shipperConfidence && (
            <Tooltip title="Độ tin cậy">
              <Tag color="green">{(parseFloat(record.shipperConfidence) * 100).toFixed(0)}%</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Button
          color="primary"
          variant="text"
          icon={<EditOutlined />}
          onClick={() => {
            setCurrentShipping(record);
            form.setFieldsValue({ status: record.status, note: record.deliveryNote });
            setOpen(true);
          }}
        />
      ),
    },
  ];

  const pendingColumns: ColumnsType<any> = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Khách hàng',
      key: 'user',
      width: 160,
      render: (_: any, record: any) =>
        record?.user?.account || record?.user?.phone || '—',
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      width: 130,
      render: (_: any, record: any) => record?.user?.phone ?? '—',
    },
    {
      title: 'Ngày giao dự kiến',
      dataIndex: 'scheduledDeliveryDate',
      key: 'scheduledDeliveryDate',
      width: 160,
      render: (date: string) => (date ? formatDate(date) : '—'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string) => (
        <Tag color="orange">{status === 'picking_up' ? 'Đang chờ nhận' : status}</Tag>
      ),
    },
    {
      title: 'Địa chỉ giao hàng',
      key: 'address',
      ellipsis: true,
      width: 280,
      render: (_: any, record: any) => {
        const addr = record?.address ?? '';
        const detail = record?.addressDetail ?? '';
        return [addr, detail].filter(Boolean).join(', ') || '—';
      },
    },
    {
      title: 'Hành động',
      key: 'accept',
      width: 120,
      align: 'center',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          size="small"
          className="bg-green"
          loading={acceptingId === record?.id}
          onClick={() => handleAcceptDelivery(record)}
        >
          Nhận đơn
        </Button>
      ),
    },
  ];

  return (
    <Fragment>
      {!getShipperTokenSub() && !phoneSubmitted ? (
        <div className="max-w-xl">
          <h1 className="mb-2 text-lg font-bold lg:text-2xl">Tra cứu đơn hàng shipper</h1>
          <p className="mb-5 text-text2">Nhập số điện thoại shipper để xem danh sách đơn.</p>
          <div className="p-4 bg-white border rounded-lg border-slate-200">
            <div className="flex flex-wrap gap-3">
              <Input
                value={shipperPhone}
                onChange={(e) => setShipperPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Nhập 10 số điện thoại shipper"
                style={{ maxWidth: 320, height: 40 }}
                maxLength={10}
                onPressEnter={handleSubmitPhone}
              />
              <Button type="primary" className="bg-green" onClick={handleSubmitPhone}>
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="mb-1 text-lg font-bold lg:text-2xl">Đơn hàng shipper</h1>
          {shipperProfile?.phone && (
            <p className="mb-5 text-text2">
              {shipperProfile.account ? `${shipperProfile.account} • ` : ''}{shipperProfile.phone}
            </p>
          )}

          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              if (key === 'pending') fetchPendingDeliveries();
            }}
            items={[
              {
                key: 'my',
                label: 'Danh sách đơn hàng của tôi',
                children: (
                  <>
                    <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
                      <Input.Search
                        placeholder="Tìm kiếm theo tên khách hàng hoặc gói hàng"
                        allowClear
                        enterButton
                        style={{ maxWidth: 350 }}
                        onSearch={(value) => {
                          setSearch(value);
                          fetchShippings(1, pagination.pageSize, value);
                        }}
                      />
                    </div>
                    <Spin spinning={loading}>
                      <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={data}
                        bordered
                        scroll={{ x: 1300 }}
                        pagination={{
                          ...pagination,
                          showSizeChanger: true,
                          pageSizeOptions: ['10', '20', '50', '100'],
                          onChange: (page, pageSize) => fetchShippings(page, pageSize, search),
                          onShowSizeChange: (current, size) => fetchShippings(current, size, search),
                        }}
                      />
                    </Spin>
                  </>
                ),
              },
              {
                key: 'pending',
                label: 'Nhận đơn hàng đang chờ nhận',
                children: (
                  <Spin spinning={loadingPending}>
                    <Table
                      rowKey="id"
                      columns={pendingColumns}
                      dataSource={pendingDeliveries}
                      bordered
                      scroll={{ x: 900 }}
                      pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
                    />
                  </Spin>
                ),
              },
            ]}
          />

          {/* Modal cập nhật trạng thái */}
          <Modal
            title="Cập nhật trạng thái đơn hàng"
            open={open}
            onCancel={() => setOpen(false)}
            onOk={handleUpdateStatus}
            centered
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={loading}
          >
            <Form layout="vertical" form={form}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value={ShippingStatusEnum.PREPARING}>Chuẩn bị</Select.Option>
                  <Select.Option value={ShippingStatusEnum.DELIVERING}>Đang giao</Select.Option>
                  <Select.Option value={ShippingStatusEnum.COMPLETED}>Hoàn thành</Select.Option>
                  <Select.Option value={ShippingStatusEnum.CANCELED}>Đã hủy</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Ghi chú" name="note">
                <TextArea rows={3} placeholder="Nhập ghi chú (tuỳ chọn)" />
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Nhận đơn thành công"
            open={claimSuccessOpen}
            onCancel={() => {
              setClaimSuccessOpen(false);
              setClaimedDelivery(null);
            }}
            okText="OK"
            cancelButtonProps={{ style: { display: 'none' } }}
            centered
            onOk={() => {
              setClaimSuccessOpen(false);
              setClaimedDelivery(null);
              setActiveTab('my');
              fetchShippings(1, pagination.pageSize, search);
            }}
          >
            <div className="flex flex-col gap-2">
              <p className="m-0 text-text2">Bạn đã nhận đơn giao hàng.</p>
              {claimedDelivery?.user?.account && (
                <p className="m-0 text-text3">Khách hàng: {claimedDelivery.user.account}</p>
              )}
              {claimedDelivery?.address && (
                <p className="m-0 text-text3">
                  Địa chỉ: {[claimedDelivery.address, claimedDelivery.addressDetail].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </Modal>
        </>
      )}
    </Fragment>
  );
};

export default ShipperShippings;
