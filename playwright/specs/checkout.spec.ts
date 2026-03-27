import {test, expect} from '@playwright/test';
import {shippingAddress} from '../fixtures/test-data';
import {
  addItemAndGoToCart,
  clickContinueStep1,
  clickContinueStep2,
  fillShippingAddress,
  goToCheckout,
} from '../support/utils';

test.describe('Checkout Page', () => {
  test.beforeEach(async ({page}) => {
    await addItemAndGoToCart(page);
    await goToCheckout(page);
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
    await fillShippingAddress(page, shippingAddress);
    await clickContinueStep1(page);

    // Step 2 should be visible — Payment Options
    await expect(page.locator('mat-radio-group')).toBeVisible({timeout: 5000});
  });

  test('should select a payment method and proceed to step 3', async ({page}) => {
    await fillShippingAddress(page, shippingAddress);
    await clickContinueStep1(page);

    // Step 2: Select Credit Card
    await page.locator('mat-radio-button').filter({hasText: 'Credit Card'}).click();
    await clickContinueStep2(page);

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
    await fillShippingAddress(page, shippingAddress);
    await clickContinueStep1(page);

    await page.locator('mat-radio-button').filter({hasText: 'PayPal'}).click();
    await clickContinueStep2(page);

    await expect(page.locator('button').filter({hasText: 'PLACE ORDER'})).toBeVisible({
      timeout: 5000,
    });
  });

  test('should have a Back button on step 2', async ({page}) => {
    await fillShippingAddress(page, shippingAddress);
    await clickContinueStep1(page);

    await expect(page.locator('button').filter({hasText: 'BACK'}).first()).toBeVisible();
  });
});
