/// <reference types="cypress" />

Cypress.on('uncaught:exception', () => {
  // Prevent Cypress from failing tests on uncaught app exceptions
  return false;
});
