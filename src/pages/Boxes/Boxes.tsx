import React, { Fragment, useEffect, useState } from 'react';
import Section from '../../components/Section/Section';
import { TBox } from '../../types/TBox';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  QrcodeOutlined,
  TruckOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { formatVND, unwrapApiList } from '../../utils/helper';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedBoxId } from '../../store/slices/boxSlice';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { Spin } from 'antd';
import { useTitle } from '../../hooks/useTitle';
import { useTranslation } from 'react-i18next';
import './Boxes.scss';

const Boxes: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('common.allBoxes'));

  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        setLoading(true);
        const res = await api.get('/boxes');
        setBoxes(unwrapApiList<TBox>(res.data));
      } catch (err) {
        console.error('Error fetching boxes:', err);
        toast.error(t('common.errorLoadingBoxes'));
      } finally {
        setLoading(false);
      }
    };
    fetchBoxes();
  }, [t]);

  return (
    <Fragment>
      <MainHeader sticky />

      <Section>
        <h2 className="max-w-4xl mx-auto mb-0 text-4xl font-semibold tracking-tight text-center text-balance sm:text-5xl">
          {t('common.chooseBoxForYou')}
        </h2>
        <p className="max-w-4xl mx-auto mt-6 mb-0 text-base font-medium text-center text-text3 text-pretty sm:text-lg/8">
          {t('common.chooseBoxForYouDesc')}
        </p>
        <div className="boxes-page grid items-center grid-cols-1 gap-5 mx-auto my-16 gap-y-6 sm:mt-20 lg:grid-cols-3">
          {loading ? (
            <div className="flex items-center justify-center col-span-3 py-20">
              <Spin size="large" tip={t('common.loadingBoxes')} />
            </div>
          ) : (
            boxes.map((box) => {
              const isTrialBox =
                box.slug?.toLowerCase().includes('trai-nghiem') ||
                box.name?.toLowerCase().includes('trải nghiệm') ||
                box.name?.toLowerCase().includes('trai nghiem');
              const descriptionText = box.description || t('landing.packageDescriptionFallback');
              const descriptionLines = descriptionText
                .split('.')
                .map((s: string) => s.trim())
                .filter(Boolean);
              const descriptionItems = [
                ...descriptionLines.map((line) => ({ line, negative: false })),
                ...(isTrialBox
                  ? [
                      { line: t('landing.trialNoFlexibleSelect'), negative: true },
                      { line: t('landing.trialNoExtraVegetables'), negative: true },
                    ]
                  : []),
              ];

              return (
                <div
                  key={box.id}
                  className="flex flex-col justify-between h-full p-8 bg-white border sm:p-10 rounded-3xl border-gray-border"
                >
                  <Link to={`/boxes/${box.id}`} className="hover:text-inherit">
                    <div className="flex items-start justify-between">
                      <p className="m-0 font-semibold text-base/7 text-orange line-clamp-2">
                        {box.name}
                      </p>
                    </div>
                    <ul className="m-0 mt-4 space-y-2 text-sm/6 text-text2 list-none p-0">
                      {descriptionItems.map((item, idx) => (
                        <li key={`${box.id}-desc-${idx}`} className="flex items-start gap-2">
                          <span
                            className={`inline-flex items-center justify-center flex-none w-5 h-5 rounded-full font-bold ${
                              item.negative
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                            aria-hidden="true"
                          >
                            {item.negative ? '✗' : '✓'}
                          </span>
                          <span>{item.line}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="package-price-section mt-6">
                      <h2 className="price-text">
                        {box.price ? formatVND(box.price) : formatVND(360000)}
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

                    <ul className="m-0 mt-8 space-y-3 text-sm/6">
                      <li className="flex gap-x-3">
                        <CheckCircleOutlined
                          aria-hidden="true"
                          className="flex-none w-5 h-6 text-orange"
                        />
                        {t('common.weight')}:{' '}
                        {box.includes?.serving_size ?? box.includes?.audience ?? '—'}
                      </li>
                      <li className="flex gap-x-3">
                        <CheckCircleOutlined
                          aria-hidden="true"
                          className="flex-none w-5 h-6 text-orange"
                        />
                        {t('common.includes')}{' '}
                        {box.includes?.product_count ?? '—'} {t('common.products')}
                      </li>
                      <li className="flex gap-x-3">
                        <CheckCircleOutlined
                          aria-hidden="true"
                          className="flex-none w-5 h-6 text-orange"
                        />
                        {t('common.customize')}
                      </li>
                    </ul>
                  </Link>

                  <Link to={`/purchase/${box.slug}`}>
                    <button
                      className="w-full bg-green2 text-white mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
                      onClick={() => dispatch(setSelectedBoxId(box.id))}
                    >
                      {t('common.buyNow')}
                    </button>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </Section>
      <MainFooter />
    </Fragment>
  );
};

export default Boxes;
