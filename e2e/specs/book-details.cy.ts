describe('Book Details Page', () => {
  beforeEach(() => {
    // Navigate to a book detail page via the books listing
    cy.visit('/books');
    cy.get('.book-card').first().click();
    // Wait for deferred content to load (500ms timer + API call)
    cy.get('.details-card', {timeout: 15000}).should('be.visible');
  });

  it('should display book details', () => {
    cy.get('app-book-details').should('be.visible');
  });

  it('should display book title and author', () => {
    cy.get('mat-card-title').should('be.visible');
    cy.get('mat-card-subtitle').should('contain.text', 'by');
  });

  it('should display book price', () => {
    cy.get('.price-row').should('contain.text', '$');
  });

  it('should have an add to cart button', () => {
    cy.contains('ADD TO CART').should('be.visible');
  });

  it('should add book to cart', () => {
    cy.contains('ADD TO CART').click();
    cy.get('a[href="/cart"]').should('be.visible');
  });

  it('should show quantity stepper after adding to cart', () => {
    cy.contains('ADD TO CART').click();
    cy.get('.qty-stepper').should('be.visible');
    cy.get('.qty-count').should('contain.text', '1');
  });

  it('should increment quantity via stepper', () => {
    cy.contains('ADD TO CART').click();
    cy.get('.qty-stepper').should('be.visible');
    cy.get('.qty-stepper .qty-btn').last().click();
    cy.get('.qty-count').should('contain.text', '2');
  });

  it('should decrement quantity and remove from cart when quantity reaches zero', () => {
    cy.contains('ADD TO CART').click();
    cy.get('.qty-stepper').should('be.visible');
    cy.get('.qty-stepper .qty-btn').first().click();
    cy.contains('ADD TO CART').should('be.visible');
  });

  it('should navigate back to books listing', () => {
    cy.contains('BACK').click();
    cy.url().should('include', '/books');
  });
});
