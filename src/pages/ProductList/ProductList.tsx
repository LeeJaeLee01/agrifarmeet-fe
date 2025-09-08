import React, { useEffect, useState } from 'react';
import { Spin, Button, Space, Select } from 'antd';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductList.scss';
import Section from '../../components/Section/Section';

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

interface Categories {
  id: string;
  name: string;
}

type SortType = 'priceAsc' | 'priceDesc' | 'newest' | 'best-seller';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortType, setSortType] = useState<SortType>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products', {
        headers: { Authorization: false },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories', {
        headers: { Authorization: false },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsFromCategory = async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/categories/${categoryId}`, {
        headers: { Authorization: false },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === 'all') {
      fetchProducts();
    } else {
      fetchProductsFromCategory(value);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
    <Section>
      <div className="container mx-auto">
        <h2 className="mb-5 text-xl font-semibold">Tất cả sản phẩm</h2>

        <div className="flex flex-col gap-3 mb-5 md:items-center md:flex-row">
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
            <Button
              type={sortType === 'best-seller' ? 'primary' : 'default'}
              onClick={() => setSortType('best-seller')}
            >
              Bán chạy
            </Button>
          </Space.Compact>
          <div className="flex items-center gap-3">
            <span className="font-medium">Danh mục:</span>
            <Select
              style={{ width: 200 }}
              placeholder="Chọn danh mục"
              onChange={handleCategoryChange}
              value={selectedCategory || 'all'}
            >
              <Select.Option value="all">Tất cả</Select.Option>
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </div>
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
                image={product.image}
                name={product.name}
                unit="Cân"
                price={product.price}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

export default ProductList;
