describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the hero section with CTA', () => {
    cy.get('.hero-section').should('be.visible');
    cy.get('.hero-content').should('contain.text', 'BookStore');
    cy.get('.cta-btn').should('be.visible').and('contain.text', 'BROWSE ALL BOOKS');
  });

  it('should navigate to books page when clicking CTA', () => {
    cy.get('.cta-btn').click();
    cy.url().should('include', '/books');
  });

  it('should display featured books section', () => {
    cy.get('.featured-section').should('be.visible');
    cy.get('.featured-section .book-card').should('have.length.greaterThan', 0);
  });

  it('should navigate to book details when clicking a featured book', () => {
    cy.get('.featured-section .book-card').first().click();
    cy.url().should('match', /\/books\/\w+/);
  });

  it('should display categories section', () => {
    cy.get('.categories-section').should('be.visible');
    cy.get('.category-card').should('have.length.greaterThan', 0);
  });

  it('should navigate to books filtered by category', () => {
    cy.get('.category-card').first().click();
    cy.url().should('include', '/books');
    cy.url().should('include', 'category=');
  });
});
