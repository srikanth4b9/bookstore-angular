import {test, expect} from '@playwright/test';
import {shippingAddress} from '../fixtures/test-data';

test.describe('Checkout Page', () => {
  test.beforeEach(async ({page}) => {
    // Add an item to cart first
    await page.goto('/books');
    const addBtn = page.locator('.book-grid .book-card .add-btn').first();
    await expect(addBtn).toBeVisible({timeout: 15000});
    await addBtn.click({force: true});
    await expect(addBtn).toHaveClass(/added/, {timeout: 5000});
    await page.goto('/checkout');
  });

  test('should display the checkout page title', async ({page}) => {
    await expect(page.locator('.page-title')).toHaveText('Checkout');
  });

  test('should display a vertical stepper with 3 steps', async ({page}) => {
    await expect(page.locator('mat-stepper')).toBeVisible();
    const stepLabels = page.locator('mat-step-header');
    await expect(stepLabels).toHaveCount(3);
  });

  test('should show shipping address form on step 1', async ({page}) => {
    await expect(page.locator('mat-step-header').first()).toContainText('Shipping Address');
    await expect(page.locator('input[matInput]').first()).toBeVisible();
  });

  test('should fill in shipping address and proceed to step 2', async ({page}) => {
    // Fill the address form fields
    const inputs = page.locator('.step-content input[matInput]');
    await inputs.nth(0).fill(shippingAddress.street);
    await inputs.nth(1).fill(shippingAddress.city);
    await inputs.nth(2).fill(shippingAddress.state);
    await inputs.nth(3).fill(shippingAddress.zipCode);
    await inputs.nth(4).fill(shippingAddress.country);

    // Click Continue button
    await page.locator('button').filter({hasText: 'CONTINUE'}).first().click();

    // Step 2 should be visible — Payment Options
    await expect(page.locator('mat-radio-group')).toBeVisible({timeout: 5000});
  });

  test('should select a payment method and proceed to step 3', async ({page}) => {
    // Fill step 1
    const inputs = page.locator('.step-content input[matInput]');
    await inputs.nth(0).fill(shippingAddress.street);
    await inputs.nth(1).fill(shippingAddress.city);
    await inputs.nth(2).fill(shippingAddress.state);
    await inputs.nth(3).fill(shippingAddress.zipCode);
    await inputs.nth(4).fill(shippingAddress.country);
    await page.locator('button').filter({hasText: 'CONTINUE'}).first().click();

    // Step 2: Select Credit Card
    await page.locator('mat-radio-button').filter({hasText: 'Credit Card'}).click();
    await page.locator('button').filter({hasText: 'CONTINUE'}).click();

    // Step 3: Review should show address and payment info
    await expect(page.locator('.review-details')).toBeVisible({timeout: 5000});
    await expect(page.locator('.review-details')).toContainText(shippingAddress.street);
    await expect(page.locator('.review-details')).toContainText('Credit Card');
  });

  test('should display order summary sidebar with cart items', async ({page}) => {
    await expect(page.locator('.summary-card mat-card-title')).toHaveText('Order Summary');
    const listItems = page.locator('.summary-card mat-list-item');
    expect(await listItems.count()).toBeGreaterThan(0);
  });

  test('should display total amount in summary', async ({page}) => {
    await expect(page.locator('.total-row .total-price')).toBeVisible();
    await expect(page.locator('.total-row .total-price')).toContainText('$');
  });

  test('should have a Place Order button on step 3', async ({page}) => {
    // Navigate to step 3
    const inputs = page.locator('.step-content input[matInput]');
    await inputs.nth(0).fill(shippingAddress.street);
    await inputs.nth(1).fill(shippingAddress.city);
    await inputs.nth(2).fill(shippingAddress.state);
    await inputs.nth(3).fill(shippingAddress.zipCode);
    await inputs.nth(4).fill(shippingAddress.country);
    await page.locator('button').filter({hasText: 'CONTINUE'}).first().click();

    await page.locator('mat-radio-button').filter({hasText: 'PayPal'}).click();
    await page.locator('button').filter({hasText: 'CONTINUE'}).click();

    await expect(page.locator('button').filter({hasText: 'PLACE ORDER'})).toBeVisible({
      timeout: 5000,
    });
  });

  test('should have a Back button on step 2', async ({page}) => {
    const inputs = page.locator('.step-content input[matInput]');
    await inputs.nth(0).fill(shippingAddress.street);
    await inputs.nth(1).fill(shippingAddress.city);
    await inputs.nth(2).fill(shippingAddress.state);
    await inputs.nth(3).fill(shippingAddress.zipCode);
    await inputs.nth(4).fill(shippingAddress.country);
    await page.locator('button').filter({hasText: 'CONTINUE'}).first().click();

    await expect(page.locator('button').filter({hasText: 'BACK'})).toBeVisible();
  });
});
