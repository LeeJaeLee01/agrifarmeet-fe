import React, { useEffect, useState } from 'react';
import { Table, message, Button, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './Cart.scss';
import api from '../../utils/api';
import Section from '../../components/Section/Section';
import { Link } from 'react-router-dom';

interface CartItem {
  id: string; // cart_item id
  productId: string; // product id
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('http://localhost:3030/carts');

      const data = response.data.cart_items.map((item: any) => ({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        quantity: item.quantity,
        image: item.product.image || '',
      }));

      setCartItems(data);
    } catch (error) {
      message.error('Không thể tải giỏ hàng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Xóa 1 sản phẩm (dùng cart_item.id)
  const removeItem = async (cartItem: CartItem) => {
    try {
      setUpdatingId(cartItem.id);
      await api.delete(`http://localhost:3030/carts/${cartItem.id}`);

      setCartItems((prev) => prev.filter((item) => item.id !== cartItem.id));
      message.success('Đã xóa sản phẩm khỏi giỏ');
    } catch (err) {
      message.error('Không thể xóa sản phẩm');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Xóa nhiều sản phẩm (dùng cart_item.id)
  const removeSelected = async () => {
    try {
      setLoading(true);
      await Promise.all(
        selectedRowKeys.map((key) => api.delete(`http://localhost:3030/carts/${key}`))
      );

      setCartItems((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setSelectedRowKeys([]);
      message.success('Đã xóa các sản phẩm đã chọn');
    } catch (err) {
      message.error('Không thể xóa các sản phẩm đã chọn');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tăng số lượng
  const increaseQuantity = async (cartItem: CartItem) => {
    try {
      setUpdatingId(cartItem.id);
      await api.post('http://localhost:3030/carts/add', {
        productId: cartItem.productId,
        quantity: 1,
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } catch (err) {
      message.error('Không thể tăng số lượng');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Giảm số lượng (khi còn 1 thì xoá luôn bằng cart_item.id)
  const decreaseQuantity = async (cartItem: CartItem) => {
    try {
      setUpdatingId(cartItem.id);

      if (cartItem.quantity === 1) {
        removeItem(cartItem);
        setCartItems((prev) => prev.filter((item) => item.id !== cartItem.id));
        message.success('Đã xóa sản phẩm khỏi giỏ');
      } else {
        await api.post('http://localhost:3030/carts/decrease', {
          productId: cartItem.productId,
          quantity: 1,
        });
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === cartItem.id ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
      }
    } catch (err) {
      message.error('Không thể giảm số lượng');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const columns: ColumnsType<CartItem> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (src, id) =>
        src ? (
          <Link to={`/product/${id.productId}`}>
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
      render: (price: number) => <span>{price.toLocaleString()}₫</span>,
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
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => <span>{(record.price * record.quantity).toLocaleString()}₫</span>,
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
          <Button danger size="small" disabled={updatingId === record.id}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newKeys: React.Key[]) => setSelectedRowKeys(newKeys),
  };

  // Tính tổng tiền chỉ của item đã chọn
  const totalAmount = cartItems
    .filter((item) => selectedRowKeys.includes(item.id))
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
          rowSelection={rowSelection}
          dataSource={cartItems}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </div>

      {/* Thanh tổng tiền */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow cart-items-info">
        <div className="container flex items-center justify-end w-full h-20 gap-5 px-5 mx-auto">
          <span className="text-lg font-medium">
            Tổng tiền ({selectedRowKeys.length} sản phẩm):{' '}
            <span className="text-red-600">{totalAmount.toLocaleString()}₫</span>
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
