/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    navigateTo(path: string): Chainable<void>;
  }
}

Cypress.Commands.add('navigateTo', (path: string) => {
  cy.visit(path);
  cy.url().should('include', path === '/' ? '/' : path);
});
