import { Fragment, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Loading from './components/Loading/Loading';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './routes/PrivateRoute';
import { ConfigProvider, App as AntdApp } from 'antd';

const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Products = lazy(() => import('./pages/ProductList/ProductList'));
const Product = lazy(() => import('./pages/Product/Product'));
const FarmStand = lazy(() => import('./pages/FarmStand/FarmStand'));
const Purchase = lazy(() => import('./pages/Purchase/Purchase'));
const Order = lazy(() => import('./pages/Order/Order'));
const BoxDetails = lazy(() => import('./pages/BoxDetails/BoxDetails'));

function App() {
  return (
    <Fragment>
      <ConfigProvider>
        <AntdApp>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/farm-stand" element={<FarmStand />} />
                <Route path="/purchase/:id" element={<Purchase />} />
                <Route path="/order/" element={<Order />} />
                <Route path="/boxes/:id" element={<BoxDetails />} />
              </Route>
            </Routes>
          </Suspense>
        </AntdApp>
      </ConfigProvider>
    </Fragment>
  );
}

export default App;
