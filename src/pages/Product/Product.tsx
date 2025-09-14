import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Product.scss';
import Section from '../../components/Section/Section';
import { Spin, Button } from 'antd';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { TProduct } from '../../types/TProduct';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<TProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`, {
        headers: { Authorization: false },
      });
      setProduct(res.data);
      document.title = res.data.name;
    } catch (error) {
      console.error('Lỗi khi fetch product:', error);
      toast.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAdding(true);
      await api.post(
        '/carts/add',
        { productId: product.id, quantity },
        { headers: { Authorization: true } }
      );
      toast.success('Thêm vào giỏ thành công!');
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-center">Không tìm thấy sản phẩm.</p>;
  }

  return (
    <Section fullScreen>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Hình ảnh */}
          <div className="max-w-md border">
            <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
          </div>

          {/* Thông tin */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Product;
