describe('Full User Flow: Browse → Add to Cart → Checkout', () => {
  // Helper to get a Material input by its mat-label text
  const getInputByLabel = (label: string) =>
    cy.contains('mat-form-field mat-label', label).parents('mat-form-field').find('input');

  // Click the visible CONTINUE button (each stepper step has its own)
  const clickContinue = () =>
    cy.get('.stepper-actions:visible button').contains('CONTINUE').click();

  it('should complete a full shopping flow from home to order placement', () => {
    // 1. Start at home page
    cy.visit('/');
    cy.get('.hero-section').should('be.visible');

    // 2. Navigate to books
    cy.get('.cta-btn').click();
    cy.url().should('include', '/books');
    cy.get('.book-list').scrollIntoView();
    cy.get('.book-card', {timeout: 15000}).should('have.length.greaterThan', 0);

    // 3. Add first book to cart
    cy.get('.add-btn').first().scrollIntoView().click({force: true});

    // 4. Add second book to cart
    cy.get('.add-btn').eq(1).scrollIntoView().click({force: true});

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
    getInputByLabel('Street Address').clear().type('789 Pine St');
    getInputByLabel('City').clear().type('San Francisco');
    getInputByLabel('State').clear().type('CA');
    getInputByLabel('Zip Code').clear().type('94102');
    getInputByLabel('Country').clear().type('USA');
    clickContinue();

    // 9. Select payment method
    cy.get('mat-radio-button').contains('Credit Card').click();
    clickContinue();

    // 10. Place the order
    cy.contains('button', 'PLACE ORDER').click();

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
    cy.get('.book-list').scrollIntoView();
    cy.get('.add-btn', {timeout: 15000}).first().scrollIntoView().click({force: true});

    // 5. Go to cart and checkout
    cy.get('a[href="/cart"]').click();
    cy.get('.checkout-btn').click();

    // 6. Complete checkout
    getInputByLabel('Street Address').clear().type('100 Market St');
    getInputByLabel('City').clear().type('Boston');
    getInputByLabel('Zip Code').clear().type('02101');
    clickContinue();

    cy.get('mat-radio-button').contains('PayPal').click();
    clickContinue();

    cy.contains('button', 'PLACE ORDER').click();
    cy.get('.success-container').should('be.visible');

    // 7. View orders
    cy.contains('VIEW MY ORDERS').click();
    cy.url().should('include', '/account');
  });
});
