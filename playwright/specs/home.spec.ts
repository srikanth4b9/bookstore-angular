import {test, expect} from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('should display the hero section with welcome message', async ({page}) => {
    await expect(page.locator('.hero-section h1')).toHaveText('Welcome to BookStore');
    await expect(page.locator('.hero-section p')).toContainText('Discover a world of knowledge');
  });

  test('should have a "Browse All Books" CTA button', async ({page}) => {
    const ctaButton = page.locator('.cta-btn');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toContainText('BROWSE ALL BOOKS');
  });

  test('should navigate to books page when CTA is clicked', async ({page}) => {
    await page.locator('.cta-btn').click();
    await expect(page).toHaveURL(/\/books/);
  });

  test('should display featured books section', async ({page}) => {
    await expect(page.locator('.featured-section h2')).toHaveText('Featured Books');
    const bookCards = page.locator('.featured-section .book-card');
    await expect(bookCards).toHaveCount(4);
  });

  test('should display browse by category section', async ({page}) => {
    await expect(page.locator('.categories-section h2')).toHaveText('Browse by Category');
    const categoryCards = page.locator('.category-card');
    expect(await categoryCards.count()).toBeGreaterThan(0);
  });

  test('should navigate to book details when a featured book is clicked', async ({page}) => {
    await page.locator('.featured-section .book-card').first().click();
    await expect(page).toHaveURL(/\/books\/.+/);
  });

  test('should navigate to books with category filter when category card is clicked', async ({
    page,
  }) => {
    await page.locator('.category-card').first().click();
    await expect(page).toHaveURL(/\/books\?category=/);
  });

  test('should have a "View All" link in the featured section', async ({page}) => {
    const viewAllLink = page.locator('.featured-section .section-header a');
    await expect(viewAllLink).toContainText('View All');
    await viewAllLink.click();
    await expect(page).toHaveURL(/\/books/);
  });
});
