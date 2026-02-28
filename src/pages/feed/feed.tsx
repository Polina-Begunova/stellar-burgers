import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '../../components/ui/preloader';
import { FeedUI } from '../../components/ui/pages/feed';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.feed);
  const ingredientsLoading = useSelector((state) => state.ingredients.loading);

  useEffect(() => {
    dispatch(getFeeds());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  if (loading || ingredientsLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
