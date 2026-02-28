import store from './store';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при вызове с undefined', () => {
    // Получаем состояние store напрямую
    const state = store.getState();
    
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
