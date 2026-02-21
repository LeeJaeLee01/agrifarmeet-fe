import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import api from '../../utils/api';
import { TBox } from '../../types/TBox';
import { TProduct } from '../../types/TProduct';
import SwiperList from '../../components/SwiperList/SwiperList';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './Landing.scss';
import { useTranslation } from 'react-i18next';
import { formatVND } from '../../utils/helper';

const Landing: React.FC = () => {
  const { t } = useTranslation();
  const farmerImageUrl = 'https://api.nongthonviet.com.vn/media/6075f867068bb739ff944505_images1469385_1.jpg';
  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isWeeklyVisible, setIsWeeklyVisible] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const weeklyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWeeklyProducts = async () => {
      try {
        const res = await api.get('/products/weekly');
        const rawData = res.data as any;
        const productsData = Array.isArray(rawData)
          ? rawData
          : (Array.isArray(rawData.data)
            ? rawData.data
            : (rawData.data ? [rawData.data] : []));
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching weekly products:', err);
      }
    };

    fetchWeeklyProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWeeklyVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (weeklyRef.current) {
      observer.observe(weeklyRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTitleVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const res = await api.get<TBox[]>('/boxes');
        const rawData = res.data as any;
        const boxesData = Array.isArray(rawData)
          ? rawData
          : (Array.isArray(rawData.data)
            ? rawData.data
            : (rawData.data ? [rawData.data] : []));
        setBoxes(boxesData);
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
        {/* Hero Section */}
        <section className="hero-section">
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation
            autoplay={{ delay: 3600, disableOnInteraction: false }}
            loop={true}
            className="hero-swiper"
          >
            {[
              {
                id: 1,
                image: farmerImageUrl,
                titleLine1: t('landing.heroTitleLine1'),
                titleLine2: t('landing.heroTitleLine2'),
                description: t('landing.heroDescription'),
              },
              {
                id: 2,
                image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2570&auto=format&fit=crop',
                titleLine1: t('landing.heroTitleLine1'),
                titleLine2: t('landing.cleanFromGarden'),
                description: t('landing.vietgapStandard'),
              },
              {
                id: 3,
                image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2670&auto=format&fit=crop',
                titleLine1: t('landing.weeklyHomeDelivery'),
                titleLine2: t('landing.heroTitleLine2'),
                description: t('landing.freshEveryDay'),
              },
            ].map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="container" style={{ height: '100%' }}>
                  <div className="hero-background">
                    <img src={slide.image} alt="Hero Slide" className="hero-image" />
                    <div className="hero-overlay"></div>
                  </div>
                  <div className="hero-content">
                    <div className="hero-text-content">
                      <h2 className="hero-title-line1">{slide.titleLine1}</h2>
                      <h4 className="hero-title-line2">{slide.titleLine2}</h4>
                      <p className="hero-description">{slide.description}</p>
                      <button
                        className="hero-cta-button"
                        onClick={() => {
                          solutionsRef.current?.scrollIntoView({
                            behavior: 'smooth',
                          });
                        }}
                      >
                        {t('landing.heroCta')}
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* How AGRIFARMEET Solves It Section */}
        <section ref={solutionsRef} className="solutions-section">
          <div className="container">
            <h2
              ref={titleRef}
              className={`section-title ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              {t('landing.packagesTitle').toUpperCase()}
            </h2>
            <p
              className={`section-subtitle ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              {t('landing.packagesSubtitle')}
            </p>

            <div className="packages-grid">
              {boxes.map((box, index) => (
                <div
                  key={box.id}
                  className="package-card"
                  style={{ animationDelay: `${0.2 * index}s` }}
                >
                  <div className="package-header-badge">
                    <img src="https://cdn-icons-png.flaticon.com/512/2917/2917995.png" alt="icon" />
                  </div>

                  <div className="package-title-section">
                    <h3>{box.name}</h3>
                    <p className="package-description">
                      {box.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>
                  </div>

                  <div className="package-price-section">
                    <h2 className="price-text">
                      {box.price ? formatVND(box.price) : formatVND(360000)}
                    </h2>

                  </div>

                  <div className="package-action">
                    <Link to={`/boxes/${box.slug}`} className="select-button">
                      {t('landing.selectProduct') || 'MUA NGAY'}
                    </Link>
                  </div>

                  <div className="package-features-list">
                    <h4>{t('landing.packageIncludes') || 'Gói bao gồm'}</h4>
                    <ul>
                      <li>
                        <span className="icon">👥</span> {box.includes.serving_size}
                      </li>
                      <li>
                        <span className="icon">⏱️</span> {box.includes.duration_text}
                      </li>
                      <li>
                        <span className="icon">🥬</span> {box.includes.product_count} {t('landing.products') || 'sản phẩm'}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Weekly Products Section */}
        <section ref={weeklyRef} className="weekly-products-section">
          <div className="container">
            <h2 className={`section-title ${isWeeklyVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {t('landing.weeklyTitle')}
            </h2>
            <p
              className={`section-subtitle ${isWeeklyVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              {t('landing.weeklySubtitle')}
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
                      <img
                        src={(Array.isArray(product.images) ? product.images[0] : (product.images ? JSON.parse(product.images || '[]')[0] : product.image)) || farmerImageUrl}
                        alt={product.name}
                      />
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">
                      {product.description || t('landing.productDefaultDescription')}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </SwiperList>
          </div>
        </section>

        {/* Comparison Section */}
        {/* <section className="comparison-section">
          <div className="container">
            <h2 className="section-title">
              {t('landing.comparisonTitle')}
            </h2>

            <div className="comparison-table">
              <div className="comparison-column agrifarmeet">
                <h3 className="column-title">
                  {t('landing.agrifarmeetColumn')}
                </h3>
                <div className="comparison-item">
                  <CheckCircleOutlined className="icon check" />
                  <span>{t('landing.cleanFromGarden')}</span>
                </div>
                <div className="comparison-item">
                  <CheckCircleOutlined className="icon check" />
                  <span>{t('landing.vietgapStandard')}</span>
                </div>
                <div className="comparison-item">
                  <CheckCircleOutlined className="icon check" />
                  <span>{t('landing.weeklyHomeDelivery')}</span>
                </div>
              </div>

              <div className="comparison-column market">
                <h3 className="column-title">
                  {t('landing.marketColumn')}
                </h3>
                <div className="comparison-item">
                  <CloseCircleOutlined className="icon cross" />
                  <span>{t('landing.unclearOrigin')}</span>
                </div>
                <div className="comparison-item">
                  <CloseCircleOutlined className="icon cross" />
                  <span>{t('landing.noVerification')}</span>
                </div>
                <div className="comparison-item">
                  <CloseCircleOutlined className="icon cross" />
                  <span>{t('landing.crowdedShopping')}</span>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
      <MainFooter />
    </Fragment>
  );
};

export default Landing;
