import {test, expect} from '@playwright/test';
import {newUser} from '../fixtures/test-data';

test.describe('Register Page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/register');
  });

  test('should display the register card with title', async ({page}) => {
    await expect(page.locator('mat-card-title')).toHaveText('Register');
  });

  test('should display name, email, and password fields', async ({page}) => {
    await expect(page.locator('#nameInput')).toBeVisible();
    await expect(page.locator('#emailInput')).toBeVisible();
    await expect(page.locator('#passwordInput')).toBeVisible();
  });

  test('should have a Register submit button', async ({page}) => {
    const registerBtn = page.locator('.auth-btn');
    await expect(registerBtn).toHaveText('REGISTER');
  });

  test('should toggle password visibility', async ({page}) => {
    const passwordInput = page.locator('#passwordInput');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.locator('button[mat-icon-button]').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should fill in registration form', async ({page}) => {
    await page.locator('#nameInput').fill(newUser.name);
    await page.locator('#emailInput').fill(newUser.email);
    await page.locator('#passwordInput').fill(newUser.password);

    await expect(page.locator('#nameInput')).toHaveValue(newUser.name);
    await expect(page.locator('#emailInput')).toHaveValue(newUser.email);
    await expect(page.locator('#passwordInput')).toHaveValue(newUser.password);
  });

  test('should have a link to login page', async ({page}) => {
    const loginLink = page.locator('.switch-auth a');
    await expect(loginLink).toHaveText('Login here');
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should submit the registration form', async ({page}) => {
    await page.locator('#nameInput').fill(newUser.name);
    await page.locator('#emailInput').fill(newUser.email);
    await page.locator('#passwordInput').fill(newUser.password);
    await page.locator('.auth-btn').click();
    // After registration the app navigates away from /register
    await expect(page).not.toHaveURL(/\/register/, {timeout: 5000});
  });
});
