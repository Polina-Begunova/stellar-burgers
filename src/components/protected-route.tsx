import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthChecked, user } = useSelector((state) => state.user);

  // Ждем проверки авторизации
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Для маршрутов, требующих авторизации
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  // Для маршрутов, доступных только неавторизованным (login, register и т.д.)
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  return children;
};
