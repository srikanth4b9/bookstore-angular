import {addBookToCart} from '../support/utils';

describe('Books Page', () => {
  beforeEach(() => {
    cy.visit('/books');
  });

  it('should display the books page', () => {
    cy.get('.books-page').should('be.visible');
  });

  it('should display search input', () => {
    cy.get('input[placeholder="Title, author, ISBN..."]').should('be.visible');
  });

  it('should search for books by title', () => {
    // Scroll the book list into view to trigger the @defer block
    cy.get('.book-list').scrollIntoView();
    cy.get('.book-card', {timeout: 15000}).should('have.length.greaterThan', 0);
    cy.get('input[placeholder="Title, author, ISBN..."]').clear().type('the');
    cy.get('.book-card', {timeout: 15000}).should('have.length.greaterThan', 0);
  });

  it('should show no results for non-existent search', () => {
    cy.get('input[placeholder="Title, author, ISBN..."]').type('zzz_nonexistent_xyz');
    cy.wait(500);
    cy.get('.no-results').should('be.visible');
  });

  it('should display books in grid view by default', () => {
    cy.get('.book-grid').should('be.visible');
  });

  it('should toggle between grid and list view', () => {
    cy.get('.book-grid').should('be.visible');

    // Click list view button
    cy.get('button').contains('view_list').click();
    cy.get('.book-list-view').should('be.visible');

    // Click grid view button
    cy.get('button').contains('grid_view').click();
    cy.get('.book-grid').should('be.visible');
  });

  it('should navigate to book details when clicking a book card', () => {
    cy.get('.book-card').first().click();
    cy.url().should('match', /\/books\/\w+/);
  });

  it('should add a book to cart', () => {
    addBookToCart();
    cy.get('a[href="/cart"]').should('be.visible');
  });

  it('should display pagination', () => {
    cy.get('mat-paginator').should('be.visible');
  });

  it('should filter books by category from query params', () => {
    cy.visit('/books?category=Technology');
    cy.get('.books-page').should('be.visible');
  });
});
