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
              </Route>
            </Routes>
          </Suspense>
        </AntdApp>
      </ConfigProvider>
    </Fragment>
  );
}

export default App;
