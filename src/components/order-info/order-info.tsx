import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const { orders } = useSelector((state) => state.feed);
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  console.log('OrderInfo: number =', number);
  console.log('OrderInfo: orders =', orders);
  console.log('OrderInfo: ingredients =', ingredients);

  const orderData = orders.find((item: any) => item.number === Number(number));
  console.log('OrderInfo: orderData =', orderData);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc: number, item: any) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  console.log('OrderInfo: orderInfo =', orderInfo);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
