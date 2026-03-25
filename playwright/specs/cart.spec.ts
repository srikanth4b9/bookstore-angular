import {test, expect} from '@playwright/test';

test.describe('Cart Page', () => {
  test('should show empty cart message when no items', async ({page}) => {
    await page.goto('/cart');
    await expect(page.locator('.empty-cart')).toBeVisible();
    await expect(page.locator('.empty-cart p')).toHaveText('Your cart is empty.');
    await expect(page.locator('.empty-cart a').filter({hasText: 'BROWSE BOOKS'})).toBeVisible();
  });

  test('should navigate to books page from empty cart', async ({page}) => {
    await page.goto('/cart');
    await page.locator('.empty-cart a').filter({hasText: 'BROWSE BOOKS'}).click();
    await expect(page).toHaveURL(/\/books/);
  });

  test.describe('with items in cart', () => {
    test.beforeEach(async ({page}) => {
      // Add an item to cart first
      await page.goto('/books');
      const firstCard = page.locator('.book-grid .book-card').first();
      await expect(firstCard).toBeVisible({timeout: 15000});
      // JS click bypasses overlay visibility issues in headless mode
      await firstCard.locator('.add-btn').dispatchEvent('click');
      await page.waitForTimeout(500);
      await page.goto('/cart');
    });

    test('should display cart items', async ({page}) => {
      await expect(page.locator('.page-title')).toHaveText('Shopping Cart');
      const cartItems = page.locator('.cart-item-row');
      expect(await cartItems.count()).toBeGreaterThan(0);
    });

    test('should display item title, price, and quantity', async ({page}) => {
      const cartItem = page.locator('.cart-item-row').first();
      await expect(cartItem.locator('.item-title')).toBeVisible();
      await expect(cartItem.locator('.price')).toBeVisible();
      await expect(cartItem.locator('.qty')).toBeVisible();
    });

    test('should display order summary with subtotal', async ({page}) => {
      await expect(page.locator('.summary-card mat-card-title')).toHaveText('Order Summary');
      await expect(page.locator('.summary-row').filter({hasText: 'Subtotal'})).toBeVisible();
    });

    test('should display free shipping', async ({page}) => {
      await expect(page.locator('.free-text')).toHaveText('FREE');
    });

    test('should increase item quantity', async ({page}) => {
      const qtyBefore = await page.locator('.qty').first().textContent();
      await page.locator('.quantity-controls button').filter({hasText: 'add'}).first().click();
      const qtyAfter = await page.locator('.qty').first().textContent();
      expect(Number(qtyAfter?.trim())).toBe(Number(qtyBefore?.trim()) + 1);
    });

    test('should decrease item quantity', async ({page}) => {
      // First increase to 2
      await page.locator('.quantity-controls button').filter({hasText: 'add'}).first().click();
      const qtyBefore = await page.locator('.qty').first().textContent();
      await page.locator('.quantity-controls button').filter({hasText: 'remove'}).first().click();
      const qtyAfter = await page.locator('.qty').first().textContent();
      expect(Number(qtyAfter?.trim())).toBe(Number(qtyBefore?.trim()) - 1);
    });

    test('should remove an item from the cart', async ({page}) => {
      await page.locator('button[aria-label="Remove item"]').first().click();
      await expect(page.locator('.empty-cart')).toBeVisible();
    });

    test('should have promo code input and apply button', async ({page}) => {
      await expect(page.locator('.promo-field')).toBeVisible();
      await expect(page.locator('.apply-btn')).toBeVisible();
    });

    test('should have a Proceed to Checkout button', async ({page}) => {
      const checkoutBtn = page.locator('.checkout-btn');
      await expect(checkoutBtn).toContainText('PROCEED TO CHECKOUT');
      await checkoutBtn.click();
      await expect(page).toHaveURL(/\/checkout/);
    });
  });
});
