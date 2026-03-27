describe('Account Page', () => {
  beforeEach(() => {
    cy.visit('/account');
  });

  it('should display the account page', () => {
    cy.get('app-account').should('be.visible');
  });

  it('should display user profile information', () => {
    cy.contains('John Doe').should('be.visible');
    cy.contains('john@example.com').should('be.visible');
  });

  it('should display tabs for orders and addresses', () => {
    cy.get('mat-tab-group').should('be.visible');
  });

  it('should display order history', () => {
    cy.contains('Order').should('be.visible');
  });

  it('should display user addresses', () => {
    cy.contains('123 Main St').should('be.visible');
  });
});
