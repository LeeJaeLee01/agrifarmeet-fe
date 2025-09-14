import { Fragment, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Loading from './components/Loading/Loading';
import SpinnerAdmin from './components/Loading/SpinnerAdmin';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import AdminGuestRoute from './routes/AdminGuestRoute';
import { ConfigProvider, App as AntdApp } from 'antd';

// User pages
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Product = lazy(() => import('./pages/Product/Product'));
const FarmStand = lazy(() => import('./pages/FarmStand/FarmStand'));
const Purchase = lazy(() => import('./pages/Purchase/Purchase'));
const Order = lazy(() => import('./pages/Order/Order'));
const BoxDetails = lazy(() => import('./pages/BoxDetails/BoxDetails'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login/Login'));
const AdminCategories = lazy(() => import('./pages/admin/Categories/Categories'));
const AdminProducts = lazy(() => import('./pages/admin/Products/Products'));
const AdminBoxes = lazy(() => import('./pages/admin/Boxes/Boxes'));

function App() {
  return (
    <Fragment>
      <ConfigProvider>
        <AntdApp>
          <Routes>
            {/* Nhóm route User */}
            <Route
              element={
                <Suspense fallback={<Loading />}>
                  <MainLayout />
                </Suspense>
              }
            >
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
              <Route path="/product/:id" element={<Product />} />
              <Route path="/farm-stand" element={<FarmStand />} />
              <Route path="/purchase/:id" element={<Purchase />} />
              <Route path="/order" element={<Order />} />
              <Route path="/boxes/:id" element={<BoxDetails />} />
            </Route>

            {/* Nhóm route Admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Suspense fallback={<SpinnerAdmin />}>
                    <AdminLayout />
                  </Suspense>
                </AdminRoute>
              }
            >
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="boxes" element={<AdminBoxes />} />
            </Route>
            <Route
              path="/admin/login"
              element={
                <AdminGuestRoute>
                  <AdminLogin />
                </AdminGuestRoute>
              }
            />
          </Routes>
        </AntdApp>
      </ConfigProvider>
    </Fragment>
  );
}

export default App;
