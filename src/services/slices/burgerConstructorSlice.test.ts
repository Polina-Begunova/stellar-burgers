import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor
} from './burgerConstructorSlice';
import { TIngredient } from '@utils-types';

// Мок для crypto.randomUUID
beforeAll(() => {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => 'test-id-' + Math.random().toString(36).substring(2, 9)
    }
  });
});

describe('burgerConstructor slice', () => {
  const mockBun: TIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const mockMain: TIngredient = {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 50,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const initialState = {
    bun: null,
    ingredients: []
  };

  it('должен добавлять булку', () => {
    const action = addIngredient(mockBun);
    const newState = burgerConstructorReducer(initialState, action);

    expect(newState.bun).toBeDefined();
    expect(newState.bun?.name).toBe('Булка');
    expect(newState.bun?.type).toBe('bun');
    expect(newState.bun?.id).toBeDefined(); // Проверяем, что id сгенерировался
  });

  it('должен добавлять начинку', () => {
    const action = addIngredient(mockMain);
    const newState = burgerConstructorReducer(initialState, action);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0].name).toBe('Начинка');
    expect(newState.ingredients[0].id).toBeDefined();
  });

  it('должен удалять ингредиент', () => {
    // Сначала добавляем ингредиент
    const addAction = addIngredient(mockMain);
    const stateWithIngredient = burgerConstructorReducer(
      initialState,
      addAction
    );
    const ingredientId = stateWithIngredient.ingredients[0].id;

    // Затем удаляем его
    const removeAction = removeIngredient(ingredientId);
    const newState = burgerConstructorReducer(
      stateWithIngredient,
      removeAction
    );

    expect(newState.ingredients).toHaveLength(0);
  });

  it('должен перемещать ингредиент вверх', () => {
    // Добавляем первый ингредиент
    const addFirstAction = addIngredient(mockMain);
    const stateWithFirst = burgerConstructorReducer(
      initialState,
      addFirstAction
    );

    // Добавляем второй ингредиент
    const secondMain = { ...mockMain, _id: '3', name: 'Вторая начинка' };
    const addSecondAction = addIngredient(secondMain);
    const stateWithTwo = burgerConstructorReducer(
      stateWithFirst,
      addSecondAction
    );

    expect(stateWithTwo.ingredients[0].name).toBe('Начинка');
    expect(stateWithTwo.ingredients[1].name).toBe('Вторая начинка');

    // Перемещаем второй ингредиент вверх
    const moveUpAction = moveIngredientUp(1);
    const newState = burgerConstructorReducer(stateWithTwo, moveUpAction);

    expect(newState.ingredients[0].name).toBe('Вторая начинка');
    expect(newState.ingredients[1].name).toBe('Начинка');
  });

  it('должен перемещать ингредиент вниз', () => {
    // Добавляем первый ингредиент
    const addFirstAction = addIngredient(mockMain);
    const stateWithFirst = burgerConstructorReducer(
      initialState,
      addFirstAction
    );

    // Добавляем второй ингредиент
    const secondMain = { ...mockMain, _id: '3', name: 'Вторая начинка' };
    const addSecondAction = addIngredient(secondMain);
    const stateWithTwo = burgerConstructorReducer(
      stateWithFirst,
      addSecondAction
    );

    // Перемещаем первый ингредиент вниз
    const moveDownAction = moveIngredientDown(0);
    const newState = burgerConstructorReducer(stateWithTwo, moveDownAction);

    expect(newState.ingredients[0].name).toBe('Вторая начинка');
    expect(newState.ingredients[1].name).toBe('Начинка');
  });

  it('должен очищать конструктор', () => {
    // Добавляем булку и начинку
    const addBunAction = addIngredient(mockBun);
    const stateWithBun = burgerConstructorReducer(initialState, addBunAction);
    const addMainAction = addIngredient(mockMain);
    const stateWithItems = burgerConstructorReducer(
      stateWithBun,
      addMainAction
    );

    // Очищаем конструктор
    const resetAction = resetConstructor();
    const newState = burgerConstructorReducer(stateWithItems, resetAction);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);
  });
});
