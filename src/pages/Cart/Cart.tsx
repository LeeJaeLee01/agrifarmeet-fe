import React, { useEffect, useState } from 'react';
import { Table, message, Button, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Section from '../../components/Section/Section';
import { Link } from 'react-router-dom';
import './Cart.scss';
import { formatVND } from '../../utils/helper';

interface CartItem {
  productId: string; // product id
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Lấy giỏ hàng từ localStorage
  const fetchCart = () => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Lưu lại giỏ vào localStorage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  // Xóa 1 sản phẩm
  const removeItem = (cartItem: CartItem) => {
    const updated = cartItems.filter((item) => item.productId !== cartItem.productId);
    saveCart(updated);
    message.success('Đã xóa sản phẩm khỏi giỏ');
  };

  // Xóa nhiều sản phẩm
  const removeSelected = () => {
    const updated = cartItems.filter((item) => !selectedRowKeys.includes(item.productId));
    saveCart(updated);
    setSelectedRowKeys([]);
    message.success('Đã xóa các sản phẩm đã chọn');
  };

  // Tăng số lượng
  const increaseQuantity = (cartItem: CartItem) => {
    const updated = cartItems.map((item) =>
      item.productId === cartItem.productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    saveCart(updated);
  };

  // Giảm số lượng (về 0 thì xóa luôn)
  const decreaseQuantity = (cartItem: CartItem) => {
    if (cartItem.quantity === 1) {
      removeItem(cartItem);
    } else {
      const updated = cartItems.map((item) =>
        item.productId === cartItem.productId ? { ...item, quantity: item.quantity - 1 } : item
      );
      saveCart(updated);
    }
  };

  const columns: ColumnsType<CartItem> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'img',
      key: 'img',
      render: (src, record) =>
        src ? (
          <Link to={`/product/${record.productId}`}>
            <img src={src} alt="product" className="object-cover w-14 h-14" />
          </Link>
        ) : (
          <span>Không có</span>
        ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`/product/${record.productId}`}>{text}</Link>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span>{formatVND(price)}</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record) => (
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center border rounded-md">
            <Button type="text" className="px-3" onClick={() => decreaseQuantity(record)}>
              -
            </Button>
            <div className="px-4">{quantity}</div>
            <Button type="text" className="px-3" onClick={() => increaseQuantity(record)}>
              +
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Xóa sản phẩm?"
          onConfirm={() => removeItem(record)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger size="small">
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newKeys: React.Key[]) => setSelectedRowKeys(newKeys),
    // sử dụng productId làm rowKey
    getCheckboxProps: (record: CartItem) => ({
      value: record.productId,
    }),
  };

  // Tính tổng tiền chỉ của item đã chọn
  const totalAmount = cartItems
    .filter((item) => selectedRowKeys.includes(item.productId))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Section fullScreen>
      <div className="container mx-auto cart-page">
        <h2 className="mb-5 text-xl font-semibold">Giỏ hàng của bạn ({cartItems.length})</h2>

        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title="Xóa các sản phẩm đã chọn?"
            onConfirm={removeSelected}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger className="mb-3">
              Xóa {selectedRowKeys.length} sản phẩm đã chọn
            </Button>
          </Popconfirm>
        )}

        <Table
          rowSelection={{
            ...rowSelection,
            selectedRowKeys,
            onChange: (newKeys: React.Key[]) => setSelectedRowKeys(newKeys),
          }}
          dataSource={cartItems}
          columns={columns}
          rowKey="productId"
          pagination={false}
          scroll={{ x: 'max-content' }}
          className="pb-10"
        />
      </div>

      {/* Thanh tổng tiền */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow cart-items-info">
        <div className="container flex items-center justify-end w-full h-20 gap-5 px-5 mx-auto">
          <span className="text-lg font-medium">
            Tổng tiền ({selectedRowKeys.length} sản phẩm):{' '}
            <span className="text-red-600">{formatVND(totalAmount)}</span>
          </span>
          <Button
            type="primary"
            size="large"
            className="bg-purple hover:bg-purple"
            disabled={selectedRowKeys.length === 0}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default Cart;
