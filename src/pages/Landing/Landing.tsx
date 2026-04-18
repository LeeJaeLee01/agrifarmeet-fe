import React, { Fragment, useEffect, useState, useRef } from 'react';
import { DownOutlined } from '@ant-design/icons';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { useTitle } from '../../hooks/useTitle';
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
import { Modal, Button } from 'antd';
import { getFirstCooperativeImageUrl, unwrapApiList } from '../../utils/helper';
import PackagesSection from '../../components/PackagesSection/PackagesSection';

const Landing: React.FC = () => {
  const { t, i18n } = useTranslation();
  useTitle('Farme - Nông sản sạch, minh bạch, an toàn, bền vững');
  const farmerImageUrl =
    'https://api.nongthonviet.com.vn/media/6075f867068bb739ff944505_images1469385_1.jpg';
  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isWeeklyVisible] = useState(true);
  const [isTitleVisible] = useState(true);
  const [isPartnersVisible] = useState(true);
  const [isCustomerReviewVisible] = useState(true);
  const [weeklySlidesPerView, setWeeklySlidesPerView] = useState(5);
  const weeklyRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const partnersGridRef = useRef<HTMLDivElement | null>(null);
  const reviewsGridRef = useRef<HTMLDivElement | null>(null);
  const customerReviewRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [showHeroScrollHint, setShowHeroScrollHint] = useState(true);

  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [weeklyModalData, setWeeklyModalData] = useState<{
    box: { name: string };
    weekStartDate: string;
    items: any[];
  } | null>(null);
  const [weeklyModalLoading, setWeeklyModalLoading] = useState(false);

  const handleShowWeekly = async () => {
    setIsWeeklyModalOpen(true);
    if (weeklyModalData) return; // đã load rồi thì không load lại
    try {
      setWeeklyModalLoading(true);
      const res = await api.get('/boxes/goi-co-ban/weekly-products');
      setWeeklyModalData(res.data?.data ?? res.data);
    } catch (err) {
      console.error('Error fetching weekly products modal:', err);
    } finally {
      setWeeklyModalLoading(false);
    }
  };
  const scrollToPackagesSection = () => {
    weeklyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    /**
     * Nút "Chi tiết" luôn hiện cố định đáy màn hình cho đến khi kéo tới khối
     * "CÁC GÓI RAU CỦA CHÚNG TÔI" (solutionsRef): khi phần đó vào vùng đáy (trùng nút) thì ẩn.
     */
    const scrollHintBottomZonePx = 100;

    const updateHeroScrollHint = () => {
      const packagesSection = solutionsRef.current;
      if (!packagesSection) {
        setShowHeroScrollHint(true);
        return;
      }
      const top = packagesSection.getBoundingClientRect().top;
      const reachedPackages = top < window.innerHeight - scrollHintBottomZonePx;
      setShowHeroScrollHint(!reachedPackages);
    };

    updateHeroScrollHint();
    window.addEventListener('scroll', updateHeroScrollHint, { passive: true });
    window.addEventListener('resize', updateHeroScrollHint);
    return () => {
      window.removeEventListener('scroll', updateHeroScrollHint);
      window.removeEventListener('resize', updateHeroScrollHint);
    };
  }, []);

  useEffect(() => {
    const updateWeeklyPerView = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setWeeklySlidesPerView(5);
      } else if (w >= 768) {
        setWeeklySlidesPerView(3);
      } else {
        setWeeklySlidesPerView(2);
      }
    };
    updateWeeklyPerView();
    window.addEventListener('resize', updateWeeklyPerView);
    return () => window.removeEventListener('resize', updateWeeklyPerView);
  }, []);

  useEffect(() => {
    if (window.location.hash !== '#landing-packages') return;
    const timer = window.setTimeout(() => {
      solutionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchSeasonalOnSaleProducts = async () => {
      try {
        const res = await api.get('/products/is-sale/all');
        setProducts(unwrapApiList<TProduct>(res.data));
      } catch (err) {
        console.error('Error fetching is-sale products (landing):', err);
      }
    };

    fetchSeasonalOnSaleProducts();
  }, []);

  // Auto scroll partners section on mobile every 3s
  useEffect(() => {
    const gridEl = partnersGridRef.current;
    if (!gridEl) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const cardWidth = (gridEl.firstElementChild as HTMLElement | null)?.clientWidth || 200;
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

  // Tự động trượt ngang feedback (ping-pong) sau khi có dữ liệu
  useEffect(() => {
    if (feedbacks.length === 0) return;

    let intervalId: number | undefined;
    let cancelled = false;

    const setup = () => {
      if (cancelled) return;
      const gridEl = reviewsGridRef.current;
      if (!gridEl) return;

      const first = gridEl.firstElementChild as HTMLElement | null;
      const cardWidth = first?.clientWidth || 280;
      const gapStyle = getComputedStyle(gridEl).gap || getComputedStyle(gridEl).columnGap;
      const gap = parseFloat(gapStyle) || 16;
      const step = cardWidth + gap;
      let direction: 1 | -1 = 1;

      intervalId = window.setInterval(() => {
        const el = reviewsGridRef.current;
        if (!el || cancelled) return;
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 4) return;

        if (direction === 1 && el.scrollLeft + step >= maxScroll - 4) {
          direction = -1;
          el.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else if (direction === -1 && el.scrollLeft <= 4) {
          direction = 1;
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: direction * step, behavior: 'smooth' });
        }
      }, 3000);
    };

    const t = window.setTimeout(setup, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [feedbacks.length]);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const res = await api.get('/boxes');
        setBoxes(unwrapApiList<TBox>(res.data));
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
        const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        setPartners(list);
      } catch (err) {
        console.error('Error fetching cooperatives:', err);
      }
    };
    fetchPartners();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await api.get('/feedbacks?page=1&limit=20');
        const raw = res.data as any;
        const list = Array.isArray(raw?.data?.items)
          ? raw.data.items
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw)
              ? raw
              : [];
        setFeedbacks(list);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <Fragment>
      <MainHeader simple />
      <div className="landing-page">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="hero-section" ref={heroRef}>
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="hero-swiper"
          >
            {[
              {
                id: 1,
                image: '/banner.png',
                titleLine1: t('landing.heroTitleLine1'),
                titleLine2: t('landing.heroTitleLine2'),
                description: t('landing.heroDescription'),
              },
            ].map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="container" style={{ height: '100%' }}>
                  <div className="hero-background">
                    <img src={slide.image} alt="Hero Slide" className="hero-image" />
                  </div>
                  {/* <div className="hero-content">
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
                  </div> */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* fixed theo viewport: không đặt trong .hero-section (transform làm fixed bám đáy ảnh) */}
        <div className={`hero-scroll-hint-group ${showHeroScrollHint ? '' : 'is-hidden'}`}>
          <button
            type="button"
            id="show-weekly"
            className="hero-scroll-hint hero-scroll-hint--weekly"
            onClick={handleShowWeekly}
            aria-label={t('landing.weeklyDetails')}
          >
            <span className="hero-scroll-hint__text">{t('landing.weeklyDetails')}</span>
            <DownOutlined className="hero-scroll-hint__icon" />
          </button>
          <button
            type="button"
            className="hero-scroll-hint"
            onClick={scrollToPackagesSection}
            aria-label={t('landing.details')}
          >
            <span className="hero-scroll-hint__text">{t('landing.details')}</span>
            <DownOutlined className="hero-scroll-hint__icon" />
          </button>
        </div>

        {/* How FARME Solves It Section */}
        <PackagesSection
          boxes={boxes}
          sectionRef={solutionsRef}
          titleRef={titleRef}
          titleVisible={isTitleVisible}
        />

        {/* Weekly Products Section */}
        <section ref={weeklyRef} className="weekly-products-section">
          <div className="container">
            <h2 className={`section-title ${isWeeklyVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              {t('landing.weeklyTitle')}
            </h2>

            {products.length === 0 ? (
              <p className="text-center text-text3">{t('common.noData')}</p>
            ) : products.length <= weeklySlidesPerView ? (
              <div className="weekly-products-static">
                {products.map((product) => {
                  const imgSrc = (() => {
                    const first = Array.isArray(product.images)
                      ? product.images[0]
                      : typeof product.images === 'string'
                        ? (() => {
                            try {
                              const parsed = JSON.parse(product.images || '[]');
                              return Array.isArray(parsed) && parsed[0]
                                ? parsed[0]
                                : product.images;
                            } catch {
                              return product.images;
                            }
                          })()
                        : product.image || '';
                    if (!first) return farmerImageUrl;
                    if (/^https?:\/\//i.test(first)) return first;
                    const base =
                      process.env.REACT_APP_API_URL ||
                      (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3030');
                    return `${base.replace(/\/$/, '')}/${String(first).replace(/^\//, '')}`;
                  })();
                  return (
                    <div key={product.id} className="product-item">
                      <div className="product-image">
                        <img src={imgSrc} alt={product.name} />
                      </div>
                      <h3 className="product-name">{product.name}</h3>
                    </div>
                  );
                })}
              </div>
            ) : (
              <SwiperList
                className="products-swiper"
                loop={true}
                slidesPerViewConfig={{
                  0: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 5 },
                }}
                spaceBetween={24}
              >
                {products.map((product) => {
                  const imgSrc = (() => {
                    const first = Array.isArray(product.images)
                      ? product.images[0]
                      : typeof product.images === 'string'
                        ? (() => {
                            try {
                              const parsed = JSON.parse(product.images || '[]');
                              return Array.isArray(parsed) && parsed[0]
                                ? parsed[0]
                                : product.images;
                            } catch {
                              return product.images;
                            }
                          })()
                        : product.image || '';
                    if (!first) return farmerImageUrl;
                    if (/^https?:\/\//i.test(first)) return first;
                    const base =
                      process.env.REACT_APP_API_URL ||
                      (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3030');
                    return `${base.replace(/\/$/, '')}/${String(first).replace(/^\//, '')}`;
                  })();
                  return (
                    <SwiperSlide key={product.id}>
                      <div className="product-item">
                        <div className="product-image">
                          <img src={imgSrc} alt={product.name} />
                        </div>
                        <h3 className="product-name">{product.name}</h3>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </SwiperList>
            )}
          </div>
        </section>

        {/* Customer Review Section */}
        <section ref={customerReviewRef} className="customer-review-section">
          <div className="container">
            {/* <h3
              className={`section-label ${isCustomerReviewVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              {t('landing.customerSay')}
            </h3> */}
            <h2
              className={`section-title ${isCustomerReviewVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: isCustomerReviewVisible ? '0.15s' : undefined }}
            >
              {t('landing.reviewTitle')}
            </h2>
            <div className="reviews-grid" ref={reviewsGridRef}>
              {feedbacks.map((r, index) => {
                const rating = Math.max(0, Math.min(5, Number(r?.vote ?? 0)));
                const feedbackImage = Array.isArray(r?.images) && r.images[0] ? r.images[0] : '';
                const location = r?.addressDetail || r?.address || '';
                const initials = String(r?.name || '')
                  .trim()
                  .split(/\s+/)
                  .slice(-2)
                  .map((w) => w.charAt(0).toUpperCase())
                  .join('');
                return (
                  <div
                    key={r.id}
                    className={`review-card ${isCustomerReviewVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{
                      animationDelay: isCustomerReviewVisible ? `${0.2 + index * 0.1}s` : undefined,
                    }}
                  >
                    <div className="review-media">
                      {feedbackImage ? (
                        <img
                          className="review-photo"
                          src={feedbackImage}
                          alt=""
                          draggable={false}
                        />
                      ) : (
                        <div className="review-photo-placeholder">
                          {t('landing.noFeedbackImage')}
                        </div>
                      )}
                    </div>
                    <div className="review-author">
                      <div className="review-author-row">
                        <div className="review-author-main">
                          <p className="review-name">{r.name}</p>
                          <div className="review-rating" aria-label={`rating-${rating}`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < rating ? 'star star-filled' : 'star'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          type="link"
                          className="review-detail-btn"
                          onClick={() => {
                            setSelectedFeedback({
                              ...r,
                              __rating: rating,
                              __initials: initials,
                              __avatarUrl: feedbackImage || '',
                              __location: location,
                              __image: feedbackImage,
                            });
                            setIsFeedbackModalOpen(true);
                          }}
                        >
                          {t('landing.detail')}
                        </Button>
                      </div>
                      {location ? <p className="review-location">{location}</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <Modal
              open={isFeedbackModalOpen}
              onCancel={() => {
                setIsFeedbackModalOpen(false);
                setSelectedFeedback(null);
              }}
              footer={null}
              centered
              width={760}
              title={null}
              className="feedback-detail-modal"
              destroyOnHidden
            >
              <div className="feedback-modal">
                <div className="feedback-modal-top">
                  <div className="feedback-modal-avatar-wrap" aria-hidden="true">
                    {selectedFeedback?.__avatarUrl ? (
                      <img
                        className="feedback-modal-avatar"
                        src={selectedFeedback.__avatarUrl}
                        alt={selectedFeedback?.name || ''}
                      />
                    ) : (
                      <div className="feedback-modal-avatar-fallback">
                        {selectedFeedback?.__initials || t('landing.customerInitials')}
                      </div>
                    )}
                  </div>
                  <div className="feedback-modal-meta">
                    <div className="feedback-modal-name-row">
                      <p className="feedback-modal-name">
                        {selectedFeedback?.name || t('landing.customer')}
                      </p>
                      {selectedFeedback?.__location ? (
                        <p className="feedback-modal-location">{selectedFeedback.__location}</p>
                      ) : null}
                    </div>
                    <div
                      className="feedback-modal-rating"
                      aria-label={`rating-${selectedFeedback?.__rating ?? 0}`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Number(selectedFeedback?.__rating ?? 0)
                              ? 'star star-filled'
                              : 'star'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="feedback-modal-sub">
                      {selectedFeedback?.user?.phone ? (
                        <span className="feedback-modal-sub-item">
                          {t('landing.phoneLabel')}: <b>{selectedFeedback.user.phone}</b>
                        </span>
                      ) : null}
                      {selectedFeedback?.createdAt ? (
                        <span className="feedback-modal-sub-item">
                          {t('landing.date')}:{' '}
                          <b>
                            {new Date(selectedFeedback.createdAt).toLocaleDateString(
                              i18n.language === 'vi' ? 'vi-VN' : 'en-US',
                            )}
                          </b>
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="feedback-modal-body">
                  <div className="feedback-modal-media">
                    {selectedFeedback?.__image ? (
                      <img
                        className="feedback-modal-photo"
                        src={selectedFeedback.__image}
                        alt={`feedback-${selectedFeedback?.name || ''}`}
                      />
                    ) : (
                      <div className="feedback-modal-empty">{t('landing.noFeedbackImage')}</div>
                    )}
                  </div>

                  <div className="feedback-modal-text">
                    <p className="feedback-modal-description">
                      “{selectedFeedback?.description || ''}”
                    </p>

                    {selectedFeedback?.address || selectedFeedback?.addressDetail ? (
                      <div className="feedback-modal-address">
                        <div className="feedback-modal-address-title">{t('landing.address')}</div>
                        <div className="feedback-modal-address-text">
                          {[selectedFeedback.addressDetail, selectedFeedback.address]
                            .filter(Boolean)
                            .join(' - ')}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </section>

        {/* Partners Section */}
        <section ref={partnersRef} className="partners-section">
          <div className="container">
            <h2
              className={`section-title ${isPartnersVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              {t('landing.partnersTitle')}
            </h2>
            {String(t('landing.partnersSubtitle') || '').trim() ? (
              <p
                className={`section-subtitle ${isPartnersVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
              >
                {t('landing.partnersSubtitle')}
              </p>
            ) : null}

            <div className="partners-grid" ref={partnersGridRef}>
              {partners.map((partner, index) => {
                const logo = getFirstCooperativeImageUrl(
                  partner.images,
                  'https://via.placeholder.com/150x100?text=Partner',
                );
                return (
                  <div
                    key={partner.id}
                    className={`partner-item ${isPartnersVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <img src={logo} alt={partner.name} />
                    <p className="partner-htx-name" title={partner.name}>
                      {partner.name}
                    </p>
                  </div>
                );
              })}
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
      <Modal
        open={isWeeklyModalOpen}
        onCancel={() => setIsWeeklyModalOpen(false)}
        footer={null}
        centered
        width={680}
        title={
          weeklyModalData
            ? `${weeklyModalData.box?.name ?? ''} — Rau tuần ${new Date(weeklyModalData.weekStartDate).toLocaleDateString('vi-VN')}`
            : t('landing.weeklyDetails')
        }
        destroyOnClose
      >
        {weeklyModalLoading ? (
          <div className="flex justify-center py-10">
            <span>{t('common.loading') || 'Đang tải...'}</span>
          </div>
        ) : weeklyModalData ? (
          <div className="flex flex-col gap-3 mt-2 overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {weeklyModalData.items.map((item: any) => {
              const p = item.product;
              const img = Array.isArray(p.images) ? p.images[0] : p.images;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-gray-100"
                >
                  {img && (
                    <img
                      src={img}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-md shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 m-0">{p.name}</p>
                    <p className="text-sm text-gray-500 m-0">{p.category?.name}</p>
                    <p className="text-sm text-gray-400 m-0">
                      {item.quantity} {item.unit} · {p.weight}g
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </Modal>
      <MainFooter />
    </Fragment>
  );
};

export default Landing;
