import React, { Fragment, useState } from 'react';
import { Card, Table } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const Dashboard: React.FC = () => {
  const [stats] = useState({
    users: 1200,
    orders: 340,
    revenue: 125000000,
    shipping: 45,
  });

  const recentOrders = [
    {
      id: 'DH001',
      customer: 'Nguyễn Văn A',
      total: 199000,
      status: 'pending',
      createdAt: '2025-09-27',
    },
    {
      id: 'DH002',
      customer: 'Trần Thị B',
      total: 399000,
      status: 'paid',
      createdAt: '2025-09-27',
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 5000000 },
    { month: 'Feb', revenue: 8000000 },
    { month: 'Mar', revenue: 6500000 },
    { month: 'Apr', revenue: 12000000 },
    { month: 'May', revenue: 10000000 },
  ];

  const orderStatusData = [
    { name: 'Pending', value: 12 },
    { name: 'Paid', value: 30 },
    { name: 'Shipped', value: 25 },
    { name: 'Delivered', value: 50 },
  ];
  const COLORS = ['#ffbb28', '#36a2eb', '#ff6384', '#3da35d'];

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id' },
    { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (val: number) => val.toLocaleString() + ' đ',
    },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  return (
    <Fragment>
      <h1 className="mb-5 text-lg font-bold lg:text-2xl">Dashboard</h1>
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 gap-4 mb-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green">
              <UserOutlined className="text-base text-white" />
            </div>
            <div>
              <p className="m-0 text-sm text-text3">Người dùng</p>
              <p className="m-0 text-xl font-semibold">{stats.users}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green">
              <ShoppingCartOutlined className="text-base text-white" />
            </div>
            <div>
              <p className="m-0 text-sm text-text3">Đơn hàng</p>
              <p className="m-0 text-xl font-semibold">{stats.orders}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green">
              <DollarOutlined className="text-base text-white" />
            </div>
            <div>
              <p className="m-0 text-sm text-text3">Doanh thu</p>
              <p className="m-0 text-xl font-semibold">{stats.revenue.toLocaleString()} đ</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green">
              <TruckOutlined className="text-base text-white" />
            </div>
            <div>
              <p className="m-0 text-sm text-text3">Giao hàng</p>
              <p className="m-0 text-xl font-semibold">{stats.shipping}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 gap-4 mb-5 lg:grid-cols-2">
        <Card title="Doanh thu theo tháng">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3da35d" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Trạng thái đơn hàng">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Đơn hàng gần đây */}
      <Card title="Đơn hàng gần đây">
        <Table dataSource={recentOrders} columns={columns} rowKey="id" pagination={false} />
      </Card>
    </Fragment>
  );
};

export default Dashboard;
