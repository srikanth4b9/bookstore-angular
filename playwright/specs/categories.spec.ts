import {test, expect} from '@playwright/test';

test.describe('Categories Page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/categories');
  });

  test('should display the categories page title', async ({page}) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should display category cards', async ({page}) => {
    const categoryCards = page.locator('mat-card');
    await expect(categoryCards.first()).toBeVisible({timeout: 10000});
    expect(await categoryCards.count()).toBeGreaterThan(0);
  });

  test('should navigate to books page with category filter when clicking a category', async ({
    page,
  }) => {
    const firstCategory = page.locator('mat-card').first();
    await expect(firstCategory).toBeVisible({timeout: 10000});
    await firstCategory.click();
    await expect(page).toHaveURL(/\/books/);
  });
});
