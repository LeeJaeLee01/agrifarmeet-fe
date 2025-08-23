import React, { useEffect, useState } from 'react';
import './Products.scss';
import { Spin, Button, Space } from 'antd';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard/ProductCard';

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  description: string | null;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

type SortType = 'priceAsc' | 'priceDesc' | 'newest';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortType, setSortType] = useState<SortType>('newest');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('http://localhost:3030/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortType) {
      case 'priceAsc':
        return Number(a.price) - Number(b.price);
      case 'priceDesc':
        return Number(b.price) - Number(a.price);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="relative cart-page page-height">
      <div className="container h-full p-5 mx-auto">
        <h2 className="mb-5 text-xl font-semibold">Sản phẩm</h2>

        <div className="flex items-center gap-3 mb-5">
          <span className="font-medium">Sắp xếp theo:</span>
          <Space.Compact>
            <Button
              type={sortType === 'priceAsc' ? 'primary' : 'default'}
              onClick={() => setSortType('priceAsc')}
            >
              Giá tăng dần
            </Button>
            <Button
              type={sortType === 'priceDesc' ? 'primary' : 'default'}
              onClick={() => setSortType('priceDesc')}
            >
              Giá giảm dần
            </Button>
            <Button
              type={sortType === 'newest' ? 'primary' : 'default'}
              onClick={() => setSortType('newest')}
            >
              Mới nhất
            </Button>
          </Space.Compact>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                img={product.image}
                name={product.name}
                unit="Cân"
                price={product.price}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
