import React, { useEffect, useState } from 'react';
import Section from '../../components/Section/Section';
import { Link } from 'react-router-dom';
import SwiperList from '../../components/SwiperList/SwiperList';
import { SwiperSlide } from 'swiper/react';
import ProductCard from '../../components/ProductCard/ProductCard';
import api from '../../utils/api';
import { message } from 'antd';

const BestSeller: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('http://localhost:3030/products');

      setFeaturedProducts(response.data);
    } catch (error) {
      message.error('Không thể tải giỏ hàng');
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Section>
      <div className="container mx-auto">
        <div className="flex items-center justify-between w-full mb-8 text-text1 title">
          <h2 className="m-0 text-xl">Sản phẩm bán chạy</h2>
          <Link to="/products">Shop all</Link>
        </div>
        <SwiperList>
          {featuredProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard
                id={item.id}
                image={item.image}
                name={item.name}
                unit="Cân"
                oldPrice={item.oldPrice}
                price={item.price}
                discount={item.discount}
              />
            </SwiperSlide>
          ))}
        </SwiperList>
      </div>
    </Section>
  );
};

export default BestSeller;
