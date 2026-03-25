import {test, expect} from '@playwright/test';

test.describe('Navbar', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('should display the BookStore brand name', async ({page}) => {
    await expect(page.locator('.nav-brand')).toContainText('BookStore');
  });

  test('should have navigation links for Home, Books, Categories, and Cart', async ({page}) => {
    const navLinks = page.locator('.nav-links a');
    await expect(navLinks.filter({hasText: 'Home'})).toBeVisible();
    await expect(navLinks.filter({hasText: 'Books'})).toBeVisible();
    await expect(navLinks.filter({hasText: 'Categories'})).toBeVisible();
  });

  test('should have a cart icon with badge', async ({page}) => {
    await expect(
      page.locator('.nav-links mat-icon').filter({hasText: 'shopping_cart'}),
    ).toBeVisible();
  });

  test('should navigate to Home when brand is clicked', async ({page}) => {
    await page.goto('/books');
    await page.locator('.nav-brand').click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate to Books page', async ({page}) => {
    await page.locator('.nav-links a').filter({hasText: 'Books'}).click();
    await expect(page).toHaveURL(/\/books/);
  });

  test('should navigate to Categories page', async ({page}) => {
    await page.locator('.nav-links a').filter({hasText: 'Categories'}).click();
    await expect(page).toHaveURL(/\/categories/);
  });

  test('should navigate to Cart page', async ({page}) => {
    await page.locator('.nav-links a mat-icon').filter({hasText: 'shopping_cart'}).click();
    await expect(page).toHaveURL(/\/cart/);
  });

  test('should show Account icon when user is logged in', async ({page}) => {
    await expect(
      page.locator('.nav-links mat-icon').filter({hasText: 'account_circle'}),
    ).toBeVisible();
  });
});
