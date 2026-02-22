import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/userSlice';
import styles from './app.module.css';
import '../../index.css';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        {/* Основные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Защищенные маршруты для неавторизованных пользователей */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные маршруты для авторизованных пользователей */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Маршруты для модальных окон с деталями */}
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
              <IngredientDetails />
            </Modal>
          }
        />

        <Route
          path='/feed/:number'
          element={
            <Modal title='Детали заказа' onClose={() => navigate(-1)}>
              <OrderInfo />
            </Modal>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Modal title='Детали заказа' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />

        {/* Маршрут для несуществующих страниц */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

export default App;
