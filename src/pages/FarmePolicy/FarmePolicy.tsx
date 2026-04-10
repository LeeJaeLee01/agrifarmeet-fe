import React, { Fragment } from 'react';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { useTitle } from '../../hooks/useTitle';
import { useTranslation } from 'react-i18next';

type PolicyBlock = {
  num: string;
  titleKey: string;
  noteKey?: string;
  bodyKeys: string[];
};

const POLICY_BLOCKS: PolicyBlock[] = [
  {
    num: '01',
    titleKey: 'farmePolicy.section1Title',
    noteKey: 'farmePolicy.section1Note',
    bodyKeys: ['farmePolicy.section1P1', 'farmePolicy.section1P2'],
  },
  {
    num: '02',
    titleKey: 'farmePolicy.section2Title',
    bodyKeys: ['farmePolicy.section2P1', 'farmePolicy.section2P2'],
  },
  {
    num: '03',
    titleKey: 'farmePolicy.section3Title',
    bodyKeys: ['farmePolicy.section3P1'],
  },
  {
    num: '04',
    titleKey: 'farmePolicy.section4Title',
    bodyKeys: ['farmePolicy.section4P1'],
  },
];

const FarmePolicy: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('farmePolicy.pageTitle'));

  return (
    <Fragment>
      <MainHeader sticky />

      <div className="min-h-screen bg-white text-text1 font-sans">
        <section className="pt-6 pb-16 px-6 lg:pb-24 lg:px-20">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-[#1b4332] mb-3">
              {t('farmePolicy.heroTitle')}
            </h1>
            <div className="flex gap-2 w-full max-w-md mb-10 md:mb-12">
              <span className="h-1 flex-1 rounded-full bg-[#2d6a4f]" />
              <span className="h-1 flex-1 rounded-full bg-[#7c3aed]" />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-0">
              <div className="w-full lg:w-[34%] shrink-0">
                <div className="rounded-2xl overflow-hidden border border-[#d8f3dc] shadow-md h-full min-h-[260px] lg:min-h-[420px] bg-[#f0f8f4]">
                  <img
                    src="/DSC06501.jpg"
                    alt=""
                    className="w-full h-full min-h-[260px] lg:min-h-[420px] object-cover"
                  />
                </div>
              </div>

              <div
                className="hidden lg:flex w-10 xl:w-12 shrink-0 flex-col items-center justify-center relative self-stretch"
                aria-hidden
              >
                <div className="absolute top-8 bottom-8 left-1/2 w-px -translate-x-1/2 bg-[#2d6a4f]/35" />
              </div>

              <div className="flex-1 min-w-0 space-y-10 lg:space-y-12 lg:pl-2 border-t border-[#e5e7eb] pt-10 lg:border-t-0 lg:pt-0">
                {POLICY_BLOCKS.map((block) => (
                  <div key={block.num} className="flex gap-4 sm:gap-5">
                    <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-xs sm:text-sm font-bold tracking-tight">
                      {block.num}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-bold text-[#1b4332] mb-1 leading-snug">
                        {t(block.titleKey)}
                      </h2>
                      {block.noteKey ? (
                        <p className="text-sm sm:text-[15px] text-text2 italic mb-3">{t(block.noteKey)}</p>
                      ) : null}
                      <div className="space-y-3 text-text2 text-[15px] sm:text-base leading-relaxed text-justify">
                        {block.bodyKeys.map((key) => (
                          <p key={key}>{t(key)}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <MainFooter />
    </Fragment>
  );
};

export default FarmePolicy;
