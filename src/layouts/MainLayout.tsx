import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader/MainHeader';
import MainFooter from '../components/MainFooter/MainFooter';
import './MainLayout.scss';

const MainLayout: React.FC = () => {
  return (
    <Fragment>
      <MainHeader />
      <main>
        <Outlet />
      </main>
      <MainFooter />
    </Fragment>
  );
};

export default MainLayout;
