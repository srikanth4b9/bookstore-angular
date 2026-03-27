describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the registration form', () => {
    cy.get('.auth-page').should('be.visible');
    cy.get('.auth-card').should('be.visible');
  });

  it('should have name, email, and password fields', () => {
    cy.get('#nameInput').should('be.visible');
    cy.get('#emailInput').should('be.visible');
    cy.get('#passwordInput').should('be.visible');
  });

  it('should have a register button', () => {
    cy.get('.auth-btn').should('be.visible').and('contain.text', 'REGISTER');
  });

  it('should fill in registration form', () => {
    cy.get('#nameInput').type('John Doe');
    cy.get('#emailInput').type('john@example.com');
    cy.get('#passwordInput').type('password123');

    cy.get('#nameInput').should('have.value', 'John Doe');
    cy.get('#emailInput').should('have.value', 'john@example.com');
    cy.get('#passwordInput').should('have.value', 'password123');
  });

  it('should register and navigate to login page', () => {
    cy.get('#nameInput').type('John Doe');
    cy.get('#emailInput').type('john@example.com');
    cy.get('#passwordInput').type('password123');

    cy.on('window:alert', (text) => {
      expect(text).to.equal('Account created successfully (Mock)!');
    });

    cy.get('.auth-btn').click();
    cy.url().should('include', '/login');
  });

  it('should have a link to login page', () => {
    cy.get('a[href="/login"]').should('be.visible');
  });

  it('should navigate to login page via link', () => {
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');
  });
});
