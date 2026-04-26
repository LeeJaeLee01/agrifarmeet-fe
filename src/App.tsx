import { Fragment, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Loading from './components/Loading/Loading';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './routes/AdminRoute';
import AdminGuestRoute from './routes/AdminGuestRoute';
import { ConfigProvider, App as AntdApp } from 'antd';
import PaymentReturn from './pages/Purchase/PaymentReturn';
import ShipperLayout from './layouts/ShipperLayout';
import MessengerFloatingButton from './components/MessengerFloatingButton/MessengerFloatingButton';

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
const OrderLookup = lazy(() => import('./pages/OrderLookup/OrderLookup'));
const BoxDetails = lazy(() => import('./pages/BoxDetails/BoxDetails'));
const Boxes = lazy(() => import('./pages/Boxes/Boxes'));
const Introduce = lazy(() => import('./pages/Introduce/Introduce'));
const OrderingProcess = lazy(() => import('./pages/OrderingProcess/OrderingProcess'));
const FarmePolicy = lazy(() => import('./pages/FarmePolicy/FarmePolicy'));
const Shipping = lazy(() => import('./pages/Shipping/Shipping'));
const News = lazy(() => import('./pages/News/News'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const WeeklyMenu = lazy(() => import('./pages/WeeklyMenu/WeeklyMenu'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users/Users'));
const AdminCategories = lazy(() => import('./pages/admin/Categories/Categories'));
const AdminProducts = lazy(() => import('./pages/admin/Products/Products'));
const AdminBoxes = lazy(() => import('./pages/admin/Boxes/Boxes'));
const AdminBoxVegetables = lazy(() => import('./pages/admin/BoxVegetables/BoxVegetables'));
const AdminExperienceWeekly = lazy(() => import('./pages/admin/ExperienceWeekly/ExperienceWeekly'));
const AdminWeeklyMenu = lazy(() => import('./pages/admin/WeeklyMenuAdmin/WeeklyMenuAdmin'));
const AdminFeedbacks = lazy(() => import('./pages/admin/FeedbacksAdmin/FeedbacksAdmin'));
const AdminUserBoxes = lazy(() => import('./pages/admin/UserBoxes/UserBoxes'));
const AdminShipping = lazy(() => import('./pages/admin/Shipping/Shipping'));
const AdminShippers = lazy(() => import('./pages/admin/Shippers/Shippers'));
const AdminNews = lazy(() => import('./pages/admin/NewsAdmin/NewsAdmin'));

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
              {/* <Route path="/home" element={<Home />} /> */}
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
              <Route path="/purchase/:slug" element={<Purchase />} />
              <Route path="/order" element={<Order />} />
              <Route path="/order-lookup" element={<OrderLookup />} />
              <Route path="/introduce" element={<Introduce />} />
              <Route path="/quy-trinh-dat-hang" element={<OrderingProcess />} />
              <Route path="/chinh-sach" element={<FarmePolicy />} />
              <Route path="/news" element={<News />} />
              <Route path="/boxes" element={<Boxes />} />
              <Route path="/boxes/:id" element={<BoxDetails />} />
              <Route path="/payment/return" element={<PaymentReturn />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/weekly-menu" element={<WeeklyMenu />} />
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
              <Route path="box-vegetables" element={<AdminBoxVegetables />} />
              <Route path="experience-weekly" element={<AdminExperienceWeekly />} />
              <Route path="weekly-menu" element={<AdminWeeklyMenu />} />
              <Route path="feedbacks" element={<AdminFeedbacks />} />
              <Route path="user-boxes" element={<AdminUserBoxes />} />
              <Route path="shippings" element={<AdminShipping />} />
              <Route path="shippers" element={<AdminShippers />} />
              <Route path="news" element={<AdminNews />} />
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
                <Suspense fallback={<Loading />}>
                  <ShipperLayout />
                </Suspense>
              }
            >
              <Route path="" element={<Shipper />} />
            </Route>
          </Routes>
        </AntdApp>
      </ConfigProvider>
      <MessengerFloatingButton
        messengerHref="https://m.me/1023499277515849"
        zaloHref="https://zalo.me/2768914139305378370"
      />
    </Fragment>
  );
}

export default App;
