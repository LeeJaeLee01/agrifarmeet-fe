import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from '../components/MainHeader/MainHeader';
import './MainLayout.scss';

const MainLayout: React.FC = () => {
  return (
    <Fragment>
      <MainHeader />
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
};

export default MainLayout;
