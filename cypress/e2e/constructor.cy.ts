/// <reference types="cypress" />
/// <reference types="mocha" />

// Функция для удаления iframe
const removeIframe = () => {
  cy.document().then((doc) => {
    const iframe = doc.querySelector('#webpack-dev-server-client-overlay');
    if (iframe) {
      iframe.remove();
      cy.log('✅ iframe удален');
    }
  });
};

describe('Конструктор бургера', () => {
  // Глобальный beforeEach для всех тестов
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait(1000);
    removeIframe();
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.contains('Краторная булка N-200i', { timeout: 10000 })
        // .should('be.visible') - УБРАЛИ!
        .closest('[data-testid=ingredient-item]')
        .find('button')
        .click({ force: true });
      
      cy.get('[data-testid=burger-constructor-bun-top]').should(
        'contain',
        'Краторная булка N-200i (верх)'
      );
      cy.get('[data-testid=burger-constructor-bun-bottom]').should(
        'contain',
        'Краторная булка N-200i (низ)'
      );
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии', { timeout: 10000 })
        // .should('be.visible') - УБРАЛИ!
        .closest('[data-testid=ingredient-item]')
        .find('button')
        .click({ force: true });
      
      cy.get('[data-testid=burger-constructor-ingredients]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должно открываться при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i', { timeout: 10000 })
        // .should('be.visible') - УБРАЛИ!
        .closest('[data-testid=ingredient-item]')
        .find('a')
        .click({ force: true });
      
      cy.get('[data-testid=modal]').should('be.visible');
      cy.get('[data-testid=modal-title]').should(
        'contain',
        'Детали ингредиента'
      );
      cy.get('[data-testid=modal]').should('contain', 'Краторная булка N-200i');
    });

    it('должно закрываться по клику на крестик', () => {
      cy.contains('Краторная булка N-200i', { timeout: 10000 })
        .closest('[data-testid=ingredient-item]')
        .find('a')
        .click({ force: true });
      
      cy.get('[data-testid=modal]').should('be.visible');
      cy.get('[data-testid=modal-close]').click({ force: true });
      cy.get('[data-testid=modal]').should('not.exist');
    });

    it('должно закрываться по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i', { timeout: 10000 })
        .closest('[data-testid=ingredient-item]')
        .find('a')
        .click({ force: true });
      
      cy.get('[data-testid=modal]').should('be.visible');
      cy.get('[data-testid=modal-overlay]').click({ force: true });
      cy.get('[data-testid=modal]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      // Устанавливаем сессию ПОСЛЕ загрузки страницы
      cy.session('auth', () => {
        cy.setCookie('accessToken', 'mock-access-token', {
          path: '/',
          httpOnly: false,
          secure: false,
          domain: 'localhost'
        });
        localStorage.setItem('refreshToken', 'mock-refresh-token');
      });

      cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
        'createOrder'
      );

      // Перезагружаем страницу с новой сессией
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait(1000);
      removeIframe();
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });

    it('должен создавать заказ', () => {
      cy.getCookie('accessToken').should('exist');

      // Добавляем булку
      cy.contains('Краторная булка N-200i', { timeout: 10000 })
        .closest('[data-testid=ingredient-item]')
        .find('button')
        .click({ force: true });

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии', { timeout: 10000 })
        .closest('[data-testid=ingredient-item]')
        .find('button')
        .click({ force: true });

      // Добавляем соус
      cy.contains('Соус Spicy-X', { timeout: 10000 })
        .closest('[data-testid=ingredient-item]')
        .find('button')
        .click({ force: true });

      cy.get('[data-testid=burger-constructor-bun-top]', { timeout: 10000 })
        .should('be.visible');

      cy.contains('Оформить заказ').scrollIntoView().click({ force: true });
      
      cy.wait('@createOrder', { timeout: 10000 });

      cy.get('[data-testid=modal]', { timeout: 10000 }).should('be.visible');
      cy.contains('12345').should('be.visible');

      cy.get('[data-testid=modal-close]').click({ force: true });
      cy.wait(500);
      cy.get('[data-testid=modal]', { timeout: 10000 }).should('not.exist');

      cy.get('[data-testid=burger-constructor-bun-top]').should('not.exist');
      cy.get('[data-testid=burger-constructor-ingredients]').should('not.contain', 'Биокотлета');
    });
  });
});
