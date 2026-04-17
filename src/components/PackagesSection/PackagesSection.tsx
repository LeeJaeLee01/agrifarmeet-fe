import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Spin } from 'antd';
import { TBox } from '../../types/TBox';
import { formatVND } from '../../utils/helper';
import {
  isExperienceBoxBySlug,
  isFlexibleBoxBySlug,
  isStandardBoxBySlug,
} from '../../utils/boxType';
import '../../pages/Landing/Landing.scss';

function isBasicOrFlexibleBox(box: TBox): boolean {
  const slug = box.slug;
  return isExperienceBoxBySlug(slug) || isFlexibleBoxBySlug(slug);
}

function splitFormattedVnd(formatted: string): { amount: string; vndSuffix: string } {
  if (formatted.endsWith(' VND')) {
    return { amount: formatted.slice(0, -4), vndSuffix: ' VND' };
  }
  return { amount: formatted, vndSuffix: '' };
}

const PACKAGE_BADGE_ICON = 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png';

export type PackagesSectionProps = {
  boxes: TBox[];
  loading?: boolean;
  sectionRef?: React.RefObject<HTMLElement | null>;
  titleRef?: React.RefObject<HTMLHeadingElement | null>;
  /** Landing dùng animation + opacity theo scroll; trang khác có thể bỏ. */
  titleVisible?: boolean;
  sectionId?: string;
  titleKey?: string;
  subtitleKey?: string;
  /** Landing: chữ hoa toàn bộ tiêu đề; trang /boxes: giữ dạng câu thường. */
  titleUppercase?: boolean;
};

function getBoxDisplay(box: TBox, t: (k: string) => string) {
  const includes = (box.includes ?? {}) as Record<string, string | number | undefined>;
  const audience = (includes.audience as string | undefined) || includes.serving_size;
  const meal_suggestion_per_week = includes.meal_suggestion_per_week as string | undefined;
  const isTrialBox = isExperienceBoxBySlug(box.slug);
  const descriptionText = box.description || t('landing.packageDescriptionFallback');
  const descriptionLines = descriptionText
    .split('.')
    .map((s) => s.trim())
    .filter(Boolean);
  const descriptionItems = [
    ...descriptionLines.map((line) => ({ line, negative: false })),
    ...(isTrialBox ? [{ line: t('landing.farmHelp'), negative: true }] : []),
  ];
  const comboLabel = isExperienceBoxBySlug(box.slug)
    ? '(Combo 1/4 tuần)'
    : isStandardBoxBySlug(box.slug) || isFlexibleBoxBySlug(box.slug)
      ? '(Combo 1/6/8 tuần)'
      : '';
  const total = `${includes.total} (${includes.box_weight})`;
  return { includes, audience, meal_suggestion_per_week, descriptionItems, comboLabel, total };
}

const PackagesSection: React.FC<PackagesSectionProps> = ({
  boxes,
  loading = false,
  sectionRef,
  titleRef,
  titleVisible = true,
  sectionId = 'landing-packages',
  titleKey = 'landing.packagesTitle',
  subtitleKey = 'landing.packagesSubtitle',
  titleUppercase = true,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const titleAnim = titleVisible ? 'animate-fade-in-up' : 'opacity-0';

  const renderPriceBlock = (box: TBox) => {
    const { amount, vndSuffix } = splitFormattedVnd(
      box.price ? formatVND(box.price) : formatVND(360000),
    );
    return (
      <h2 className="price-text">
        {isBasicOrFlexibleBox(box) ? (
          <span className="price-text__only">{t('landing.priceOnlyPrefix')}</span>
        ) : null}
        <span className="price-text__figures">
          <span className="price-text__amount">{amount}</span>
          <span className="price-text__vnd-suffix">
            {vndSuffix ? <span className="price-text__vnd">{vndSuffix}</span> : null}
            <span className="price-text__suffix">{t('landing.pricePerWeekSuffix')}</span>
          </span>
        </span>
      </h2>
    );
  };

  const renderMetaBadges = () => (
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
      <span className="price-meta-badge price-meta-badge--ship" title={t('landing.shippingByArea')}>
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
  );

  const renderPackageCard = (box: TBox, index: number) => {
    const { audience, meal_suggestion_per_week, descriptionItems, comboLabel, total } =
      getBoxDisplay(box, t);
    const showComboLine =
      isExperienceBoxBySlug(box.slug) ||
      isStandardBoxBySlug(box.slug) ||
      isFlexibleBoxBySlug(box.slug);

    return (
      <div className="package-card" style={{ animationDelay: `${0.2 * index}s` }}>
        <div className="package-header-badge">
          <img src={PACKAGE_BADGE_ICON} alt="" />
        </div>

        <div
          className="package-title-section"
          style={box.slug === 'goi-qua-tang' ? { marginBottom: 20, flexGrow: 0 } : undefined}
        >
          <h3>{box.name}</h3>
          <p
            className={`package-combo-line ${showComboLine ? '' : 'package-combo-line--placeholder'}`}
          >
            {comboLabel}
          </p>
          <ul className="package-description package-description--checklist">
            {box.slug === 'goi-qua-tang' ? (
              <>
                <li key={`${box.id}-gift-0`}>
                  <span className="package-description__check" aria-hidden="true">
                    ✓
                  </span>
                  <span className="package-description__text">
                    Hộp rau của chúng tôi là một món quà ý nghĩa và khác biệt dành tặng cho người
                    thân, bạn bè, đối tác hoặc phúc lợi cho nhân viên vào những dịp đặc biệt. Hộp
                    rau được đóng gói đẹp mắt, chỉn chu, mang nhiều ý nghĩa về sức khoẻ
                  </span>
                </li>
                <li key={`${box.id}-gift-1`}>
                  <span className="package-description__check" aria-hidden="true">
                    ✓
                  </span>
                  <span className="package-description__text">
                    Liên hệ với Farme để biết thêm chi tiết cũng như ưu đãi cho gói quà tặng
                  </span>
                </li>
              </>
            ) : (
              descriptionItems.map((item, i) => (
                <li key={`${box.id}-desc-${i}`}>
                  <span className="package-description__check" aria-hidden="true">
                    ✓
                  </span>
                  <span className="package-description__text">{item.line}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        {box.slug !== 'goi-qua-tang' && (
          <div className="package-price-section">
            {renderPriceBlock(box)}
            {renderMetaBadges()}
          </div>
        )}

        <div className="package-action">
          {box.slug === 'goi-qua-tang' ? (
            <a
              href="https://zalo.me/2768914139305378370"
              target="_blank"
              rel="noreferrer"
              className="select-button"
              style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}
            >
              {t('landing.contactUs')}
            </a>
          ) : (
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
          )}
        </div>

        {box.slug !== 'goi-qua-tang' && (
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
        )}
      </div>
    );
  };

  return (
    <section id={sectionId} ref={sectionRef} className="solutions-section">
      <div className="container">
        <h2 ref={titleRef} className={`section-title ${titleAnim}`}>
          {titleUppercase ? t(titleKey).toUpperCase() : t(titleKey)}
        </h2>
        <p className={`section-subtitle ${titleAnim}`} style={{ animationDelay: '0.2s' }}>
          {t(subtitleKey)}
        </p>

        {loading && boxes.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Spin size="large" tip={t('common.loadingBoxes')} />
          </div>
        ) : (
          <>
            <Swiper
              modules={[Navigation, Autoplay]}
              className="packages-swiper-mobile"
              navigation
              autoplay={{ delay: 3200, disableOnInteraction: false }}
              loop={boxes.length > 1}
              slidesPerView={1}
              spaceBetween={16}
            >
              {boxes.map((box, index) => (
                <SwiperSlide key={`mobile-${box.id}`}>{renderPackageCard(box, index)}</SwiperSlide>
              ))}
            </Swiper>

            <div className="packages-grid">
              {boxes.map((box, index) => (
                <Fragment key={box.id}>{renderPackageCard(box, index)}</Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PackagesSection;
