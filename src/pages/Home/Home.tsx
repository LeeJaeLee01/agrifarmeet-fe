import React, { Fragment } from 'react';
import { Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { NavLink } from 'react-router-dom';
import { menu } from '../../utils/constants';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <Fragment>
      <Header className="header">
        <div className="logo">
          <NavLink to="/">
            <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
          </NavLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Menu
            mode="horizontal"
            selectable={false}
            style={{ borderBottom: 'none', background: 'transparent' }}
            items={menu.map((item) => ({
              key: item.path,
              label: (
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    color: isActive ? '#2f751d' : 'inherit',
                    fontWeight: isActive ? 600 : 'normal',
                    fontSize: 16,
                    paddingBottom: 4,
                  })}
                >
                  {item.title}
                </NavLink>
              ),
            }))}
          />
        </div>
      </Header>
    </Fragment>
  );
};

export default Home;
