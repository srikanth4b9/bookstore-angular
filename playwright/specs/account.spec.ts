import {test, expect} from '@playwright/test';

test.describe('Account Page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/account');
  });

  test('should display user profile information', async ({page}) => {
    await expect(page.locator('body')).toContainText('John Doe');
  });

  test('should display user email', async ({page}) => {
    await expect(page.locator('body')).toContainText('john@example.com');
  });

  test('should have tab navigation for profile and orders', async ({page}) => {
    const tabs = page.locator('mat-tab-group');
    await expect(tabs).toBeVisible({timeout: 10000});
  });

  test('should display address information', async ({page}) => {
    await expect(page.locator('body')).toContainText('123 Main St');
  });
});
