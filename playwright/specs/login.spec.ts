import {test, expect} from '@playwright/test';
import {testUser} from '../fixtures/test-data';

test.describe('Login Page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/login');
  });

  test('should display the login card with title', async ({page}) => {
    await expect(page.locator('mat-card-title')).toHaveText('Login');
  });

  test('should display email and password fields', async ({page}) => {
    await expect(page.locator('#emailInput')).toBeVisible();
    await expect(page.locator('#passwordInput')).toBeVisible();
  });

  test('should have a Login submit button', async ({page}) => {
    const loginBtn = page.locator('.auth-btn');
    await expect(loginBtn).toHaveText('LOGIN');
  });

  test('should toggle password visibility', async ({page}) => {
    const passwordInput = page.locator('#passwordInput');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.locator('button[mat-icon-button]').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.locator('button[mat-icon-button]').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should fill in login form fields', async ({page}) => {
    await page.locator('#emailInput').fill(testUser.email);
    await page.locator('#passwordInput').fill(testUser.password);

    await expect(page.locator('#emailInput')).toHaveValue(testUser.email);
    await expect(page.locator('#passwordInput')).toHaveValue(testUser.password);
  });

  test('should have a link to register page', async ({page}) => {
    const registerLink = page.locator('.switch-auth a');
    await expect(registerLink).toHaveText('Register here');
    await registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('should submit the login form', async ({page}) => {
    await page.locator('#emailInput').fill(testUser.email);
    await page.locator('#passwordInput').fill(testUser.password);
    await page.locator('.auth-btn').click();
    // After login the app navigates away from /login
    await expect(page).not.toHaveURL(/\/login/, {timeout: 5000});
  });
});
