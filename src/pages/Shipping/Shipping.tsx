import React, { Fragment, useState } from 'react';
import Section from '../../components/Section/Section';
import MainHeader from '../../components/MainHeader/MainHeader';
import MainFooter from '../../components/MainFooter/MainFooter';
import { TShipping } from '../../types/TShipping';

const Shipping: React.FC = () => {
  const [shipping, setShipping] = useState<TShipping[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Fragment>
      <MainHeader sticky />
      <Section spaceBottom>
        <div className="container mx-auto">
          <h1 className="section-title">Giao hàng</h1>
          <div className=""></div>
        </div>
      </Section>
      <MainFooter />
    </Fragment>
  );
};

export default Shipping;
