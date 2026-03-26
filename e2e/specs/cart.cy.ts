describe('Cart Page', () => {
  it('should display empty cart when no items added', () => {
    cy.visit('/cart');
    cy.get('.empty-cart').should('be.visible');
    cy.contains('BROWSE BOOKS').should('be.visible');
  });

  it('should navigate to books page from empty cart', () => {
    cy.visit('/cart');
    cy.contains('BROWSE BOOKS').click();
    cy.url().should('include', '/books');
  });

  describe('with items in cart', () => {
    beforeEach(() => {
      // Add an item to cart via the books page
      cy.visit('/books');
      cy.get('.book-list').scrollIntoView();
      cy.get('.add-btn', {timeout: 15000}).first().scrollIntoView().click({force: true});
      cy.visit('/cart');
    });

    it('should display cart items', () => {
      cy.get('.cart-items-section').should('be.visible');
      cy.get('.cart-item-row').should('have.length.greaterThan', 0);
    });

    it('should display order summary', () => {
      cy.contains('Subtotal').should('be.visible');
      cy.contains('Total').should('be.visible');
    });

    it('should have quantity controls', () => {
      cy.get('.quantity-controls').should('be.visible');
    });

    it('should increase item quantity', () => {
      cy.get('.quantity-controls button').contains('+').first().click();
      cy.get('.quantity-controls').first().should('contain.text', '2');
    });

    it('should have a checkout button', () => {
      cy.get('.checkout-btn').should('be.visible').and('contain.text', 'PROCEED TO CHECKOUT');
    });

    it('should navigate to checkout', () => {
      cy.get('.checkout-btn').click();
      cy.url().should('include', '/checkout');
    });

    it('should remove item from cart', () => {
      cy.get('button[color="warn"]').first().click();
      cy.get('.empty-cart').should('be.visible');
    });
  });

  describe('promo code', () => {
    beforeEach(() => {
      cy.visit('/books');
      cy.get('.book-list').scrollIntoView();
      cy.get('.add-btn', {timeout: 15000}).first().scrollIntoView().click({force: true});
      cy.visit('/cart');
    });

    it('should apply SAVE10 promo code', () => {
      cy.get('input[matInput]').last().type('SAVE10');
      cy.get('.apply-btn').click();
      cy.contains('SAVE10').should('be.visible');
    });

    it('should apply WELCOME promo code', () => {
      cy.get('input[matInput]').last().type('WELCOME');
      cy.get('.apply-btn').click();
      cy.contains('WELCOME').should('be.visible');
    });

    it('should show error for invalid promo code', () => {
      cy.get('input[matInput]').last().type('INVALID');
      cy.get('.apply-btn').click();
      cy.get('.mat-mdc-snack-bar-container').should('contain.text', 'Invalid promo code');
    });
  });
});
