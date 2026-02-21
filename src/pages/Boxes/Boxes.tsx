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
import { formatVND, formatWeight } from '../../utils/helper';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedBoxId } from '../../store/slices/boxSlice';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { Spin } from 'antd';
import { useTitle } from '../../hooks/useTitle';
import { useTranslation } from 'react-i18next';

const Boxes: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('common.allBoxes'));

  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    api
      .get<TBox[]>('/boxes')
      .then((res) => {
        const rawData = res.data as any;
        const boxesData = Array.isArray(rawData)
          ? rawData
          : (Array.isArray(rawData.data)
            ? rawData.data
            : (rawData.data ? [rawData.data] : []));
        setBoxes(boxesData);
      })
      .catch((err) => {
        toast.error(t('common.errorLoadingBoxes'));
        console.error('Error fetching boxes:', err);
      })
      .finally(() => setLoading(false));
  }, []);

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
        <div className="grid items-center grid-cols-1 gap-5 mx-auto mt-16 gap-y-6 sm:mt-20 lg:grid-cols-3">
          {loading ? (
            <div className="flex items-center justify-center col-span-3 py-20">
              <Spin size="large" tip={t('common.loadingBoxes')} />
            </div>
          ) : (
            boxes.map((box) => (
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
                  <p className="m-0 mt-4 text-sm/6 text-text2">{box.description}</p>
                  <p className="flex items-baseline m-0 mt-6 gap-x-2">
                    <span className="text-4xl font-semibold tracking-tight">
                      {formatVND(box.price)}
                    </span>
                    <span className="text-sm">/ {box.includes.duration_text}</span>
                  </p>

                  <ul role="list" className="m-0 mt-8 space-y-3 text-sm/6">
                    <li className="flex gap-x-3">
                      <CheckCircleOutlined
                        aria-hidden="true"
                        className="flex-none w-5 h-6 text-orange"
                      />
                      {t('common.weight')}: {box.includes.serving_size}
                    </li>
                    <li className="flex gap-x-3">
                      <CheckCircleOutlined
                        aria-hidden="true"
                        className="flex-none w-5 h-6 text-orange"
                      />
                      {t('common.includes')} {box.includes.product_count} {t('common.products')}
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
            ))
          )}
        </div>
      </Section>

      <Section spaceBottom>
        <h2 className="max-w-4xl mx-auto mt-2 mb-0 text-4xl font-semibold tracking-tight text-center text-balance sm:text-5xl">
          {t('common.whyCSADifferent')}
        </h2>
        <p className="max-w-4xl mx-auto mt-6 mb-0 text-base font-medium text-center text-text3 text-pretty sm:text-lg/8">
          {t('common.whyCSADifferentDesc')}
        </p>
        <div className="grid items-center max-w-4xl grid-cols-1 mx-auto mt-16 gap-y-10 gap-x-8 sm:mt-20 lg:grid-cols-2">
          <div className="flex gap-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green2">
              <CalendarOutlined className="text-xl text-center text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base/7">{t('common.seasonalBox')}</p>
              <p className="mt-2 mb-0 text-text2 text-base/7">
                {t('common.seasonalBoxDesc')}
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green2">
              <QrcodeOutlined className="text-xl text-center text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base/7">{t('common.qrTraceability')}</p>
              <p className="mt-2 mb-0 text-text2 text-base/7">
                {t('common.qrTraceabilityDesc')}
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green2">
              <VideoCameraOutlined className="text-xl text-center text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base/7">{t('common.livestreamFarmTour')}</p>
              <p className="mt-2 mb-0 text-text2 text-base/7">
                {t('common.livestreamFarmTourDesc')}
              </p>
            </div>
          </div>

          <div className="flex gap-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green2">
              <TruckOutlined className="text-xl text-center text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base/7">{t('common.periodicDelivery')}</p>
              <p className="mt-2 mb-0 text-text2 text-base/7">
                {t('common.periodicDeliveryDesc')}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <MainFooter />
    </Fragment>
  );
};

export default Boxes;
