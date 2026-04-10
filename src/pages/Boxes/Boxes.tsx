import React, { Fragment, useEffect, useState } from 'react';
import { TBox } from '../../types/TBox';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { unwrapApiList } from '../../utils/helper';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { useTitle } from '../../hooks/useTitle';
import { useTranslation } from 'react-i18next';
import PackagesSection from '../../components/PackagesSection/PackagesSection';

const Boxes: React.FC = () => {
  const { t } = useTranslation();
  useTitle(t('common.allBoxes'));

  const [boxes, setBoxes] = useState<TBox[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      <div className="landing-page pt-4 pb-12 md:pt-6">
        <PackagesSection
          boxes={boxes}
          loading={loading}
          sectionId="boxes-packages"
          titleKey="common.chooseBoxForYou"
          subtitleKey="common.chooseBoxForYouDesc"
          titleUppercase={false}
        />
      </div>
      <MainFooter />
    </Fragment>
  );
};

export default Boxes;
