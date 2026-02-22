// src/pages/constructor-page/constructor-page.tsx
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return <ConstructorPageUI isIngredientsLoading={loading} />;
};
