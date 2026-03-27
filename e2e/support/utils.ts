/**
 * Shared utility functions for Cypress e2e tests.
 */

/** Get a Material form-field input by its mat-label text. */
export const getInputByLabel = (label: string) =>
  cy.contains('mat-form-field mat-label', label).parents('mat-form-field').find('input');

/** Get the search input on the books page. */
export const getSearchInput = () => cy.get('.books-page input[matInput]');

/** Click the visible CONTINUE button in the active stepper step. */
export const clickContinue = () =>
  cy.get('.stepper-actions:visible button').contains('CONTINUE').click();

/** Click the PLACE ORDER button. */
export const clickPlaceOrder = () => cy.contains('button', 'PLACE ORDER').click();

/** Add a book to cart from the books page and wait for the book list to load. */
export const addBookToCart = (index = 0) => {
  cy.get('.book-list').scrollIntoView();
  cy.get('.add-btn', {timeout: 15000}).eq(index).scrollIntoView().click({force: true});
};

/**
 * Add item(s) to cart from the books page, then navigate to cart
 * using in-app links (cy.visit would reload and lose in-memory cart state).
 */
export const addItemAndGoToCart = (count = 1) => {
  cy.visit('/books');
  for (let i = 0; i < count; i++) {
    addBookToCart(i);
  }
  cy.get('a[href="/cart"]').click();
  cy.url().should('include', '/cart');
};

/** Navigate from cart to checkout. */
export const goToCheckout = () => {
  cy.get('.checkout-btn').click();
  cy.url().should('include', '/checkout');
};

/**
 * Fill the shipping address form in the checkout stepper.
 * Only street, city, and zipCode are required.
 */
export const fillShippingAddress = (address: {
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country?: string;
}) => {
  getInputByLabel('Street Address').clear().type(address.street);
  getInputByLabel('City').clear().type(address.city);
  if (address.state) {
    getInputByLabel('State').clear().type(address.state);
  }
  getInputByLabel('Zip Code').clear().type(address.zipCode);
  if (address.country) {
    getInputByLabel('Country').clear().type(address.country);
  }
};
