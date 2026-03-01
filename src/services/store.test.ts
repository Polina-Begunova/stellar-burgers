import { rootReducer } from './store';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при вызове с undefined', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    // Проверяем, что все слайсы существуют
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('userOrders');

    // Проверяем начальные значения
    expect(state.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
