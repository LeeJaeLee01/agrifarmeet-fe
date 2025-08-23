import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Product.scss';
import Section from '../../components/Section/Section';
import { Spin, Button, InputNumber } from 'antd';
import { toast } from 'react-toastify';
import api from '../../utils/api';

interface ProductType {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  description: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [adding, setAdding] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`http://localhost:3030/products/${id}`);
      setProduct(res.data);
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
      await api.post('http://localhost:3030/carts/add', {
        productId: product.id,
        quantity,
      });
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
            <p className="text-lg font-semibold text-green-600">
              {Number(product.price).toLocaleString()}₫
            </p>
            <p className="text-gray-600">Số lượng còn lại: {product.quantity}</p>
            <p className="text-gray-700">{product.description}</p>

            {/* Chọn số lượng */}
            <div className="flex items-center gap-3 mt-4">
              <span>Số lượng:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  type="text"
                  className="px-3"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </Button>
                <div className="px-4">{quantity}</div>
                <Button
                  type="text"
                  className="px-3"
                  onClick={() =>
                    setQuantity((prev) =>
                      product ? Math.min(product.quantity, prev + 1) : prev + 1
                    )
                  }
                >
                  +
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <Button type="primary" size="large" loading={adding} onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Product;
