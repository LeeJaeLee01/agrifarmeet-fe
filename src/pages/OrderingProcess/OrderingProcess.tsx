import React, { Fragment } from 'react';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { useTitle } from '../../hooks/useTitle';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const STEPS = [
  { key: 'step1', icon: '📦' },
  { key: 'step2', icon: '📋' },
  { key: 'step3', icon: '🌿' },
  { key: 'step4', icon: '🏠' },
] as const;

const OrderingProcess: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('orderingProcess.pageTitle'));

  return (
    <Fragment>
      <MainHeader sticky />

      <div className="min-h-screen bg-white text-text1 font-sans">
        <section className="pt-6 pb-16 px-6 lg:pb-24 lg:px-20">
          <div className="container px-20">
            {/* Header — nền xanh đậm */}
            <div className="rounded-2xl border border-[#0f291e] bg-[#32753A] px-6 py-10 md:px-12 md:py-12 text-center mb-10 shadow-md">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-3 leading-[1.1]">
                {t('orderingProcess.pageTitle')}
              </h1>
              <p className="text-lg md:text-xl text-[#c8e6c9] font-medium">
                {t('orderingProcess.tagline')}
              </p>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-center text-[#1b4332] mb-2">
              {t('orderingProcess.sectionTitle')}
            </h2>
            <p className="text-center text-text2 text-base md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('orderingProcess.intro')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {STEPS.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className="w-full max-w-[76px] sm:max-w-[84px] aspect-square rounded-lg bg-[#32753A] flex items-center justify-center p-0 shadow-sm mb-3 overflow-hidden"
                    aria-hidden
                  >
                    <span className="text-[1.75rem] sm:text-[2rem] leading-none block">
                      {step.icon}
                    </span>
                  </div>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#1b4332] mb-2 leading-tight px-1 min-[1280px]:whitespace-nowrap">
                    {index + 1}. {t(`orderingProcess.${step.key}Title`)}
                  </span>
                  {step.key === 'step1' ? (
                    <p className="text-text2 text-sm md:text-[15px] leading-relaxed text-justify sm:text-center">
                      {t('orderingProcess.step1BodyBefore')}
                      <Link to="/boxes" className="text-[#2d6a4f] font-semibold underline-offset-2 hover:underline">
                        {t('orderingProcess.step1Website')}
                      </Link>
                      {t('orderingProcess.step1BodyMiddle')}
                      <a href="tel:0981817189" className="text-[#2d6a4f] font-semibold whitespace-nowrap">
                        0981817189
                      </a>
                      {t('orderingProcess.step1BodyAfter')}
                    </p>
                  ) : (
                    <p className="text-text2 text-sm md:text-[15px] leading-relaxed text-justify sm:text-center">
                      {t(`orderingProcess.${step.key}Body`)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <MainFooter />
    </Fragment>
  );
};

export default OrderingProcess;
