import React, { Fragment, useEffect, useState, useRef } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
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
import { Modal, Button } from 'antd';
import { formatVND, getFirstCooperativeImageUrl, unwrapApiList } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';

/** Gói đăng ký cơ bản / linh hoạt (không trải nghiệm) — cùng heuristic với trang Purchase */
function isBasicOrFlexibleBox(box: TBox): boolean {
  const slug = String(box.slug || '').toLowerCase();
  const name = String(box.name || '').toLowerCase();
  const isTrial =
    slug.includes('trai-nghiem') ||
    name.includes('trải nghiệm') ||
    name.includes('trai nghiem') ||
    name.includes('thử nghiệm') ||
    name.includes('thu nghiem');
  if (isTrial) return false;
  const hasBasic =
    slug.includes('co-ban') ||
    slug.includes('co_ban') ||
    slug.includes('coban') ||
    name.includes('cơ bản') ||
    name.includes('co ban');
  const hasFlexible =
    slug.includes('linh-hoat') ||
    slug.includes('linh_hoat') ||
    slug.includes('linhhoat') ||
    name.includes('linh hoạt') ||
    name.includes('linh hoat');
  return hasBasic || hasFlexible;
}

/** Tách "1.234.567" và " VND" từ chuỗi formatVND để tô màu giống nhau */
function splitFormattedVnd(formatted: string): { amount: string; vndSuffix: string } {
  if (formatted.endsWith(' VND')) {
    return { amount: formatted.slice(0, -4), vndSuffix: ' VND' };
  }
  return { amount: formatted, vndSuffix: '' };
}

const Landing: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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
  const weeklyRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const partnersGridRef = useRef<HTMLDivElement | null>(null);
  const reviewsGridRef = useRef<HTMLDivElement | null>(null);
  const customerReviewRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const [showHeroScrollHint, setShowHeroScrollHint] = useState(true);

  const scrollToPackagesSection = () => {
    solutionsRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    if (window.location.hash !== '#landing-packages') return;
    const timer = window.setTimeout(() => {
      solutionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchWeeklyProducts = async () => {
      try {
        const res = await api.get('/products/weekly');
        const rawData = res.data as any;
        const productsData = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData.data)
            ? rawData.data
            : rawData.data
              ? [rawData.data]
              : [];
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
            loop={true}
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
        <button
          type="button"
          className={`hero-scroll-hint ${showHeroScrollHint ? '' : 'is-hidden'}`}
          onClick={scrollToPackagesSection}
          aria-label={t('landing.details')}
        >
          <span className="hero-scroll-hint__text">{t('landing.details')}</span>
          <DownOutlined className="hero-scroll-hint__icon" />
        </button>

        {/* How FARME Solves It Section */}
        <section id="landing-packages" ref={solutionsRef} className="solutions-section">
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

            <Swiper
              modules={[Navigation, Autoplay]}
              className="packages-swiper-mobile"
              navigation
              autoplay={{ delay: 3200, disableOnInteraction: false }}
              loop={boxes.length > 1}
              slidesPerView={1}
              spaceBetween={16}
            >
              {boxes.map((box, index) => {
                const includes = box.includes as Record<string, string | number | undefined>;
                const audience =
                  (includes.audience as string | undefined) || box.includes.serving_size;
                const meal_suggestion_per_week = includes.meal_suggestion_per_week as string | undefined;
                const isTrialBox =
                  box.slug?.toLowerCase().includes('trai-nghiem') ||
                  box.name?.toLowerCase().includes('trải nghiệm') ||
                  box.name?.toLowerCase().includes('trai nghiem');
                const descriptionText = box.description || t('landing.packageDescriptionFallback');
                const descriptionLines = descriptionText
                  .split('.')
                  .map(s => s.trim())
                  .filter(Boolean);
                const descriptionItems = [
                  ...descriptionLines.map(line => ({ line, negative: false })),
                  ...(isTrialBox
                    ? [
                        { line: t('landing.farmHelp'), negative: true },
                        // { line: t('landing.trialNoExtraVegetables'), negative: true },
                      ]
                    : []),
                ];
                const total = `${includes.total} (${includes.box_weight})`;

                return (
                  <SwiperSlide key={`mobile-${box.id}`}>
                    <div className="package-card" style={{ animationDelay: `${0.2 * index}s` }}>
                      <div className="package-header-badge">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/2917/2917995.png"
                          alt="icon"
                        />
                      </div>

                      <div className="package-title-section">
                        <h3>{box.name}</h3>
                        <ul className="package-description package-description--checklist">
                          {descriptionItems.map((item, i) => (
                            <li key={`${box.id}-desc-mobile-${i}`}>
                              <span className="package-description__check" aria-hidden="true">
                                ✓
                              </span>
                              <span className="package-description__text">{item.line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="package-price-section">
                        <h2 className="price-text">
                          {(() => {
                            const { amount, vndSuffix } = splitFormattedVnd(
                              box.price ? formatVND(box.price) : formatVND(360000)
                            );
                            return (
                              <>
                                {isBasicOrFlexibleBox(box) ? (
                                  <span className="price-text__only">{t('landing.priceOnlyPrefix')}</span>
                                ) : null}
                                <span className="price-text__figures">
                                  <span className="price-text__amount">{amount}</span>
                                  <span className="price-text__vnd-suffix">
                                    {vndSuffix ? (
                                      <span className="price-text__vnd">{vndSuffix}</span>
                                    ) : null}
                                    <span className="price-text__suffix">{t('landing.pricePerWeekSuffix')}</span>
                                  </span>
                                </span>
                              </>
                            );
                          })()}
                        </h2>
                        <div className="price-meta-badges" role="note">
                          <span
                            className="price-meta-badge price-meta-badge--vat"
                            title={t('landing.vatIncludedTitle')}
                          >
                            <span className="price-meta-badge__glyph" aria-hidden="true">
                              ✓
                            </span>
                            <span className="price-meta-badge__text">{t('landing.vatIncluded')}</span>
                          </span>
                          <span
                            className="price-meta-badge price-meta-badge--ship"
                            title={t('landing.shippingByArea')}
                          >
                            <span className="price-meta-badge__glyph" aria-hidden="true">
                              🚚
                            </span>
                            <span className="price-meta-badge__text price-meta-badge__text--ship">
                              <span className="price-meta-badge__strong">{t('landing.freeShip')}</span>
                              <span className="price-meta-badge__sep" aria-hidden="true">
                                ·
                              </span>
                              <span className="price-meta-badge__sub">{t('landing.freeDelivery')}</span>
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="package-action">
                        <button
                          type="button"
                          className="select-button"
                          onClick={() => {
                            if (box.slug) {
                              navigate(`/purchase/${box.slug}`);
                            } else {
                              navigate('/boxes');
                            }
                          }}
                        >
                          {t('landing.selectProduct')}
                        </button>
                      </div>

                      <div className="package-features-list">
                        <h4>{t('landing.packageIncludes')}:</h4>
                        <ul>
                          <li>
                            <span className="icon">👥</span> {audience}
                          </li>
                          <li>
                            <span className="icon">🕐</span> {meal_suggestion_per_week}
                          </li>
                          <li>
                            <span className="icon">🥬</span> {total}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="packages-grid">
              {boxes.map((box, index) => {
                const includes = box.includes as Record<string, string | number | undefined>;
                const audience =
                  (includes.audience as string | undefined) || box.includes.serving_size;
                const meal_suggestion_per_week = includes.meal_suggestion_per_week as string | undefined;
                const isTrialBox =
                  box.slug?.toLowerCase().includes('trai-nghiem') ||
                  box.name?.toLowerCase().includes('trải nghiệm') ||
                  box.name?.toLowerCase().includes('trai nghiem');
                const descriptionText = box.description || t('landing.packageDescriptionFallback');
                const descriptionLines = descriptionText
                  .split('.')
                  .map(s => s.trim())
                  .filter(Boolean);
                const descriptionItems = [
                  ...descriptionLines.map(line => ({ line, negative: false })),
                  ...(isTrialBox
                    ? [
                        { line: t('landing.farmHelp'), negative: true },
                        // { line: t('landing.trialNoExtraVegetables'), negative: true },
                      ]
                    : []),
                ];
                const total = `${includes.total} (${includes.box_weight})`;

                return (
                  <div key={box.id} className="package-card" style={{ animationDelay: `${0.2 * index}s` }}>
                    <div className="package-header-badge">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2917/2917995.png"
                        alt="icon"
                      />
                    </div>

                    <div className="package-title-section">
                      <h3>{box.name}</h3>
                      <ul className="package-description package-description--checklist">
                        {descriptionItems.map((item, i) => (
                          <li key={`${box.id}-desc-${i}`}>
                            <span className="package-description__check" aria-hidden="true">
                              ✓
                            </span>
                            <span className="package-description__text">{item.line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="package-price-section">
                      <h2 className="price-text">
                        {(() => {
                          const { amount, vndSuffix } = splitFormattedVnd(
                            box.price ? formatVND(box.price) : formatVND(360000)
                          );
                          return (
                            <>
                              {isBasicOrFlexibleBox(box) ? (
                                <span className="price-text__only">{t('landing.priceOnlyPrefix')}</span>
                              ) : null}
                              <span className="price-text__figures">
                                <span className="price-text__amount">{amount}</span>
                                <span className="price-text__vnd-suffix">
                                  {vndSuffix ? (
                                    <span className="price-text__vnd">{vndSuffix}</span>
                                  ) : null}
                                  <span className="price-text__suffix">{t('landing.pricePerWeekSuffix')}</span>
                                </span>
                              </span>
                            </>
                          );
                        })()}
                      </h2>
                      <div className="price-meta-badges" role="note">
                        <span
                          className="price-meta-badge price-meta-badge--vat"
                          title={t('landing.vatIncludedTitle')}
                        >
                          <span className="price-meta-badge__glyph" aria-hidden="true">
                            ✓
                          </span>
                          <span className="price-meta-badge__text">{t('landing.vatIncluded')}</span>
                        </span>
                        <span
                          className="price-meta-badge price-meta-badge--ship"
                          title={t('landing.shippingByArea')}
                        >
                          <span className="price-meta-badge__glyph" aria-hidden="true">
                            🚚
                          </span>
                          <span className="price-meta-badge__text price-meta-badge__text--ship">
                            <span className="price-meta-badge__strong">{t('landing.freeShip')}</span>
                            <span className="price-meta-badge__sep" aria-hidden="true">
                              ·
                            </span>
                            <span className="price-meta-badge__sub">{t('landing.freeDelivery')}</span>
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="package-action">
                      <button
                        type="button"
                        className="select-button"
                        onClick={() => {
                          if (box.slug) {
                            navigate(`/purchase/${box.slug}`);
                          } else {
                            navigate('/boxes');
                          }
                        }}
                      >
                        {t('landing.selectProduct')}
                      </button>
                    </div>

                    <div className="package-features-list">
                      <h4>{t('landing.packageIncludes')}:</h4>
                      <ul>
                        <li>
                          <span className="icon">👥</span> {audience}
                        </li>
                        <li>
                          <span className="icon">🕐</span> {meal_suggestion_per_week}
                        </li>
                        <li>
                          <span className="icon">🥬</span> {total}
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Weekly Products Section */}
        {/* <section ref={weeklyRef} className="weekly-products-section">
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
                        src={
                          (Array.isArray(product.images)
                            ? product.images[0]
                            : product.images
                              ? JSON.parse(product.images || '[]')[0]
                              : product.image) || farmerImageUrl
                        }
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
        </section> */}

        {/* Partners Section */}
        <section ref={partnersRef} className="partners-section">
          <div className="container">
            <h2
              className={`section-title ${isPartnersVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
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
                        <div className="review-photo-placeholder">{t('landing.noFeedbackImage')}</div>
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
              destroyOnClose
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
                            i < Number(selectedFeedback?.__rating ?? 0) ? 'star star-filled' : 'star'
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
                              i18n.language === 'vi' ? 'vi-VN' : 'en-US'
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
