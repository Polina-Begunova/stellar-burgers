describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid=burger-constructor-bun-top]').should('contain', 'Краторная булка N-200i (верх)');
      cy.get('[data-testid=burger-constructor-bun-bottom]').should('contain', 'Краторная булка N-200i (низ)');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click();
      cy.get('[data-testid=burger-constructor-ingredients]').should('contain', 'Биокотлета из марсианской Магнолии');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открываться при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid=modal]').should('be.visible');
      cy.get('[data-testid=modal-title]').should('contain', 'Детали ингредиента');
    });

    it('должно закрываться по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid=modal-close]').click();
      cy.get('[data-testid=modal]').should('not.exist');
    });

    it('должно закрываться по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-testid=modal-overlay]').click({ force: true });
      cy.get('[data-testid=modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
      
      // Подставляем моковые токены
      cy.setCookie('accessToken', 'mock-access-token');
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    afterEach(() => {
      // Очищаем токены после теста
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('должен создавать заказ', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i').click();
      
      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии').click();
      
      // Добавляем соус
      cy.contains('Соус Spicy-X').click();
      
      // Оформляем заказ
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      
      // Проверяем модальное окно с заказом
      cy.get('[data-testid=modal]').should('be.visible');
      cy.contains('12345').should('be.visible');
      
      // Закрываем модальное окно
      cy.get('[data-testid=modal-close]').click();
      cy.get('[data-testid=modal]').should('not.exist');
      
      // Проверяем, что конструктор пуст
      cy.get('[data-testid=burger-constructor-bun-top]').should('not.exist');
      cy.get('[data-testid=burger-constructor-ingredients]').should('not.contain', 'Биокотлета');
    });
  });
});
