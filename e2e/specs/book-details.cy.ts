describe('Book Details Page', () => {
  beforeEach(() => {
    // Navigate to a book detail page via the books listing
    cy.visit('/books');
    cy.get('.book-card').first().click();
  });

  it('should display book details', () => {
    cy.get('app-book-details').should('be.visible');
  });

  it('should display book title and author', () => {
    cy.get('mat-card').should('be.visible');
    // Book info should be rendered
    cy.get('mat-card-title, h1, h2').should('have.length.greaterThan', 0);
  });

  it('should display book price', () => {
    cy.contains('$').should('be.visible');
  });

  it('should have an add to cart button', () => {
    cy.contains('Add to Cart').should('be.visible');
  });

  it('should add book to cart', () => {
    cy.contains('Add to Cart').click();
    // Cart badge should show count
    cy.get('a[href="/cart"]').should('be.visible');
  });

  it('should navigate back to books listing', () => {
    cy.contains('Back').click();
    cy.url().should('include', '/books');
  });
});
