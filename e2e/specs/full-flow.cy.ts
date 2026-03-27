import {
  addBookToCart,
  clickContinue,
  clickPlaceOrder,
  fillShippingAddress,
  goToCheckout,
} from '../support/utils';
import {altShippingAddress, shippingAddress, testUser} from '../fixtures/test-data';

describe('Full User Flow: Browse → Add to Cart → Checkout', () => {
  it('should complete a full shopping flow from home to order placement', () => {
    // 1. Start at home page
    cy.visit('/');
    cy.get('.hero-section').should('be.visible');

    // 2. Navigate to books
    cy.get('.cta-btn').click();
    cy.url().should('include', '/books');
    cy.get('.book-list').scrollIntoView();
    cy.get('.book-card', {timeout: 15000}).should('have.length.greaterThan', 0);

    // 3. Add two books to cart
    addBookToCart(0);
    addBookToCart(1);

    // 4. Navigate to cart
    cy.get('a[href="/cart"]').click();
    cy.url().should('include', '/cart');
    cy.get('.cart-item-row').should('have.length', 2);

    // 5. Verify subtotal is displayed
    cy.contains('Subtotal').should('be.visible');

    // 6. Proceed to checkout
    goToCheckout();

    // 7. Fill shipping address
    fillShippingAddress(altShippingAddress);
    clickContinue();

    // 8. Select payment method
    cy.get('mat-radio-button').contains('Credit Card').click();
    clickContinue();

    // 9. Place the order
    clickPlaceOrder();

    // 10. Verify success
    cy.get('.success-container').should('be.visible');

    // 11. Continue shopping
    cy.contains('CONTINUE SHOPPING').click();
    cy.url().should('include', '/books');
  });

  it('should complete registration → login → browse → purchase flow', () => {
    // 1. Register
    cy.visit('/register');
    cy.get('#nameInput').type(testUser.name);
    cy.get('#emailInput').type(testUser.email);
    cy.get('#passwordInput').type(testUser.password);

    cy.on('window:alert', () => true);
    cy.get('.auth-btn').click();
    cy.url().should('include', '/login');

    // 2. Login
    cy.get('#emailInput').type(testUser.email);
    cy.get('#passwordInput').type(testUser.password);

    cy.on('window:alert', () => true);
    cy.get('.auth-btn').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // 3. Browse categories
    cy.get('.nav-links').contains('Categories').click();
    cy.url().should('include', '/categories');
    cy.get('mat-card').first().click();
    cy.url().should('include', '/books');

    // 4. Add book to cart
    addBookToCart();

    // 5. Go to cart and checkout
    cy.get('a[href="/cart"]').click();
    goToCheckout();

    // 6. Complete checkout
    fillShippingAddress(shippingAddress);
    clickContinue();

    cy.get('mat-radio-button').contains('PayPal').click();
    clickContinue();

    clickPlaceOrder();
    cy.get('.success-container').should('be.visible');

    // 7. View orders
    cy.contains('VIEW MY ORDERS').click();
    cy.url().should('include', '/account');
  });
});
