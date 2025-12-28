import { Fragment, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Loading from './components/Loading/Loading';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './routes/AdminRoute';
import AdminGuestRoute from './routes/AdminGuestRoute';
import { ConfigProvider, App as AntdApp } from 'antd';
import PaymentReturn from './pages/Purchase/PaymentReturn';
import ShipperRoute from './routes/ShipperRoute';
import ShipperLayout from './layouts/ShipperLayout';

// User pages
const Landing = lazy(() => import('./pages/Landing/Landing'));
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));
const SignUp = lazy(() => import('./pages/SignUp/SignUp'));
// const Cart = lazy(() => import('./pages/Cart/Cart'));
const Product = lazy(() => import('./pages/Product/Product'));
// const FarmStand = lazy(() => import('./pages/FarmStand/FarmStand'));
const Purchase = lazy(() => import('./pages/Purchase/Purchase'));
const Order = lazy(() => import('./pages/Order/Order'));
const BoxDetails = lazy(() => import('./pages/BoxDetails/BoxDetails'));
const Boxes = lazy(() => import('./pages/Boxes/Boxes'));
const Shipping = lazy(() => import('./pages/Shipping/Shipping'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users/Users'));
const AdminCategories = lazy(() => import('./pages/admin/Categories/Categories'));
const AdminProducts = lazy(() => import('./pages/admin/Products/Products'));
const AdminBoxes = lazy(() => import('./pages/admin/Boxes/Boxes'));
const AdminShipping = lazy(() => import('./pages/admin/Shipping/Shipping'));
const AdminShippers = lazy(() => import('./pages/admin/Shippers/Shippers'));

// Shipper
const Shipper = lazy(() => import('./pages/Shipper/Shipper'));

function App() {
  return (
    <Fragment>
      <ConfigProvider>
        <AntdApp>
          <Routes>
            {/* Landing page - no layout */}
            <Route
              path="/"
              element={
                <Suspense fallback={<Loading />}>
                  <Landing />
                </Suspense>
              }
            />

            {/* Nhóm route User */}
            <Route
              element={
                <Suspense fallback={<Loading />}>
                  <MainLayout />
                </Suspense>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/product/:id" element={<Product />} />
              {/* <Route
                path="/farm-stand"
                element={
                  <PrivateRoute>
                    <FarmStand />
                  </PrivateRoute>
                }
              /> */}
              <Route path="/purchase/:id" element={<Purchase />} />
              <Route path="/order" element={<Order />} />
              <Route path="/boxes" element={<Boxes />} />
              <Route path="/boxes/:id" element={<BoxDetails />} />
              <Route path="/payment/return" element={<PaymentReturn />} />
              <Route path="/shipping" element={<Shipping />} />
            </Route>

            {/* Nhóm route Admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Suspense fallback={<Loading />}>
                    <AdminLayout />
                  </Suspense>
                </AdminRoute>
              }
            >
              <Route path="" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="boxes" element={<AdminBoxes />} />
              <Route path="shippings" element={<AdminShipping />} />
              <Route path="shippers" element={<AdminShippers />} />
            </Route>
            <Route
              path="/admin/login"
              element={
                <AdminGuestRoute>
                  <AdminLogin />
                </AdminGuestRoute>
              }
            />
            <Route
              path="/shipper"
              element={
                <ShipperRoute>
                  <Suspense fallback={<Loading />}>
                    <ShipperLayout />
                  </Suspense>
                </ShipperRoute>
              }
            >
              <Route path="" element={<Shipper />} />
            </Route>
          </Routes>
        </AntdApp>
      </ConfigProvider>
    </Fragment>
  );
}

export default App;
