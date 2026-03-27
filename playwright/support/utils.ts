import {expect, type Page} from '@playwright/test';

/**
 * Shared utility functions for Playwright e2e tests.
 */

/** Get a Material form-field input by its mat-label text. */
export const getInputByLabel = (page: Page, label: string) =>
  page.locator('mat-form-field').filter({hasText: label}).locator('input');

/** Add a book to cart from the books grid by index. */
export const addBookToCart = async (page: Page, index = 0) => {
  const card = page.locator('.book-grid .book-card').nth(index);
  await expect(card).toBeVisible({timeout: 15000});
  await card.locator('.add-btn').dispatchEvent('click');
};

/**
 * Add item(s) to cart from the books page, then navigate to cart
 * using in-app links (page.goto would reload and lose in-memory cart state).
 */
export const addItemAndGoToCart = async (page: Page, count = 1) => {
  await page.goto('/books');
  for (let i = 0; i < count; i++) {
    await addBookToCart(page, i);
  }
  await page.locator('a[href="/cart"]').click();
  await expect(page).toHaveURL(/\/cart/);
};

/** Navigate from cart to checkout via in-app link. */
export const goToCheckout = async (page: Page) => {
  await page.locator('.checkout-btn').click();
  await expect(page).toHaveURL(/\/checkout/);
};

/**
 * Fill the shipping address form in the checkout stepper.
 * Uses mat-label selectors instead of positional nth() for resilience.
 */
export const fillShippingAddress = async (
  page: Page,
  address: {street: string; city: string; state?: string; zipCode: string; country?: string},
) => {
  await getInputByLabel(page, 'Street Address').fill(address.street);
  await getInputByLabel(page, 'City').fill(address.city);
  if (address.state) {
    await getInputByLabel(page, 'State').fill(address.state);
  }
  await getInputByLabel(page, 'Zip Code').fill(address.zipCode);
  if (address.country) {
    await getInputByLabel(page, 'Country').fill(address.country);
  }
};

/** Click the first visible CONTINUE button (step 1). */
export const clickContinueStep1 = async (page: Page) => {
  await page.locator('button').filter({hasText: 'CONTINUE'}).first().click();
};

/** Click the second CONTINUE button (step 2) with force to bypass stepper visibility. */
export const clickContinueStep2 = async (page: Page) => {
  await expect(page.locator('mat-radio-group')).toBeVisible({timeout: 5000});
  await page.locator('button').filter({hasText: 'CONTINUE'}).nth(1).click({force: true});
};

/** Click the PLACE ORDER button. */
export const clickPlaceOrder = async (page: Page) => {
  await page.locator('button').filter({hasText: 'PLACE ORDER'}).click();
};
