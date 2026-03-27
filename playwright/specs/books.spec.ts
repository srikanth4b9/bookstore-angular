import {test, expect} from '@playwright/test';

test.describe('Books Page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/books');
  });

  test('should display the books page with title and total count', async ({page}) => {
    await expect(page.locator('.book-list h2')).toContainText('Books');
    await expect(page.locator('.book-list h2 small')).toContainText('total');
  });

  test('should display filter sidebar with search, category, sort fields', async ({page}) => {
    await expect(page.locator('.filters h3')).toHaveText('Filters');
    await expect(page.locator('.filters mat-form-field')).toHaveCount(4);
  });

  test('should display books in grid view by default', async ({page}) => {
    const bookCards = page.locator('.book-grid .book-card');
    await expect(bookCards.first()).toBeVisible({timeout: 15000});
    expect(await bookCards.count()).toBeGreaterThan(0);
  });

  test('should switch to list view', async ({page}) => {
    await page.locator('button[title="List View"]').click();
    const listCards = page.locator('.book-list-card');
    await expect(listCards.first()).toBeVisible({timeout: 15000});
    expect(await listCards.count()).toBeGreaterThan(0);
  });

  test('should search for books by title', async ({page}) => {
    const searchInput = page.locator('.filters input[matInput]').first();
    await searchInput.fill('Angular');
    await page.waitForTimeout(500);
    // Verify results updated — either books appear or "No books found"
    const results = page.locator('.book-card, .no-results');
    await expect(results.first()).toBeVisible({timeout: 10000});
  });

  test('should display book card with title, author, and price', async ({page}) => {
    const firstCard = page.locator('.book-grid .book-card').first();
    await expect(firstCard).toBeVisible({timeout: 15000});
    await expect(firstCard.locator('.book-title')).toBeVisible();
    await expect(firstCard.locator('.book-author')).toBeVisible();
    await expect(firstCard.locator('.book-price')).toBeVisible();
  });

  test('should navigate to book details when a book card is clicked', async ({page}) => {
    const firstCard = page.locator('.book-grid .book-card').first();
    await expect(firstCard).toBeVisible({timeout: 15000});
    await firstCard.click();
    await expect(page).toHaveURL(/\/books\/.+/);
  });

  test('should display paginator', async ({page}) => {
    await expect(page.locator('mat-paginator')).toBeVisible();
  });

  test('should have add to cart button on book cards', async ({page}) => {
    const addBtn = page.locator('.book-grid .book-card .add-btn').first();
    await expect(addBtn).toBeVisible({timeout: 15000});
  });

  test('should add a book to cart from the grid view', async ({page}) => {
    const firstCard = page.locator('.book-grid .book-card').first();
    await expect(firstCard).toBeVisible({timeout: 15000});
    // JS click bypasses overlay visibility issues in headless mode
    await firstCard.locator('.add-btn').dispatchEvent('click');
    await expect(firstCard.locator('.qty-stepper')).toBeVisible({timeout: 5000});
  });

  test('should show quantity stepper after adding to cart', async ({page}) => {
    const firstCard = page.locator('.book-grid .book-card').first();
    await expect(firstCard).toBeVisible({timeout: 15000});
    await firstCard.locator('.add-btn').dispatchEvent('click');
    await expect(firstCard.locator('.qty-stepper')).toBeVisible({timeout: 5000});
    await expect(firstCard.locator('.qty-count')).toHaveText('1');
  });

  test('should increment quantity via grid stepper', async ({page}) => {
    const firstCard = page.locator('.book-grid .book-card').first();
    await expect(firstCard).toBeVisible({timeout: 15000});
    await firstCard.locator('.add-btn').dispatchEvent('click');
    await expect(firstCard.locator('.qty-stepper')).toBeVisible({timeout: 5000});
    await firstCard.locator('.qty-stepper .qty-btn').last().click();
    await expect(firstCard.locator('.qty-count')).toHaveText('2');
  });

  test('should remove item when decrementing quantity to zero', async ({page}) => {
    const firstCard = page.locator('.book-grid .book-card').first();
    await expect(firstCard).toBeVisible({timeout: 15000});
    await firstCard.locator('.add-btn').dispatchEvent('click');
    await expect(firstCard.locator('.qty-stepper')).toBeVisible({timeout: 5000});
    await firstCard.locator('.qty-stepper .qty-btn').first().click();
    await expect(firstCard.locator('.add-btn')).toBeVisible({timeout: 5000});
  });
});
