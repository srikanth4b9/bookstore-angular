import {test, expect} from '@playwright/test';

test.describe('Book Details Page', () => {
  test.beforeEach(async ({page}) => {
    // Navigate to books page and click the first book
    await page.goto('/books');
    const firstCard = page.locator('.book-grid .book-card').first();
    await expect(firstCard).toBeVisible({timeout: 15000});
    await firstCard.click();
    await expect(page).toHaveURL(/\/books\/.+/);
  });

  test('should display book title and author', async ({page}) => {
    await expect(page.locator('mat-card-title')).toBeVisible({timeout: 10000});
    await expect(page.locator('mat-card-subtitle')).toContainText('by');
  });

  test('should display book cover image', async ({page}) => {
    await expect(page.locator('.book-cover')).toBeVisible({timeout: 10000});
  });

  test('should display book rating', async ({page}) => {
    await expect(page.locator('.rating-row')).toBeVisible({timeout: 10000});
  });

  test('should display book price', async ({page}) => {
    const priceRow = page.locator('.price-row');
    await expect(priceRow).toBeVisible({timeout: 10000});
    await expect(priceRow).toContainText('$');
  });

  test('should display stock availability', async ({page}) => {
    const statusChip = page.locator('.status-chip');
    await expect(statusChip).toBeVisible({timeout: 10000});
  });

  test('should display ISBN and category', async ({page}) => {
    const metaInfo = page.locator('.meta-info');
    await expect(metaInfo).toBeVisible({timeout: 10000});
    await expect(metaInfo).toContainText('ISBN:');
    await expect(metaInfo).toContainText('Category:');
  });

  test('should display description section', async ({page}) => {
    await expect(page.locator('.description-section h3')).toHaveText('Description');
    await expect(page.locator('.description-section p')).toBeVisible();
  });

  test('should have a Back button that navigates to books page', async ({page}) => {
    const backButton = page.locator('mat-card-actions a').filter({hasText: 'BACK'});
    await expect(backButton).toBeVisible({timeout: 10000});
    await backButton.click();
    await expect(page).toHaveURL(/\/books/);
  });

  test('should have an Add to Cart button', async ({page}) => {
    const addToCartBtn = page.locator('mat-card-actions button').filter({hasText: 'ADD TO CART'});
    await expect(addToCartBtn).toBeVisible({timeout: 10000});
  });

  test('should display the reviews section', async ({page}) => {
    await expect(page.locator('.reviews-section h2')).toHaveText('Customer Reviews');
  });
});
