import React, { useEffect, useState } from 'react';
import Section from '../../components/Section/Section';
import SwiperList from '../../components/SwiperList/SwiperList';
import { SwiperSlide } from 'swiper/react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { TProductCard } from '../../types/TProductCard';
import api from '../../utils/api';

const WeeklyFarm: React.FC = () => {
  const [products, setProducts] = useState<TProductCard[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Section>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-text1">Các sản phẩm</h2>
          <Link to="/" className="text-text3">
            Xem tất cả
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <SwiperList className="pb-5">
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                <ProductCard
                  id={item.id}
                  image={item.image}
                  name={item.name}
                  unit={`${item.weight} g`} // lấy weight làm đơn vị
                  oldPrice={undefined} // backend chưa trả => có thể bỏ
                  // backend chưa trả => có thể bỏ
                  discount={undefined}
                  price={''}
                />
              </SwiperSlide>
            ))}
          </SwiperList>
        )}
      </div>
    </Section>
  );
};

export default WeeklyFarm;
