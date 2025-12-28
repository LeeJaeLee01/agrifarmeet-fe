import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import api from '../../utils/api';
import { TBox } from '../../types/TBox';
import { TProduct } from '../../types/TProduct';
import SwiperList from '../../components/SwiperList/SwiperList';
import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import './Landing.scss';

const Landing: React.FC = () => {
  const farmerImageUrl = 'https://api.nongthonviet.com.vn/media/6075f867068bb739ff944505_images1469385_1.jpg';
  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const solutionsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const res = await api.get<TBox[]>('/boxes');
        setBoxes(res.data);
      } catch (err) {
        console.error('Error fetching boxes:', err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        // Handle both array and paginated response
        const productsData = Array.isArray(res.data) 
          ? res.data 
          : (res.data.data || res.data.products || []);
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchBoxes();
    fetchProducts();
  }, []);

  return (
    <Fragment>
      <MainHeader simple />
      <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-background">
            <img src={farmerImageUrl} alt="Farmer" className="hero-image" />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <div className="hero-text-content">
              <h2 className="hero-title-line1">Nông sản sạch, minh bạch, an toàn, bền vững</h2>
              <h4 className="hero-title-line2">Rau tươi từ nông trại giao tận nhà</h4>
              <p className="hero-description">
                AGRIFARMEET giúp bạn yên tâm về nguồn rau an toàn, xanh sạch ngay tại nhà.
              </p>
              <button 
                className="hero-cta-button"
                onClick={() => {
                  solutionsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Xem gói rau phù hợp cho gia đình bạn &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How AGRIFARMEET Solves It Section */}
      <section ref={solutionsRef} className="solutions-section">
        <div className="container">
          <h2 className="section-title">Các gói rau của chúng tôi</h2>
          <p className="section-subtitle">
            Chọn gói rau phù hợp với nhu cầu của gia đình bạn, tươi ngon mỗi tuần
          </p>

          <div className="packages-grid">
            {boxes.slice(0, 3).map((box, index) => (
              <div key={box.id} className="package-card">
                <div className={`package-header ${index === 2 ? 'orange' : 'green'}`}>
                  <span className="package-icon">🌿</span>
                  <h3>{box.name}</h3>
                </div>
                <div className="package-content">
                  <ul className="package-features">
                    {box.isTrial && <li>{box.products?.length || 0} loại rau</li>}
                    <li>{box.description || 'Tươi ngon mỗi ngày'}</li>
                    <li>Giao tận nhà</li>
                  </ul>
                  <div className="package-image">
                    <img src={box.image || farmerImageUrl} alt={box.name} />
                  </div>
                  <Link to={`/boxes/${box.id}`} className="package-button">
                    Xem chi tiết &gt;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Products Section */}
      <section className="weekly-products-section">
        <div className="container">
          <h2 className="section-title">Rau tuần này có gì?</h2>
          <p className="section-subtitle">
            Nguyên liệu tươi mới, phong phú từng tuần
          </p>

          <SwiperList 
            className="products-swiper"
            slidesPerViewConfig={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            spaceBetween={20}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-item">
                  <div className="product-image">
                    <img src={product.image || farmerImageUrl} alt={product.name} />
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description || 'Tươi ngon, chất lượng cao'}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </SwiperList>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section">
        <div className="container">
          <h2 className="section-title">So sánh: AGRIFARMEET vs CHỢ / SIÊU THỊ</h2>

          <div className="comparison-table">
            <div className="comparison-column agrifarmeet">
              <h3 className="column-title">AGRIFARMEET</h3>
              <div className="comparison-item">
                <CheckCircleOutlined className="icon check" />
                <span>Rau sạch từ vườn</span>
              </div>
              <div className="comparison-item">
                <CheckCircleOutlined className="icon check" />
                <span>Giám sát chuẩn VietGAP</span>
              </div>
              <div className="comparison-item">
                <CheckCircleOutlined className="icon check" />
                <span>Giao tận nhà hàng tuần</span>
              </div>
            </div>

            <div className="comparison-column market">
              <h3 className="column-title">CHỢ / SIÊU THỊ</h3>
              <div className="comparison-item">
                <CloseCircleOutlined className="icon cross" />
                <span>Rau nguồn gốc mập mờ</span>
              </div>
              <div className="comparison-item">
                <CloseCircleOutlined className="icon cross" />
                <span>Không ai kiểm chứng</span>
              </div>
              <div className="comparison-item">
                <CloseCircleOutlined className="icon cross" />
                <span>Đi lại, chen lấn</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
      <MainFooter />
    </Fragment>
  );
};

export default Landing;
