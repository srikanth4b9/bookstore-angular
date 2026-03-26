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

  // Helper to get a Material input by its mat-label text
  const getInputByLabel = (label: string) =>
    cy.contains('mat-form-field mat-label', label).parents('mat-form-field').find('input');

  // Click the visible CONTINUE button (each stepper step has its own)
  const clickContinue = () =>
    cy.get('.stepper-actions:visible button').contains('CONTINUE').click();

  it('should display the checkout page', () => {
    cy.get('.checkout-page').should('be.visible');
  });

  it('should display the stepper with shipping address step', () => {
    cy.get('mat-stepper').should('be.visible');
    cy.contains('Shipping Address').should('be.visible');
  });

  it('should pre-populate address fields from user profile', () => {
    getInputByLabel('Street Address').should('not.have.value', '');
  });

  it('should fill in shipping address and proceed to payment', () => {
    getInputByLabel('Street Address').clear().type('456 Oak Ave');
    getInputByLabel('City').clear().type('New York');
    getInputByLabel('State').clear().type('NY');
    getInputByLabel('Zip Code').clear().type('10001');
    getInputByLabel('Country').clear().type('USA');

    clickContinue();
    cy.contains('Payment').should('be.visible');
  });

  it('should select payment method and proceed to review', () => {
    // Fill shipping address
    getInputByLabel('Street Address').clear().type('456 Oak Ave');
    getInputByLabel('City').clear().type('New York');
    getInputByLabel('Zip Code').clear().type('10001');

    clickContinue();

    // Select payment method
    cy.get('mat-radio-button').contains('PayPal').click();
    clickContinue();

    // Should be on review step
    cy.contains('Review').should('be.visible');
  });

  it('should display order summary sidebar', () => {
    cy.contains('Order Summary').should('be.visible');
    cy.contains('Total').should('be.visible');
  });

  it('should complete full checkout flow', () => {
    // Step 1: Shipping address
    getInputByLabel('Street Address').clear().type('456 Oak Ave');
    getInputByLabel('City').clear().type('New York');
    getInputByLabel('Zip Code').clear().type('10001');
    clickContinue();

    // Step 2: Payment
    cy.get('mat-radio-button').contains('Credit Card').click();
    clickContinue();

    // Step 3: Review & Place Order
    cy.contains('button', 'PLACE ORDER').click();

    // Should show success
    cy.get('.success-container').should('be.visible');
    cy.contains('VIEW MY ORDERS').should('be.visible');
    cy.contains('CONTINUE SHOPPING').should('be.visible');
  });

  it('should navigate to account after placing order', () => {
    getInputByLabel('Street Address').clear().type('456 Oak Ave');
    getInputByLabel('City').clear().type('New York');
    getInputByLabel('Zip Code').clear().type('10001');
    clickContinue();

    cy.get('mat-radio-button').contains('Credit Card').click();
    clickContinue();

    cy.contains('button', 'PLACE ORDER').click();
    cy.get('.success-container').should('be.visible');

    cy.contains('VIEW MY ORDERS').click();
    cy.url().should('include', '/account');
  });
});
