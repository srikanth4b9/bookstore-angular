describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('.auth-page').should('be.visible');
    cy.get('.auth-card').should('be.visible');
  });

  it('should have email and password fields', () => {
    cy.get('#emailInput').should('be.visible');
    cy.get('#passwordInput').should('be.visible');
  });

  it('should have a login button', () => {
    cy.get('.auth-btn').should('be.visible').and('contain.text', 'LOGIN');
  });

  it('should type into email and password fields', () => {
    cy.get('#emailInput').type('john@example.com');
    cy.get('#passwordInput').type('password123');
    cy.get('#emailInput').should('have.value', 'john@example.com');
    cy.get('#passwordInput').should('have.value', 'password123');
  });

  it('should login and navigate to home', () => {
    cy.get('#emailInput').type('john@example.com');
    cy.get('#passwordInput').type('password123');

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Logged in successfully (Mock)!');
    });

    cy.get('.auth-btn').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should have a link to register page', () => {
    cy.get('a[href="/register"]').should('be.visible');
  });

  it('should navigate to register page', () => {
    cy.get('a[href="/register"]').click();
    cy.url().should('include', '/register');
  });

  it('should toggle password visibility', () => {
    cy.get('#passwordInput').should('have.attr', 'type', 'password');
    cy.get('button').contains('visibility_off').click();
    cy.get('#passwordInput').should('have.attr', 'type', 'text');
  });
});
