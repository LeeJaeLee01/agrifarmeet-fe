import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader/MainHeader';
import MainFooter from '../components/MainFooter/MainFooter';
import './MainLayout.scss';

const MainLayout: React.FC = () => {
  return (
    <Fragment>
      <MainHeader />
      <main className="page-height">
        <Outlet />
      </main>
      {/* <MainFooter /> */}
    </Fragment>
  );
};

export default MainLayout;
