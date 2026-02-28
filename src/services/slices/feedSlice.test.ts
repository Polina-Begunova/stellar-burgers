import feedReducer, { getFeeds } from './feedSlice';
import { TOrder } from '@utils-types';

// Определяем начальное состояние для тестов
const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

describe('feed slice', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      number: 12345,
      status: 'done',
      name: 'Заказ 1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      ingredients: ['1', '2', '3']
    }
  ];

  it('должен обрабатывать pending состояние', () => {
    const action = { type: getFeeds.pending.type };
    const state = feedReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать fulfilled состояние', () => {
    const action = {
      type: getFeeds.fulfilled.type,
      payload: {
        orders: mockOrders,
        total: 100,
        totalToday: 10
      }
    };
    const state = feedReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать rejected состояние', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: getFeeds.rejected.type,
      error: { message: errorMessage }
    };
    const state = feedReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });
});
