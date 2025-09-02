import React from 'react';
import Section from '../../components/Section/Section';
import SwiperList from '../../components/SwiperList/SwiperList';
import { featuredProducts } from '../../utils/constants';
import { SwiperSlide } from 'swiper/react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Link } from 'react-router-dom';

const WeeklyFarm: React.FC = () => {
  return (
    <Section>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl text-text1">Các sản phẩm</h2>
          <Link to="/" className="text-text3">
            Xem tất cả
          </Link>
        </div>
        <SwiperList className="pb-5">
          {featuredProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard
                id={item.id}
                img={item.image}
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

export default WeeklyFarm;
