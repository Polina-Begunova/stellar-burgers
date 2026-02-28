// Добавляем кастомные команды
(Cypress.Commands as any).add('setMockCookie', (name, value) => {
  cy.document().then((doc) => {
    doc.cookie = `${name}=${value}; path=/`;
  });
});

(Cypress.Commands as any).add('clearMockCookie', (name) => {
  cy.document().then((doc) => {
    doc.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
});
