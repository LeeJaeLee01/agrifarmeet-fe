import React, { Fragment } from 'react';
import CategorySection from '../../modules/Home/CategorySection';
import BestSeller from '../../modules/Home/BestSeller';
import Banner from '../../modules/Home/Banner';
import './Home.scss';
import 'swiper/css';
import 'swiper/css/navigation';

const Home: React.FC = () => {
  return (
    <Fragment>
      <Banner />
      <BestSeller />
      {/* <CategorySection /> */}
      <BestSeller />
    </Fragment>
  );
};

export default Home;
