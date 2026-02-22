import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUserOrders } from '../../services/slices/userOrdersSlice';
import { ProfileOrdersUI } from '../../components/ui/pages/profile-orders';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.userOrders);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
