import { Swiper } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { TSwiperList } from '../../types/TSwiperList';
import 'swiper/css';
import 'swiper/css/navigation';
import './SwiperList.scss';

const SwiperList: React.FC<TSwiperList> = ({
  children,
  slidesPerViewConfig,
  spaceBetween = 20,
  className = '',
}) => {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={spaceBetween}
      className={className}
      breakpoints={
        slidesPerViewConfig || {
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }
      }
    >
      {children}
    </Swiper>
  );
};

export default SwiperList;
