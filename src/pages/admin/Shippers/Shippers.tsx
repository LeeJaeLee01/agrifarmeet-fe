import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Table, Spin, Tag, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { formatDate } from '../../../utils/helper';
import { TShipping } from '../../../types/TShipping';

const mockShippings: TShipping[] = [
  {
    id: 'SHIP-001',
    boxUserId: 'BU-001',
    boxUser: {
      id: 'BU-001',
      userId: 'U-001',
      user: {
        id: 'U-001',
        username: 'khachhang1',
        email: 'user1@example.com',
        fullName: 'Khách hàng 1',
        phone: '0900000001',
        role: 'user',
        createdAt: '',
        updatedAt: '',
      } as any,
      boxId: 'BOX-001',
      box: {
        id: 'BOX-001',
        name: 'Gói Rau Sạch A',
        description: 'Gói rau sạch giao hàng hàng tuần',
        price: '350000',
        image:
          'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalWeight: 5,
        isTrial: false,
        createdAt: '',
        updatedAt: '',
      } as any,
      timeActive: new Date().toISOString(),
      timeEnd: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    scheduledAt: new Date().toISOString(),
    estimatedArrivalMinutes: 30,
    estimatedArrivalAt: new Date().toISOString(),
    shipperId: 'S-001',
    shipper: {
      id: 'S-001',
      username: 'shipper.nguyenvana',
      email: 'shipper1@example.com',
      fullName: 'Nguyễn Văn A',
      phone: '0911111111',
      role: 'shipper',
      createdAt: '',
      updatedAt: '',
    } as any,
    status: 'delivering',
    deliveryAddress: '123 Đường A, Quận 1, TP.HCM',
    deliveryUserDetail: null,
    deliveryNote: 'Giao giờ hành chính',
    deliveredAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deliveryDay: 'tuesday',
    deliveryWeek: '2025-W10',
    shipperConfidence: '0.92',
    trafficCondition: 'Đường đông',
    weatherCondition: 'Nắng đẹp',
  },
  {
    id: 'SHIP-002',
    boxUserId: 'BU-002',
    boxUser: {
      id: 'BU-002',
      userId: 'U-002',
      user: {
        id: 'U-002',
        username: 'khachhang2',
        email: 'user2@example.com',
        fullName: 'Khách hàng 2',
        phone: '0900000002',
        role: 'user',
        createdAt: '',
        updatedAt: '',
      } as any,
      boxId: 'BOX-002',
      box: {
        id: 'BOX-002',
        name: 'Gói Trái Cây B',
        description: 'Trái cây theo mùa',
        price: '450000',
        image:
          'https://images.pexels.com/photos/615706/pexels-photo-615706.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalWeight: 4,
        isTrial: false,
        createdAt: '',
        updatedAt: '',
      } as any,
      timeActive: new Date().toISOString(),
      timeEnd: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    scheduledAt: new Date().toISOString(),
    estimatedArrivalMinutes: 45,
    estimatedArrivalAt: new Date().toISOString(),
    shipperId: 'S-002',
    shipper: {
      id: 'S-002',
      username: 'shipper.tranthib',
      email: 'shipper2@example.com',
      fullName: 'Trần Thị B',
      phone: '0922222222',
      role: 'shipper',
      createdAt: '',
      updatedAt: '',
    } as any,
    status: 'preparing',
    deliveryAddress: '456 Đường B, Quận 3, TP.HCM',
    deliveryUserDetail: null,
    deliveryNote: 'Gọi trước khi giao',
    deliveredAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deliveryDay: 'friday',
    deliveryWeek: '2025-W11',
    shipperConfidence: '0.85',
    trafficCondition: 'Kẹt xe nhẹ',
    weatherCondition: 'Có mưa nhỏ',
  },
  {
    id: 'SHIP-003',
    boxUserId: 'BU-003',
    boxUser: {
      id: 'BU-003',
      userId: 'U-003',
      user: {
        id: 'U-003',
        username: 'khachhang3',
        email: 'user3@example.com',
        fullName: 'Khách hàng 3',
        phone: '0900000003',
        role: 'user',
        createdAt: '',
        updatedAt: '',
      } as any,
      boxId: 'BOX-003',
      box: {
        id: 'BOX-003',
        name: 'Gói Rau & Trái Cây C',
        description: 'Kết hợp rau và trái cây',
        price: '550000',
        image:
          'https://images.pexels.com/photos/3730959/pexels-photo-3730959.jpeg?auto=compress&cs=tinysrgb&w=600',
        totalWeight: 6,
        isTrial: false,
        createdAt: '',
        updatedAt: '',
      } as any,
      timeActive: new Date().toISOString(),
      timeEnd: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    scheduledAt: new Date().toISOString(),
    estimatedArrivalMinutes: 60,
    estimatedArrivalAt: new Date().toISOString(),
    shipperId: 'S-001',
    shipper: {
      id: 'S-001',
      username: 'shipper.nguyenvana',
      email: 'shipper1@example.com',
      fullName: 'Nguyễn Văn A',
      phone: '0911111111',
      role: 'shipper',
      createdAt: '',
      updatedAt: '',
    } as any,
    status: 'delivered',
    deliveryAddress: '789 Đường C, Quận 5, TP.HCM',
    deliveryUserDetail: null,
    deliveryNote: 'Đã giao thành công',
    deliveredAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deliveryDay: 'tuesday',
    deliveryWeek: '2025-W09',
    shipperConfidence: '0.98',
    trafficCondition: 'Thông thoáng',
    weatherCondition: 'Mát mẻ',
  },
] as any;

const AdminShippers: React.FC = () => {
  const [data, setData] = useState<TShipping[]>([]);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    // Fake data cho màn hình Shipper
    setData(mockShippings);
  }, []);

  const renderStatus = (status: TShipping['status']) => {
    let color: string = 'default';
    let label = '';

    switch (status) {
      case 'pending':
        color = 'default';
        label = 'Đang chờ';
        break;
      case 'preparing':
        color = 'orange';
        label = 'Đang chuẩn bị';
        break;
      case 'delivering':
        color = 'blue';
        label = 'Đang giao hàng';
        break;
      case 'delivered':
        color = 'green';
        label = 'Đã giao';
        break;
      case 'cancelled':
        color = 'red';
        label = 'Đã hủy';
        break;
      default:
        label = status;
    }

    return <Tag color={color}>{label}</Tag>;
  };

  const columns: ColumnsType<TShipping> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 220,
      ellipsis: true,
    },
    {
      title: 'Ngày giao dự kiến',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: TShipping['status']) => renderStatus(status),
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 260,
      ellipsis: true,
    },
    {
      title: 'Shipper phụ trách',
      dataIndex: ['shipper', 'username'],
      key: 'shipper',
      width: 180,
      render: (_: unknown, record: TShipping) =>
        record.shipper ? record.shipper.username : <span className="text-text3">Chưa phân công</span>,
    },
  ];

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const keyword = search.trim().toLowerCase();
    return data.filter((item) => item.shipper?.username?.toLowerCase().includes(keyword));
  }, [data, search]);

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Danh sách giao hàng theo Shipper</h1>

      <div className="flex flex-wrap w-full gap-5 mb-5 md:justify-end">
        <Input.Search
          placeholder="Tìm kiếm theo tên shipper"
          allowClear
          enterButton
          style={{ maxWidth: 350 }}
          onSearch={(value) => setSearch(value)}
          onChange={(e) => {
            if (!e.target.value) setSearch('');
          }}
        />
      </div>

      <Spin spinning={false}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          bordered
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1100 }}
        />
      </Spin>
    </Fragment>
  );
};

export default AdminShippers;


