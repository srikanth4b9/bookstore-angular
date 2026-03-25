import {test, expect} from '@playwright/test';
import {shippingAddress} from '../fixtures/test-data';

test.describe('Full Shopping Flow', () => {
  test('should complete the full browse-to-checkout flow', async ({page}) => {
    // 1. Start at home page
    await page.goto('/');
    await expect(page.locator('.hero-section h1')).toHaveText('Welcome to BookStore');

    // 2. Navigate to books via CTA
    await page.locator('.cta-btn').click();
    await expect(page).toHaveURL(/\/books/);

    // 3. Wait for books to load and click on the first book
    const firstCard = page.locator('.book-grid .book-card').first();
    await expect(firstCard).toBeVisible({timeout: 15000});
    await firstCard.click();
    await expect(page).toHaveURL(/\/books\/.+/);

    // 4. Add book to cart from details page
    const addToCartBtn = page.locator('button').filter({hasText: 'ADD TO CART'});
    await expect(addToCartBtn).toBeVisible({timeout: 10000});
    await addToCartBtn.click();

    // 5. Navigate to cart
    await page.locator('.nav-links a mat-icon').filter({hasText: 'shopping_cart'}).click();
    await expect(page).toHaveURL(/\/cart/);

    // 6. Verify item is in cart
    const cartItems = page.locator('.cart-item-row');
    expect(await cartItems.count()).toBeGreaterThan(0);

    // 7. Proceed to checkout
    await page.locator('.checkout-btn').click();
    await expect(page).toHaveURL(/\/checkout/);

    // 8. Fill in shipping address
    const inputs = page.locator('.step-content input[matInput]');
    await inputs.nth(0).fill(shippingAddress.street);
    await inputs.nth(1).fill(shippingAddress.city);
    await inputs.nth(2).fill(shippingAddress.state);
    await inputs.nth(3).fill(shippingAddress.zipCode);
    await inputs.nth(4).fill(shippingAddress.country);
    await page.locator('button').filter({hasText: 'CONTINUE'}).first().click();

    // 9. Select payment method
    await page.locator('mat-radio-button').filter({hasText: 'Credit Card'}).click();
    await page.locator('button').filter({hasText: 'CONTINUE'}).click();

    // 10. Verify review step shows correct details
    await expect(page.locator('.review-details')).toContainText(shippingAddress.street);
    await expect(page.locator('.review-details')).toContainText('Credit Card');
    await expect(page.locator('button').filter({hasText: 'PLACE ORDER'})).toBeVisible();
  });

  test('should navigate from home through categories to filtered books', async ({page}) => {
    await page.goto('/');

    // Click a category card on the home page
    await page.locator('.category-card').first().click();
    await expect(page).toHaveURL(/\/books/);
  });

  test('should add multiple items and verify cart count', async ({page}) => {
    await page.goto('/books');

    // Add books to cart
    const cards = page.locator('.book-grid .book-card');
    await expect(cards.first()).toBeVisible({timeout: 15000});
    await cards.nth(0).locator('.add-btn').dispatchEvent('click');
    await page.waitForTimeout(300);
    await cards.nth(1).locator('.add-btn').dispatchEvent('click');
    await page.waitForTimeout(300);

    // Navigate to cart
    await page.goto('/cart');

    // Should have 2 items
    const cartItems = page.locator('.cart-item-row');
    await expect(cartItems).toHaveCount(2);
  });

  test('should navigate between auth pages', async ({page}) => {
    await page.goto('/login');
    await expect(page.locator('mat-card-title')).toHaveText('Login');

    // Go to register
    await page.locator('.switch-auth a').click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('mat-card-title')).toHaveText('Register');

    // Go back to login
    await page.locator('.switch-auth a').click();
    await expect(page).toHaveURL(/\/login/);
  });
});
