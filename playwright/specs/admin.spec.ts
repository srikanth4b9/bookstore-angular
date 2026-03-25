import {test, expect} from '@playwright/test';

test.describe('Admin Page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/admin');
  });

  test('should display the admin dashboard', async ({page}) => {
    await expect(page.locator('app-admin')).toBeVisible();
  });

  test('should have tab navigation for books and orders', async ({page}) => {
    const tabs = page.locator('mat-tab-group');
    await expect(tabs).toBeVisible({timeout: 10000});
  });

  test('should display books table', async ({page}) => {
    await expect(page.locator('mat-table')).toBeVisible({timeout: 10000});
  });

  test('should display total sales information', async ({page}) => {
    await expect(page.locator('body')).toContainText('Total Sales');
  });

  test('should toggle add book form', async ({page}) => {
    await page.getByText('Add Book').click();
    await expect(page.getByPlaceholder('Title')).toBeVisible();
    await expect(page.getByPlaceholder('Author')).toBeVisible();
  });
});
