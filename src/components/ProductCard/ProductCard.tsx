import React from 'react';
import { formatVND } from '../../utils/helper';
import { TProductCard } from '../../types/TProductCard';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { App } from 'antd';
import './ProductCard.scss';

const ProductCard: React.FC<TProductCard> = ({
  id,
  img,
  name,
  unit,
  oldPrice,
  price,
  discount,
}) => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const { modal } = App.useApp();

  const addToCart = async () => {
    if (!token) {
      modal.confirm({
        title: 'Bạn chưa đăng nhập',
        content:
          'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ngay không?',
        okText: 'Đăng nhập',
        cancelText: 'Hủy',
        centered: true,
        onOk: () => {
          navigate('/login');
        },
      });
      return;
    }

    try {
      // Lấy giỏ hàng từ localStorage (nếu có)
      const cartData = localStorage.getItem('cart');
      let cart: any[] = cartData ? JSON.parse(cartData) : [];

      // Kiểm tra sản phẩm đã tồn tại chưa
      const existing = cart.find((item) => item.productId === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          productId: id,
          name,
          price: Number(price),
          unit,
          img,
          quantity: 1,
        });
      }

      // Lưu lại giỏ hàng vào localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      toast.success('Thêm vào giỏ thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ');
    }
  };

  return (
    <div className="relative flex flex-col h-full pb-4 transition bg-white rounded-lg cursor-pointer group card">
      <Link to={`/product/${id}`} className="flex-1">
        <div className="relative">
          <img src={img} alt={name} className="object-cover w-full h-40 rounded-lg" />
          {discount && (
            <span className="absolute px-2 py-1 text-xs font-bold bg-red-500 rounded-lg top-1 right-1 text-red bg-rose-200">
              -{discount}%
            </span>
          )}
        </div>

        <div className="flex-1 px-3 mt-4">
          <h3 className="h-10 mb-2 text-sm font-medium text-text1 line-clamp-2">{name}</h3>
          <p className="mb-3 text-xs text-text3">Đơn vị tính: {unit}</p>

          <div className="flex items-center gap-2">
            {oldPrice && (
              <span className="text-sm line-through text-text4">{formatVND(oldPrice)}</span>
            )}
            <span className="text-base font-semibold text-green">{formatVND(price)}</span>
          </div>
        </div>
      </Link>
      <div className="px-3">
        <button
          onClick={addToCart}
          className="w-full px-2 py-2 mt-3 text-sm font-normal transition bg-green-500 border rounded-lg text-purple border-purple group-hover:bg-purple group-hover:text-white"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
