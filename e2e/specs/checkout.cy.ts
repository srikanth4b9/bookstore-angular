describe('Checkout Page', () => {
  beforeEach(() => {
    // Add item to cart first
    cy.visit('/books');
    cy.get('.book-list').scrollIntoView();
    cy.get('.add-btn', {timeout: 15000}).first().scrollIntoView().click({force: true});
    // Navigate via app link then to checkout (cy.visit would reload and lose in-memory cart state)
    cy.get('a[href="/cart"]').click();
    cy.get('.checkout-btn').click();
    cy.url().should('include', '/checkout');
  });

  it('should display the checkout page', () => {
    cy.get('.checkout-page').should('be.visible');
  });

  it('should display the stepper with shipping address step', () => {
    cy.get('mat-stepper').should('be.visible');
    cy.contains('Shipping Address').should('be.visible');
  });

  it('should pre-populate address fields from user profile', () => {
    cy.get('input[placeholder="Street Address"]').should('not.have.value', '');
  });

  it('should fill in shipping address and proceed to payment', () => {
    cy.get('input[placeholder="Street Address"]').clear().type('456 Oak Ave');
    cy.get('input[placeholder="City"]').clear().type('New York');
    cy.get('input[placeholder="State"]').clear().type('NY');
    cy.get('input[placeholder="ZIP Code"]').clear().type('10001');
    cy.get('input[placeholder="Country"]').clear().type('USA');

    cy.contains('CONTINUE').click();
    cy.contains('Payment').should('be.visible');
  });

  it('should select payment method and proceed to review', () => {
    // Fill shipping address
    cy.get('input[placeholder="Street Address"]').clear().type('456 Oak Ave');
    cy.get('input[placeholder="City"]').clear().type('New York');
    cy.get('input[placeholder="ZIP Code"]').clear().type('10001');

    cy.contains('CONTINUE').click();

    // Select payment method
    cy.get('mat-radio-button').contains('PayPal').click();
    cy.contains('CONTINUE').click();

    // Should be on review step
    cy.contains('Review').should('be.visible');
  });

  it('should display order summary sidebar', () => {
    cy.contains('Order Summary').should('be.visible');
    cy.contains('Total').should('be.visible');
  });

  it('should complete full checkout flow', () => {
    // Step 1: Shipping address
    cy.get('input[placeholder="Street Address"]').clear().type('456 Oak Ave');
    cy.get('input[placeholder="City"]').clear().type('New York');
    cy.get('input[placeholder="ZIP Code"]').clear().type('10001');
    cy.contains('CONTINUE').click();

    // Step 2: Payment
    cy.get('mat-radio-button').contains('Credit Card').click();
    cy.contains('CONTINUE').click();

    // Step 3: Review & Place Order
    cy.get('.place-order').click();

    // Should show success
    cy.get('.success-container').should('be.visible');
    cy.contains('VIEW MY ORDERS').should('be.visible');
    cy.contains('CONTINUE SHOPPING').should('be.visible');
  });

  it('should navigate to account after placing order', () => {
    cy.get('input[placeholder="Street Address"]').clear().type('456 Oak Ave');
    cy.get('input[placeholder="City"]').clear().type('New York');
    cy.get('input[placeholder="ZIP Code"]').clear().type('10001');
    cy.contains('CONTINUE').click();

    cy.get('mat-radio-button').contains('Credit Card').click();
    cy.contains('CONTINUE').click();

    cy.get('.place-order').click();
    cy.get('.success-container').should('be.visible');

    cy.contains('VIEW MY ORDERS').click();
    cy.url().should('include', '/account');
  });
});
