describe('Full User Flow: Browse → Add to Cart → Checkout', () => {
  it('should complete a full shopping flow from home to order placement', () => {
    // 1. Start at home page
    cy.visit('/');
    cy.get('.hero-section').should('be.visible');

    // 2. Navigate to books
    cy.get('.cta-btn').click();
    cy.url().should('include', '/books');
    cy.get('.book-card').should('have.length.greaterThan', 0);

    // 3. Add first book to cart
    cy.get('.add-btn').first().click();

    // 4. Add second book to cart
    cy.get('.add-btn').eq(1).click();

    // 5. Navigate to cart
    cy.get('a[href="/cart"]').click();
    cy.url().should('include', '/cart');
    cy.get('.cart-item-row').should('have.length', 2);

    // 6. Verify subtotal is displayed
    cy.contains('Subtotal').should('be.visible');

    // 7. Proceed to checkout
    cy.get('.checkout-btn').click();
    cy.url().should('include', '/checkout');

    // 8. Fill shipping address
    cy.get('input[placeholder="Street Address"]').clear().type('789 Pine St');
    cy.get('input[placeholder="City"]').clear().type('San Francisco');
    cy.get('input[placeholder="State"]').clear().type('CA');
    cy.get('input[placeholder="ZIP Code"]').clear().type('94102');
    cy.get('input[placeholder="Country"]').clear().type('USA');
    cy.contains('CONTINUE').click();

    // 9. Select payment method
    cy.get('mat-radio-button').contains('Credit Card').click();
    cy.contains('CONTINUE').click();

    // 10. Place the order
    cy.get('.place-order').click();

    // 11. Verify success
    cy.get('.success-container').should('be.visible');

    // 12. Continue shopping
    cy.contains('CONTINUE SHOPPING').click();
    cy.url().should('include', '/books');
  });

  it('should complete registration → login → browse → purchase flow', () => {
    // 1. Register
    cy.visit('/register');
    cy.get('#nameInput').type('Test User');
    cy.get('#emailInput').type('test@example.com');
    cy.get('#passwordInput').type('password123');

    cy.on('window:alert', () => true);
    cy.get('.auth-btn').click();
    cy.url().should('include', '/login');

    // 2. Login
    cy.get('#emailInput').type('test@example.com');
    cy.get('#passwordInput').type('password123');

    cy.on('window:alert', () => true);
    cy.get('.auth-btn').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // 3. Browse categories
    cy.get('.nav-links').contains('Categories').click();
    cy.url().should('include', '/categories');
    cy.get('mat-card').first().click();
    cy.url().should('include', '/books');

    // 4. Add book to cart
    cy.get('.add-btn').first().click();

    // 5. Go to cart and checkout
    cy.get('a[href="/cart"]').click();
    cy.get('.checkout-btn').click();

    // 6. Complete checkout
    cy.get('input[placeholder="Street Address"]').clear().type('100 Market St');
    cy.get('input[placeholder="City"]').clear().type('Boston');
    cy.get('input[placeholder="ZIP Code"]').clear().type('02101');
    cy.contains('CONTINUE').click();

    cy.get('mat-radio-button').contains('PayPal').click();
    cy.contains('CONTINUE').click();

    cy.get('.place-order').click();
    cy.get('.success-container').should('be.visible');

    // 7. View orders
    cy.contains('VIEW MY ORDERS').click();
    cy.url().should('include', '/account');
  });
});
