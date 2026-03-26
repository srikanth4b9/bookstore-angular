describe('Navbar', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the navbar with brand name', () => {
    cy.get('mat-toolbar').should('be.visible');
    cy.get('.nav-brand').should('contain.text', 'BookStore');
  });

  it('should have navigation links', () => {
    cy.get('.nav-links').within(() => {
      cy.contains('Home').should('be.visible');
      cy.contains('Books').should('be.visible');
      cy.contains('Categories').should('be.visible');
    });
  });

  it('should navigate to Books page', () => {
    cy.get('.nav-links').contains('Books').click();
    cy.url().should('include', '/books');
  });

  it('should navigate to Categories page', () => {
    cy.get('.nav-links').contains('Categories').click();
    cy.url().should('include', '/categories');
  });

  it('should have a cart icon link', () => {
    cy.get('a[href="/cart"]').should('be.visible');
  });

  it('should navigate to cart page when clicking cart icon', () => {
    cy.get('a[href="/cart"]').click();
    cy.url().should('include', '/cart');
  });

  it('should show account icon when logged in', () => {
    cy.get('a[href="/account"]').should('be.visible');
  });

  it('should navigate home when clicking brand name', () => {
    cy.visit('/books');
    cy.get('.nav-brand').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
