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
    cy.get('.table-container table').should('be.visible');
  });

  it('should display total revenue in Sales Analytics tab', () => {
    cy.contains('.mat-mdc-tab', 'Sales Analytics').click();
    cy.contains('Total Revenue').should('be.visible');
  });

  it('should toggle add book form', () => {
    cy.contains('ADD NEW BOOK').click();
    cy.get('input[placeholder="e.g. The Great Gatsby"]').should('be.visible');
    cy.get('input[placeholder="e.g. F. Scott Fitzgerald"]').should('be.visible');
  });
});
