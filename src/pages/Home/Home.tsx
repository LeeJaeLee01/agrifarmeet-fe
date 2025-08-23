import React, { Fragment } from 'react';
import { Carousel } from 'antd';
import { bannerImages, categories, featuredProducts } from '../../utils/constants';
import { Link } from 'react-router-dom';
import './Home.scss';
import Section from '../../components/Section/Section';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import SwiperList from '../../components/SwiperList/SwiperList';

const Home: React.FC = () => {
  return (
    <Fragment>
      <Carousel autoplay arrows infinite={false} className="carousel h-96">
        {bannerImages.map((item) => (
          <div key={item.id} className="block carousel-item h-96">
            <img src={item.src} alt={item.alt} className="block object-cover w-full h-full" />
          </div>
        ))}
      </Carousel>
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
      <Section secondary>
        <div className="container mx-auto">
          <div className="flex items-center justify-between w-full mb-8 text-text1 title">
            <h2 className="m-0 text-xl">Danh mục sản phẩm</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-3">
            {categories.map((item) => (
              <div key={item.id} className="">
                <img
                  src={item.image}
                  alt={item.name}
                  className="block object-cover w-full mb-4 h-60"
                />
                <h3 className="mb-2 text-lg font-normal text-text1">{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section>
        <div className="container mx-auto">
          <div className="flex items-center justify-between w-full mb-8 text-text1 title">
            <h2 className="m-0 text-xl">Danh mục sản phẩm</h2>
          </div>
          <SwiperList>
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
    </Fragment>
  );
};

export default Home;
