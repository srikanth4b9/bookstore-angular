describe('Categories Page', () => {
  beforeEach(() => {
    cy.visit('/categories');
  });

  it('should display the categories page', () => {
    cy.get('app-categories').should('be.visible');
  });

  it('should display category cards', () => {
    cy.get('mat-card').should('have.length.greaterThan', 0);
  });

  it('should navigate to books filtered by category when clicking a card', () => {
    cy.get('mat-card').first().click();
    cy.url().should('include', '/books');
    cy.url().should('include', 'category=');
  });
});
