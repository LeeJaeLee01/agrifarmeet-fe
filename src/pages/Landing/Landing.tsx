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
import { formatVND, getFirstCooperativeImageUrl } from '../../utils/helper';

const Landing: React.FC = () => {
  const { t } = useTranslation();
  const farmerImageUrl = 'https://api.nongthonviet.com.vn/media/6075f867068bb739ff944505_images1469385_1.jpg';
  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [isUserProblemVisible] = useState(true);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isWeeklyVisible] = useState(true);
  const [isTitleVisible] = useState(true);
  const [isPartnersVisible] = useState(true);
  const [isCustomerReviewVisible] = useState(true);
  const [isCommitmentsVisible] = useState(true);
  const [isFaqVisible] = useState(true);
  const [isFinalCtaVisible] = useState(true);
  const userProblemRef = useRef<HTMLElement | null>(null);
  const weeklyRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const partnersGridRef = useRef<HTMLDivElement | null>(null);
  const customerReviewRef = useRef<HTMLElement | null>(null);
  const commitmentsRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);
  const finalCtaRef = useRef<HTMLElement | null>(null);

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

  // Auto scroll partners section on mobile every 3s
  useEffect(() => {
    const gridEl = partnersGridRef.current;
    if (!gridEl) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const cardWidth =
      (gridEl.firstElementChild as HTMLElement | null)?.clientWidth || 200;
    const gap = 16;
    const step = cardWidth + gap;

    const interval = setInterval(() => {
      const maxScroll = gridEl.scrollWidth - gridEl.clientWidth;
      if (gridEl.scrollLeft + step >= maxScroll - 5) {
        gridEl.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        gridEl.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(interval);
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

    fetchBoxes();
  }, []);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await api.get('/cooperatives');
        const raw = res.data as any;
        const list = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
        setPartners(list);
      } catch (err) {
        console.error('Error fetching cooperatives:', err);
      }
    };
    fetchPartners();
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
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="hero-swiper"
          >
            {[
              // {
              //   id: 1,
              //   image: farmerImageUrl,
              //   titleLine1: t('landing.heroTitleLine1'),
              //   titleLine2: t('landing.heroTitleLine2'),
              //   description: t('landing.heroDescription'),
              // },
              {
                id: 2,
                image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2570&auto=format&fit=crop',
                titleLine1: t('landing.heroTitleLine1'),
                titleLine2: t('landing.heroTitleLine2'),
                description: t('landing.heroDescription'),
              },
              // {
              //   id: 3,
              //   image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2670&auto=format&fit=crop',
              //   titleLine1: t('landing.weeklyHomeDelivery'),
              //   titleLine2: t('landing.heroTitleLine2'),
              //   description: t('landing.freshEveryDay'),
              // },
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

        {/* User Problem Section */}
        <section ref={userProblemRef} className="user-problem-section">
          <div className="container">
            <h3
              className={`section-label ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              Vấn đề người dùng gặp phải
            </h3>
            <h2
              className={`section-title ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isUserProblemVisible ? '0.15s' : undefined }}
            >
              Người thành phố đang khó tin vào rau sạch
            </h2>
            <p
              className={`section-description ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isUserProblemVisible ? '0.3s' : undefined }}
            >
              Ngày này người dùng ngày càng lo lắng về thực phẩm:
            </p>
            <ul
              className={`section-problem-list ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isUserProblemVisible ? '0.25s' : undefined }}
            >
              <li>👉 Rau không rõ nguồn gốc</li>
              <li>👉 Quá nhiều trung gian</li>
            </ul>
            <p
              className={`section-description section-description-conclusion ${
                isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: isUserProblemVisible ? '0.4s' : undefined }}
            >
              Trong khi đó nhiều nông dân vẫn trồng rau rất cẩn thận nhưng sản
              phẩm lại không đến được trực tiếp người tiêu dùng.
            </p>

            <div className="user-origin-block">
              <h3
                className={`section-label ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isUserProblemVisible ? '0.5s' : undefined }}
              >
                FARME RA ĐỜI
              </h3>

              <h2
                className={`section-title ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isUserProblemVisible ? '0.6s' : undefined }}
              >
                Farme Kết Nối Nông Dân Và Gia Đình Thành Phố
              </h2>

              <p
                className={`section-description ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isUserProblemVisible ? '0.7s' : undefined }}
              >
                Farme xây dựng mô hình giao rau định kỳ từ nông trại để mang rau tươi
                minh bạch đến bàn ăn gia đình.
              </p>

              <p
                className={`section-description section-description-conclusion ${
                  isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: isUserProblemVisible ? '0.8s' : undefined }}
              >
                Rau được:
              </p>

              <ul
                className={`section-problem-list ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isUserProblemVisible ? '0.9s' : undefined }}
              >
                <li>👉 Thu hoạch trực tiếp tại trang trại</li>
                <li>👉 Đóng gói trong ngày</li>
                <li>👉 Giao tận nhà mỗi tuần</li>
                <li>👉 Không qua nhiều trung gian</li>
              </ul>
            </div>

            <div className="user-core-values-block">
              <h3
                className={`section-label ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isUserProblemVisible ? '1.0s' : undefined }}
              >
                GIÁ TRỊ CỐT LÕI
              </h3>

              <h2
                className={`section-title ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isUserProblemVisible ? '1.1s' : undefined }}
              >
                Giá Trị Của Farme
              </h2>

              <p
                className={`section-description ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isUserProblemVisible ? '1.2s' : undefined }}
              >
                3 giá trị cốt lõi Farme mang đến cho khách hàng và nông dân:
              </p>

              <div className="core-values-grid">
                {[
                  {
                    title: 'Minh Bạch',
                    description:
                      'Khách hàng biết rau đến từ trang trại nào và ai là người trồng.',
                  },
                  {
                    title: 'An Toàn',
                    description:
                      'Rau được canh tác theo quy trình kiểm soát tại các hợp tác xã uy tín.',
                  },
                  {
                    title: 'Bền Vững',
                    description:
                      'Farme giúp nông dân bán sản phẩm ổn định và phát triển nông nghiệp bền vững.',
                  },
                ].map((value, index) => (
                  <div
                    key={value.title}
                    className={`core-value-card ${
                      isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                    style={{
                      animationDelay: isUserProblemVisible
                        ? `${1.3 + index * 0.1}s`
                        : undefined,
                    }}
                  >
                    <h4>{value.title}</h4>
                    <p>{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="user-how-it-works-block">
              <h3
                className={`section-label ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isUserProblemVisible ? '1.5s' : undefined }}
              >
                FARME HOẠT ĐỘNG THẾ NÀO
              </h3>

              <h2
                className={`section-title ${isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: isUserProblemVisible ? '1.6s' : undefined }}
              >
                Cách Farme Hoạt Động
              </h2>

              <div className="how-it-works-steps">
                {[
                  {
                    step: 'Bước 1',
                    description: 'Chọn gói rau phù hợp với nhu cầu gia đình.',
                  },
                  {
                    step: 'Bước 2',
                    description:
                      'Rau được thu hoạch tại trang trại và đóng gói trong ngày.',
                  },
                  {
                    step: 'Bước 3',
                    description:
                      'Farme giao hộp rau tươi đến tận nhà mỗi tuần.',
                  },
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className={`how-step ${
                      isUserProblemVisible ? 'animate-fade-in-up' : 'opacity-0'
                    }`}
                    style={{
                      animationDelay: isUserProblemVisible
                        ? `${1.7 + index * 0.1}s`
                        : undefined,
                    }}
                  >
                    <p className="how-step-label">{item.step}</p>
                    <p className="how-step-description">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How FARME Solves It Section */}
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

        {/* Partners Section */}
        <section ref={partnersRef} className="partners-section">
          <div className="container">
            <h2 className={`section-title ${isPartnersVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {t('landing.partnersTitle')}
            </h2>
            <p
              className={`section-subtitle ${isPartnersVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              {t('landing.partnersSubtitle')}
            </p>

            <div className="partners-grid" ref={partnersGridRef}>
              {partners.map((partner, index) => {
                const logo = getFirstCooperativeImageUrl(partner.images, 'https://via.placeholder.com/150x100?text=Partner');
                return (
                  <div
                    key={partner.id}
                    className={`partner-item ${isPartnersVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <img src={logo} alt={partner.name} />
                    <p className="partner-htx-name" title={partner.name}>{partner.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Customer Review Section */}
        <section ref={customerReviewRef} className="customer-review-section">
          <div className="container">
            <h3
              className={`section-label ${isCustomerReviewVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              KHÁCH HÀNG NÓI GÌ
            </h3>
            <h2
              className={`section-title ${isCustomerReviewVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isCustomerReviewVisible ? '0.15s' : undefined }}
            >
              Review
            </h2>
            <blockquote
              className={`customer-testimonial ${isCustomerReviewVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isCustomerReviewVisible ? '0.25s' : undefined }}
            >
              Gia đình mình rất yên tâm khi dùng rau Farme. Rau luôn tươi và giao rất đúng hẹn.
            </blockquote>
            <p
              className={`customer-attribution ${isCustomerReviewVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isCustomerReviewVisible ? '0.35s' : undefined }}
            >
              — Chị Lan, Cầu Giấy
            </p>
          </div>
        </section>

        {/* Commitments Section */}
        <section ref={commitmentsRef} className="commitments-section">
          <div className="container">
            <h3
              className={`section-label ${isCommitmentsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              CAM KẾT CỦA FARME
            </h3>
            <h2
              className={`section-title ${isCommitmentsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isCommitmentsVisible ? '0.15s' : undefined }}
            >
              Farme cam kết:
            </h2>
            <ul
              className={`commitments-list ${isCommitmentsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isCommitmentsVisible ? '0.25s' : undefined }}
            >
              <li>👉 Minh bạch nguồn gốc</li>
              <li>👉 Rau thu hoạch trong ngày</li>
              <li>👉 Không tồn kho lâu</li>
              <li>👉 Giao hàng nhanh trong ngày</li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} className="faq-section">
          <div className="container">
            <h3 className={`section-label ${isFaqVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              FAQ
            </h3>

            <div className="faq-list">
              {[
                {
                  q: 'Rau có phải VietGAP không?',
                  a: 'Rau được trồng tại các hợp tác xã tuân theo quy trình canh tác kiểm soát.',
                },
                {
                  q: 'Có thể tạm dừng giao hàng không?',
                  a: 'Bạn có thể tạm dừng hoặc huỷ gói bất kỳ lúc nào.',
                },
                {
                  q: 'Nếu rau không tươi thì sao?',
                  a: 'Farme luôn sẵn sàng hỗ trợ đổi sản phẩm.',
                },
              ].map((item, index) => (
                <div
                  key={item.q}
                  className={`faq-item ${isFaqVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: isFaqVisible ? `${0.15 + index * 0.1}s` : undefined }}
                >
                  <h4 className="faq-question">{item.q}</h4>
                  <p className="faq-answer">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section ref={finalCtaRef} className="final-cta-section">
          <div className="container">
            {/* <h3 className={`section-label ${isFinalCtaVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              FINAL CTA
            </h3> */}
            <h2
              className={`section-title ${isFinalCtaVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isFinalCtaVisible ? '0.15s' : undefined }}
            >
              Bắt Đầu Trải Nghiệm Farme Ngay Hôm Nay
            </h2>
            <p
              className={`final-cta-text ${isFinalCtaVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isFinalCtaVisible ? '0.3s' : undefined }}
            >
              Chọn gói rau phù hợp cho gia đình bạn và để Farme chăm sóc bữa ăn xanh mỗi tuần.
            </p>
            <div
              className={`final-cta-actions ${isFinalCtaVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isFinalCtaVisible ? '0.45s' : undefined }}
            >
              <Link
                to="/boxes"
                className="final-cta-button"
              >
                Chọn Gói Rau Phù Hợp
              </Link>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        {/* <section className="comparison-section">
          <div className="container">
            <h2 className="section-title">
              {t('landing.comparisonTitle')}
            </h2>

            <div className="comparison-table">
              <div className="comparison-column farme">
                <h3 className="column-title">
                  {t('landing.farmeColumn')}
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
