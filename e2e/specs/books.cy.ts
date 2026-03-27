import {addBookToCart, getSearchInput} from '../support/utils';

describe('Books Page', () => {
  beforeEach(() => {
    cy.visit('/books');
  });

  it('should display the books page', () => {
    cy.get('.books-page').should('be.visible');
  });

  it('should display search input', () => {
    getSearchInput().should('be.visible');
  });

  it('should search for books by title', () => {
    cy.get('.book-list').scrollIntoView();
    cy.get('.book-card', {timeout: 15000}).should('have.length.greaterThan', 0);
    getSearchInput().clear().type('the');
    cy.get('.book-card', {timeout: 15000}).should('have.length.greaterThan', 0);
  });

  it('should show no results for non-existent search', () => {
    getSearchInput().type('zzz_nonexistent_xyz');
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

  it('should show quantity stepper after adding to cart', () => {
    addBookToCart();
    cy.get('.qty-stepper', {timeout: 5000}).first().should('be.visible');
    cy.get('.qty-count').first().should('contain.text', '1');
  });

  it('should increment quantity via grid stepper', () => {
    addBookToCart();
    cy.get('.qty-stepper', {timeout: 5000}).first().should('be.visible');
    cy.get('.qty-stepper .qty-btn').last().click({force: true});
    cy.get('.qty-count').first().should('contain.text', '2');
  });

  it('should remove item when decrementing quantity to zero', () => {
    addBookToCart();
    cy.get('.qty-stepper', {timeout: 5000}).first().should('be.visible');
    cy.get('.qty-stepper .qty-btn').first().click({force: true});
    cy.get('.add-btn', {timeout: 5000}).first().should('be.visible');
  });

  it('should display pagination', () => {
    cy.get('mat-paginator').should('be.visible');
  });

  it('should filter books by category from query params', () => {
    cy.visit('/books?category=Technology');
    cy.get('.books-page').should('be.visible');
  });
});
