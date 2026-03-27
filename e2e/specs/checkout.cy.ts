import {
  addItemAndGoToCart,
  clickContinue,
  clickPlaceOrder,
  fillShippingAddress,
  getInputByLabel,
  goToCheckout,
} from '../support/utils';
import {shippingAddress} from '../fixtures/test-data';

describe('Checkout Page', () => {
  beforeEach(() => {
    addItemAndGoToCart();
    goToCheckout();
  });

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
    fillShippingAddress(shippingAddress);

    clickContinue();
    cy.contains('Payment').should('be.visible');
  });

  it('should select payment method and proceed to review', () => {
    fillShippingAddress(shippingAddress);
    clickContinue();

    cy.get('mat-radio-button').contains('PayPal').click();
    clickContinue();

    cy.contains('Review').should('be.visible');
  });

  it('should display order summary sidebar', () => {
    cy.contains('Order Summary').should('be.visible');
    cy.contains('Total').should('be.visible');
  });

  it('should complete full checkout flow', () => {
    fillShippingAddress(shippingAddress);
    clickContinue();

    cy.get('mat-radio-button').contains('Credit Card').click();
    clickContinue();

    clickPlaceOrder();

    cy.get('.success-container').should('be.visible');
    cy.contains('VIEW MY ORDERS').should('be.visible');
    cy.contains('CONTINUE SHOPPING').should('be.visible');
  });

  it('should navigate to account after placing order', () => {
    fillShippingAddress(shippingAddress);
    clickContinue();

    cy.get('mat-radio-button').contains('Credit Card').click();
    clickContinue();

    clickPlaceOrder();
    cy.get('.success-container').should('be.visible');

    cy.contains('VIEW MY ORDERS').click();
    cy.url().should('include', '/account');
  });
});
