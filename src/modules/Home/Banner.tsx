import { Carousel } from 'antd';
import { bannerImages } from '../../utils/constants';

const Banner = () => {
  return (
    <div className="container mx-auto">
      <Carousel autoplay arrows infinite={true} className="carousel h-96">
        {bannerImages.map((item) => (
          <div key={item.id} className="block carousel-item h-96">
            <img src={item.src} alt={item.alt} className="block object-cover w-full h-full" />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
