describe('Admin Page', () => {
  beforeEach(() => {
    cy.visit('/admin');
  });

  it('should display the admin dashboard', () => {
    cy.get('app-admin').should('be.visible');
  });

  it('should display tabs for books and orders management', () => {
    cy.get('mat-tab-group').should('be.visible');
  });

  it('should display books table', () => {
    cy.get('mat-table').should('be.visible');
  });

  it('should display total sales summary', () => {
    cy.contains('Total Sales').should('be.visible');
  });

  it('should toggle add book form', () => {
    cy.contains('Add Book').click();
    cy.get('input[placeholder="Title"]').should('be.visible');
    cy.get('input[placeholder="Author"]').should('be.visible');
  });
});
