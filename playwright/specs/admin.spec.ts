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
    await expect(page.locator('.table-container table')).toBeVisible({timeout: 10000});
  });

  test('should display total revenue in Sales Analytics tab', async ({page}) => {
    await page.locator('.mat-mdc-tab', {hasText: 'Sales Analytics'}).click();
    await expect(page.locator('body')).toContainText('Total Revenue');
  });

  test('should toggle add book form', async ({page}) => {
    await page.getByText('ADD NEW BOOK').click();
    await expect(page.getByPlaceholder('e.g. The Great Gatsby')).toBeVisible();
    await expect(page.getByPlaceholder('e.g. F. Scott Fitzgerald')).toBeVisible();
  });
});
